import type { Books } from "~/root"
import BookList from "./BookList"

export const Lists = ({ books }: {books: Books}) => {
    return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <BookList
            title="To Read"
            status="to-read"
            filteredBooks={books.filter(book=>book.status==="to-read")}
        />
        <BookList
            title="Currently Reading"
            status="reading"
            filteredBooks={books.filter(book=>book.status==="reading")}
        />
        <BookList
            title="Already Read"
            status="read"
            filteredBooks={books.filter(book=>book.status==="read")}
        />
    </div>
    )
}