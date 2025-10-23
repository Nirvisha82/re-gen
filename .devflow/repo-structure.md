This file is a merged representation of the entire codebase, combined into a single document.
The content has been processed for AI analysis and code review purposes.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and default ignore patterns
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Repository Information
- **Repository URL:** https://github.com/Nirvisha82/re-gen.git
- **Repository Name:** re-gen
- **Total Files Analyzed:** 43
- **Generated:** 2025-10-23 12:20:02

# Directory Structure
```
.DS_Store
.devflow/
  repo-structure.md
.gitignore
README.md
client/
  .gitignore
  README.md
  eslint.config.mjs
  next.config.ts
  package-lock.json
  package.json
  postcss.config.mjs
  public/
    file.svg
    globe.svg
    next.svg
    vercel.svg
    window.svg
  src/
    app/
      activated/
        page.jsx
      favicon.ico
      globals.css
      layout.tsx
      page.jsx
    components/
      base/
        BaseButton.jsx
        BaseDialog.jsx
        BaseInput.jsx
        BaseLoader.jsx
  tailwind.config.ts
  tsconfig.json
package-lock.json
package.json
server/
  .eslintrc.js
  .gitignore
  .prettierrc
  README.md
  nest-cli.json
  package-lock.json
  package.json
  src/
    app.controller.spec.ts
    app.controller.ts
    app.module.ts
    app.service.ts
    database/
      sqlite.ts
      user.entity.ts
      user.repository.ts
      users.db
    gmail/
      gmail.controller.spec.ts
      gmail.controller.ts
      gmail.module.ts
      gmail.service.spec.ts
      gmail.service.ts
    llm/
      llm.service.ts
    main.ts
  test/
    app.e2e-spec.ts
    jest-e2e.json
  tsconfig.build.json
  tsconfig.json
```

# Files

## File: .gitignore
````
# Root
node_modules/
dist/
.env

# Server
/server/.env/
/server/node_modules/
/server/dist/

# Client
/client/.next/
/client/node_modules/
/client/.env/
````

## File: README.md
````markdown
# Re:Gen - AI-Powered Gmail Reply Assistant

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-green.svg" alt="Node.js Version">
  <img src="https://img.shields.io/badge/NestJS-Framework-red.svg" alt="NestJS">
  <img src="https://img.shields.io/badge/AI-Gemini%20Pro-orange.svg" alt="Gemini AI">
  <img src="https://img.shields.io/badge/TypeScript-Language-blue.svg" alt="TypeScript">
</p>

Re:Gen is an intelligent Gmail auto-reply assistant built with NestJS that uses Google Cloud's Pub/Sub for real-time email monitoring and Google's Gemini AI for generating contextually appropriate responses.

## 🚀 Features

- **📩 Real-time Gmail Detection**: Google Cloud Pub/Sub push notifications
- **🧠 AI-Powered Responses**: Gemini Pro for intelligent reply generation
- **👤 Multi-User Support**: OAuth2-based Gmail authentication
- **🔧 Modular Architecture**: NestJS modules for scalable development

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Runtime** | Node.js 18+ |
| **Framework** | NestJS |
| **Language** | TypeScript |
| **Google APIs** | Gmail API, Pub/Sub |
| **AI Model** | Gemini Pro |
| **Port** | 8080 |


## 🔧 Installation & Setup

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Google Cloud Project with enabled APIs:
  - Gmail API
  - Google Cloud Pub/Sub API
- Google Generative AI API key (Gemini)

### Step 1: Clone Repository

```bash
git clone https://github.com/Nirvisha82/re-gen.git
cd re-gen
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Environment Configuration

Create a `.env` file in the root directory:

```env
# Google OAuth2 Credentials
GOOGLE_CLIENT_ID=xxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxx

# Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Application Configuration
PORT=8080
NODE_ENV=development
```

### Step 4: Run Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The application will be accessible at `http://localhost:8080`

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Gmail API     │    │   Google Cloud  │    │   NestJS App    │
│                 │    │     Pub/Sub     │    │     (Port 8080) │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │ New Email   │ │────▶│ │Push Notif.  │ │────▶│ │Gmail Module │ │
│ │ Detected    │ │    │ │             │ │    │ │             │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
                               ┌─────────────────┐    ┌─────────────────┐
                               │   Gemini API    │    │   LLM Service   │
                               │                 │    │                 │
                               │ ┌─────────────┐ │    │ ┌─────────────┐ │
                               │ │Generate     │ │◀───│ │Process      │ │
                               │ │Response     │ │    │ │Request      │ │
                               │ └─────────────┘ │    │ └─────────────┘ │
                               └─────────────────┘    └─────────────────┘
```

## 🔄 Module Structure

### AppModule (Root)
- **Imports**: GmailModule, ConfigModule
- **Controllers**: AppController
- **Providers**: AppService, LLMService

### GmailModule
- Handles Gmail API operations
- OAuth2 authentication
- Email fetching and sending

### LLMService
- Gemini API integration
- Response generation
- Prompt processing

## 🔧 Configuration

### Environment Variables
- `GOOGLE_CLIENT_ID`: OAuth2 client ID
- `GOOGLE_CLIENT_SECRET`: OAuth2 client secret  
- `GEMINI_API_KEY`: Gemini AI API key
- `PORT`: Application port (default: 8080)
- `NODE_ENV`: Environment mode

### Getting API Keys
- **Gemini API**: [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Google OAuth2**: [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- 
## 👥 Contributors

- **[Nirvisha Soni](https://github.com/Nirvisha82)** 
- **[Neel Malwatkar](https://github.com/neelmalwatkar)**
- **[Anuj Gawde](https://github.com/anujgawde)** 


## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open a Pull Request

---

<p align="center">
  Made with ❤️ using NestJS and Gemini AI
</p>
````

## File: client/.gitignore
````
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
````

## File: client/README.md
````markdown
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
````

## File: client/eslint.config.mjs
````
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
````

## File: client/next.config.ts
````typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {},
};

module.exports = nextConfig;
````

## File: client/package.json
````json
{
  "name": "compose-ai-client",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "axios": "^1.7.9",
    "next": "15.1.6",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "15.1.6",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
````

## File: client/postcss.config.mjs
````
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;
````

## File: client/src/app/activated/page.jsx
````jsx
"use client";

import React from "react";

export default function Activated() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center p-6">
      <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-tr from-[#5465FF] 
        to-[#2D3CC1] bg-clip-text text-transparent">
        Re:Gen
      </h1>
      <p className="mt-4 text-lg sm:text-xl font-medium text-gray-600 max-w-xl">
        Mail reply generation activated! Replies to new mails will be saved to the drafts.
      </p>
    </div>
  );
}
````

## File: client/src/app/globals.css
````css
@tailwind base;
@tailwind components;
@tailwind utilities;
````

## File: client/src/app/layout.tsx
````tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RE:Gen",
  description: "Effortless email responses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
````

## File: client/src/app/page.jsx
````jsx
"use client";

import React from "react";

export default function Home() {
  const activate = () => {
    window.location.href = "http://localhost:8080/gmail/auth/url";
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-50 text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-tr from-[#5465FF] 
                 to-[#2D3CC1] bg-clip-text text-transparent">
  Re:Gen
</h1>
      <p className="mt-4 text-lg sm:text-xl font-medium text-gray-600 max-w-xl">
      AI‑generated smart replies, auto‑saved to drafts so you can respond instantly.
      </p>
      <button
        onClick={activate}
        className="mt-8 bg-[#5465FF] hover:bg-[#2D3CC1] text-white font-semibold py-4 px-8 rounded-2xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Activate Reply Generation
      </button>
    </div>
  );
}
````

## File: client/src/components/base/BaseButton.jsx
````jsx
export default function BaseButton({
  buttonText,
  type,
  onClick,
  customClasses,
}) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`rounded-md text-center py-2 px-4 md:px-8 md:py-2 bg-primary text-white font-semibold border-none ${customClasses} text-sm md:text-base`}
    >
      {buttonText}
    </button>
  );
}
````

## File: client/src/components/base/BaseDialog.jsx
````jsx
import React from "react";
import BaseButton from "./BaseButton";

export default function BaseDialog({ text, isOpen, toggleDialog, title }) {
  if (!isOpen) {
    return null;
  }

  const closeDialog = () => {
    toggleDialog();
  };
  return (
    <div
      onClick={closeDialog}
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
    >
      <div
        className="bg-white rounded-lg shadow-lg w-5/6 md:w-1/2 lg:w-1/3 p-4 relative z-50 h-1/4 flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()} // Prevent click event from bubbling up to the parent div
      >
        {/* Dialog Header */}
        <div className="text-lg font-semibold md:text-2xl">{title}</div>

        {/* Dialog Content */}
        <div className="text-sm md:text-base">{text}</div>

        {/* Dialog CTA */}
        <div className="flex justify-end items-center">
          <BaseButton buttonText="Close" onClick={closeDialog} />
        </div>
      </div>
    </div>
  );
}
````

## File: client/src/components/base/BaseInput.jsx
````jsx
export default function BaseInput({
  placeHolder,
  label,
  errorText,
  type,
  isHidden = false,
  name,
  onChange,
  value,
}) {
  return (
    <div className={`w-full ${isHidden ? "hidden" : ""}`}>
      <div className="space-y-1">
        <label className="font-xl font-medium">{label}</label>

        <div className="rounded-md border">
          <input
            value={value ?? ""}
            onChange={onChange}
            name={name}
            type={type ?? "text"}
            className="w-full border-none px-4 py-2 rounded-md focus:outline-primary"
            placeholder={placeHolder}
          />
        </div>
      </div>
      <div
        className={`text-xs text-red-500 ${errorText.length ? "" : "hidden"} `}
      >
        {errorText}
      </div>
    </div>
  );
}
````

## File: client/src/components/base/BaseLoader.jsx
````jsx
import React from "react";

const BaseLoader = () => {
  return (
    <div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
  );
};

export default BaseLoader;
````

## File: client/tailwind.config.ts
````typescript
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "google-blue": "#4285F4",
        primary: "#52b788",
      },
    },
  },
  plugins: [],
} satisfies Config;
````

## File: client/tsconfig.json
````json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", "src/app/page.jsx"],
  "exclude": ["node_modules"]
}
````

## File: package.json
````json
{
  "dependencies": {
    "sqlite3": "^5.1.7"
  }
}
````

## File: server/.eslintrc.js
````javascript
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
````

## File: server/.gitignore
````
# compiled output
/dist
/node_modules
/build

# Logs
logs
*.log
npm-debug.log*
pnpm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# OS
.DS_Store

# Tests
/coverage
/.nyc_output

# IDEs and editors
/.idea
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace

# IDE - VSCode
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json

# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# temp directory
.temp
.tmp

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Diagnostic reports (https://nodejs.org/api/report.html)
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json
````

## File: server/.prettierrc
````json
{
  "singleQuote": true,
  "trailingComma": "all"
}
````

## File: server/README.md
````markdown
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
````

## File: server/nest-cli.json
````json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true,
    "assets": ["src/data/**/*"]
  }
}
````

## File: server/package.json
````json
{
  "name": "compose-ai-server",
  "version": "0.0.1",
  "description": "",
  "author": "",
  "private": true,
  "license": "UNLICENSED",
  "scripts": {
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },
  "dependencies": {
    "@google-cloud/pubsub": "^5.0.0",
    "@nestjs/common": "^10.0.0",
    "@nestjs/config": "^4.0.2",
    "@nestjs/core": "^10.0.0",
    "@nestjs/passport": "^11.0.5",
    "@nestjs/platform-express": "^10.0.0",
    "axios": "^1.9.0",
    "better-sqlite3": "^11.9.1",
    "google-auth-library": "^9.15.1",
    "googleapis": "^148.0.0",
    "passport": "^0.7.0",
    "passport-google-oauth20": "^2.0.0",
    "reflect-metadata": "^0.2.0",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/express": "^4.17.17",
    "@types/jest": "^29.5.2",
    "@types/node": "^20.3.1",
    "@types/supertest": "^6.0.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "eslint": "^8.42.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-prettier": "^5.0.0",
    "jest": "^29.5.0",
    "prettier": "^3.0.0",
    "source-map-support": "^0.5.21",
    "supertest": "^7.0.0",
    "ts-jest": "^29.1.0",
    "ts-loader": "^9.4.3",
    "ts-node": "^10.9.1",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.1.3"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "json",
      "ts"
    ],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": [
      "**/*.(t|j)s"
    ],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}
````

## File: server/src/app.controller.spec.ts
````typescript
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
````

## File: server/src/app.controller.ts
````typescript
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {}
````

## File: server/src/app.module.ts
````typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GmailModule } from './gmail/gmail.module';
import { LLMService } from './llm/llm.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [GmailModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, LLMService],
})
export class AppModule {}
````

## File: server/src/app.service.ts
````typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {}
````

## File: server/src/database/sqlite.ts
````typescript
import * as path from 'path';
const Database = require('better-sqlite3');
const db = new Database(path.join(process.cwd(), 'src', 'database', 'users.db'));
// Create or migrate the `users` table
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    email TEXT PRIMARY KEY,
    access_token TEXT,
    refresh_token TEXT,
    token_type TEXT,
    scope TEXT,
    refresh_token_expires_in INTEGER,
    expiry_date INTEGER,
    history_id TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`).run();

export default db;
````

## File: server/src/database/user.entity.ts
````typescript
export interface User {
    email: string;
    access_token: string;
    refresh_token: string;
    token_type: string;
    scope: string;
    refresh_token_expires_in: number;
    expiry_date: number;
    history_id: string;
  }
````

## File: server/src/database/user.repository.ts
````typescript
import db from '../database/sqlite';
import { User } from '../database/user.entity';

export class UserRepository {
  saveOrUpdate(user: User) {
    const stmt = db.prepare(`
      INSERT INTO users (
        email, access_token, refresh_token, token_type,
        scope, refresh_token_expires_in, expiry_date, history_id
      )
      VALUES (
        @email, @access_token, @refresh_token, @token_type,
        @scope, @refresh_token_expires_in, @expiry_date, @history_id
      )
      ON CONFLICT(email) DO UPDATE SET
        access_token = excluded.access_token,
        refresh_token = excluded.refresh_token,
        token_type = excluded.token_type,
        scope = excluded.scope,
        refresh_token_expires_in = excluded.refresh_token_expires_in,
        expiry_date = excluded.expiry_date,
        history_id = excluded.history_id,
        updated_at = CURRENT_TIMESTAMP
    `);
    stmt.run(user);
  }

  findByEmail(email: string): User | undefined {
    return db.prepare(`SELECT * FROM users WHERE email = ?`).get(email);
  }

  updateHistoryId(email: string, history_id: string) {
    db.prepare(`UPDATE users SET history_id = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?`)
      .run(history_id, email);
  }

  getAllUsers(): User[] {
    return db.prepare(`SELECT * FROM users`).all();
  }
}
````

## File: server/src/gmail/gmail.controller.spec.ts
````typescript
import { Test, TestingModule } from '@nestjs/testing';
import { GmailController } from './gmail.controller';
import { GmailService } from './gmail.service';

describe('GmailController', () => {
  let controller: GmailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GmailController],
      providers: [GmailService],
    }).compile();

    controller = module.get<GmailController>(GmailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
````

## File: server/src/gmail/gmail.controller.ts
````typescript
import {
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Res,
  Query,
} from '@nestjs/common';
import { GmailService } from './gmail.service';

@Controller('gmail')
export class GmailController {
  constructor(private readonly gmailService: GmailService) {}

  @Get('auth/url')
  getAuthUrl(@Res() res: any) {
    const url = this.gmailService.getAuthUrl();
    return res.redirect(url);
  }

  @Get('auth/callback')
  async authCallback(@Query('code') code: string, @Res() res: any) {
    await this.gmailService.handleOAuthCallback(code);
    return res.redirect('http://localhost:3000/activated');
  }

  @Post('pubsub/push')
  async pubsubPush(@Req() req: Request) {
    console.log('bruh, this got printed');
    await this.gmailService.handlePushNotification(req.body);
    return { status: 'ok' };
  }
}
````

## File: server/src/gmail/gmail.module.ts
````typescript
import { Module } from '@nestjs/common';
import { GmailService } from './gmail.service';
import { GmailController } from './gmail.controller';

@Module({ providers: [GmailService], controllers: [GmailController] })
export class GmailModule {}
````

## File: server/src/gmail/gmail.service.spec.ts
````typescript
import { Test, TestingModule } from '@nestjs/testing';
import { GmailService } from './gmail.service';

describe('GmailService', () => {
  let service: GmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GmailService],
    }).compile();

    service = module.get<GmailService>(GmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
````

## File: server/src/gmail/gmail.service.ts
````typescript
import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import { PubSub } from '@google-cloud/pubsub';
import { LLMService } from '../llm/llm.service';
import * as fs from 'fs';
import * as path from 'path';
import { UserRepository } from '../database/user.repository';

@Injectable()
export class GmailService {
  private oauth2Client;
  private gmail;
  private pubsub: PubSub;
  private logger = new Logger(GmailService.name);
  private readonly userRepo = new UserRepository();

  private readonly llmService: LLMService;
  private CLIENT_ID = `${process.env.CLIENT_ID}`;
  private CLIENT_SECRET = `${process.env.CLIENT_SECRET}`;
  private CALLBACK_URL = `${process.env.CALLBACK_URL}`;
  private PUB_SUB_TOPIC = `${process.env.PUB_SUB_TOPIC}`;
  private userEmail: string;

  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      this.CLIENT_ID,
      this.CLIENT_SECRET,
      this.CALLBACK_URL,
    );

    this.pubsub = new PubSub();
    this.llmService = new LLMService();
  }

  // 1) Generate OAuth URL
  getAuthUrl(): string {
    const scopes = ['https://www.googleapis.com/auth/gmail.modify'];
    console.log('------- Generating Auth URL ------');
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
    });
  }

  // 2) Exchange code for tokens and start watch
  async handleOAuthCallback(code: string) {
    console.log(' ---- Handling OAuth Callback ---- ');
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
    console.log('logging url===============> ', tokens);
    const profile = await this.gmail.users.getProfile({ userId: 'me' });
    const userEmail = profile.data.emailAddress;
    this.userEmail = userEmail;
    this.logger.log(`Authenticated user: ${userEmail}`);

    // Start Gmail watch
    const res = await this.gmail.users.watch({
      userId: 'me',
      requestBody: {
        labelIds: ['INBOX'],
        topicName: this.PUB_SUB_TOPIC,
      },
    });
    this.userRepo.saveOrUpdate({
      email: userEmail,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_type: tokens.token_type,
      scope: tokens.scope,
      refresh_token_expires_in: tokens.refresh_token_expires_in,
      expiry_date: tokens.expiry_date,
      history_id: res.data.historyId,
    });

    return tokens;
  }

  // 3) Handle Pub/Sub push
  async handlePushNotification(reqBody: any) {
    console.log('^^^^^ Handling Push Notification ^^^^^^');
    
    const msg = JSON.parse(
      Buffer.from(reqBody.message.data, 'base64').toString(),
    );



    const userEmail = msg.emailAddress;  // Gmail includes this
    const historyId = msg.historyId;
  
    this.logger.log(`Push received for user: ${userEmail}, historyId: ${historyId}`);
    const user = this.userRepo.findByEmail(userEmail);

    if (!user) {
      this.logger.error(`User ${userEmail} not found`);
      return;
    }

      // Auth Gmail client from stored tokens
    const gmail = this.getGmailClientFromTokens(user);

    // try {
    //   // Rehydrate Gmail client with stored user tokens
    //   const gmail = this.getGmailClientFromTokens(user);


    //   // Decode the Pub/Sub push message
    //   const msg = JSON.parse(
    //     Buffer.from(reqBody.message.data, 'base64').toString(),
    //   );
    //   const pushHistoryId = String(msg.historyId);

    //   this.logger.log(`Using historyId: ${user.history_id}`);

      // Fetch new messages since last known historyId
      try {
        // Fetch new messages since last known history
        const res = await gmail.users.history.list({
          userId: 'me',
          startHistoryId: String(user.history_id),
          historyTypes: ['messageAdded'],
        });

        const historyItems = res.data.history || [];
        for (const history of historyItems) {
          for (const message of history.messages || []) {
            await this.createDraftReply(message.id, userEmail, gmail);
          }
        }
    

      // Save new historyId
      const newHistoryId = res.data.historyId || historyId;
      this.userRepo.updateHistoryId(userEmail, newHistoryId);
      this.logger.log(`Updated historyId for ${userEmail} to: ${newHistoryId}`);
    } catch (err) {
      this.logger.error(`Failed to process Gmail push for ${userEmail}`, err);

      if (err.message?.includes('Requested entity was not found')) {
        this.logger.warn('History ID expired. Resetting watch...');
        const res = await gmail.users.watch({
          userId: 'me',
          requestBody: {
            labelIds: ['INBOX'],
            topicName: this.PUB_SUB_TOPIC,
          },
        });

        if (res.data.historyId) {
          this.userRepo.updateHistoryId(userEmail, res.data.historyId);
          this.logger.log(`Watch reset. New historyId: ${res.data.historyId}`);
        }
        
      }
    }
  }

  // ========== Draft Reply with Filters
  async createDraftReply(messageId: string, userEmail: string, gmail: any) {
    console.log('Drafting a reply.');

    // 1. Get message metadata
    const message = await gmail.users.messages.get({
      userId: 'me',
      id: messageId,
      format: 'metadata',
      metadataHeaders: [
        'Subject',
        'Message-ID',
        'References',
        'In-Reply-To',
        'From',
        'To',
        'Cc',
      ],
    });

    if (!message.data.labelIds?.includes('INBOX')) {
      this.logger.log(`Skipping message not in INBOX: ${messageId}`);
      return;
    }

    const headers = message.data.payload.headers;

    const from = headers.find((h) => h.name === 'From')?.value || '';
    const subject = headers.find((h) => h.name === 'Subject')?.value || '';
    const messageIdHeader =
      headers.find((h) => h.name === 'Message-ID')?.value || '';
    const referencesHeader =
      headers.find((h) => h.name === 'References')?.value || '';
    const toHeader = headers.find((h) => h.name === 'To')?.value || '';
    const ccHeader = headers.find((h) => h.name === 'Cc')?.value || '';

    if (from.includes(userEmail)) {
      this.logger.log(`Skipping self-sent message: ${messageId}`);
      return;
    }

    const inReplyTo = messageIdHeader;
    const references = referencesHeader
      ? `${referencesHeader} ${messageIdHeader}`
      : messageIdHeader;

    const threadId = message.data.threadId;

    // 2. Compute recipients
    const to = from;
    const ccList = [toHeader, ccHeader]
      .flatMap((header) => (header || '').split(','))
      .map((addr) => addr.trim())
      .filter((addr) => addr && !addr.includes(userEmail));

    const cc = [...new Set(ccList)].join(', '); // remove duplicates

    // 3. Generate reply content using LLM
    const bodyMsg = await this.extractEmailBody(messageId, gmail);
    const replyContent = await this.llmService.generateReply(subject, bodyMsg);

    // 4. Build raw RFC2822 message
    const rawLines = [
      `To: ${to}`,
      ...(cc ? [`Cc: ${cc}`] : []),
      `Subject: ${subject}`,
      `In-Reply-To: ${inReplyTo}`,
      `References: ${references}`,
      'Content-Type: text/plain; charset=UTF-8',
      'MIME-Version: 1.0',
      'Content-Transfer-Encoding: 7bit',
      '',
      replyContent,
    ];

    const encodedMessage = Buffer.from(rawLines.join('\r\n'), 'utf-8').toString(
      'base64url',
    );

    const draft = await gmail.users.drafts.create({
      userId: 'me',
      requestBody: {
        message: {
          raw: encodedMessage,
          threadId,
        },
      },
    });

    this.logger.log(
      `Draft created in thread: ${threadId}, draftId: ${draft.data.id}`,
    );
  }


  private async extractEmailBody(
    messageId: string,
    gmail: any,
  ): Promise<string> {
    const msg = await gmail.users.messages.get({
      userId: 'me',
      id: messageId,
      format: 'full',
    });

    const parts = msg.data.payload?.parts || [];
    const textPart = parts.find((part) => part.mimeType === 'text/plain');

    if (textPart?.body?.data) {
      const decoded = Buffer.from(textPart.body.data, 'base64').toString(
        'utf-8',
      );
      return decoded;
    }

    return '(No readable plain text content)';
  }

  private getGmailClientFromTokens(tokens: any) {
    const oauth2 = new google.auth.OAuth2(
      this.CLIENT_ID,
      this.CLIENT_SECRET,
      'http://localhost:8080/gmail/auth/callback',
    );
    oauth2.setCredentials(tokens);
    return google.gmail({ version: 'v1', auth: oauth2 });
  }
}
````

## File: server/src/llm/llm.service.ts
````typescript
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LLMService {
  private readonly logger = new Logger(LLMService.name);
  private readonly modelName = process.env.GEMINI_MODEL || 'gemini-pro';
  private readonly apiKey = process.env.GEMINI_API_KEY;

  private get endpointUrl(): string {
    return `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent`;
  }

  async generateReply(subject: string, body: string): Promise<string> {
    console.log('~~~~~~ Generating content ~~~~~~~');
    const prompt = this.buildPrompt(subject, body);

    try {
      const response = await axios.post(
        `${this.endpointUrl}?key=${this.apiKey}`,
        {
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      console.log('LLM REPLY =================> ', reply);
      return reply || 'Could not generate a response.';
    } catch (error) {
      this.logger.error('LLM generation failed', error);
      return 'Error generating reply.';
    }
  }

  private buildPrompt(subject: string, body: string): string {
    return `
You are a professional email assistant. Based on the following email content, generate a polite and helpful reply:

Subject: ${subject}

Body:
${body}

Your response should be clear, context-aware, and useful. Avoid unnecessary repetition. Only return the message body (no greeting or sign-off).
Do not use heavy vocabulary, keep it simple. In the response, only return the email content.
    `.trim();
  }
}
````

## File: server/src/main.ts
````typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json());
  app.enableCors();
  await app.listen(8080);
}
bootstrap();
````

## File: server/test/app.e2e-spec.ts
````typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
````

## File: server/test/jest-e2e.json
````json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  }
}
````

## File: server/tsconfig.build.json
````json
{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "test", "dist", "**/*spec.ts"]
}
````

## File: server/tsconfig.json
````json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false
  }
}
````

