# Trip Track API Documentation

Welcome to the Trip Track API documentation. This guide provides comprehensive information about the available endpoints, their functionalities, request and response structures, and necessary authentication details.

---

## Table of Contents

- [Trip Track API Documentation](#trip-track-api-documentation)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Authentication](#authentication)
    - [Register](#register)
    - [Login](#login)
    - [Logout](#logout)
  - [Users](#users)
    - [Create User](#create-user)
    - [Get User by ID](#get-user-by-id)
    - [Update Password](#update-password)
    - [Follow User](#follow-user)
    - [Unfollow User](#unfollow-user)
    - [Get Followers](#get-followers)
    - [Get Following](#get-following)
  - [Routes](#routes)
    - [Create Route](#create-route)
    - [Like Route](#like-route)
    - [Unlike Route](#unlike-route)
    - [Add Comment](#add-comment)
    - [Remove Comment](#remove-comment)
    - [Get Routes by User](#get-routes-by-user)
    - [Search Routes](#search-routes)
    - [Get Nearby Routes](#get-nearby-routes)
  - [Messages](#messages)
    - [Create Message](#create-message)
    - [Mark Message as Read](#mark-message-as-read)
    - [Get Messages by Conversation](#get-messages-by-conversation)
  - [Error Handling](#error-handling)
  - [Rate Limiting](#rate-limiting)
  - [Authentication Notes](#authentication-notes)
  - [Contact](#contact)

---

## Overview

- **Base URL:** `http://localhost:3000`
- **Authentication:** Utilizes session-based authentication. Ensure that cookies are handled appropriately in your client.
- **Content Type:** All requests and responses are in `JSON` format.

---

## Authentication

All authenticated endpoints require a valid session cookie. Authentication is handled through Express Session.

### Register

Create a new user account.

- **Endpoint:** `POST /users`
- **Description:** Registers a new user.
- **Request Body:**

  ```json
  {
  	"name": "John Doe",
  	"username": "johndoe",
  	"email": "john@example.com",
  	"password": "password123",
  	"bio": "Hello, I'm John!"
  }
  ```

- **Response:**

  - **Status:** `201 Created`
  - **Body:**

    ```json
    {
    	"_id": "userId",
    	"name": "John Doe",
    	"username": "johndoe",
    	"email": "john@example.com",
    	"bio": "Hello, I'm John!",
    	"profilePicture": null,
    	"followers": [],
    	"following": [],
    	"createdAt": "2024-03-20T00:00:00.000Z",
    	"updatedAt": "2024-03-20T00:00:00.000Z"
    }
    ```

- **Errors:**
  - **400 Bad Request:** Missing required fields or validation errors.
  - **400 Bad Request:** Email already exists.
  - **400 Bad Request:** Username already exists.

### Login

Authenticate a user and create a session.

- **Endpoint:** `POST /auth/login`
- **Description:** Logs in a user with valid credentials.
- **Request Body:**

  ```json
  {
  	"email": "john@example.com",
  	"password": "password123"
  }
  ```

- **Response:**

  - **Status:** `200 OK`
  - **Body:**

    ```json
    {
    	"_id": "userId",
    	"name": "John Doe",
    	"username": "johndoe",
    	"email": "john@example.com"
    }
    ```

- **Errors:**
  - **400 Bad Request:** Invalid credentials.

### Logout

Terminate the user's session.

- **Endpoint:** `POST /auth/logout`
- **Description:** Logs out the currently authenticated user.
- **Response:**

  - **Status:** `200 OK`
  - **Body:**

    ```json
    {
    	"message": "Logged out successfully"
    }
    ```

- **Errors:**
  - **401 Unauthorized:** No active session.

---

## Users

### Create User

Register a new user.

- **Endpoint:** `POST /users`
- **Description:** Creates a new user account.
- **Request Body:**

  ```json
  {
  	"name": "John Doe",
  	"username": "johndoe",
  	"email": "john@example.com",
  	"password": "password123",
  	"bio": "Hello, I'm John!",
  	"profilePicture": "https://example.com/profile.jpg"
  }
  ```

- **Response:**

  - **Status:** `201 Created`
  - **Body:**

    ```json
    {
    	"_id": "userId",
    	"name": "John Doe",
    	"username": "johndoe",
    	"email": "john@example.com",
    	"bio": "Hello, I'm John!",
    	"profilePicture": "https://example.com/profile.jpg",
    	"followers": [],
    	"following": [],
    	"bookmarks": [],
    	"isAdmin": false,
    	"isProtected": false,
    	"createdAt": "2024-03-20T00:00:00.000Z",
    	"updatedAt": "2024-03-20T00:00:00.000Z"
    }
    ```

- **Errors:**
  - **400 Bad Request:** Missing required fields or validation errors.
  - **400 Bad Request:** Email already exists.
  - **400 Bad Request:** Username already exists.

### Get User by ID

Retrieve a user's details by their ID.

- **Endpoint:** `GET /users/{id}`
- **Description:** Fetches user information based on the provided user ID.
- **Parameters:**

  - **Path:** `id` (string) - The unique identifier of the user.

- **Response:**

  - **Status:** `200 OK`
  - **Body:**

    ```json
    {
    	"_id": "userId",
    	"name": "John Doe",
    	"username": "johndoe",
    	"email": "john@example.com",
    	"bio": "Hello, I'm John!",
    	"profilePicture": "https://example.com/profile.jpg",
    	"followers": [],
    	"following": [],
    	"bookmarks": [],
    	"isAdmin": false,
    	"isProtected": false,
    	"createdAt": "2024-03-20T00:00:00.000Z",
    	"updatedAt": "2024-03-20T00:00:00.000Z"
    }
    ```

- **Errors:**
  - **404 Not Found:** User does not exist.
  - **400 Bad Request:** Invalid ID format.

### Update Password

Change a user's password.

- **Endpoint:** `PUT /users/{id}/password`
- **Description:** Updates the password for the specified user.
- **Parameters:**

  - **Path:** `id` (string) - The unique identifier of the user.

- **Request Body:**

  ```json
  {
  	"oldPassword": "password123",
  	"newPassword": "newPassword456"
  }
  ```

- **Response:**

  - **Status:** `200 OK`
  - **Body:**

    ```json
    {
    	"_id": "userId",
    	"name": "John Doe",
    	"username": "johndoe",
    	"email": "john@example.com",
    	"bio": "Hello, I'm John!",
    	"profilePicture": "https://example.com/profile.jpg",
    	"followers": [],
    	"following": [],
    	"bookmarks": [],
    	"isAdmin": false,
    	"isProtected": false,
    	"createdAt": "2024-03-20T00:00:00.000Z",
    	"updatedAt": "2024-03-21T00:00:00.000Z"
    }
    ```

- **Errors:**
  - **400 Bad Request:** Invalid old password.
  - **404 Not Found:** User does not exist.
  - **400 Bad Request:** Invalid ID format.

### Follow User

Follow another user.

- **Endpoint:** `POST /users/{id}/follow/{followId}`
- **Description:** Authenticated user follows the user with `followId`.
- **Parameters:**

  - **Path:**
    - `id` (string) - The ID of the user who is following.
    - `followId` (string) - The ID of the user to be followed.

- **Response:**

  - **Status:** `200 OK`
  - **Body:**

    ```json
    {
    	"message": "Successfully followed the user."
    }
    ```

- **Errors:**
  - **400 Bad Request:** Invalid ID format.
  - **404 Not Found:** User or followId does not exist.
  - **400 Bad Request:** Already following the user.

### Unfollow User

Unfollow a user that you are currently following.

- **Endpoint:** `DELETE /users/{id}/follow/{followId}`
- **Description:** Authenticated user unfollows the user with `followId`.
- **Parameters:**

  - **Path:**
    - `id` (string) - The ID of the user who is unfollowing.
    - `followId` (string) - The ID of the user to be unfollowed.

- **Response:**

  - **Status:** `200 OK`
  - **Body:**

    ```json
    {
    	"message": "Successfully unfollowed the user."
    }
    ```

- **Errors:**
  - **400 Bad Request:** Invalid ID format.
  - **404 Not Found:** User or followId does not exist.
  - **400 Bad Request:** Not following the user.

### Get Followers

Retrieve a list of users who follow a specific user.

- **Endpoint:** `GET /users/{id}/followers`
- **Description:** Fetches the followers of the specified user.
- **Parameters:**

  - **Path:** `id` (string) - The unique identifier of the user.
  - **Query Parameters:**
    - `page` (number, optional) - Page number for pagination (default: 1).
    - `limit` (number, optional) - Number of items per page (default: 10).

- **Response:**

  - **Status:** `200 OK`
  - **Body:**

    ```json
    {
    	"data": [
    		{
    			"_id": "followerId",
    			"username": "janedoe",
    			"profilePicture": "https://example.com/jane.jpg",
    			"name": "Jane Doe"
    		}
    		// More followers...
    	],
    	"pagination": {
    		"page": 1,
    		"limit": 10,
    		"totalPages": 2,
    		"totalItems": 15
    	}
    }
    ```

- **Errors:**
  - **400 Bad Request:** Invalid ID format.
  - **404 Not Found:** User does not exist.

### Get Following

Retrieve a list of users that a specific user is following.

- **Endpoint:** `GET /users/{id}/following`
- **Description:** Fetches the users that the specified user is following.
- **Parameters:**

  - **Path:** `id` (string) - The unique identifier of the user.
  - **Query Parameters:**
    - `page` (number, optional) - Page number for pagination (default: 1).
    - `limit` (number, optional) - Number of items per page (default: 10).

- **Response:**

  - **Status:** `200 OK`
  - **Body:**

    ```json
    {
    	"data": [
    		{
    			"_id": "followingId",
    			"username": "johnsmith",
    			"profilePicture": "https://example.com/john.jpg",
    			"name": "John Smith"
    		}
    		// More following users...
    	],
    	"pagination": {
    		"page": 1,
    		"limit": 10,
    		"totalPages": 1,
    		"totalItems": 5
    	}
    }
    ```

- **Errors:**
  - **400 Bad Request:** Invalid ID format.
  - **404 Not Found:** User does not exist.

---

## Routes

### Create Route

Create a new travel route.

- **Endpoint:** `POST /routes`
- **Description:** Allows authenticated users to create a new travel route.
- **Request Body:**

  ```json
  {
  	"title": "Scenic Mountain Route",
  	"startPoint": {
  		"lat": 45.523064,
  		"lng": -122.676483
  	},
  	"endPoint": {
  		"lat": 45.522749,
  		"lng": -122.678928
  	},
  	"travelMode": "DRIVING",
  	"description": "Beautiful mountain drive",
  	"totalDistance": 15000,
  	"totalTime": 1800,
  	"visibility": "public"
  }
  ```

- **Response:**

  - **Status:** `201 Created`
  - **Body:**

    ```json
    {
    	"_id": "routeId",
    	"title": "Scenic Mountain Route",
    	"creator": {
    		"_id": "userId",
    		"username": "johndoe",
    		"profilePicture": "https://example.com/profile.jpg",
    		"name": "John Doe"
    	},
    	"startPoint": {
    		"lat": 45.523064,
    		"lng": -122.676483
    	},
    	"endPoint": {
    		"lat": 45.522749,
    		"lng": -122.678928
    	},
    	"travelMode": "DRIVING",
    	"description": "Beautiful mountain drive",
    	"totalDistance": 15000,
    	"totalTime": 1800,
    	"visibility": "public",
    	"likes": [],
    	"comments": [],
    	"createdAt": "2024-03-20T00:00:00.000Z",
    	"updatedAt": "2024-03-20T00:00:00.000Z"
    }
    ```

- **Errors:**
  - **400 Bad Request:** Missing required fields or validation errors.
  - **401 Unauthorized:** User must be logged in to create a route.

### Like Route

Like a specific route.

- **Endpoint:** `POST /routes/{routeId}/like/{userId}`
- **Description:** Allows a user to like a route.
- **Parameters:**

  - **Path:**
    - `routeId` (string) - The ID of the route to like.
    - `userId` (string) - The ID of the user liking the route.

- **Response:**

  - **Status:** `200 OK`
  - **Body:**

    ```json
    {
    	"_id": "routeId",
    	"likes": [
    		{
    			"_id": "userId",
    			"username": "johndoe",
    			"name": "John Doe"
    		}
    	]
    }
    ```

- **Errors:**
  - **400 Bad Request:** Invalid ID format.
  - **404 Not Found:** Route or user does not exist.
  - **400 Bad Request:** User has already liked the route.

### Unlike Route

Remove a like from a specific route.

- **Endpoint:** `DELETE /routes/{routeId}/like/{userId}`
- **Description:** Allows a user to unlike a route they have previously liked.
- **Parameters:**

  - **Path:**
    - `routeId` (string) - The ID of the route to unlike.
    - `userId` (string) - The ID of the user unliking the route.

- **Response:**

  - **Status:** `200 OK`
  - **Body:**

    ```json
    {
    	"_id": "routeId",
    	"likes": []
    }
    ```

- **Errors:**
  - **400 Bad Request:** Invalid ID format.
  - **404 Not Found:** Route or user does not exist.
  - **400 Bad Request:** User has not liked the route.

### Add Comment

Add a comment to a route.

- **Endpoint:** `POST /routes/{routeId}/comments`
- **Description:** Allows a user to add a comment to a specific route.
- **Parameters:**

  - **Path:**
    - `routeId` (string) - The ID of the route to comment on.

- **Request Body:**

  ```json
  {
  	"userId": "userId",
  	"content": "Great route!"
  }
  ```

- **Response:**

  - **Status:** `200 OK`
  - **Body:**

    ```json
    {
    	"_id": "routeId",
    	"comments": [
    		{
    			"_id": "commentId",
    			"content": "Great route!",
    			"user": {
    				"_id": "userId",
    				"name": "John Doe",
    				"username": "johndoe",
    				"profilePicture": "https://example.com/profile.jpg"
    			},
    			"createdAt": "2024-03-20T01:00:00.000Z"
    		}
    		// More comments...
    	]
    }
    ```

- **Errors:**
  - **400 Bad Request:** Missing required fields or validation errors.
  - **400 Bad Request:** Invalid ID format.
  - **404 Not Found:** Route or user does not exist.

### Remove Comment

Remove a comment from a route.

- **Endpoint:** `DELETE /routes/{routeId}/comments/{commentId}`
- **Description:** Allows a user to remove their comment from a specific route.
- **Parameters:**

  - **Path:**
    - `routeId` (string) - The ID of the route.
    - `commentId` (string) - The ID of the comment to remove.

- **Request Body:**

  ```json
  {
  	"userId": "userId"
  }
  ```

- **Response:**

  - **Status:** `200 OK`
  - **Body:**

    ```json
    {
    	"_id": "routeId",
    	"comments": [
    		// Remaining comments...
    	]
    }
    ```

- **Errors:**
  - **400 Bad Request:** Invalid ID format.
  - **404 Not Found:** Route or comment does not exist.
  - **403 Forbidden:** User is not authorized to delete this comment.

### Get Routes by User

Retrieve all routes created by a specific user.

- **Endpoint:** `GET /routes/user/{userId}`
- **Description:** Fetches routes created by the specified user with pagination.
- **Parameters:**

  - **Path:** `userId` (string) - The unique identifier of the user.
  - **Query Parameters:**
    - `page` (number, optional) - Page number for pagination (default: 1).
    - `limit` (number, optional) - Number of routes per page (default: 10).

- **Response:**

  - **Status:** `200 OK`
  - **Body:**

    ```json
    {
    	"data": [
    		{
    			"_id": "routeId",
    			"title": "Scenic Mountain Route",
    			"creator": {
    				"_id": "userId",
    				"username": "johndoe",
    				"name": "John Doe"
    			},
    			"startPoint": {
    				"lat": 45.523064,
    				"lng": -122.676483
    			},
    			"endPoint": {
    				"lat": 45.522749,
    				"lng": -122.678928
    			}
    		}
    		// More routes...
    	],
    	"page": 1,
    	"limit": 10,
    	"total": 25,
    	"pages": 3
    }
    ```

- **Errors:**
  - **400 Bad Request:** Invalid ID format.
  - **404 Not Found:** User does not exist.

### Search Routes

Search for routes based on a query string.

- **Endpoint:** `GET /routes/search`
- **Description:** Searches for routes that match the provided query.
- **Parameters:**

  - **Query Parameters:**
    - `q` (string, required) - The search query.
    - `page` (number, optional) - Page number for pagination (default: 1).
    - `limit` (number, optional) - Number of routes per page (default: 10).

- **Example Request:**

  ```
  GET /routes/search?q=mountain&page=1&limit=10
  ```

- **Response:**

  - **Status:** `200 OK`
  - **Body:**

    ```json
    {
    	"data": [
    		{
    			"_id": "routeId",
    			"title": "Scenic Mountain Route",
    			"creator": {
    				"_id": "userId",
    				"username": "johndoe",
    				"name": "John Doe"
    			}
    		}
    		// More routes...
    	],
    	"page": 1,
    	"limit": 10,
    	"total": 1,
    	"pages": 1
    }
    ```

- **Errors:**
  - **400 Bad Request:** Missing or invalid query parameters.

### Get Nearby Routes

Find routes near a specific geographic location.

- **Endpoint:** `GET /routes/nearby`
- **Description:** Retrieves routes within a specified radius from given latitude and longitude.
- **Parameters:**

  - **Query Parameters:**
    - `lat` (number, required) - Latitude of the center point.
    - `lng` (number, required) - Longitude of the center point.
    - `radius` (number, optional) - Radius in kilometers (default: 10).
    - `page` (number, optional) - Page number for pagination (default: 1).
    - `limit` (number, optional) - Number of routes per page (default: 10).

- **Example Request:**

  ```
  GET /routes/nearby?lat=45.523064&lng=-122.676483&radius=10&page=1&limit=10
  ```

- **Response:**

  - **Status:** `200 OK`
  - **Body:**

    ```json
    {
    	"data": [
    		{
    			"_id": "routeId",
    			"title": "Scenic Mountain Route",
    			"creator": {
    				"_id": "userId",
    				"username": "johndoe",
    				"name": "John Doe"
    			},
    			"startPoint": {
    				"lat": 45.523064,
    				"lng": -122.676483
    			},
    			"endPoint": {
    				"lat": 45.522749,
    				"lng": -122.678928
    			}
    		}
    		// More nearby routes...
    	],
    	"page": 1,
    	"limit": 10,
    	"total": 1,
    	"pages": 1
    }
    ```

- **Errors:**
  - **400 Bad Request:** Missing or invalid query parameters.

---

## Messages

### Create Message

Send a new message within a conversation.

- **Endpoint:** `POST /messages`
- **Description:** Creates a new message in the specified conversation.
- **Request Body:**

  ```json
  {
  	"conversationId": "conversationId",
  	"senderId": "userId",
  	"content": "Hello there!"
  }
  ```

- **Response:**

  - **Status:** `201 Created`
  - **Body:**

    ```json
    {
    	"_id": "messageId",
    	"conversation": "conversationId",
    	"sender": {
    		"_id": "userId",
    		"username": "johndoe",
    		"name": "John Doe"
    	},
    	"content": "Hello there!",
    	"readBy": ["userId"],
    	"createdAt": "2024-03-20T01:00:00.000Z"
    }
    ```

- **Errors:**
  - **400 Bad Request:** Missing required fields or validation errors.
  - **400 Bad Request:** Invalid ID format.
  - **404 Not Found:** Conversation or sender does not exist.

### Mark Message as Read

Mark a specific message as read by a user.

- **Endpoint:** `PUT /messages/{messageId}/read/{userId}`
- **Description:** Marks the specified message as read by the user.
- **Parameters:**

  - **Path:**
    - `messageId` (string) - The ID of the message to mark as read.
    - `userId` (string) - The ID of the user marking the message as read.

- **Response:**

  - **Status:** `200 OK`
  - **Body:**

    ```json
    {
    	"_id": "messageId",
    	"conversation": "conversationId",
    	"sender": {
    		"_id": "userId",
    		"username": "johndoe",
    		"name": "John Doe"
    	},
    	"content": "Hello there!",
    	"readBy": ["userId1", "userId2"],
    	"createdAt": "2024-03-20T01:00:00.000Z"
    }
    ```

- **Errors:**
  - **400 Bad Request:** Invalid ID format.
  - **404 Not Found:** Message or user does not exist.
  - **400 Bad Request:** User has already marked the message as read.

### Get Messages by Conversation

Retrieve all messages within a specific conversation.

- **Endpoint:** `GET /messages/conversation/{conversationId}`
- **Description:** Fetches messages from the specified conversation with pagination.
- **Parameters:**

  - **Path:** `conversationId` (string) - The unique identifier of the conversation.
  - **Query Parameters:**
    - `page` (number, optional) - Page number for pagination (default: 1).
    - `limit` (number, optional) - Number of messages per page (default: 50).

- **Response:**

  - **Status:** `200 OK`
  - **Body:**

    ```json
    {
    	"data": [
    		{
    			"_id": "messageId",
    			"conversation": "conversationId",
    			"sender": {
    				"_id": "userId",
    				"username": "johndoe",
    				"name": "John Doe"
    			},
    			"content": "Hello there!",
    			"readBy": ["userId1", "userId2"],
    			"createdAt": "2024-03-20T01:00:00.000Z"
    		}
    		// More messages...
    	],
    	"page": 1,
    	"limit": 50,
    	"total": 75,
    	"pages": 2
    }
    ```

- **Errors:**
  - **400 Bad Request:** Invalid ID format.
  - **404 Not Found:** Conversation does not exist.

---

## Error Handling

All error responses follow a consistent structure:

- **Status Code:** Indicates the type of error (e.g., 400, 401, 404).
- **Body:**

  ```json
  {
  	"message": "Description of the error."
  }
  ```

**Common Error Messages:**

- `"Invalid credentials"`
- `"User not found"`
- `"Email already exists"`
- `"Username already exists"`
- `"Invalid ID format"`
- `"Not following the user"`
- `"Already following the user"`
- `"Conversation must have at least 2 participants"`
- `"You must be logged in to create a route"`
- `"Failed to create route"`
- `"Failed to like route"`
- `"Failed to unlike route"`
- `"Failed to send message"`

Ensure to handle these errors appropriately in your client applications to provide meaningful feedback to users.

---

## Rate Limiting

API requests are limited to **100 requests per IP address per 15-minute window**. Exceeding this limit will result in a `429 Too Many Requests` error.

---

## Authentication Notes

- **Session-Based Authentication:** The API uses session cookies to manage user authentication. Ensure that your client handles cookies correctly to maintain authenticated sessions.
- **Protected Routes:** Certain endpoints require the user to be authenticated. Unauthorized access attempts will result in `401 Unauthorized` errors.
- **Session Expiry:** Sessions expire after **24 hours** of inactivity.
- **CORS:** Enabled for frontend development. Ensure your client is configured to handle CORS appropriately.

---

## Contact

For any inquiries or feedback regarding the Trip Track API, please contact:

- **Email:** [yigitbaba.contact@gmail.com](mailto:yigitbaba.contact@gmail.com)
- **GitHub:** [https://github.com/babaygt](https://github.com/babaygt)

---

_Last Updated: November 15, 2024_
