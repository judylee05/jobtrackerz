export type User = {
  email: string;
  id: string;
  first_name: string;
  last_name: string;
  dateCreated: string;
};

export type Job = {
  skills: string[];
  company_name: string;
  job_title: string;
  pay: { [key: string]: number };
  location: string;
  remote: boolean;
  status: string;
  link: string;
  id: string;
  date_applied: string;
  contacts: [string]
};

export type Contact = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  title: string;
};

export type ContactList = {
  data: [Contact];
};

export type JobApps = {
  data: [Job];
};

export type PatchJob = {
  [key: string] : any;
}

export type PatchContact = {
  [key: string] : any;
}