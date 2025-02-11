import { Link, Form } from "@remix-run/react";
import type { FC } from "react";

interface HeaderProps {
  user?: {
    email: string;
  } | null;
}

export const Header: FC<HeaderProps> = ({ user }) => {
  return (
    <header className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <Link to="/">
            <h1 className="block text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Read
            <span className="text-blue-400 relative">
            <span className="absolute -top-1 -right-6 w-5 h-5 bg-blue-400 rounded-full"></span>
            me
          </span>
            </h1>
          </Link>
          <p className="mt-2 text-xl text-gray-300">
            Your personal book tracking companion
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <Form action="/logout" method="post">
              <button
                type="submit"
                className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                Log Out
              </button>
            </Form>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-semibold text-blue-500 border border-blue-500 rounded hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};