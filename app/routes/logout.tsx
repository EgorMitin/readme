import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { destroyUserSession } from "~/utils/session.server";

export let action = async ({ request }: ActionFunctionArgs) => {
  return destroyUserSession(request);
};

export let loader = async () => {
  return redirect("/");
};