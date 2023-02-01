import { Link } from "@remix-run/react";

export default function Landing() {
  return (
    <div className="relative h-screen overflow-hidden bg-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="absolute z-10 min-h-full bg-slate-900 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32">
          <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight text-rose-100 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Find your</span>{" "}
                <span className="block text-rose-400 xl:inline">dream job</span>
              </h1>
              <p className="mt-3 text-base text-rose-100 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0">
                Stay organized and motived with JobTracker.
              </p>
              {/* Login and Register Buttons */}
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link
                    to="/login"
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-rose-400 px-8 py-3 text-base font-medium text-white hover:bg-rose-500 md:py-4 md:px-10 md:text-lg"
                  >
                    Login
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link
                    to="/register"
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-rose-100 px-8 py-3 text-base font-medium text-rose-500 hover:bg-rose-200 md:py-4 md:px-10 md:text-lg"
                  >
                    Register
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
      {/* hero image */}
      <div className="lg:absolute lg:inset-y-0 lg:right-0">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:h-full lg:w-full"
          src="https://images.unsplash.com/photo-1523289333742-be1143f6b766?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2370&q=80"
          alt=""
        />
      </div>
    </div>
  );
}
