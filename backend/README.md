Guess who likes writing documentation and diagramming.

# API Documentation

- [Data Models](#data-models)
- [User Account Endpoints](/backend/documentation/UserAccount.md) - In a different file
- [Job Application Endpoints](/backend/documentation/Jobs.md) - In a different file


## Data Models

### users
| Property | Data Type | required | frontend form data | Notes |
|----------|-----------|----------|--------------------|-------|
| _id | MongoDB Type ObjectId | True, auto-generated | false | Primary Key, id_.toString() returns the id in a better human readable way.|
| email | string | true | true | MUST BE UNIQUE. Used as the primary form of identification outside of the id |
| password | string | true | true | hashed password, no plaintext password allowed |
| first_name | string | true | true | - |
| last_name | string | true | true | - |
| dateCreated | date | true, created by default | false | Automatically generated in the backend when a user object is created, front end does not need to worry about handling this. |


### job_applications
| Property | Data Type | required | frontend form data | Notes |
|----------|-----------|----------|--------------------|-------|
| _id | MongoDB Type ObjectId | True, auto-generated | false | Primary Key, id_.toString() returns the id in a better human readable way.|
| user_id | MongoDB Type ObjectId | true | true | id of the user that applied for this job. |
| company_id | MongoDB Type ObjectId | true | true | id of the company that the job is listed under.  If the company does not exist, the company is added to the company collection. |
| date_applied | Date | true, created by default | false | Automatically generated in the backend when a user object is created, front end does not need to worry about handling this. |
| job_title | string | true | true | - |
| pay | Object of two numbers min and max | false | true | Can be null if no pay range is given, if there is only one number given put the value in one or both but keep it consistent for your own sanity |
| location | string | true | true | - |
| remote | boolean | true | true | - |
| status | string | false, default "Applied" | true | - |
| link | string | false , default null| true | - |