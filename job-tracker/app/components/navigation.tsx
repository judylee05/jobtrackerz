import { Form, Link } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import type { User } from "Typings/typings";
import { gerUserById } from "~/models/user.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export type Loader = typeof loader;

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const user: User = await gerUserById(userId);
  return user;
}

const Navigation = () => {
  const user = useUser();

  return (
    <div className="bg-rose-500 align-center sticky top-0">
      <div className="justify-end gap-2 p-2 sm:flex">
      <div className="flex w-full items-center justify-start px-5 py-3 text-2xl font-bold text-rose-50 sm:text-3xl md:text-4xl">
          <span className="block xl:inline">Hi {user.first_name}!</span>
        </div>
        <div className="rounded-md shadow">
          <Link
            to="/jobs"
            className="flex w-full items-center justify-center rounded-md border border-transparent bg-rose-400 px-5 py-3 text-base font-medium text-white hover:bg-rose-700 md:py-3 md:px-6 md:text-lg"
          >
            Jobs
          </Link>
        </div>
        <div className="rounded-md shadow">
          <Link
            to="/contacts"
            className="flex w-full items-center justify-center rounded-md border border-transparent bg-rose-400 px-5 py-3 text-base font-medium text-white hover:bg-rose-700 md:py-3 md:px-6 md:text-lg"
          >
            Contacts
          </Link>
        </div>
        <div className="rounded-md shadow">
          <Form action="/logout" method="post">
            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-md border border-transparent bg-rose-400 px-5 py-3 text-base font-medium text-white hover:bg-rose-700 md:py-3 md:px-6 md:text-lg"
            >
              Logout
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
