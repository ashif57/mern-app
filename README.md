# MERN Boilerplate Backend

A production-ready Node.js/Express boilerplate for building RESTful APIs. This project comes with a comprehensive set of features including authentication, role-based access control, validation, caching, logging, and API documentation.

## Features

- **NoSQL Database**: [MongoDB](https://www.mongodb.com) object modeling using [Mongoose](https://mongoosejs.com)
- **Authentication**: JWT-based authentication (access and refresh tokens)
- **Authorization**: Role-based access control (User/Admin)
- **Validation**: Request data validation using [Joi](https://github.com/hapijs/joi)
- **Logging**: Application logging with [Winston](https://github.com/winstonjs/winston) and HTTP request logging with [Morgan](https://github.com/expressjs/morgan)
- **Security**: set security HTTP headers using [helmet](https://helmetjs.github.io)
- **CORS**: Cross-Origin Resource-Sharing enabled using [cors](https://github.com/expressjs/cors)
- **Caching**: Redis integration for caching using [ioredis](https://github.com/luin/ioredis)
- **Docker**: Docker support for easy deployment
- **API Documentation**: Interactive API documentation using [Swagger](https://swagger.io)
- **Error Handling**: Centralized error handling mechanism

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v14 or higher)
- [Docker](https://www.docker.com/) (optional, for running databases)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd mern-app/backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy the `.env.example` file (or create a `.env` file) in the `backend` directory.

   ```bash
   cp .env.example .env
   ```

   Ensure you have MongoDB and Redis running. You can use the provided `docker-compose.yml` in the root directory to spin them up.

4. Start the databases (from the project root):

   ```bash
   docker-compose up -d
   ```

5. Run the server:

   ```bash
   # development
   npm run dev

   # production
   npm start
   ```

## Project Structure

```
src\
 |--config\         # Environment variables and configuration (logger, roles, tokens, etc.)
 |--controllers\    # Route controllers (controller logic)
 |--docs\           # Swagger documentation files
 |--middlewares\    # Custom express middlewares (auth, error handling, rate limiting, validation)
 |--models\         # Mongoose models (User, Office, Token)
 |--routes\         # Routes definition
 |--services\       # Business logic (service layer)
 |--utils\          # Utility classes and functions (AppError, catchAsync, pick)
 |--validations\    # Request data validation schemas
 |--app.js          # Express app setup
 |--index.js        # App entry point
```

## API Documentation

To view the list of available APIs and their specifications, run the server and go to `http://localhost:3000/v1/docs` in your browser. This documentation page is automatically generated using the swagger definitions.

### API Endpoints

List of available routes:

**Auth Routes**:

- `POST /v1/auth/register` - register
- `POST /v1/auth/login` - login
- `POST /v1/auth/refresh-tokens` - refresh auth tokens
- `POST /v1/auth/logout` - logout

**User Routes**:

- `POST /v1/users` - create a user
- `GET /v1/users` - get all users
- `GET /v1/users/:userId` - get user
- `PATCH /v1/users/:userId` - update user
- `DELETE /v1/users/:userId` - delete user

**Office Routes**:

- `POST /v1/offices` - create an office
- `GET /v1/offices` - get all offices
- `GET /v1/offices/:officeId` - get office
- `PATCH /v1/offices/:officeId` - update office
- `DELETE /v1/offices/:officeId` - delete office

## Error Handling

The app has a centralized error handling mechanism. Controllers should try to catch the errors and forward them to the error handling middleware (by calling `next(error)`). For convenience, you can also use the `catchAsync` utility wrapper, which forwards the error automatically.

```javascript
const catchAsync = require("../utils/catchAsync");

const controller = catchAsync(async (req, res) => {
  // this error will be forwarded to the error handling middleware
  throw new Error("Something went wrong");
});
```

The error handling middleware sends an error response, which has the following format:

```json
{
  "code": 404,
  "message": "Not found"
}
```

## Validation

Request data is validated using [Joi](https://joi.dev/). Check the [documentation](https://joi.dev/api/) for more details on how to write Joi validation schemas.

The validation schemas are defined in the `src/validations` directory and are used in the routes by providing them as parameters to the `validate` middleware.

```javascript
const express = require("express");
const validate = require("../../middlewares/validate");
const userValidation = require("../../validations/user.validation");
const userController = require("../../controllers/user.controller");

const router = express.Router();

router.post(
  "/users",
  validate(userValidation.createUser),
  userController.createUser,
);
```

## Authentication

To require authentication for certain routes, you can use the `auth` middleware.

```javascript
const express = require("express");
const auth = require("../../middlewares/auth");
const userController = require("../../controllers/user.controller");

const router = express.Router();

router.post("/users", auth("manageUsers"), userController.createUser);
```

These routes require a valid JWT access token in the Authorization request header using the Bearer schema. If the request does not contain a valid access token, an Unauthorized (401) error is thrown.

**Generating Access Tokens**:

An access token is generated when a successful `POST /v1/auth/register` or `POST /v1/auth/login` request is made. An access token is valid for 30 minutes. You can also generate a new access token by making a `POST /v1/auth/refresh-tokens` request with a valid refresh token.

## Authorization

The `auth` middleware can also be used to require specific rights/permissions.

```javascript
const express = require("express");
const auth = require("../../middlewares/auth");
const userController = require("../../controllers/user.controller");

const router = express.Router();

router.post("/users", auth("manageUsers"), userController.createUser);
```

The user role and the rights of each role are defined in `src/config/roles.js`.

## Logging

Import the logger from `src/config/logger.js`. It is using the Winston logging library.

logging should be done according to the following severity levels (ascending order from most important to least important):

```javascript
const logger = require("<path to src>/config/logger");

logger.error("message"); // level 0
logger.warn("message"); // level 1
logger.info("message"); // level 2
logger.http("message"); // level 3
logger.verbose("message"); // level 4
logger.debug("message"); // level 5
```

## Custom Mongoose Plugins

The app also contains 2 custom mongoose plugins that you can attach to any mongoose model schema. You can find the plugins in `src/models/plugins`.

```javascript
const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const userSchema = mongoose.Schema(
  {
    /* schema definition here */
  },
  { timestamps: true },
);

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

const User = mongoose.model("User", userSchema);
```

### toJSON

The toJSON plugin applies the following changes in the toJSON transform call:

- removes `__v`, `createdAt`, `updatedAt`, and any schema path that has `private: true`
- replaces `_id` with `id`

### paginate

The paginate plugin adds the `paginate` static method to the mongoose schema.

## License

[MIT](LICENSE)
