import { Link, Outlet, useParams, useNavigate } from "@remix-run/react";
import type { Book } from "~/root";
import BookOptions from "./Options";
import { useState } from "react";
import { IMAGE_PLACEHOLDER } from "~/root";

interface BookItemProps {
    book: Book
  }
  
  export default function BookItem({ book }: BookItemProps) {
    const params = useParams(); 
    const navigate = useNavigate();
    const [showOptions, setShowOptions] = useState(false);

    return (
        <li className="flex p-3 bg-gray-700 rounded-lg flex-wrap">
            <Link className="flex p-3 bg-gray-700 rounded-lg flex-wrap" to={`/books/${book.id}`}>
            <div className="flex items-start justify-between w-full">
                <div>
                    <h3 className="font-medium text-lg text-gray-100">{book.title}</h3>
                    <p className=" text-base text-gray-400">{book.author}</p>
                </div>
                <div className="flex space-x-2 relative">
                    <div onClick={(e) => {
                        e.preventDefault();
                        setShowOptions(true);
                    }} className="text-gray-300 hover:text-white focus:outline-none z-20">
                        <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </div>
                    {showOptions && (
                        <BookOptions onClose={() => {
                            setShowOptions(false)
                        }
                        }
                        book={book}
                        />
                    )}
                </div>
            </div>
                <img
                    className="mt-2 w-48 h-auto aspect-[2/3] object-cover rounded-lg shadow-md hover:scale-[1.01] transition-transform duration-200"
                    src={book.image || IMAGE_PLACEHOLDER}
                />
            </Link>
        </li>
    )
  }