[![Build and run tests](https://github.com/Slonik923/flow/actions/workflows/build.yaml/badge.svg)](https://github.com/Slonik923/flow/actions/workflows/build.yaml)
[![Publish package to GitHub Packages](https://github.com/Slonik923/flow/actions/workflows/publish.yaml/badge.svg)](https://github.com/Slonik923/flow/actions/workflows/publish.yaml)

# Flow Library

Helper library for managing request-scoped data in Express applications using Node.js [AsyncLocalStorage](https://nodejs.org/api/async_context.html#class-asynclocalstorage).

This library simplifies accessing request-specific context (like the current user, request details, localization functions, etc.) anywhere in your call stack without passing them as arguments.

## Installation

```bash
npm install @ofrules/flow
```

## Usage

### 1. Define your Context Interface

Define the shape of the data you want to store for each request. The library provides a `RequestData` class to help capture standard request details.

```typescript
import { RequestData } from "@ofrules/flow";

// Example context interface
export interface MyContext {
  request: RequestData;
  userId?: string;
  // Add other properties as needed (e.g., i18next t function, trace IDs)
}
```

### 2. Create the Flow Instance

Extend the `FlowDefinition` class typed with your context interface, and export a singleton instance. This singleton will be used to access the data.

```typescript
// flow.ts
import { FlowDefinition } from "@ofrules/flow";
import { MyContext } from "./types";

class MyFlow extends FlowDefinition<MyContext> {}

export const Flow = new MyFlow();
```

### 3. Setup the Middleware

Use the `flowMiddleware` in your Express application. This middleware initializes the asynchronous storage for each request and populates the `request` property.

```typescript
import express from "express";
import { flowMiddleware } from "@ofrules/flow";
import { Flow } from "./flow";

const app = express();

// Initialize flow middleware
app.use(flowMiddleware(Flow));

// ... other middleware and routes
```

### 4. Access Data Anywhere

You can now retrieve the current context data from anywhere in your async code (controllers, services, models) using `Flow.get()`.

```typescript
import { Flow } from "./flow";

export const myServiceFunction = () => {
  // Get the current context
  const context = Flow.get();

  console.log(`Request from IP: ${context.request.ip}`);
  console.log(`Request URL: ${context.request.url}`);
  
  if (context.userId) {
    // ... do something with user
  }
};
```

## API

### `FlowDefinition<T>`
Abstract class wrapping `AsyncLocalStorage`.
- `get()`: Returns the current store `T`. **Throws an error** if called outside of an active asynchronous context (i.e., if the middleware hasn't run or context is lost).
- `init(data, callback, ...args)`: Runs the callback within the context of `data`. Used internally by the middleware.

### `flowMiddleware(flowInstance)`
Express middleware that initializes the storage.
- **Input:** An instance of your `FlowDefinition`.
- **Behavior:** Captures `RequestData` from the Express request and initializes the store with `{ request: RequestData }`.
- **Type Warning:** The middleware casts the initial object to `T`. Ensure your context type `T` has a `request` property of type `RequestData`. Other properties in `T` will be `undefined` initially.

### `RequestData`
A helper class that normalizes and stores common request information:
- `method`: HTTP method (GET, POST, etc.)
- `url`: The original request URL.
- `ip`: The client IP address. respects `x-real-ip` header if present (useful behind proxies like Nginx).
- `headers`: Request headers.
- `query`: Query parameters.
- `body`: Request body.

## License

ISC