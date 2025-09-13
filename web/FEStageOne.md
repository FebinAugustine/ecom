# Ecom Web Frontend: Stage One [COMPLETED]

This document outlines the features and architecture for the first stage of the web frontend.

## Core Pages Implemented

### Public Routes:
1. **Home Page**: The main landing page.
2. **Login Page**: For user, seller, and admin authentication.
3. **Register Page**: With a dynamic form for both `USER` and `SELLER` roles.
4. **Forgot Password Page**: To initiate the password recovery process.
5. **Reset Password with Code Page**: To finalize password recovery using an email code.
6. **Not Found (404) Page**: A catch-all route for undefined URLs.

### Protected Routes (Role-Based):
7. **User Dashboard**: A central hub for regular users.
8. **Seller Dashboard**: A central hub for sellers.
9. **Admin Dashboard**: A central hub for administrators.
10. **Profile Page**: A comprehensive page for users to view and manage their profile, update their avatar, and delete their account.
11. **Reset Password Page**: For authenticated users to change their password.

## Key Features & Architecture

- **Clean Architecture**: A modular folder structure is used to separate concerns:
  - `apis`: Centralized Axios instance and API functions.
  - `components`: Reusable, atomic components (forms, buttons, etc.).
  - `hooks`: Custom hooks for shared logic (e.g., `useNotify`).
  - `layouts`: Consistent page layouts (e.g., `MainLayout` with Header/Footer).
  - `pages`: Top-level page components.
  - `state`: Global state management with `zustand` (`useAuthStore`, `useThemeStore`).
- **Robust Authentication**: Complete frontend logic for registration, login, logout, and role-based protected routes.
- **Email Verification Flow**: New users and sellers must verify their email before they can log in.
- **Light/Dark Mode**: A persistent, system-aware theme switcher provides a modern user experience.
- **Toast Notifications**: A centralized notification system (`react-hot-toast`) provides clean, non-intrusive feedback for all user actions.
