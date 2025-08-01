# Re:Gen – AI-Powered Gmail Auto-Responder ✉️🤖

**Re:Gen** is an intelligent Gmail auto-reply assistant that uses Google Cloud's Pub/Sub to receive real-time email alerts and generates smart responses using **Gemini** (Google’s generative AI). The project supports **multi-user handling**, **session-based OAuth**, and stores credentials and metadata in a **SQLite** database.

---

## 🧠 Features

- 📩 Real-time Gmail email detection using **Pub/Sub push notifications**
- 🧠 Smart AI-generated responses using **Gemini Pro**
- 👤 Multi-user support with per-user Gmail OAuth credentials
- 🗃️ Local **SQLite** database for storing user info, email logs, and metadata
- 🛠️ Web server to manage Gmail watch registration and token refresh
- 📂 Session-based response generation and reusability

---

## 🛠 Tech Stack

| Layer              | Tech Used                                 |
|-------------------|--------------------------------------------|
| Language           | Python 3.10+                               |
| Web Framework      | Flask                                      |
| Database           | SQLite3                                    |
| Google Integration | Gmail API, Google Cloud Pub/Sub, OAuth2   |
| AI Model           | Gemini Pro via Google Generative SDK      |
| Deployment         | Localhost (or Cloud Run / App Engine)     |

---

## 📁 Project Structure

```
re-gen/
├── creds/                     # OAuth2 credentials per user
├── logs/                      # Saved logs
├── static/                    # Static HTML for status
├── templates/                 # HTML templates for routes
├── .env                       # Environment variables
├── app.py                     # Flask app – PubSub + AI logic
├── db.py                      # SQLite DB setup and queries
├── gemini_utils.py            # Gemini API wrapper
├── gmail_utils.py             # Gmail API fetch/reply functions
├── oauth.py                   # OAuth flow and user login
├── pubsub_utils.py            # Pub/Sub handling
├── requirements.txt
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Nirvisha82/re-gen.git
cd re-gen
```

### 2. Create a Virtual Environment

```bash
python -m venv .venv
source .venv/bin/activate   # or .\.venv\Scripts\activate on Windows
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Set Up `.env` File

Copy the sample `.env.example` and fill in the values:

```env
FLASK_SECRET_KEY=your_secret
GOOGLE_CLIENT_ID=xxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxx
GEMINI_API_KEY=your_gemini_api_key
WATCH_EXPIRY_TIME=604800
```

You can get Gemini API keys from: https://makersuite.google.com/app/apikey

### 5. Initialize the Database

```bash
python db.py
```

This will create `regen.db` in the root folder with the required tables.

### 6. Start the Flask App

```bash
python app.py
```

It will be accessible at `http://localhost:5000`

---

## 🚀 How It Works

### 📬 Gmail Watch & Pub/Sub Workflow

1. User authenticates via `/login`
2. Gmail `watch()` is registered via Gmail API, subscribing to `INBOX` label
3. New mail triggers **Pub/Sub**, which makes an HTTP POST to `/pubsub`
4. Message ID and thread ID are extracted
5. The original message is fetched using Gmail API
6. Gemini Pro generates a response based on prompt template
7. Response is sent using Gmail API and logged in the DB

### 🧠 Gemini Prompting Flow

- Prompt template used is:
  ```
  You are a helpful AI assistant. Write a concise and professional reply to the following email:
  
  {EMAIL_CONTENT}
  ```
- Gemini generates a response using the provided message body and context.

---

## 🌐 Key Routes

| Route              | Method | Description                                |
|-------------------|--------|--------------------------------------------|
| `/`               | GET    | Home page / status                         |
| `/login`          | GET    | OAuth2 login with Gmail                    |
| `/oauth2callback` | GET    | OAuth2 redirect URI                        |
| `/watch`          | GET    | Register Gmail watch (for current user)    |
| `/pubsub`         | POST   | Gmail push notification (Pub/Sub trigger)  |
| `/send_reply`     | POST   | (Internal) Auto-sends reply via Gemini     |

---

## 🗃️ Database Schema

### `users` table

| Column     | Type    | Description                     |
|------------|---------|---------------------------------|
| id         | INTEGER | Primary key                     |
| email      | TEXT    | User Gmail address              |
| token_json | TEXT    | Serialized credentials          |

### `email_log` table

| Column      | Type    | Description                          |
|-------------|---------|--------------------------------------|
| id          | INTEGER | Primary key                          |
| email       | TEXT    | User's email                         |
| thread_id   | TEXT    | Gmail thread ID                      |
| message_id  | TEXT    | Message ID                           |
| received_at | TEXT    | Timestamp of reception               |
| prompt      | TEXT    | Input sent to Gemini                 |
| reply       | TEXT    | Gemini’s generated response          |

---

## 🧪 Testing It Out Locally

1. Log in at `http://localhost:5000/login` with your Gmail
2. Run `/watch` once after login to register Gmail watch
3. Send a test email to that Gmail account from another
4. Gemini reply should be sent automatically, and logged

---

## 🛡️ Notes & Limitations

- Gmail watch expires in 7 days (604800 seconds) — handled via `WATCH_EXPIRY_TIME`
- Currently uses session-based flow; no multi-login interface
- Gemini API quota and latency can affect performance
- Only plain-text email bodies are supported in current version

---

## 📊 Future Improvements

- [ ] Web UI for user login & dashboard
- [ ] Gmail label filtering (respond only to certain threads)
- [ ] Response tone customization per user
- [ ] Multiple Gemini models / styles
- [ ] Deploy on Cloud Run with HTTPS for production

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

---

## 🙌 Acknowledgments

- [Google Gmail API Docs](https://developers.google.com/gmail/api)
- [Gemini Pro (Generative AI)](https://ai.google.dev/)
- [Flask Web Framework](https://flask.palletsprojects.com/)

---

## 🧠 Author

**Nirvisha Soni**  
**Neel Malwatkar**
**Anuj Gawde**
