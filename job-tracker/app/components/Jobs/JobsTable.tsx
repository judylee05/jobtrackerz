import type { JobApps } from "~/utils/typings";
import JobsRow from "./JobsRow";
import {Form} from "@remix-run/react";

const JobsTable = (job_app: JobApps) => {
  return (
    <table className="w-full bg-slate-900">
      <thead className="border-b">
        <tr>
          <th
            scope="col"
            className="px-6 py-4 text-left text-sm font-medium text-white"
          >
            Company
          </th>
          <th
            scope="col"
            className="px-6 py-4 text-left text-sm font-medium text-white"
          >
            Status
          </th>
          <th
            scope="col"
            className="px-6 py-4 text-left text-sm font-medium text-white"
          >
            Date
          </th>
          <th
            scope="col"
            className="px-6 py-4 text-left text-sm font-medium text-white"
          >
            Position
          </th>
          <th
            scope="col"
            className="px-6 py-4 text-left text-sm font-medium text-white"
          >
            Pay Range
          </th>
          <th
            scope="col"
            className="px-6 py-4 text-left text-sm font-medium text-white"
          >
            Skills
          </th>
          <th
            scope="col"
            className="px-6 py-4 text-left text-sm font-medium text-white"
          >
            Location
          </th>
          <th
            scope="col"
            className="px-6 py-4 text-left text-sm font-medium text-white"
          >
            Remote
          </th>
          <th
            scope="col"
            className="px-6 py-4 text-left text-sm font-medium text-white"
          >
            Contacts
          </th>
          <th
            scope="col"
            className="px-6 py-4 text-left text-sm font-medium text-white"
          >
            Link
          </th>
        </tr>
      </thead>
      
        <tbody>
        
          {/* Company */}
          {job_app.data.map((element) => {
            return <JobsRow key={element.id} {...element} />;
          })}
          
        </tbody>
      
    </table>
  );
};

export default JobsTable
