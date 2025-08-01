# Re:Gen - Intelligent Gmail Auto-Reply Assistant

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-green.svg" alt="Node.js Version">
  <img src="https://img.shields.io/badge/NestJS-Framework-red.svg" alt="NestJS">
  <img src="https://img.shields.io/badge/AI-Gemini%20Pro-orange.svg" alt="Gemini AI">
  <img src="https://img.shields.io/badge/TypeScript-Language-blue.svg" alt="TypeScript">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License">
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

## 📄 License

This project is licensed under the MIT License.

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
