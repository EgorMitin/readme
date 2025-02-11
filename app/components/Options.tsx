import { States } from "~/root";
import { Form, useFetcher } from "@remix-run/react";
import type { Book } from "~/root";
import { useEffect, useRef } from "react";

interface EditBookProps {
    book: Book;
    onClose: () => void;
  }

export default function BookOptions ({book, onClose}: EditBookProps) {
    const fetcher = useFetcher();
    const handleStatusChange = (state: string) => {
        try {
            if (state !== "read" && state !== "reading" && state !== "to-read") {
                throw new Error("Invalid status");
            }
            fetcher.submit(
                { ...book, status: state },
                {method: "PATCH", action: `/${book.id}/edit`}
            );
            book.status = state;
        } catch (error) {
            console.log("Error updating status", error);
        }
    }


    const optionsRef = useRef<HTMLDivElement | null>(null);
  
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
                onClose()
            }
        }
  
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
    <div 
        ref={optionsRef}
        onClick={e=>{e.stopPropagation()}}
        className="absolute z-30 right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5"
    >
        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
        {Object.entries(States).map(([status, label]) => (
         status !== book.status
         ? (  
        <button
            key={status}
            onClick={() => handleStatusChange(status)}
            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white w-full text-left"
        >
            {label}
        </button>)
        : ""))
        }

        <Form action={`../${book.id}/edit`}>
            <button
                type="submit"
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 hover:text-white w-full text-left"
            >
                Edit
            </button>
        </Form>

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
    );
}