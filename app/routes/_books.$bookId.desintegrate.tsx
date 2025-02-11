import type { ActionFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { redirect } from "@remix-run/node";
import { removeBook } from "~/data";

export const action = async ({ params, }: ActionFunctionArgs) => {
    invariant(params.bookId, "Request should contain book Id");
    await removeBook(params.bookId);
    return redirect('/');
}