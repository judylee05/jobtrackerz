import ContactsAddModalForm from "./ContactsAddModalForm"


const ContactsAddModal = (params:any) => {
    // error handling
    let err = null
    if(params.error.first_name) err = params.error.first_name
    else if(params.error.last_name) err = params.error.last_name
    else if(params.error.company) err = params.error.company
    else if(params.error.title) err = params.error.title
    else if(params.error.email) err = params.error.email
    else if(params.error.server) err = params.error.server // display any server error messages*/

    return (
        <div className="relative z-10 bg-slate-800" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-slate-800 bg-opacity-75 transition-opacity"></div>
            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex w-full min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-lg bg-slate-800 text-center shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        <div className="bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex justify-center">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <ContactsAddModalForm />
                                {err? <div className="text-rose-400 font-bold">{err}</div> : ""}
                            </div>
                        </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactsAddModal