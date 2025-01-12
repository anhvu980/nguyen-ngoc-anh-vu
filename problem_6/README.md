# Scoreboard API Service Specification

## Overview

This module serves as the backend API for managing the scoreboard, updating user scores, and ensuring secure handling of score updates. It is designed to allow live updates to the scoreboard while preventing unauthorized access and score manipulation.

## Functionality

- **Live Score Updates**: The system updates the top 10 scores in real time when a user completes an action.
- **Score Update Endpoint**: A secure API endpoint will handle requests to update user scores.
- **Security**: The API will ensure that score updates can only occur with proper authorization to prevent malicious users from tampering with scores.

## API Endpoints

### 1. POST /api/score/update

#### Description

Updates a user's score upon completion of a valid action.

#### Request Body

```json
{
  "user_id": "string",
  "score_increment": "integer",
  "auth_token": "string"
}

user_id (string, required): The unique identifier for the user.
score_increment (integer, required): The number of points to add to the user’s score.
auth_token (string, required): A secure authorization token to validate the request.

Response
{
  "status": "success",
  "message": "User score updated successfully."
}

status (string): Indicates whether the request was successful.
message (string): A description of the result.

Error Response
{
  "status": "error",
  "message": "Unauthorized access."
}


status (string): Indicates failure status.
message (string): Describes the error (e.g., unauthorized access, invalid parameters).

2. GET /api/scoreboard
Description
Fetches the top 10 user scores.

Response

[
  {
    "user_id": "string",
    "username": "string",
    "score": "integer"
  },
  ...
]

user_id (string): The unique identifier for the user.
username (string): The display name of the user.
score (integer): The current score of the user.

Authentication & Security
To prevent malicious users from submitting unauthorized score updates, the following security measures should be implemented:

1. Authorization Tokens
Every request to /api/score/update must include a valid auth_token.
Tokens should be issued during user authentication and are required for validating the request.
2. Token Validation
The server should validate the token to ensure the user has authorization to update the score.
If the token is invalid or expired, the server should respond with an error.
3. Rate Limiting
Implement rate limiting to prevent abuse of the API (e.g., excessive score updates from a single user in a short period).
4. Input Validation
Ensure that the score_increment is a positive integer and that the user_id corresponds to a valid user in the database.
Any malformed requests should be rejected.
Live Scoreboard Updates
To maintain the real-time display of the top 10 scores, we recommend integrating the following:

Use WebSockets or server-sent events (SSE) to broadcast score updates to all connected clients, ensuring they see the most recent data without needing to reload the page.
A message containing the updated score and user information should be sent to all connected clients after a successful score update.
Database Design
We assume a simple database schema for storing user scores:

Users Table:
user_id (primary key, string)
username (string)
score (integer)
Flow of Execution
Below is a diagram that illustrates the flow of the system:

Flow of Execution Diagram:
User performs an action: The user completes an action on the website.
Action triggers API call: The action sends a POST request to the /api/score/update endpoint with the relevant user_id, score_increment, and auth_token.
Token validation: The server validates the auth_token to confirm the user's authorization.
Score update: If the token is valid, the user's score is updated in the database.
Broadcast to clients: The updated score is broadcasted to all clients (using WebSockets/SSE) for live update.
Client updates the scoreboard: The front-end dynamically updates the scoreboard with the new data.
Diagram of Flow

+-----------------+    Action    +------------------------+    Validate    +------------------+    Update    +-------------------+
| User performs   | ------------> | /api/score/update      | -------------> | Auth Token       | ------------> | User's score      |
| an action       |               | (POST request)         |   (valid/invalid) | Validation       |               | is updated in     |
+-----------------+               +------------------------+                   +------------------+               | database         |
                                                                                                          |               |
                                                                                                          v               v
                                                                                            +---------------------------+
                                                                                            | Broadcast updated score   |
                                                                                            | to connected clients via  |
                                                                                            | WebSockets / SSE          |
                                                                                            +---------------------------+
                                                                                                          |
                                                                                                          v
                                                                                              +-------------------------+
                                                                                              | Front-end updates the   |
                                                                                              | scoreboard in real-time |
                                                                                              +-------------------------+

Improvements and Considerations
Scalability: Consider using a distributed cache (e.g., Redis) for frequently accessed data like the top 10 scores to reduce database load.
API Versioning: Implement versioning for the API to maintain backward compatibility as the system evolves.
Error Handling: Ensure that detailed error messages are provided for debugging purposes (e.g., invalid score_increment or malformed requests).
Logging and Monitoring: Set up proper logging and monitoring for tracking API requests, errors, and abnormal activity.
```
