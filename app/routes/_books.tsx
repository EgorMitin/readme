import type { LoaderFunctionArgs } from "@remix-run/node";
import { 
    Outlet,
    Link,
    Form,
    useLoaderData,
    useSubmit,
    useLocation
 } from "@remix-run/react";
import { Lists } from "../components/Lists";
import { json } from "@remix-run/node";
import { useEffect } from "react";
import { getBooks } from "~/data";

export const loader = async ({request}: LoaderFunctionArgs) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q") || "";
    const books = await getBooks(q);
    return json({ books, q })
  }

export default function Layout () {
    let { books, q } = useLoaderData<typeof loader>();
    const location = useLocation();
    const isAddBookPage = location.pathname === "/addbook" || location.pathname.includes("edit");
    const submit = useSubmit();
    const searching = 
    location &&
    new URLSearchParams(location.search).has("q");

    useEffect(()=>{
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
        searchField.value = q || "";
    }
    }, [q]);

  return (
    <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Your Books</h2>
            <Form 
                id="search-form"
                className="relative flex items-center"
                onChange={(event)=> {
                    const isFirstSearch = q === null;
                    submit(event.currentTarget, {
                    replace: !isFirstSearch,
                    })
                }
                }
                role="search"
                >
                <div className="relative">
                    <input
                        aria-label="Search contacts"
                        id="q"
                        name="q"
                        placeholder="Search books..."
                        type="search"
                        defaultValue={q || ""}
                        className="w-64 sm:w-80 px-5 py-3 text-white bg-white/10 backdrop-blur-md border border-gray-700 rounded-full outline-none placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <svg className="w-5 h-5 text-gray-400 transition-all duration-300 hover:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>
                </div>
            </Form>
            <Link 
                to="/addbook"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
            Add Book
            </Link>
        </div>
        <Outlet />
        <Lists books={books} />
    </div>
  );
}