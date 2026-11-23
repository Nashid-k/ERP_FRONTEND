# ERP_FRONTEND

Internal Enterprise Resource Planning (ERP) & User Portal Frontend for **Talkism Private Limited**, Ernakulam, Kochi.

Built with **React 19**, **Vite**, **Tailwind CSS**, and **Lucide Icons**.

## Key Features

- **Authentication & RBAC**: Secure email-based authentication, Super Admin governance, invitation acceptance, and password management.
- **Staff Directory & User Management**: Multi-tab management for All Users, Active Staff, Pending Invitations, Inactive Accounts, and Blocked Accounts.
- **Invitation Flow**: Identity-bound invitation acceptance with token verification and single-use invalidation.
- **Responsive Dashboard**: Executive metrics, department breakdowns, and real-time activity stream.
- **Fluid & Accessible UI**: WCAG AA color contrast, debounced search (350ms), and notification toast system with deduplication.

## Setup & Running

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Create `.env` in the root (see `.env.example`):
```env
VITE_API_URL=http://localhost:5000/api
```
