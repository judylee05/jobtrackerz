import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Navigation from "~/components/navigation";

import { requireUserId } from "~/session.server";
import { useOptionalUser } from "~/utils";

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const user = await (
    await fetch(process.env.API_BASE_URL + "/profile/" + userId)
  ).json();
  return json({ user });
}

export default function Profile() {
  const data = useLoaderData<typeof loader>();
  const user = useOptionalUser();
  return (
    <main>
      <div className="h-screen flex-col justify-center bg-slate-900">
        <Navigation />
        <h1 className="p-5 text-center text-4xl font-bold text-rose-400 sm:text-5xl md:text-6xl">
          <span className="block xl:inline">Profile</span>
        </h1>
        <div className="p-5 text-center text-xl font-bold text-rose-400">
          {user?.email}
        </div>
      </div>
    </main>
  );
}
