import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import * as React from "react";

import { getUserId, createUserSession } from "~/session.server";

import { safeRedirect, validateEmail } from "~/utils";
import { User, UserCreation } from "Typings/typings";
import { stringify } from "querystring";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/jobs");
  return json({});
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const first_name = formData.get("first_name");
  const last_name = formData.get("last_name");

  const redirectTo = safeRedirect(formData.get("redirectTo"), "/jobs");

  if (!validateEmail(email)) {
    return json(
      { errors: { email: "Email is invalid", password: null, first_name:null, last_name:null } },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { email: null, password: "Password is required", first_name:null, last_name:null } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json(
      { errors: { email: null, password: "Password is too short", first_name:null, last_name:null  } },
      { status: 400 }
    );
  }

  if(!first_name || typeof first_name !== "string"){
    return json(
      { errors: { email: null, password: null, first_name:"First name is required", last_name:null} },
      { status: 400 }
    );
  }

  if(!last_name || typeof last_name !== "string"){
    return json(
      { errors: { email: null, password: null, first_name:null, last_name:"Last name is required"} },
      { status: 400 }
    );
  }

  const existingUser = await fetch(process.env.API_BASE_URL+"/profile?email="+email)
  if (existingUser.status === 302) {
    return json(
      {
        errors: {
          email: "A user already exists with this email",
          password: null,
        },
      },
      { status: 400 }
    );
  }

  const data = {
    email: email,
    password: password,
    first_name: first_name,
    last_name: last_name
  };

  const request_object = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };


  const user: User = await fetch(
    process.env.API_BASE_URL + "/register",
    request_object
  ).then((result) => {
    return result.json();
  });


  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo,
  });
}

export const meta: MetaFunction = () => {
  return {
    title: "Register",
  };
};

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData<UserCreation>(); // do we need to type this?
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const firstNameRef = React.useRef<HTMLInputElement>(null);
  const lastNameRef = React.useRef<HTMLInputElement>(null);

  
  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }else if(actionData?.errors?.first_name){
      firstNameRef.current?.focus()
    }else if(actionData?.errors?.last_name){
      lastNameRef.current?.focus()
    }
  }, [actionData]);

  return (
    <div className="flex h-screen flex-col justify-center bg-slate-900">
      <div className="mx-auto w-full max-w-md px-8">
        <h1 className="p-5 text-center text-4xl font-bold text-rose-400 sm:text-5xl md:text-6xl">
          <span className="block xl:inline">Register</span>
        </h1>
        <Form method="post" className="space-y-6">
        <div>
            <label
              htmlFor="first_name"
              className="block text-sm font-medium text-rose-100"
            >
              First Name
            </label>
            <div className="mt-1">
              <input
                ref={firstNameRef}
                id="first_name"
                required
                autoFocus={true}
                name="first_name"
                type="first_name"
                autoComplete="first_name"
                aria-invalid={actionData?.errors?.first_name ? true : undefined}
                aria-describedby="first-name-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {actionData?.errors?.first_name&& (
                <div className="pt-1 text-rose-500 underline" id="first-name-error">
                  {actionData.errors.first_name}
                </div>
              )}
            </div>
          </div>


          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-medium text-rose-100"
            >
              Last Name
            </label>
            <div className="mt-1">
              <input
                ref={lastNameRef}
                id="last_name"
                required
                autoFocus={true}
                name="last_name"
                type="last_name"
                autoComplete="last_name"
                aria-invalid={actionData?.errors?.last_name ? true : undefined}
                aria-describedby="last-name-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {actionData?.errors?.last_name&& (
                <div className="pt-1 text-rose-500 underline" id="last-name-error">
                  {actionData.errors.last_name}
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-rose-100"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                ref={emailRef}
                id="email"
                required
                autoFocus={true}
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={actionData?.errors?.email ? true : undefined}
                aria-describedby="email-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {actionData?.errors?.email && (
                <div className="pt-1 text-rose-500 underline" id="email-error">
                  {actionData.errors.email}
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-rose-100"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                ref={passwordRef}
                name="password"
                type="password"
                autoComplete="new-password"
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby="password-error"
                className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
              />
              {actionData?.errors?.password && (
                <div className="pt-1 text-rose-500 underline" id="password-error">
                  {actionData.errors.password}
                </div>
              )}
            </div>
          </div>

          <input type="hidden" name="redirectTo" value={redirectTo} />
          <button
            type="submit"
            className="w-full rounded bg-rose-400  py-2 px-4 text-white hover:bg-rose-500"
          >
            Create Account
          </button>
          <div className="flex items-center justify-center">
            <div className="text-center text-sm text-rose-100">
              Already have an account?{" "}
              <Link
                className="text-rose-500 underline"
                to={{
                  pathname: "/login",
                  search: searchParams.toString(),
                }}
              >
                Log in
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
