This repository, "Re:Gen - AI-Powered Gmail Reply Assistant," is a full-stack application designed to automate email replies using Google's Gemini AI. It leverages a modern technology stack with a clear separation between client and server concerns.

---

## Repository Overview

1.  **Project Type**:
    This is a **full-stack web application**. It consists of a client-side interface built with Next.js and a server-side API built with NestJS. Its core functionality is an AI-powered assistant that monitors Gmail for new emails and generates draft replies.

2.  **Architecture**:
    The project follows a **monorepo architecture** with two main components:
    *   **Client (`client/`)**: A Next.js application serving as the user interface. Its primary role is to initiate the Gmail authentication flow and display activation status.
    *   **Server (`server/`)**: A NestJS application that acts as the backend. It handles:
        *   Google OAuth2 authentication for Gmail.
        *   Integration with Google Cloud Pub/Sub for real-time Gmail notifications.
        *   Interaction with the Gmail API to fetch email content and create drafts.
        *   Integration with Google's Gemini Pro AI for generating email replies.
        *   Persistence of user tokens and Gmail `historyId` using SQLite.

    The overall flow involves the client redirecting the user to the server for Google authentication. Once authenticated, the server sets up a Gmail watch via Pub/Sub. When new emails arrive, Pub/Sub pushes notifications to the server, which then fetches the email, uses the LLM to generate a reply, and saves it as a draft in the user's Gmail.

3.  **Technology Stack**:
    *   **Runtime**: Node.js 18+
    *   **Backend Framework**: NestJS (TypeScript)
    *   **Frontend Framework**: Next.js (React, primarily JSX/TSX)
    *   **Styling**: Tailwind CSS
    *   **Database**: SQLite (using `better-sqlite3` library)
    *   **AI Model**: Google Gemini Pro
    *   **Google APIs**: Gmail API, Google Cloud Pub/Sub API, Google OAuth2
    *   **HTTP Client**: Axios (both client and server)
    *   **Authentication**: Passport.js with `passport-google-oauth20` (server)

4.  **Entry Points**:
    *   **Client**: The main entry point for the Next.js application is `client/src/app/layout.tsx`, which defines the root layout. The user-facing entry points are `client/src/app/page.jsx` (the home page for activation) and `client/src/app/activated/page.jsx` (the success page after activation).
    *   **Server**: The NestJS application's entry point is `server/src/main.ts`. This file bootstraps the NestJS application, enables CORS, and starts listening for incoming requests on port 8080.

---

## File Analysis

### `README.md` (Root)
*   **Purpose**: Provides a high-level overview of the project, its features, technology stack, installation instructions, environment configuration, and architectural diagram.
*   **Role**: Serves as the primary documentation for developers and users to understand, set up, and run the application.
*   **Key Functions/Classes**: N/A (documentation).
*   **Dependencies**: N/A.
*   **Business Logic**: Outlines the project's core value proposition (AI-powered Gmail reply assistant) and how it achieves it.

### `client/package.json`
*   **Purpose**: Manages the client-side project's dependencies and defines scripts for development, building, and linting.
*   **Role**: Defines the Next.js frontend application's environment and build process.
*   **Key Functions/Classes**: Specifies `next` as a dependency and defines `dev`, `build`, `start`, `lint` scripts.
*   **Dependencies**: `next`, `react`, `react-dom`, `axios` (for potential API calls), various dev dependencies for linting, styling, and TypeScript.
*   **Business Logic**: N/A.

### `client/src/app/page.jsx`
*   **Purpose**: Renders the main landing page of the client application, prompting the user to activate reply generation.
*   **Role**: The initial user interface for interacting with the Re:Gen service.
*   **Key Functions/Classes**:
    *   `Home` (default export): A React functional component.
    *   `activate` function: Triggers the redirection to the backend's Google OAuth URL (`http://localhost:8080/gmail/auth/url`).
*   **Dependencies**: `react`.
*   **Business Logic**: Initiates the user authentication and authorization flow with Google.

### `client/src/app/activated/page.jsx`
*   **Purpose**: Displays a confirmation message to the user after successful activation of mail reply generation.
*   **Role**: Provides feedback to the user that the service is now active.
*   **Key Functions/Classes**:
    *   `Activated` (default export): A simple React functional component that renders static text.
*   **Dependencies**: `react`.
*   **Business Logic**: Confirms the successful setup of the email monitoring and reply generation.

### `server/package.json`
*   **Purpose**: Manages the server-side project's dependencies and defines scripts for building, running, formatting, and testing.
*   **Role**: Defines the NestJS backend application's environment and build process.
*   **Key Functions/Classes**: Specifies NestJS core dependencies, Google Cloud libraries, `better-sqlite3`, `googleapis`, and defines various `start`, `build`, `test`, `lint`, `format` scripts.
*   **Dependencies**: `@google-cloud/pubsub`, `@nestjs/*`, `axios`, `better-sqlite3`, `google-auth-library`, `googleapis`, `passport`, `passport-google-oauth20`, `rxjs`. Also includes numerous dev dependencies for NestJS CLI, testing (Jest, Supertest), ESLint, Prettier, and TypeScript.
*   **Business Logic**: N/A.

### `server/src/main.ts`
*   **Purpose**: The entry point for bootstrapping the NestJS server application.
*   **Role**: Initializes the NestJS application, sets up global middleware, and starts the HTTP server.
*   **Key Functions/Classes**:
    *   `bootstrap` function: An async function that creates an instance of the NestJS application using `AppModule`, applies `body-parser` middleware, enables CORS, and starts the server on port 8080.
*   **Dependencies**: `AppModule`, `@nestjs/core`, `body-parser`.
*   **Business Logic**: Handles the initial setup and startup of the backend service.

### `server/src/app.module.ts`
*   **Purpose**: The root module of the NestJS application, responsible for composing and organizing other modules and services.
*   **Role**: Defines the overall structure and dependencies of the backend application.
*   **Key Functions/Classes**:
    *   `@Module` decorator: Imports `GmailModule` and `ConfigModule.forRoot()`, declares `AppController`, and provides `AppService` and `LLMService`.
*   **Dependencies**: `GmailModule`, `ConfigModule`, `AppController`, `AppService`, `LLMService`.
*   **Business Logic**: Acts as the central orchestrator, bringing together the Gmail integration and LLM capabilities.

### `server/src/database/sqlite.ts`
*   **Purpose**: Initializes the SQLite database connection and ensures the `users` table exists.
*   **Role**: Sets up the persistent storage for user-specific data.
*   **Key Functions/Classes**:
    *   `Database` (from `better-sqlite3`): Creates a new database instance pointing to `users.db`.
    *   `db.prepare(...).run()`: Executes a SQL statement to create the `users` table if it doesn't already exist, defining columns for email, tokens, expiry, and `history_id`.
*   **Dependencies**: `path`, `better-sqlite3`.
*   **Business Logic**: Establishes the database schema for storing user authentication and Gmail watch state.

### `server/src/database/user.repository.ts`
*   **Purpose**: Provides an abstraction layer for interacting with the `users` table in the SQLite database.
*   **Role**: Manages CRUD operations for user data, specifically authentication tokens and Gmail `historyId`.
*   **Key Functions/Classes**:
    *   `UserRepository` class:
        *   `saveOrUpdate(user: User)`: Inserts a new user or updates an existing one based on email, handling conflicts.
        *   `findByEmail(email: string)`: Retrieves a user record by their email address.
        *   `updateHistoryId(email: string, history_id: string)`: Updates the Gmail `historyId` for a specific user.
        *   `getAllUsers()`: Retrieves all user records.
*   **Dependencies**: `db` (from `sqlite.ts`), `User` interface (from `user.entity.ts`).
*   **Business Logic**: Encapsulates the logic for persisting and retrieving user-specific Gmail integration data.

### `server/src/gmail/gmail.controller.ts`
*   **Purpose**: Defines the API endpoints for Gmail-related operations, including OAuth authentication and Pub/Sub push notifications.
*   **Role**: Acts as the entry point for external interactions with the Gmail integration logic.
*   **Key Functions/Classes**:
    *   `GmailController` class:
        *   `@Get('auth/url') getAuthUrl()`: Redirects the user to the Google OAuth consent screen.
        *   `@Get('auth/callback') authCallback()`: Handles the callback from Google OAuth, processes the authorization code, and redirects the client to the activation success page.
        *   `@Post('pubsub/push') pubsubPush()`: Receives and processes push notifications from Google Pub/Sub when new emails arrive in a watched inbox.
*   **Dependencies**: `GmailService`.
*   **Business Logic**: Orchestrates the user's consent for Gmail access and receives real-time email notifications.

### `server/src/gmail/gmail.service.ts`
*   **Purpose**: Contains the core business logic for interacting with the Gmail API, managing OAuth tokens, handling Pub/Sub notifications, and orchestrating AI reply generation.
*   **Role**: The central component for all Gmail-related functionalities.
*   **Key Functions/Classes**:
    *   `GmailService` class:
        *   `oauth2Client`: Google OAuth2 client for authentication.
        *   `pubsub`: Google Cloud Pub/Sub client.
        *   `llmService`: Injected `LLMService` for AI replies.
        *   `userRepo`: `UserRepository` for database interactions.
        *   `getAuthUrl()`: Generates the Google OAuth URL.
        *   `handleOAuthCallback(code: string)`: Exchanges the OAuth code for tokens, sets up Gmail watch using Pub/Sub, and saves user data.
        *   `handlePushNotification(reqBody: any)`: Decodes Pub/Sub messages, fetches new email history, and triggers `createDraftReply` for new messages. Includes logic to reset Gmail watch if `historyId` expires.
        *   `createDraftReply(messageId: string, userEmail: string, gmail: any)`: Fetches email metadata and body, applies filters (e.g., skip self-sent, not in INBOX), calls `llmService.generateReply`, and creates a Gmail draft.
        *   `extractEmailBody(messageId: string, gmail: any)`: Extracts the plain text body from a Gmail message.
        *   `getGmailClientFromTokens(tokens: any)`: Rehydrates a `google.auth.OAuth2` client with stored user tokens.
*   **Dependencies**: `google` (googleapis), `PubSub` (@google-cloud/pubsub), `LLMService`, `UserRepository`, `Logger`.
*   **Business Logic**: Implements the entire workflow from user authentication to automated draft reply generation, including real-time email monitoring and error handling for `historyId` expiration.

### `server/src/llm/llm.service.ts`
*   **Purpose**: Provides an interface to interact with the Google Gemini Pro AI model for generating email replies.
*   **Role**: The AI integration layer, responsible for prompt engineering and communicating with the LLM API.
*   **Key Functions/Classes**:
    *   `LLMService` class:
        *   `generateReply(subject: string, body: string)`: Constructs a prompt using the email subject and body, sends an HTTP POST request to the Gemini API, and extracts the generated reply.
        *   `buildPrompt(subject: string, body: string)`: Formats the input email content into a structured prompt for the Gemini model, instructing it to act as a professional email assistant and return only the message body.
*   **Dependencies**: `axios`, `Logger`.
*   **Business Logic**: Translates email content into an AI-understandable prompt and processes the AI's response.

---

## System Relationships

1.  **Data Flow**:
    *   **User Onboarding**:
        1.  Client (`client/src/app/page.jsx`) initiates Google OAuth by redirecting to `server/gmail/auth/url`.
        2.  `GmailController.getAuthUrl` generates and redirects to Google's consent screen.
        3.  User grants permission on Google.
        4.  Google redirects back to `server/gmail/auth/callback` with an authorization `code`.
        5.  `GmailController.authCallback` calls `GmailService.handleOAuthCallback`.
        6.  `GmailService.handleOAuthCallback` exchanges `code` for `access_token` and `refresh_token` with Google, sets up a Gmail watch via Pub/Sub, and saves user credentials and the initial `historyId` to the SQLite database via `UserRepository`.
        7.  `GmailController.authCallback` redirects the client to `client/src/app/activated/page.jsx` for confirmation.
    *   **Email Processing**:
        1.  A new email arrives in the user's Gmail inbox.
        2.  Google Pub/Sub, configured by `GmailService.handleOAuthCallback`, sends a push notification (webhook) to `server/gmail/pubsub/push`.
        3.  `GmailController.pubsubPush` calls `GmailService.handlePushNotification`.
        4.  `GmailService.handlePushNotification` decodes the Pub/Sub message, retrieves the user's tokens and `historyId` from `UserRepository`, and uses the `googleapis` client (rehydrated with user tokens) to fetch new email history since the last `historyId`.
        5.  For each new message, `GmailService.createDraftReply` is called.
        6.  `createDraftReply` fetches the full email content (`extractEmailBody`), constructs a prompt, and sends it to `LLMService.generateReply`.
        7.  `LLMService.generateReply` makes an HTTP request to the Google Gemini Pro API.
        8.  The Gemini API returns a generated reply.
        9.  `createDraftReply` uses the generated reply to construct an RFC2822 formatted email and creates a draft in the user's Gmail inbox via the Gmail API.
        10. `GmailService.handlePushNotification` updates the user's `historyId` in the SQLite database via `UserRepository`.

2.  **Key Components**:
    *   **Next.js Client**: User-facing application for activation.
    *   **NestJS Server**: Backend API, orchestrator of Google services and AI.
    *   **Google OAuth2**: Handles user authentication and authorization for Gmail access.
    *   **Gmail API**: Programmatic access to Gmail for watching, reading, and drafting emails.
    *   **Google Cloud Pub/Sub**: Real-time, scalable messaging service for new email notifications.
    *   **Google Gemini Pro API**: The AI model responsible for generating intelligent email replies.
    *   **SQLite Database (`users.db`)**: Stores user-specific data (tokens, `historyId`) for persistent access and state management.
    *   **`GmailService`**: The most critical service, integrating all Google APIs and the LLM.
    *   **`LLMService`**: Encapsulates the AI interaction logic.
    *   **`UserRepository`**: Manages user data persistence.

3.  **Integration Points**:
    *   **Client-Server**: HTTP redirects for OAuth flow, potentially future API calls for status.
    *   **Server-Google OAuth**: `google-auth-library` manages the OAuth 2.0 flow.
    *   **Server-Gmail API**: `googleapis` library provides a client for interacting with Gmail.
    *   **Server-Google Cloud Pub/Sub**: `@google-cloud/pubsub` library is used to subscribe to and receive messages from Pub/Sub topics. The `pubsubPush` endpoint acts as a webhook for Pub/Sub.
    *   **Server-Google Gemini API**: `axios` is used for direct HTTP POST requests to the Generative Language API endpoint.
    *   **Server-SQLite**: `better-sqlite3` library provides synchronous access to the SQLite database file.

4.  **API/Interface Design**:
    *   **RESTful-like HTTP Endpoints**: The `GmailController` exposes `/gmail/auth/url` (GET) for initiating OAuth, `/gmail/auth/callback` (GET) for handling the OAuth redirect, and `/gmail/pubsub/push` (POST) for receiving Pub/Sub notifications.
    *   **Internal Service Interfaces**: NestJS's dependency injection system facilitates communication between services (e.g., `GmailService` injects `LLMService` and uses `UserRepository`). Services expose methods that encapsulate specific business logic.
    *   **External API Calls**: The server interacts with Google APIs (Gmail, Pub/Sub, Gemini) using their respective client libraries or direct HTTP requests, adhering to their defined API specifications.

---

## Development Insights

1.  **Code Quality**:
    *   **Organization**: The project exhibits good organization with a clear monorepo structure (`client/` and `server/`). Within the `server/` directory, NestJS's modular design is well-utilized with `AppModule`, `GmailModule`, and dedicated services (`GmailService`, `LLMService`, `AppService`). Database interactions are cleanly separated into `database/` with a `UserRepository`.
    *   **Readability**: The code is generally readable, with meaningful variable and function names. Comments in `GmailService` explain complex steps like OAuth flow and push notification handling.
    *   **Consistency**: ESLint and Prettier configurations are present for both client and server, indicating an effort towards consistent code style. TypeScript is used for the backend, enhancing type safety, though the client has a mix of `.jsx` and `.tsx` files.
    *   **Error Handling**: Basic error logging is implemented in `GmailService` and `LLMService`. `GmailService` specifically handles `historyId` expiration by resetting the Gmail watch, which is a good resilience measure.
    *   **Test Coverage**: Basic unit tests are provided for NestJS controllers and services, and e2e tests exist, but the depth of coverage isn't immediately clear from the provided files.

2.  **Design Patterns**:
    *   **Module Pattern**: NestJS's core module system (`App