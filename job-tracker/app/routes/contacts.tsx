import { ActionArgs, ActionFunction, json, LoaderArgs, SerializeFrom } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import ContactsAddModal from "~/components/Contacts/ContactsAddModal";
import ContactsTable from "~/components/Contacts/ContactsTable";
import ContactsUpdateModal from "~/components/Contacts/ContactsUpdateModal";
import Navigation from "~/components/navigation";
import { getContactList } from "~/models/contacts.server";
import { gerUserById } from "~/models/user.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import type { ContactList, User, PatchContact } from "../utils/typings";
let updateContactId = ''; // holds contact_id of the row to be updated

export type Loader = typeof loader;
type LoaderData = SerializeFrom<Loader>;

export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const user: User = await gerUserById(userId);
  const contactList = await getContactList(userId);
  return { user, contactList };
}

export let action: ActionFunction = async ({ request }: ActionArgs ) =>{
  const userId = await requireUserId(request);
  const formData = await request.formData();
  let values = await Object.fromEntries(formData)
  
  if(values._action === "cancel"){
    return json({status:304})
  }

  switch(values._action){
    case "create": // create a new job
      // form validation according to what a post request is looking for 
      
      // format object for api
      let toSend = {
        first_name: String(values.first_name), // required
        last_name: String(values.last_name), //required
        company: String(values.company), // required
        title: String(values.title),// required
        email: String(values.email) //required
      }

      // long string of validation if's I'm so sorry, there has to be a better way to do this :(
      if(!toSend.first_name){
        return json(
          { errors: { first_name: "First name is required", last_name: null, email: null, company: null,title:null, server:null} },
          { status: 400 }
        );
      }
      if(!toSend.last_name){
        return json(
          { errors: { first_name: null, last_name: "Last name is required", email: null, company: null,title:null, server:null} },
          { status: 400 }
        );
      }
      if(!toSend.email){
        return json(
          { errors: { first_name: null, last_name: null, email: "Email is required", company: null,title:null, server:null} },
          { status: 400 }
        );
      }
      if(!toSend.company){
        return json(
          { errors: { first_name: null, last_name: null, email: null, company: "Company is required",title:null, server:null} },
          { status: 400 }
        );
      }
      if(!toSend.title){
        return json(
          { errors: { first_name: null, last_name: null, email: null, company: null, title: "Title is required", server:null} },
          { status: 400 }
        );
      }

      let results = await fetch(process.env.API_BASE_URL + "/contacts/user/"+ userId, {
          method:"POST", 
          headers: {
            'Content-Type':'application/json'
          },
          body: JSON.stringify(toSend)
      })

      if(results.status !== 201){ // 201 == created
        // BAD, data was not entered correctly
        const err = await results.json()
        return json(
          { errors: {server: err.error}, status: results.status },
        );
      }
      return json({status:201})

    case "delete":
      let results_delete = await fetch(process.env.API_BASE_URL + "/contacts/"+values.contact_id, {
        method:"DELETE", 
        headers:{
          'Content-Type':'application/json'
        },
      })
      if(results_delete.status !== 204){
        // some sort of error happened, maybe display that message somehow?
        return json(
          { errors: { first_name: null, last_name: null, email: null, company: null, title: null, server:"Server error, try again."} },
          { status: 400 }
        );
      }
      return json({status:200})

    case "edit": // used to open the Update Modal
      return json({status:202, contact_id: values.contact_id});

    case "patch":
      // small validation
      if(!values.first_name && !values.last_name && !values.email && !values.company && !values.title){
        // error message here
        return json(
          { errors: { input:"Please enter at least one field to update." }},
          { status: 400 }
        );
      }

      let patchToSend: PatchContact = {
      }

      patchToSend = Object.fromEntries(
        Object.entries(values).filter(([key, value]) => value != '')
      )

      let results_patch = await fetch(
        process.env.API_BASE_URL + "/contacts/" + values.contact_id,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(patchToSend),
        }
      );

      if (results_patch.status != 204) {
        return json(
          {
            errors: {
              server: "Server error, try again.",
            }
          },
          {status: 400}
        )
      }
      // if update was done correctly, close the modal
      return json({status:201});
  }
  return json({status:200})
}


export default function Contacts() {
  const actionData       = useActionData<typeof action>(),
        err              = actionData?.errors !== undefined ? actionData.errors : "",
        data             = useLoaderData<typeof loader>();

  const contactList: ContactList = data.contactList;
  
  const [displayAddModal, setdisplayAddModal] = useState(false);
  const [displayUpdateModal, setUpdatedisplayAddModal] = useState(false);

  const openModal = ()=>{
    setdisplayAddModal(true)
  }
  const closeModal = ()=>{
    setdisplayAddModal(false)
  }

  const openUpdateModal = ()=>{
    setUpdatedisplayAddModal(true)
  }
  const closeUpdateModal = ()=>{
    setUpdatedisplayAddModal(false)
  }

  useEffect(()=>{
    if(actionData?.status === 201 || actionData?.status === 304){
      closeModal()
      closeUpdateModal()
    }
  }, [actionData])

  useEffect(()=>{
    if(actionData?.status === 202){
      updateContactId = actionData?.contact_id;
      openUpdateModal()
    }
  }, [actionData])

  return (
    <main>
      <div className="relative h-screen flex-col justify-center bg-slate-900">
        <Navigation />
        <h1 className="p-5 text-center text-4xl font-bold text-rose-400 sm:text-5xl md:text-6xl">
          <span className="block xl:inline">Contacts</span>
        </h1>

        <div className="mt-3 flex">

          <div className="ml-auto pr-20 transition-colors hover:text-cyan-500">
            <button
              className="rounded-full bg-rose-400 px-5 py-3 text-base font-medium text-white hover:bg-rose-500 md:py-3 md:px-6 md:text-lg"
              onClick={openModal}
            >
              + New Contact
            </button>
          </div>
        </div>
        {/* table */}
        {/*<div className="flex flex-col bg-slate-900 h-fit pb-3 overflow-x-hidden ">
          <div className="leg:-mx-8 sm:-mx-6">
            <div className="inline-block min-w-full py-2 sm:px-6">
  <div className="overflow-hidden">*/}
                <ContactsTable {...contactList}></ContactsTable>
              {/*</div>
            </div>
</div>
        </div>*/}
      </div>
      {displayAddModal ? (
          <div>
            <ContactsAddModal error={err}/>
          </div>
        ) : null}
      
      {displayUpdateModal ? (
          <div>
            <ContactsUpdateModal error={err} contact_id={updateContactId}/>
          </div>
        ) : null}
    </main>
  );
}
