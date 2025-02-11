import { Form, redirect, useLoaderData, useNavigate, useActionData } from "@remix-run/react";
import { useRef, useEffect } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { getBook, updateBook } from "~/data";
import invariant from "tiny-invariant";
import { json } from "@remix-run/node";
import type { Book } from "~/root";

export const action = async ({ params, request }: ActionFunctionArgs) => {
    invariant(params.bookId, "The response should contain book Id")
    const formData = await request.formData();
    const result = await updateBook(params.bookId, formData)
    if (result.success) {
      return redirect("/");
    }
    return redirect("/");
};

export const loader = async ({ params, }: LoaderFunctionArgs) => {
    invariant(params.bookId, "Request should contain book Id")
    const book = await getBook(params.bookId)
    if (!book) {
        return new Response("No book with such Id", {status: 404})
    }
    return json({ book })
}

export default function EditBook () {
    const { book } = useLoaderData<{ book: Book }>()
    const actionData = useActionData<{ errors: Record<string, string> }>();
    const navigate = useNavigate();
    const optionsRef = useRef<HTMLDivElement | null>(null);
  
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
          navigate("/");
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [navigate]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            ref={optionsRef} 
            className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-4">Edit book</h2>
            <Form method="post" className="space-y-4">
              <div>
                {actionData?.errors?.title && (<p className="text-red-400">{actionData.errors.title}</p>)}
                <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                  Title
                </label>
                <input
                  defaultValue={book.title}
                  type="text"
                  placeholder="title"
                  name="title"
                  id="title"
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>

              <div>
                {actionData?.errors?.author && (<p className="text-red-400">{actionData.errors.author}</p>)}
                <label htmlFor="author" className="block text-sm font-medium text-gray-300">
                  Author
                </label>
                <input
                  defaultValue={book.author}
                  type="text"
                  id="author"
                  placeholder="author"
                  name="author"
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-300">
                  Image
                </label>
                <input
                  defaultValue={book.image}
                  type="text"
                  id="image"
                  placeholder="url"
                  name="image"
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                  Description
                </label>
                <input
                  defaultValue={book.description}
                  type="textarea"
                  id="description"
                  placeholder="description"
                  name="description"
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div>
                {actionData?.errors?.status && (<p className="text-red-400">{actionData.errors.status}</p>)}
                <label htmlFor="status" className="block text-sm font-medium text-gray-300">
                  Status
                </label>
                <select
                  defaultValue={book.status}
                  id="status"
                  name="status"
                  className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                >
                  <option value="to-read">To Read</option>
                  <option value="reading">Currently Reading</option>
                  <option value="read">Already Read</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={()=>navigate("/")}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md"
                >
                  Save
                </button>
              </div>
            </Form>
          </div>
        </div>
      )
}