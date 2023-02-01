import { objectEnumValues } from "@prisma/client/runtime";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import type { ActionArgs, ActionFunction } from "@remix-run/server-runtime";
import { type LoaderArgs } from "@remix-run/server-runtime";
import { useEffect, useState } from "react";
import { e } from "vitest/dist/index-6e18a03a";
import JobsAddModal from "~/components/Jobs/JobsAddModal";
import JobsTable from "~/components/Jobs/JobsTable";
import JobsUpdateModal from "~/components/Jobs/JobsUpdateModal";
import Navigation from "~/components/navigation";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import type { Job, JobApps, User, PatchJob } from "../../utils/typings";
let   updateAppId       = ''; // holds app_id of the row to be updated


export async function loader({ request }: LoaderArgs) {
  const userId = await requireUserId(request);
  const user: User = await (
    await fetch(process.env.API_BASE_URL + "/profile/" + userId)
  ).json();
  const job_app: JobApps = await (
    await fetch(process.env.API_BASE_URL + "/application/user/" + user.id)
  ).json();
  return { user: user, job_app: job_app };
}

export let action: ActionFunction = async ({ request }: ActionArgs) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  let values = await Object.fromEntries(formData);

  if (values._action === "cancel") {
    return json({ status: 304, test: 999 });
  }

  switch (values._action) {
    case "create": // create a new job
      // form validation according to what a post request is looking for
      // formatting pay object for api
      let pay: any = {
        min: values.minPay ? Number(values.minPay) : null,
        max: values.maxPay ? Number(values.maxPay) : null,
      };
      pay = pay.min || pay.max ? pay : null;

      // if someone decided to swap min and max we swap here
      if (pay !== null && pay.min > pay.max) {
        let temp = pay.min;
        pay.min = pay.max;
        pay.max = temp;
      }

      // only gets fields with values from skills and turns it in to an array
      let skills = [values.skills, values.skills1, values.skills2].filter(
        (x) => {
          return x !== "" && x && x !== undefined;
        }
      );
      let date: Date = new Date(String(values.date_applied));

      // format object for api
      let toSend = {
        company_name: values.company_name, // required
        job_title: values.job_title, //required
        date_applied: date, // not required, server will default the date applied to current time
        remote: values.remote === "on" ? true : false,
        pay: pay,
        location: values.location, // required
        skills: skills,
        link: String(values.link),
      };

      if (!toSend.company_name) {
        return json(
          {
            errors: {
              company_name: "Company name is required",
              location:null,
              job_title: null,
              server: null,
            },
          },
          { status: 400 }
        );
      }
      if (!toSend.job_title) {
        return json(
          {
            errors: {
              company_name: null,
              location: null,
              job_title: "Job title is required",
              server: null,
            },
          },
          { status: 400 }
        );
      }
      if (!toSend.location) {
        return json(
          {
            errors: {
              company_name: null,
              location:"Location is required",
              job_title: null,
              server: null,
            },
          },
          { status: 400 }
        );
      }


      let results = await fetch(
        process.env.API_BASE_URL + "/application/user/" + userId,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(toSend),
        }
      );

      if (results.status !== 201) {
        // 201 == created
        // BAD, data was not entered correctly
        const err = await results.json();
        return json({ errors: { server: err.error }, status: results.status });
      }
      return json({ status: 201 });

    case "delete":
      let results_delete = await fetch(
        process.env.API_BASE_URL + "/application/" + values.app_id,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (results_delete.status !== 204) {
        return json(
          {
            errors: {
              company_name: null,
              job_title: null,
              server: "Server error, try again.",
            },
          },
          { status: 400 }
        );
      }
      return json({ status: 200 });

    case "edit": // used to open the Update Modal
      return json({ status: 202, app_id: values.app_id});

    case "patch":

      // this is ugly i know im so sorry
      if(!values.company_name 
        && !values.status 
        && !values.job_title 
        && !values.date_applied 
        && typeof values.remote != "boolean" 
        && !values.minPay 
        && !values.maxPay 
        && !values.skills 
        && !values.skills1 
        && !values.skills2){
        // error message here
        return json(
          { errors: { input:"Please enter at least one field to update." }},
          { status: 400 }
        );
      }

      // handling the ugly conditional stuff on pay
      let updatePay: any = {
        min: values.minPay ? Number(values.minPay) : null,
        max: values.maxPay ? Number(values.maxPay) : null,
      };
      updatePay = updatePay.min || updatePay.max ? updatePay : null;

      if (updatePay !== null && updatePay.min > updatePay.max) {
        let temp = updatePay.min;
        updatePay.min = updatePay.max;
        updatePay.max = temp;
      }

      let updateSkills = [values.skills, values.skills1, values.skills2].filter(
        (x) => {
          return x != "" && x && x !== undefined;
        }
      );

      let newDate: Date = new Date(String(values.date_applied));

      let patchToSend: PatchJob = {
      }

      patchToSend = Object.fromEntries(
        Object.entries(values).filter(([key, value]) => value != 'patch' && value != '' && key != 'app_id' && key != 'skills1' && key != 'skills2')
      )

      // conditional for special circumstances (pay, date, skills)

      // remote option - convert to bool
      if (values.remote == 'yes') {
        patchToSend.remote = true
      } else {patchToSend.remote = false};

      // only do the pay stuff if there's a min and/or max value?
      if(updatePay!=null){
        patchToSend.pay = updatePay;
      };

      // to prevent skills from being wiped out when user doesn't update it
      if (updateSkills.length != 0) {
        patchToSend.skills = updateSkills
      };

      patchToSend.date_applied = newDate

      // TO-DO -> form validating

      let results_patch = await fetch(
        process.env.API_BASE_URL + "/application/" + values.app_id,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(patchToSend),
        }
      );

      if (results_patch.status != 204) {
        const err = await results_patch.json();
        return json({ errors: { server: err.error }, status: results_patch.status });
      }
      // if update was done correctly, close the modal
      return json({ status: 201});
  }

  return json({ status: 200 });
};

export function parseCurrentJobs(status: string) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const jobs = useLoaderData<typeof loader>().job_app;
  const result = jobs.data.filter((job) => job.status == status);
  return result.length;
}

export default function Jobs() {
  const actionData       = useActionData<typeof action>(),
        err              = actionData?.errors !== undefined ? actionData.errors : "",
        data             = useLoaderData<typeof loader>(),
        newJobButtonText = "+ New Job",
        cardTitle1       = "Applied",
        cardCounter1     = parseCurrentJobs("Applied"),
        cardTitle2       = "Interviewing",
        cardCounter2     = parseCurrentJobs("Interview"),
        cardTitle3       = "Offers",
        cardCounter3     = parseCurrentJobs("Offer");

  const [displayAddModal, setdisplayAddModal] = useState(false);
  const [displayUpdateModal, setUpdatedisplayAddModal] = useState(false);

  const openModal = () => {
    setdisplayAddModal(true);
  };
  const closeModal = () => {
    setdisplayAddModal(false);
  };

  const openUpdateModal = () => {
    setUpdatedisplayAddModal(true);
  };
  const closeUpdateModal = () => {
    setUpdatedisplayAddModal(false);
  };

  useEffect(() => {
    if (actionData?.status === 201 || actionData?.status === 304) {
      closeModal();
      closeUpdateModal();
    }
  }, [actionData]);

  useEffect(() => {
    if (actionData?.status === 202) {
      updateAppId = actionData?.app_id;
      openUpdateModal();
    }
  }, [actionData]);

  return (
    <main>
      <div className="relative h-screen flex-col justify-center bg-slate-900">
        <Navigation />
        <h1 className="p-5 text-center text-4xl font-bold text-rose-400 sm:text-5xl md:text-6xl">
          <span className="block xl:inline">Jobs</span>
        </h1>

        <div className="mt-3 flex">
          <div className="ml-auto pr-20 transition-colors hover:text-cyan-500">
            <button
              className="rounded-full bg-rose-400 px-5 py-3 text-base font-medium text-white hover:bg-rose-500 md:py-3 md:px-6 md:text-lg"
              onClick={openModal}
            >
              {newJobButtonText}
            </button>
          </div>
        </div>
        <div className="flex flex-row justify-center gap-x-10 py-8">
          <div className="flex justify-center">
            <div className="block w-44 rounded-lg bg-sky-300 p-6 shadow-lg">
              <h5 className="mb-1 text-xl font-medium leading-tight text-slate-900">
                {cardTitle1}
              </h5>
              <p className="mb-1 text-2xl text-slate-900">{cardCounter1}</p>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="block w-44 rounded-lg bg-orange-300 p-6 shadow-lg">
              <h5 className="mb-1 text-xl font-medium leading-tight text-slate-900">
                {cardTitle2}
              </h5>
              <p className="mb-1 text-2xl text-slate-900">{cardCounter2}</p>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="block w-44 rounded-lg bg-emerald-300 p-6 shadow-lg">
              <h5 className="mb-1 text-xl font-medium leading-tight text-slate-900">
                {cardTitle3}
              </h5>
              <p className="mb-1 text-2xl text-slate-900">{cardCounter3}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 ml-5 text-2xl font-bold text-white">
          Current Applications:
        </div>
        <div>
          <JobsTable {...data.job_app} />
        </div>

        {displayAddModal ? (
          <div>
            <JobsAddModal error={err} />
          </div>
        ) : null}

        {displayUpdateModal ? (
          <div>
            <JobsUpdateModal error={err} app_id={updateAppId}/>
          </div>
        ) : null}
        </div>
    </main>
  );
}
