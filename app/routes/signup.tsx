import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { createUserSession } from "~/utils/session.server";

function validateUser(email: string | null, password: string | null, confirmPassword: string | null) {
  const errors: Record<string, string> = {};

  if (!email || email.trim().length === 0) {
    errors.email = "Email is required.";
  }
  if (!password || password.trim().length === 0) {
    errors.password = "Password is required.";
  }
  if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export let action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const validation = validateUser(email, password, confirmPassword);
  if (!validation.isValid) {
    return { success: false, errors: validation.errors };
  }

  const apiKey = process.env.FIREBASE_API_KEY;
  if (!apiKey) {
    throw new Error("FIREBASE_API_KEY must be set in your environment");
  }

  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      returnSecureToken: true,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    console.log(errorData.error.message)
    return { success: false, error: errorData.error.message };
  }

  const data = await res.json();
  const idToken = data.idToken;
  return createUserSession(idToken, "/");
};

export default function SignUpPage() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-start justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-white mb-8">
          Join Read
          <span className="text-blue-400 relative">
            <span className="absolute -top-1 -right-3 w-3 h-3 bg-blue-400 rounded-full"></span>
            me
          </span>
        </h2>
        <Form method="post" className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {actionData?.errors?.email && (
              <p className="text-red-500 text-xs mt-1">{actionData.errors.email}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {actionData?.errors?.password && (
              <p className="text-red-500 text-xs mt-1">{actionData.errors.password}</p>
            )}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {actionData?.errors?.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{actionData.errors.confirmPassword}</p>
            )}
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign up
            </button>
          </div>
        </Form>
        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-blue-400 hover:text-blue-300">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}