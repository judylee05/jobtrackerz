import { Form } from "@remix-run/react";

const JobsAddModalForm = () => {
  return (
    <div className="">
      <div className="bg-slate800 py-6 px-6 text-left lg:px-8">
        <h3 className="mb-4 text-xl font-medium text-rose-500">Add New Job</h3>
        <Form method="post">
          <div>
            <label
              className="mb-1 mt-4 block text-sm font-medium text-rose-50"
              htmlFor="company_name"
            >
              Company*
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
              id="company_name"
              type="text"
              name="company_name"
              placeholder="Enter Company Name"
            />
          </div>
          <div>
            <label
              className="mb-1 mt-4 block text-sm font-medium text-rose-50"
              htmlFor="position"
            >
              Position*
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
              id="position"
              type="text"
              name="job_title"
              placeholder="Enter Position"
            />
          </div>
          <div>
            <label
              className="mb-1 mt-4 block text-sm font-medium text-rose-50"
              htmlFor="appDate"
            >
              Applied On
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
              id="appDate"
              type="date"
              name="date_applied"
              placeholder="Enter Date"
            />
          </div>
          <div>
            <label
              className="mb-1 mt-4 block text-sm font-medium text-rose-50"
              htmlFor="position"
            >
              Location*
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
              id="location"
              type="text"
              name="location"
              placeholder="Enter Location"
            />
          </div>
          <div className="mt-4">
            <label
              className="pr-4 text-sm font-medium text-rose-50"
              htmlFor="remote"
            >
              Remote
            </label>
            <div>
              <input
                id="remote"
                type="checkbox"
                name="remote"
                placeholder="Is the position remote?"
              />
            </div>
          </div>
          <div>
            <label
              className="mb-1 mt-4 block text-sm font-medium text-rose-50"
              htmlFor="link"
            >
              Link
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
              id="link"
              type="text"
              name="link"
              placeholder="Link to position"
            />
          </div>
          <div>
            <label
              className="mb-1 mt-4 block text-sm font-medium text-rose-50"
              htmlFor="minPay"
            >
              Min Pay
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
              id="minPay"
              type="number"
              name="minPay"
              placeholder="0"
            />
          </div>

          <div>
            <label
              className="mb-1 mt-4 block text-sm font-medium text-rose-50"
              htmlFor="maxPay"
            >
              Max Pay
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
              id="maxPay"
              type="number"
              name="maxPay"
              placeholder="0"
            />
          </div>

          {/* TODO: handle pay range */}
          <div>
            <label
              className="mb-1 mt-4 block text-sm font-medium text-rose-50"
              htmlFor="skills"
            >
              Top 3 Skills
            </label>
            <input
              className="focus:shadow-outline mb-1 w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
              id="skills"
              type="text"
              name="skills"
              placeholder="Enter Skills"
            />
            <input
              className="focus:shadow-outline mb-1 w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
              id="skills"
              type="text"
              name="skills1"
              placeholder="Enter Skills"
            />
            <input
              className="focus:shadow-outline mb-1 w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
              id="skills"
              type="text"
              name="skills2"
              placeholder="Enter Skills"
            />
          </div>
          {/*Buttons*/}
          <div className="gap-2 mt-4 bg-slate-800 px-6 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="submit"
              name="_action"
              value="create"
              className="rounded-full bg-rose-500 px-5 py-3 text-base font-medium text-white hover:bg-rose-600 md:py-3 md:px-6 md:text-lg"
            >
              Add
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

export default JobsAddModalForm;

