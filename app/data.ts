import invariant from "tiny-invariant";
import { type Books, type Book, IMAGE_PLACEHOLDER } from "./root";
import { db } from "./utils/db.server";

/**
 * Fetches books from Firestore based on a query string.
 * @param q - Search query (filters title, author, description).
 * @returns A Promise resolving to a list of books.
 */
export async function getBooks(q: string = ""): Promise<Books> {
    const querySnapshot = await db.collection("books").get();
    const data: Books = [];

    querySnapshot.forEach((doc) => {
        const book = doc.data() as Book;
        if ((book.title + book.author + (book.description || "") + (book.notes || []).join("")).toLowerCase().includes(q.toLowerCase())) {
            data.push({ ...book, id: doc.id });
        }
    });

    return data;
}

/**
 * Validates book form data.
 * @param formData - The form data containing book details.
 * @returns An object with isValid flag and error messages.
 */
function validateBook(formData: FormData): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    const title = formData.get("title") as string | null;
    const author = formData.get("author") as string | null;
    const status = formData.get("status") as string | null;
    const allowedStatuses = ["to-read", "reading", "read"];

    if (!title || title.trim().length === 0) {
        errors.title = "Title is required.";
    }

    if (!author || author.trim().length === 0) {
        errors.author = "Author is required.";
    }

    if (!status || !allowedStatuses.includes(status)) {
        errors.status = "Invalid status. Allowed values: to-read, reading, read.";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}

/**
 * Adds a new book to Firestore
 * @param formData - Form data containing book details
 * @returns A Promise resolving when the book is added
 */
export async function addBook(formData: FormData): Promise<{ success: boolean; errors?: Record<string, string> }> {
    const validation = validateBook(formData);
    if (!validation.isValid) {
        return { success: false, errors: validation.errors };
    }
    const newBookRef = db.collection("books").doc();

    const bookData: Book = {
        id: newBookRef.id, // Assign generated ID
        title: (formData.get("title") as string) || "Untitled",
        author: (formData.get("author") as string) || "Unknown",
        status: (formData.get("status") as Book["status"]) || "to-read",
        image: (formData.get("image") as string) || IMAGE_PLACEHOLDER,
        description: (formData.get("description") as string) || "No description available.",
    };

    await newBookRef.set(bookData);
    return { success: true };
}

/**
 * Fetches single book from Firestore by its ID.
 * @param id - The book ID
 * @returns A Promise resolving to the book or null if not found.
 */
export async function getBook(id: string): Promise<Book | null> {
    const bookDoc = await db.collection("books").doc(id).get();
    return bookDoc.exists ? ({ id: bookDoc.id, ...bookDoc.data() } as Book) : null;
}

/**
 * Removes a book from Firestore by its ID.
 * @param id - The book ID.
 * @returns A Promise resolving when the book is deleted.
 */
export async function removeBook(id: string): Promise<void> {
    await db.collection("books").doc(id).delete();
}

/**
 * Updates an existing book in Firestore.
 * @param id - The book ID.
 * @param formData - Form data containing updated book details.
 * @returns A Promise resolving when the book is updated.
 */
export async function updateBook(id: string, formData: FormData): Promise<{ success: boolean; errors?: Record<string, string> }> {
    const validation = validateBook(formData);
    if (!validation.isValid) {
        return { success: false, errors: validation.errors };
    }

    const bookRef = db.collection("books").doc(id);

    const updatedBookData: Partial<Book> = {
        title: (formData.get("title") as string) || undefined,
        author: (formData.get("author") as string) || undefined,
        status: (formData.get("status") as Book["status"]) || undefined,
        image: (formData.get("image") as string) || undefined,
        description: (formData.get("description") as string) || undefined,
    };

    Object.keys(updatedBookData).forEach(
        (key) => updatedBookData[key as keyof Book] === undefined && delete updatedBookData[key as keyof Book]
    );

    await bookRef.update(updatedBookData);
    return { success: true };
}


/**
 * Adds note to book in Firestore.
 * @param id - The book ID.
 * @param note - New note about book.
 * @returns A Promise resolving when the book is updated.
 */
export async function addNoteToBook(bookId: string, note: string) {
    const bookRef = db.collection("books").doc(bookId);
    const book = await bookRef.get();
    invariant(book, "Book not found");
    const notes = book.data().notes || [];
    notes.push(note);
    return await bookRef.update({ notes });
}