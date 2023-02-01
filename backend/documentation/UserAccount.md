## User Account Endpoints

[<-Back](/backend/README.md)

- [Register](#register-a-new-user)
- [User Profile](#user-profile)
- [Update User Profile](#patch-profile)
- [Login](#login-a-user)


### Register a New User

Creates a new user object in the database from data passed in from the front end.

```
POST /register
```
### Request

**Path Parameters**

None

**Request Body**

Required

**Request Body Format**

JSON

**Request JSON Attributes**
| Name | Description | Required? |
|------|-------------|-----------|
| email | Primary email of the account owner. | yes |
| password | Password for the account to be hashed. | yes |
| first_name | User's first name. | yes |
| last_name | User's last name. | yes |

**Request Body Example**
```
{
  "email": "a@b.com",
  "password": "akjhfsajkhf",
  "first_name": "Alyssa",
  "last_name": "Comstock"
}
```

### Response
**Response Body Format**

JSON

**Response Statuses**

| Outcome | Status Code | Notes |
|---------|-------------|-------|
| Success | 201 | User has had their password hashed and has been successfully added to the database |
| Failure | 409 | Conflict - Email already exist. |
| Failure | 500 | Database or Server Error. |


**Response Examples**

_Success_

```
Status: 201 Created
{
  "id": 123
}
```

_Failure_
```
Status: 409 Conflict
{
  "error": "Email Already exists."
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

### User Profile

Gets the basic user information

```
GET /profile/:user_id
```
### Request

**Path Parameters**

| Name | Description | 
|------|-------------|
| user_id | id of the user to get |

**Request Body**

None

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
| Success | 200 | User found |
| Failure | 404 | User not found |
| Failure | 500 | Database or Server Error. |


**Response Examples**

_Success_
```
Status: 200 OK
{
  "id": 123,
  "email: "a@b.com",
  "first_name": "a",
  "last_name": "b",
  "dateCreated": "2022-10-16T01:26:27.031Z"
}
```

_Failure_
```
Status: 404 Conflict
{
  "error": "Could not find user."
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

### Patch Profile

Updates basic information for the user profile

```
PATCH /profile/:user_id
```
### Request

**Path Parameters**

| Name | Description | 
|------|-------------|
| user_id | id of the user to get |

**Request Body**

Required

**Request Body Format**

JSON

**Request JSON Attributes**

| Name | Description | Required? |
|------|-------------|-----------|
| first_name | New first name of the user | No |
| last_name | New last name of the user | No |


**Request Body Example**

{
  "first_name":"new_first_name"
}

### Response
**Response Body Format**

JSON

**Response Statuses**

| Outcome | Status Code | Notes |
|---------|-------------|-------|
| Success | 204 | updated |
| Failure | 404 | User not found |
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
  "error": "Could not find user."
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



### Login a User

```
POST /Login
```

### Request

**Path Parameters**

None

**Request Body**

Required

**Request Body Format**

JSON

**Request JSON Attributes**
| Name | Description | Required? |
|------|-------------|-----------|
| email | Primary email of the account owner. | yes |
| password | Password for the account. | yes |

**Request Body Example**
```
{
  "email": "a@b.com",
  "password": "akjhfsajkhf",
}
```

### Response
**Response Body Format**

JSON

**Response Statuses**

| Outcome | Status Code | Notes |
|---------|-------------|-------|
| Success | 200 | Login Successful. |
| Failure | 404 | Could not find User. |
| Failure | 403 | Incorrect password. |
| Failure | 500 | Server or database error.|


**Response Examples**

_Success_

```
Status: 200 OK
{
  "id": 123
}
```

_Failure_
```
Status: 404 Not Found
{
  "error": "Could not find User."
}
```

_Failure_
```
Status: 403 Forbidden
{
  "error": "Incorrect password."
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

