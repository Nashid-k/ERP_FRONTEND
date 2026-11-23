# Talkism ERP — Frontend Client (`ERP_FRONTEND`)

[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](#)

Internal Enterprise Resource Planning (ERP) & User Management Portal for **Talkism Private Limited**, Ernakulam, Kochi, Kerala (CIN: `U62013KL2025PTC091645`).

---

## 🏛️ Application Overview

The Talkism ERP Frontend provides a responsive, accessible, and secure user management interface for Talkism staff and administrators. The portal strictly enforces role-based access control (RBAC), secure employee invitation acceptance, and employee account lifecycle governance.

---

## ✨ Key Features

### 1. Super Admin Administration
- **Executive KPI Dashboard**: Live metrics counters for Total Directory Staff, Active Accounts, Pending Onboarding Invitations, Inactive Accounts, and Blocked Accounts.
- **Staff Directory Management**:
  - Filter by lifecycle status: *All Users*, *Active*, *Pending Invitations*, *Inactive*, and *Blocked Accounts*.
  - Debounced real-time search (350ms) across name, email, and department.
  - Lifecycle actions: Edit details, Activate/Deactivate, Block/Unblock, and Resend Invitations.
- **Audit & Governance Explorer**: Real-time audit trail capturing logins, status transitions, credential changes, and security alerts with IP addresses and timestamps.

### 2. Regular Employee Portal
- **Staff Workspace**: Overview of account status, department assignment, and verification timestamp.
- **Profile Management**: Self-service profile updates (name, phone, bio) with administrative fields (role, email) permanently locked.
- **Security & Password Management**: Self-service password changes with instant cross-session invalidation.

### 3. Invitation & Authentication Flow
- **Email-Ownership Binding**: Automatically binds and verifies the recipient's corporate email address before permitting password establishment.
- **Public Registration Guard**: Public self-registration is strictly disabled; accounts can only be provisioned via Super Admin invitation.
- **Session Revocation**: Real-time auto-logout triggered on token expiry or administrative revocation (HTTP 401/403).

### 4. UI/UX & Reliability
- **Toast Notification Architecture**: Thread-safe toast provider with duplicate message suppression (2.5s window), memoized context references, and a concurrent 3-toast limit.
- **Accessible & Responsive**: WCAG 2.1 AA color contrast compliance, keyboard navigability, and responsive layouts for mobile and desktop.

---

## 🛠️ Technology Stack

- **Framework**: React 19 (Hooks, Context API, Suspense)
- **Bundler & Dev Server**: Vite 8.3
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **Icons**: Lucide React
- **HTTP Client**: Axios with request/response interceptors

---

## 📁 Project Structure

```text
client/
├── public/                # Static brand assets and SVGs
├── src/
│   ├── assets/            # Embedded graphical assets
│   ├── components/        # Reusable UI components
│   │   ├── ConfirmDialog.jsx   # Modal confirmation with destructive styling
│   │   ├── Layout.jsx          # App shell with Sidebar and Navbar
│   │   ├── Modal.jsx           # Accessible dialog backdrop & container
│   │   ├── Navbar.jsx          # Top navigation & user profile dropdown
│   │   ├── RoleBadge.jsx       # Styled role indicator (SUPER_ADMIN, USER)
│   │   ├── Sidebar.jsx         # Responsive navigation sidebar
│   │   └── StatusBadge.jsx     # Color-coded status badge (ACTIVE, INVITED, etc.)
│   ├── context/           # Global React Context providers
│   │   ├── AuthContext.jsx     # Session state, JWT storage, and role checks
│   │   └── ToastContext.jsx    # Alert toast notifications with deduplication
│   ├── pages/             # Route-level views
│   │   ├── admin/              # Super Admin views (Dashboard, Users, Audit)
│   │   ├── auth/               # Public auth views (Login, AcceptInvitation, Reset)
│   │   └── user/               # Employee views (Workspace, Profile, Settings)
│   ├── routes/            # Route guards (ProtectedRoute, AdminRoute, PublicRoute)
│   ├── services/          # API service layers
│   │   ├── adminService.js     # User management & audit API calls
│   │   ├── api.js              # Axios instance with auth & error interceptors
│   │   ├── authService.js      # Login, password reset & invitation API calls
│   │   └── userService.js      # Profile & password change API calls
│   ├── App.jsx            # Main application component
│   ├── index.css          # Tailwind CSS root stylesheet
│   └── main.jsx           # Application entry point
├── .env.example           # Example environment template
├── .gitignore             # Git exclusion rules (zero secrets tracked)
├── package.json           # Dependencies and project scripts
└── vite.config.js         # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18.0.0` or higher
- npm `v9.0.0` or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/Nashid-k/ERP_FRONTEND.git
cd ERP_FRONTEND

# Install dependencies
npm install
```

### Environment Configuration

Create a `.env` file in the root of the project:

```bash
cp .env.example .env
```

Configure your API backend endpoint:
```env
VITE_API_URL=http://localhost:5000/api
```

### Development Server

```bash
npm run dev
```
The application will launch at `http://localhost:5173`.

### Production Build

```bash
npm run build
```
Generates an optimized, tree-shaken static bundle in the `dist/` directory.

---

## 🔒 Security Measures

1. **Zero Secret Storage**: No credentials, API secrets, or private keys exist in the client repository or bundle.
2. **Sanitized Token Consumption**: Invitation and password reset tokens in URLs are parsed from memory, validated through pre-flight checks, and cleared upon submission.
3. **Automatic Session Cleanup**: HTTP 401 or 403 responses instantly trigger local session eviction (`localStorage.removeItem`) and redirect to `/login`.
4. **Input Validation**: Client-side validation mirrors backend schemas to prevent invalid data transmission.

---

## 📄 License & Corporate Notice

Copyright © 2026 **Talkism Private Limited** (Talkisam Pvt Ltd), Ernakulam, Kochi, Kerala - 682037.  
All rights reserved. Internal enterprise software — unauthorized copying or distribution is strictly prohibited.
