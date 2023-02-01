[<-Back](/backend/README.md)

- [User Applies for a Job](#User-applies-for-a-job)
- [Get User's Job Applications](#get-user-job-applications)
- [Get a Single Job Application](#Get-a-Single-Job-Application)
- [Update a Job Application](#patch-job-Application)
- [Delete a Job Application](#delete-job-Application)

### User Applies for a Job

Creates a new job application that is applied to the user.  Note if company does not exist, it will be added to the company table.

```
POST /application/user/:user_id
```
### Request

**Path Parameters**

| Name | Description |
|------|-------------|
| user_id | id of the user applying for the position. |

**Request Body**

Required

**Request Body Format**

JSON

**Request JSON Attributes**
| Name | Description | Required? |
|------|-------------|-----------|
| company_name | name of the company that the job is posted under | yes |
| job title | title of the job | yes |
| pay | has min and max values, if there is only one val, either put it on both or just one.  Can be null | no |
| location | main location of the job | yes |
| remote | true or false | yes |
| link | link to job application posting | no |

**Request Body Example**
```
{
  "company_name": "Nike",
  "job_title": "Software Engineer",
  "pay": {"min": 65000, "max":75000},
  "location": "Hillsboro",
  "remote": false
}
```

### Response
**Response Body Format**

JSON

**Response Statuses**

| Outcome | Status Code | Notes |
|---------|-------------|-------|
| Success | 201 | Successfully added job application to the job application table. |
| Failure | 400 | Invalid user id given. |
| Failure | 404 | Could not find user with this user id to add job application to. |
| Failure | 500 | Database or Server Error. |


**Response Examples**

_Success_

```
Status: 201 Created
{
  "company_id": "123",
  "user_id": "456",
  "job_title": "Software Engineer",
  "pay": {
    "min": 65000,
    "max": 75000
  },
  "location": "Hillsboro",
  "remote": false,
  "status": "Applied",
  "link": null,
  "id": "635429a900aed94bd72dae02",
  "date_applied": "2022-10-22T17:34:33.924Z",
}
```

_Failure_
```
Status: 404 Not Found
{
  "error": "Could not find user with this user id to add job application to."
}
```

_Failure_
```
Status: 400 Bad Request
{
  "error": "Invalid user id given."
}
```

_Failure_
```
Status: 500 Internal Server Error
{
  "error": "Database or Server error."
}
```

[^ Back to top ^](#)

___

### Get User Job Applications

Gets all the job applications for a single user.

```
GET /application/user/:user_id
```
### Request

**Path Parameters**

| Name | Description |
|------|-------------|
| user_id | id of the user applying for the position. |

**Request Body**

None

**Request Body Format**

JSON

**Request JSON Attributes**

None

**Request Body Example**

None

### Response
**Response Body Format**

JSON

**Response Statuses**

| Outcome | Status Code | Notes |
|---------|-------------|-------|
| Success | 200 | Found all applications |
| Failure | 400 | Invalid user id given |
| Failure | 404 | Could not find user with this user id. |
| Failure | 500 | Database or Server Error. |


**Response Examples**

_Success_

```
Status: 200 OK
{
    "data": [
        {
            "id": "789",
            "company_id": "123",
            "user_id": "456",
            "job_title": "Software Engineer",
            "pay": {
                "min": 65000,
                "max": 75000
            },
            "location": "Hillsboro",
            "remote": false,
            "status": "Applied",
            "link": null,
            "date_applied": "2022-10-22T17:34:33.924Z",
            "company_data":{
                "_id": "123",
                "company_name": "Nike",
                "employees": []
            }
        },
        {
            "id": "555",
            "company_id": "123",
            "user_id": "456",
            "job_title": "Website Developer",
            "pay": null,
            "location": "Hillsboro",
            "remote": false,
            "status": "Applied",
            "link": null,
            "date_applied": "2022-10-22T17:34:33.924Z",
            "company_data":{
                "_id": "123",
                "company_name": "Nike",
                "employees": []
            }
        },

    ]
}
```

_Failure_
```
Status: 404 Not Found
{
  "error": "Could not find user with this user id."
}
```

_Failure_
```
Status: 400 Bad Request
{
  "error": "invalid user id given."
}
```

_Failure_
```
Status: 500 Internal Server Error
{
  "error": "Database or Server error."
}
```

[^ Back to top ^](#)

___

### Get a Single Job Application

Get a single job application by id

```
GET /application/:application_id
```
### Request

**Path Parameters**

| Name | Description |
|------|-------------|
| application_id | id of the job application. |

**Request Body**

None

**Request Body Format**

JSON

**Request JSON Attributes**

None

**Request Body Example**

None

### Response
**Response Body Format**

JSON

**Response Statuses**

| Outcome | Status Code | Notes |
|---------|-------------|-------|
| Success | 200 | Found application |
| Failure | 400 | Invalid application id given |
| Failure | 404 | Could not find job application with this application id. |
| Failure | 500 | Database or Server Error. |


**Response Examples**

_Success_

```
Status: 200 OK
{
    "id": "789",
    "company_id": "123",
    "user_id": "456",
    "job_title": "Software Engineer",
    "pay": {
        "min": 65000,
        "max": 75000
    },
    "location": "Hillsboro",
    "remote": false,
    "status": "Applied",
    "link": null,
    "date_applied": "2022-10-22T17:34:33.924Z",
    "company_data":{
        "_id": "123",
        "company_name": "Nike",
        "employees": []
    }
}
```

_Failure_
```
Status: 404 Not Found
{
  "error": "Could not find job application with this application id."
}
```

_Failure_
```
Status: 400 Bad Request
{
  "error": "Invalid application id given."
}
```

_Failure_
```
Status: 500 Internal Server Error
{
  "error": "Database or Server error."
}
```

[^ Back to top ^](#)

___

### Patch Job Application

Update the job application

```
PATCH /application/:application_id
```
### Request

**Path Parameters**

| Name | Description |
|------|-------------|
| application_id | id of the job application. |

**Request Body**

Required

**Request Body Format**

JSON

**Request JSON Attributes**

| Name | Description | Required? |
|------|-------------|-----------|
| job title | title of the job | no |
| pay | has min and max values, if there is only one val, either put it on both or just one.  Can be null | no |
| location | main location of the job | no |
| remote | true or false | no |
| link | link to job application posting | no |

**Request Body Example**

```
{
  "job_title": "Software Engineer I",
}
```

### Response
**Response Body Format**

JSON

**Response Statuses**

| Outcome | Status Code | Notes |
|---------|-------------|-------|
| Success | 204 | Found and updated application |
| Failure | 400 | Invalid application id given |
| Failure | 400 | No data given |
| Failure | 404 | Could not find job application with this application id. |
| Failure | 500 | Database or Server Error. |


**Response Examples**

_Success_

```
Status: 204 No Content
{

}
```

_Failure_
```
Status: 404 Not Found
{
  "error": "Could not find job application with this application id."
}
```

_Failure_
```
Status: 400 Bad Request
{
  "error": "Invalid application id given."
}
```

_Failure_
```
Status: 400 Bad Request
{
  "error": "No data given."
}
```

_Failure_
```
Status: 500 Internal Server Error
{
  "error": "Database or Server error."
}
```

[^ Back to top ^](#)

___

### Delete Job Application

Update the job application

```
DELETE /application/:application_id
```
### Request

**Path Parameters**

| Name | Description |
|------|-------------|
| application_id | id of the job application. |

**Request Body**

Required

**Request Body Format**

None

**Request JSON Attributes**

None

**Request Body Example**

None

### Response
**Response Body Format**

JSON

**Response Statuses**

| Outcome | Status Code | Notes |
|---------|-------------|-------|
| Success | 204 | Deleted |
| Failure | 400 | Invalid application id given |
| Failure | 404 | Could not find job application with this application id. |
| Failure | 500 | Database or Server Error. |


**Response Examples**

_Success_

```
Status: 204 No Content

```

_Failure_
```
Status: 404 Not Found
{
  "error": "Could not find job application with this application id."
}
```

_Failure_
```
Status: 400 Bad Request
{
  "error": "Invalid application id given."
}
```

_Failure_
```
Status: 500 Internal Server Error
{
  "error": "Database or Server error."
}
```

[^ Back to top ^](#)

___