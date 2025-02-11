import { Link, useLoaderData, Form, redirect, useActionData } from "@remix-run/react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getBook, addNoteToBook } from "~/data";
import { json } from "@remix-run/node";
import { IMAGE_PLACEHOLDER } from "~/root";
import type { Book } from "~/root";


export const loader = async ({ params }: LoaderFunctionArgs) => {
    invariant(params.bookId, "Request should contain book Id");
    const book = await getBook(params.bookId);
    if (!book) {
        return new Response("No book with such id", {status: 404});
    }
    return json({ book })
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  invariant(params.bookId, "Request should contain book Id");

  const formData = await request.formData();
  const note = formData.get("note");

  if (!note || typeof note !== "string") {
      return json({ error: "Note cannot be empty" }, { status: 400 });
  }

  await addNoteToBook(params.bookId, note);

  return redirect(`/books/${params.bookId}`);
};

export default function Book () {
    const { book } = useLoaderData<{ book: Book }>();
    const actionData = useActionData<{ error?: string }>();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
          <div className="max-w-4xl mx-auto">
            <Link to="/" className="text-blue-400 hover:text-blue-300 mb-6 inline-block">
              &larr; Back to all books
            </Link>
            <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 mb-6 md:mb-0">
                  <img
                    src={book.image || IMAGE_PLACEHOLDER}
                    alt={`Cover of ${book.title}`}
                    className="mt-2 w-96 h-auto aspect-[2/3] object-cover rounded-lg shadow-md"
                  />
                </div>
                <div className="md:w-2/3 md:pl-8">
                  <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
                  <p className="text-xl text-gray-300 mb-4">by {book.author}</p>
                  <p className="text-gray-400 mb-6">{book.description}</p>
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-2">Notes</h2>
                    {book.notes && book.notes.map(note => (
                      <p key={note} className="text-white border-gray-900 border-opacity-90 border-2 rounded w-full p-2 mb-3 bg-gray-700 ">
                      {note}
                    </p>))
                    }
                    <hr className="mb-2 bg-gray-400 border-none h-1" />
                    {actionData?.error && (
                      <p className="text-red-400">{actionData.error}</p>
                    )}
                    <Form method="post" className="space-y-2">
                      <textarea
                        name="note"
                        className="w-full h-32 bg-gray-700 text-white rounded p-2 mb-2"
                        placeholder="Add your notes here..."
                      ></textarea>
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                      >
                        Add Note
                      </button>
                    </Form>
                  </div>
                  <Form
                        action={`/${book.id}/desintegrate`}
                        method="post"
                        onSubmit={(event) => {
                        const response = confirm(
                            "Please confirm you want to delete this book."
                        );
                        if (!response) {
                            event.preventDefault();
                        }
                        }}
                    >
                        <button
                            type="submit"
                            className="block px-4 py-2 text-sm text-red-400 hover:bg-gray-600 hover:text-red-500 w-full text-left"
                        >
                            Delete
                        </button>
                    </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
}