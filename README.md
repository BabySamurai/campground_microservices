## Textual Representation

```sql
+----------------+     +-----------------+     +-------------------+
| User Service   |<--->| Review Service  |<--->| Campground Service|
|    (gRPC)      |     |     (gRPC)      |     |      (gRPC)       |
|    :50051      |     |     :50052       |     |       :50053     |
+----------------+     +-----------------+     +-------------------+
        ^                        ^                         ^
        |                        |                         |
        |                        |                         |
+----------------+     +-----------------+     +-------------------+
| API Gateway    |<----| API Gateway     |<----| API Gateway       |
|   (REST API)   |     |    (REST API)   |     |     (REST API)    |
|    :3000       |     |     :3000       |     |       :3000       |
+----------------+     +-----------------+     +-------------------+
```
## User Endpoints

### Get all users

```
GET /users
```

Retrieves a list of all users.

#### Response

- Status Code: 200 OK
- Body:

```json
[
  {
    "user_id": "string",
    "username": "string",
    "email": "string"
  }
]
```

### Get a user

```
GET /users/:id
```

Retrieves a specific user by ID.

#### Parameters

- `id` (string, required) - The ID of the user.

#### Response

- Status Code: 200 OK
- Body:

```json
{
  "user_id": "string",
  "username": "string",
  "email": "string"
}
```

### Create a user

```
POST /user
```

Creates a new user.

#### Request Body

- `username` (string, required) - The username of the user.
- `email` (string, required) - The email of the user.

#### Response

- Status Code: 200 OK
- Body:

```json
{
  "user_id": "string",
  "username": "string",
  "email": "string"
}
```

### Update a user

```
PATCH /users/:id
```

Updates an existing user.

#### Parameters

- `id` (string, required) - The ID of the user.

#### Request Body

- `username` (string, optional) - The new username of the user.
- `email` (string, optional) - The new email of the user.

#### Response

- Status Code: 200 OK
- Body:

```json
{
  "user_id": "string",
  "username": "string",
  "email": "string"
}
```

### Delete a user

```
DELETE /users/:id
```

Deletes a user.

#### Parameters

- `id` (string, required) - The ID of the user.

#### Response

- Status Code: 204 No Content


## Reviews Endpoints

### Get all reviews

```
GET /reviews
```

Retrieves a list of all reviews.

#### Response

- Status Code: 200 OK
- Body:

```json
[
  {
    "review_id": "string",
    "title": "string",
    "body": "string",
    "rating": "number",
    "user": "User"
  }
]
```

### Get a review

```
GET /reviews/:id
```

Retrieves a specific review by ID.

#### Parameters

- `id` (string, required) - The ID of the review.

#### Response

- Status Code: 200 OK
- Body:

```json
{
  "review_id": "string",
  "title": "string",
  "body": "string",
  "rating": "number",
  "user": "User"
}
```

### Create a review

```
POST /review
```

Creates a new review.

#### Request Body

- `title` (string, required) - The title of the review.
- `body` (string, required) - The body of the review.
- `rating` (number, required) - The rating of the review.
- `user_id` (string, required) - The ID of the user associated with the review.

#### Response

- Status Code: 200 OK
- Body:

```json
{
  "review_id": "string",
  "title": "string",
  "body": "string",
  "rating": "number",
  "user": "User"
}
```

### Update a review

```
PATCH /reviews/:id
```

Updates an existing review.

#### Parameters

- `id` (string, required) - The ID of the review.

#### Request Body

- `title` (string, optional) - The new title of the review.
- `body` (string, optional) - The new body of the review.
- `rating` (number, optional) - The new rating of the review.

#### Response

- Status Code: 200 OK
- Body:

```json
{
  "review_id": "string",
  "title": "string",
  "body": "string",
  "rating": "number",
  "user": "User"
}
```

### Delete a review

```
DELETE /reviews/:id
```

Deletes a review.

#### Parameters

- `id` (string, required) - The ID of the review.

#### Response

- Status Code: 204 No Content


## Campgrounds Endpoints

### Get all campgrounds

```
GET /campgrounds
```

Retrieves a list of all campgrounds.

#### Response

- Status Code: 200 OK
- Body:

```json
[
  {
    "campground_id": "string",
    "title": "string",
    "description": "string",
    "price": "number",
    "location": "string",
    "user": "User",
    "reviews": ["Review"]
  }
]
```

### Get a campground

```
GET /campgrounds/:id
```

Retrieves a specific campground by ID.

#### Parameters

- `id` (string, required) - The ID of the campground.

#### Response

- Status Code: 200 OK
- Body:

```json
{
  "campground_id": "string",
  "title": "string",
  "description": "string",
  "price": "number",
  "location": "string",
  "user": "User",
  "review": ["Review"]
}
```

### Create a campground

```
POST /campground
```

Creates a new campground.

#### Request Body

- `title` (string, required) - The title of the campground.
- `description` (string, required) - The description of the campground.
- `price` (number, required) - The price of the campground.
- `location` (string, required) - The location of the campground.
- `user_id` (string, required) - The ID of the user associated with the campground.
- `review_ids` (array of strings, optional) - The IDs of the reviews associated with the campground.

#### Response

- Status Code: 200 OK
- Body:

```json
{
  "campground_id": "string",
  "title": "string",
  "description": "string",
  "price": "number",
  "location": "string",
  "user": "User",
  "reviews": ["Review"]
}
```

### Update a campground

```
PATCH /campgrounds/:id
```

Updates an existing campground.

#### Parameters

- `id` (string, required) - The ID of the campground.

#### Request Body

- `title` (string, optional) - The new title of the campground.
- `description` (string, optional) - The new description of the campground.
- `price` (number, optional) - The new price of the campground.
- `location` (string, optional) - The new location of the campground.

#### Response

- Status Code: 200 OK


- Body:

```json
{
  "campground_id": "string",
  "title": "string",
  "description": "string",
  "price": "number",
  "location": "string",
  "user": "User",
  "reviews": ["Review"]
}
```

### Delete a campground

```
DELETE /campgrounds/:id
```

Deletes a campground.

#### Parameters

- `id` (string, required) - The ID of the campground.

#### Response

- Status Code: 204 No Content



## Prerequisites

- Node.js (version 14 or above)
- npm (Node Package Manager)

## Installation

1. Open a terminal or command prompt.
2. Navigate to the directory where the User Service code is located.
3. Run the following command to install the dependencies:

```shell
npm install
```

## Running the Service

1. Make sure that the gRPC servers are running on `localhost:50051-50053`
3. In the terminal or command prompt, navigate to the directory where the User Service code is located.
4. Run the following command to start the User Service:

```shell
node starMicroservices.js
```

## Running the API Gateway

To run the API Gateway, use the following command:

```shell
node apiGateway.js
```
The API Gateway will be running on port 3000.

Make sure that all the necessary dependencies are installed and the respective gRPC services are running on their specified addresses. With these instructions, you should be able to run the User Service, Review Service, and Campground Service separately.

