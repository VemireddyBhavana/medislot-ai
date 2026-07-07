# MediSlot AI ??
> **Smart Clinic Scheduling & Workforce Optimization Platform**

**Built for Hackathon Theme 6: Booking, Scheduling & Workforce**

---

## ?? The Problem
Clinics often manage appointments manually, leading to double bookings, unoptimized doctor workloads, high no-show rates, and overall inefficient appointment handling. Patients suffer from long wait times, and clinic staff burn out from unevenly distributed workloads.

---

## ?? The Solution: MediSlot AI
MediSlot AI is a next-generation healthcare SaaS that eliminates manual scheduling inefficiencies through intelligent, automated workflows and live data integrations.

---

## ? Core Smart Features

### ?? AI Symptom Checker Chatbot
Built with **Google Gemini**, patients can type their symptoms into the floating chatbot and receive immediate, AI-powered recommendations for the exact medical specialist they need to book.

### ??? Live Hospital Discovery (OpenStreetMap)
Automatically pulls live, real-world hospital data (names, locations, contact info) within a **50km radius** using the Overpass API, with a local database fallback to prevent rate-limiting.

### ?? Patient Appointment History
Patients can look up their full appointment history by name or contact info — past visits, upcoming slots, statuses, and doctor details — all in one place.

### ? Smart Slot Recommendations
The booking engine dynamically suggests optimal appointment times to balance the daily load across available doctors, actively nudging patients toward **"Fastest Availability"**.

### ?? Doctor Workload Balancer
The Admin Dashboard proactively computes which doctors are **overloaded** and which are **under-utilized**, offering a live **Workload Distribution** widget to optimize clinic efficiency.

### ?? Smart Reminders & Follow-ups
An automated notification pipeline that generates:
- ?? Immediate **Booking Confirmations**
- ? Pre-visit **Reminders** (1 day before)
- ?? Follow-up **re-engagement messages** if marked as **No-Show** or **Cancelled**

### ?? Priority Booking Triage
Patients can select urgency levels: **Routine**, **Follow-up**, or **Urgent**. Urgent appointments are visually highlighted on the Admin Control Board in **red** for immediate staff attention.

### ?? No-Show Risk Scoring
The system automatically assigns a **no-show risk level** (Low / Medium / High) to each appointment based on historical patterns, helping the clinic prioritize outreach and reminders.

### ?? Dark Mode Support
Full dark/light mode toggle — the interface adapts beautifully for any environment or preference.

---

## ??? Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React (Vite) + Tailwind CSS v4 + Framer Motion + Lucide Icons |
| **Backend** | Node.js + Express.js 5 |
| **Database** | MongoDB (Mongoose) |
| **AI** | Google Gemini API |
| **Maps & Hospitals** | OpenStreetMap — Overpass API |
| **Notifications** | Nodemailer (Email) + Twilio (WhatsApp) |

---

## ?? Demo Credentials

To access the Admin Portal, use the following login credentials:

| Field | Value |
|-------|-------|
| **Email** | `admin@medislot.ai` |
| **Password** | `medislot` |

---

## ??? App Pages

| Route | Description |
|-------|-------------|
| `/` | Landing Page |
| `/home` | Patient Home Dashboard |
| `/hospitals` | Find Nearby Hospitals (map + list) |
| `/hospital/:id` | Hospital Detail & Doctor List |
| `/book` | Book an Appointment |
| `/appointments` | Patient Appointment History |
| `/confirmation` | Booking Confirmation |
| `/admin/login` | Admin Login |
| `/admin/appointments` | Admin Control Board |
| `/admin/add-doctor` | Add New Doctor |
| `/admin/notifications` | Notification Log |

---

## ?? Local Setup & Hackathon Demo Guide

### 1. Database & Environment Setup
Ensure you have MongoDB running locally, or replace the `MONGO_URI` in `backend/.env` with your MongoDB Atlas string.
*(Note: A Gemini API key is required in the frontend `.env` for the Chatbot.)*

### 2. Install & Seed
```bash
# Install backend dependencies & seed realistic demo data
cd backend
npm install
npm run seed

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Run the Servers

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

The app will be available at **http://localhost:5173**

---

## ?? Project Structure

```
medislot-ai/
+-- backend/
¦   +-- config/         # DB connection
¦   +-- controllers/    # Route handlers
¦   +-- models/         # Mongoose schemas
¦   +-- routes/         # Express routes
¦   +-- seed/           # Demo data seeder
¦   +-- utils/          # Hospital seeder, helpers
¦   +-- server.js       # App entry point
+-- frontend/
    +-- src/
        +-- components/ # Reusable UI components
        +-- layouts/    # Page layout wrappers
        +-- pages/      # All page components
        +-- services/   # API client layer
```

---

*MediSlot AI — Because every minute in healthcare matters.*
