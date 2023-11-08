# URL Shortener Service

## Introduction

This document outlines the implementation approach for a URL shortener service backend. The service provides APIs for shortening URLs, managing user accounts, tracking URL usage, and enforcing rate limiting based on user tiers.

## Implementation Overview

### Tech Stack

- **Node.js** - The runtime environment for running the server-side JavaScript code.
- **Express.js**  - The web application framework for creating API endpoints.
- **MongoDB** - The NoSQL database for storing user and URL data.
- **Mongoose** - The Object Data Modeling (ODM) library for MongoDB and Node.js.
- **jsonwebtoken** - The library for generating and verifying JSON Web Tokens (JWT) for user authentication.
- **bcrypt** - The library for hashing passwords.
- **dotenv** - The library for loading environment variables from `.env` files.

### Project Structure

The project is structured as follows:
```
│  .env
│  package.json
│  server.js
│
├─models
│      Url.js
│      User.js
│
├─helpers
│      generateUniqueShortUrl.js
│
├─middleware
│      authenticateToken.js
│      checkRateLimit.js
│
├─controllers
│      urlController.js
│      userController.js
│
└─routes
        urlRoute.js
        userRoute.js
```

### Database Schema

#### URL Schema

The `Url` Schema is responsible for mapping long URLs to their shortened counterparts. It includes the following fields:
- `_id`
- `longUrl`: The original URL that needs to be shortened.
- `shortUrl`: The unique, shortened version of the URL. It is indexed for fast lookup and is required to be unique to avoid duplication. I chose not to set it as the primary key. This design choice allows for potential users' need to change the `shortUrl` while maintaining a consistent internal identifier with `_id`.
- `userId`: A reference to the `User` model that indicates ownership of the shortened URL. This field is indexed for efficient retrieval of all URLs associated with a specific user.

#### User Schema

The `User` Schema maintains user-specific data. Its fields include:
- `_id`
- `userName`
- `encryptedPassword`
- `tier`
- `requestCount`: Tracks the number of requests a user has made within a specific time frame, crucial for implementing rate limiting.
- `lastRequestTime`: The timestamp of the user's last request, used in conjunction with `requestCount` to reset the rate limit window. In specific, if this duration falls within the predefined rate limit window, the `lastRequestTime` remains unaltered, and the `requestCount` is incremented. Conversely, if the time elapsed surpasses the rate limit window, the server updates `lastRequestTime` to the current timestamp and resets the `requestCount` to zero.

#### Database efficiency

This modeling of data is optimized for efficiency. All database operations except retrieving a user's URL history are executed with O(1) time complexity.

### Core Functionalities

#### Authentication

- **Signup/Login/Logout**: Implemented in `userController.js` using bcrypt for password hashing and JWT for session management.
- **Token Verification**: Middleware in `authenticateToken.js` that validates JWTs for protected routes.

#### URL Management

- **Shortening URLs**: `urlController.js` handles the creation of shortened URLs, either randomly generated or custom aliases. The generateUniqueShortUrl function dynamically adjusts the length of the short URLs in response to the growing number of URLs generated, mitigating the risk of saturation and ensuring the uniqueness of each short URL without collision. 
- **Redirection**: A GET endpoint that redirects the short URL to the original URL.
- **URL History**: Users can fetch their URL history through an endpoint that queries based on the user ID.

#### Rate Limiting

- Implemented via `checkRateLimit.js` middleware which enforces request limits based on user tiers and resets the count based on the rate limit window.

### Further improvements:
To refine our service, the tier system could be expanded to impose limits on the number of short URLs that a user can generate. This feature would not only help manage system resources more efficiently but also prevent abuse of the service.

Moreover, we can divide the service into two distinct microservices—one for URL redirection and another for URL shortening. This would significantly enhance reliability and uptime. By decoupling these responsibilities, we can ensure persistent availability of the URL redirection service, even in the unlikely event that the URL shortening service becomes temporarily unavailable. Such resilience is crucial from a customer perspective, as it guarantees that their shared URLs remain active and accessible at all times, thereby maintaining trust and dependability in our service.


### Environmental Variables

The configuration is handled by a `.env` file which includes:

- `URL_SHORTENER_DB_URL`: The MongoDB connection string.
- `PORT`: The port number for the server.
- `JWT_SECRET`: The secret key for signing JWTs.
- `REDIRECT_SERVER_DOMAIN`: The domain of the redirect server, if this server is deployed on the cloud.
The `.env` file is excluded from version control to protect sensitive information.

### Usage

1. Install dependencies using `npm install`.
2. Set up the `.env` file with the necessary environment variables.
3. Run the server using `npm start`.
4. Create a New User, generate a Shortened URL, and Explore Additional Endpoints with Postman. (use x-www-form-urlencoded)


