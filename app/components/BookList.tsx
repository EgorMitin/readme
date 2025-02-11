import type { FunctionComponent } from "react";
import type { Books } from "~/root";
import BookItem from "./BookItem";

interface BookListProps {
    title: string
    status: "to-read" | "reading" | "read"
    filteredBooks: Books
}

const BookList: FunctionComponent<BookListProps> = ({title, status, filteredBooks}) => {
    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg">
            <div className="border-b border-gray-700 px-4 py-3 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
                <span className="bg-blue-500 text-white text-xs font-medium px-2.5 py-0.5 rounded">{filteredBooks.length}</span>
            </div>
            <div className=" overflow-y-auto p-4">
                {filteredBooks.length > 0 ? (
                <ul className="space-y-4">
                    {filteredBooks.map((book) => (
                    <BookItem key={book.id} book={book} />
                    ))}
                </ul>
                ) : (
                <p className="text-gray-400 text-center py-4">No books in this list yet.</p>
                )}
            </div>
        </div>
    )
}

export default BookList;