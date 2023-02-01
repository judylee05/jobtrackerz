import type { ContactList } from "~/utils/typings";
import ContactsRow from "./ContactsRow";

const ContactsTable = (contactList: ContactList) => {
  return (
    <table className="w-full bg-slate-900">
      <thead className="border-b">
        <tr>
          <th
            scope="col"
            className="px-6 py-4 text-left text-sm font-medium text-white"
          >
            Name
          </th>
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
            Title
          </th>
          <th
            scope="col"
            className="px-6 py-4 text-left text-sm font-medium text-white"
          >
            Email
          </th>
        </tr>
      </thead>
      <tbody>
        {contactList.data?.map((element) => {
          return <ContactsRow key={element.id} {...element} />;
        })}
      </tbody>
    </table>
  );
};

export default ContactsTable;
