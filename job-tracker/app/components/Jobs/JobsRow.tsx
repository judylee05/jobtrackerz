import { Form } from "@remix-run/react";
import type { Job } from "~/utils/typings";

const JobsRow = (data: Job) => {
  /*
    Please check to see if the data is actually being formatted correctly,
    make sure its some other date in the past and not current date. 

    I have no idea if this actually works and need another pair of eyes on it
    */

  /*
  Citation for proper way to format dates:
  Date:11/26/2022
  Adapted from: https://stackoverflow.com/a/31732581
  */
  const d = new Date(data.date_applied.replace(/-/g, '\/').replace(/T.+/, ''));

  let formatted_date =d.toLocaleDateString('en-us');
  let formatted_skills: string = data.skills ? data.skills.join(", ") : "N/A";
  let formatted_contacts: string = data.contacts.join(", ");

  let formatted_pay = "N/A";
  if (data.pay) {
    if (data.pay.min !== null && data.pay.max !== null) {
      formatted_pay = "$" + data.pay.min + " - $" + data.pay.max;
    } else if (data.pay.min && (!data.pay.max || data.pay.max === null)) {
      formatted_pay = "$" + data.pay.min;
    } else if (data.pay.max && (!data.pay.min || data.pay.min === null)) {
      formatted_pay = "$" + data.pay.max;
    } else {
      formatted_pay = "N/A";
    }
  }

  return (
    // putting data.id here since that is the application id that we need to pass in when we edit a row
    <tr className="border-b " id={data.id}>
      <td className="whitespace-nowrap px-6 py-4 text-sm font-light text-white">
        {data.company_name}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm font-light text-white">
        {data.status}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm font-light text-white">
        {formatted_date}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm font-light text-white">
        {data.job_title}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm font-light text-white">
        {formatted_pay}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm font-light text-white">
        {formatted_skills}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm font-light text-white">
        {data.location}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm font-light text-white">
        {data.remote ? "Yes" : "No"}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm font-light text-white">
        {formatted_contacts}
      </td>
      <td className="whitespace-wrap px-6 py-4 text-sm font-light text-white">
        {data.link ? data.link : "N/A"}
      </td>
      <td>
        <Form method="post">
          <input name="app_id" readOnly value={data.id} type="hidden" />
          <button
            type="submit"
            name="_action"
            value="edit"
            className=" h-5 w-5 pt-1 text-emerald-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 512 512"
            >
              <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
            </svg>
          </button>
        </Form>
      </td>
      <td>
        <Form method="post">
          <input name="app_id" readOnly value={data.id} type="hidden" />
          <button
            type="submit"
            name="_action"
            value="delete"
            className="ml-2 h-5 w-5 pt-1 text-red-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 448 512"
            >
              <path d="M160 400C160 408.8 152.8 416 144 416C135.2 416 128 408.8 128 400V192C128 183.2 135.2 176 144 176C152.8 176 160 183.2 160 192V400zM240 400C240 408.8 232.8 416 224 416C215.2 416 208 408.8 208 400V192C208 183.2 215.2 176 224 176C232.8 176 240 183.2 240 192V400zM320 400C320 408.8 312.8 416 304 416C295.2 416 288 408.8 288 400V192C288 183.2 295.2 176 304 176C312.8 176 320 183.2 320 192V400zM317.5 24.94L354.2 80H424C437.3 80 448 90.75 448 104C448 117.3 437.3 128 424 128H416V432C416 476.2 380.2 512 336 512H112C67.82 512 32 476.2 32 432V128H24C10.75 128 0 117.3 0 104C0 90.75 10.75 80 24 80H93.82L130.5 24.94C140.9 9.357 158.4 0 177.1 0H270.9C289.6 0 307.1 9.358 317.5 24.94H317.5zM151.5 80H296.5L277.5 51.56C276 49.34 273.5 48 270.9 48H177.1C174.5 48 171.1 49.34 170.5 51.56L151.5 80zM80 432C80 449.7 94.33 464 112 464H336C353.7 464 368 449.7 368 432V128H80V432z" />
            </svg>
          </button>
        </Form>
      </td>
    </tr>
  );
};

export default JobsRow;
