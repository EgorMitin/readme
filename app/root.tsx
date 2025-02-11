import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import "./tailwind.css";
import { Header } from "./components/Header";
import { json } from "@remix-run/node";
import { ErrorMessage } from "./components/ErrorMessage";

export const IMAGE_PLACEHOLDER = "https://d827xgdhgqbnd.cloudfront.net/wp-content/uploads/2016/04/09121712/book-cover-placeholder.png"

import { getUserSession } from "./utils/session.server";


export const links: LinksFunction = () => [];
export const meta: MetaFunction = () => {
  return [
    { title: "Read.me - Your Personal Book Tracker" },
    { name: "description", content: "Elegantly track your reading journey with Read.me" },
  ];
};

export interface Book {
  id: string
  title: string
  author: string
  image?: string
  status: "read" | "to-read" | "reading"
  description?: string
  notes?: string[]
};
export type Books = Book[];

export const States = {
  "to-read": "To Read",
  "reading": "Currently Reading",
  "read": "Already Read"
}




export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getUserSession(request);
  const token = session.get("token");
  let user = null;

  if (token) {
    user = { email: "user@example.com" };
  }

  return json({ user });
};

export function Layout() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>

      <body>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <Header user={user} />
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}


export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
          <div className="max-w-xl mx-auto">
            <ErrorMessage>
              <h1 className="text-xl font-bold mb-2">
                {isRouteErrorResponse(error) 
                  ? `${error.status} ${error.statusText}`
                  : 'Application Error'}
              </h1>
              <p className="text-red-400">
                {isRouteErrorResponse(error)
                  ? error.data
                  : error instanceof Error 
                    ? error.message
                    : 'Unknown error occurred'}
              </p>
            </ErrorMessage>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}