import { Form } from "@remix-run/react";

const ContactsUpdateModalForm = (params: any) => {
  return (
    <div className="">
      <div className="bg-slate-800 py-6 px-6 text-left lg:px-8">
        <h3 className="mb-4 text-xl font-medium text-rose-500">
          Update Existing Contact
        </h3>
        <Form method="post">
          <input name="contact_id" readOnly value={params.contact_id} type="hidden"/>
          <div>
            <label
              className="mb-1 mt-4 block text-sm font-medium text-rose-50"
              htmlFor="first_name"
            >
              First Name
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
              id="first_name"
              type="text"
              name="first_name"
              placeholder="Enter First Name"
            />
          </div>
          <div>
            <label
              className="mb-1 mt-4 block text-sm font-medium text-rose-50"
              htmlFor="last_name"
            >
              Last Name
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
              id="last_name"
              type="text"
              name="last_name"
              placeholder="Enter Last Name"
            />
          </div>
          <div>
            <label
              className="mb-1 mt-4 block text-sm font-medium text-rose-50"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
              id="email"
              type="email"
              name="email"
              placeholder="Enter Email"
            />
          </div>
          <div>
            <label
              className="mb-1 mt-4 block text-sm font-medium text-rose-50"
              htmlFor="company"
            >
              Company
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
              id="company"
              type="text"
              name="company"
              placeholder="Enter company"
            />
          </div>
          <div>
            <label
              className="mb-1 mt-4 block text-sm font-medium text-rose-50"
              htmlFor="title"
            >
              Title
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
              id="title"
              type="text"
              name="title"
              placeholder="Enter Title"
            />
          </div>

          <div className="mt-4 gap-2 bg-slate-800 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="submit"
              name="_action"
              value="patch"
              className="rounded-full bg-rose-500 px-5 py-3 text-base font-medium text-white hover:bg-rose-600 md:py-3 md:px-6 md:text-lg"
            >
              Update
            </button>
            <button
              type="submit"
              name="_action"
              value="cancel"
              className="rounded-full bg-rose-50 px-5 py-3 text-base font-medium text-black hover:bg-rose-600 md:py-3 md:px-6 md:text-lg"
            >
              Cancel
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ContactsUpdateModalForm;
