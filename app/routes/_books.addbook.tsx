import { Form, redirect } from "@remix-run/react"
import { useRef, useEffect } from "react";
import { useNavigate, useActionData } from "@remix-run/react"
import type { ActionFunctionArgs } from "@remix-run/node";
import { addBook } from "~/data";
import { motion } from "framer-motion";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const result = await addBook(formData)
  if (result.success) {
    return redirect("/");
  }
  return result
};

export default function AddBook () {
    const navigate = useNavigate();
    const optionsRef = useRef<HTMLDivElement | null>(null);
    const actionData = useActionData<{ errors: Record<string, string> }>();
  
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            ref={optionsRef}
            className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.8 }} 
            transition={{ duration: 0.3, ease: "easeOut" }} 
          >
            <h2 className="text-2xl font-bold mb-4">Add a new book</h2>
            <Form method="post" className="space-y-4">
              <div>
              {actionData?.errors?.title && (<p className="text-red-400">{actionData.errors.title}</p>)}
                <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                  Title
                </label>
                <input
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
                  onClick={()=>navigate(-1)}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md"
                >
                  Add Book
                </button>
              </div>
            </Form>
          </motion.div>
        </div>
      )
}