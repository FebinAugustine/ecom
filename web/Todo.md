# Frontend Stage One Todo [COMPLETED]

This document tracks the development progress for the first stage of the web frontend, based on `FEStageOne.md`.

**Stage One is complete.** All foundational features for user authentication, management, and UI/UX have been fully implemented.

## 1. Project Setup & Foundation

- [x] Create directory structure (`apis`, `assets`, `components`, `hooks`, `layouts`, `pages`, `state`, `utils`).
- [x] Install necessary dependencies (`axios`, `zustand`, `react-router-dom`, `react-hot-toast`).
- [x] Set up basic routing using `react-router-dom`.
- [x] Implement basic layout components.
- [x] Set up initial state management with `zustand` (`useAuthStore`, `useThemeStore`).
- [x] Create a centralized Axios instance for API calls with robust error handling.

## 2. Page Implementation

- [x] **Public Pages:**
    - [x] Home Page
    - [x] Login Page
    - [x] Register Page (with email verification)
    - [x] Forgot Password Page
    - [x] Reset Password (after forgot password flow) Page
    - [x] Not Found (404) Page
- [x] **Protected Pages:**
    - [x] User Dashboard
    - [x] Seller Dashboard
    - [x] Admin Dashboard
    - [x] Reset Password (for logged-in users) Page
    - [x] Profile Page (with update, avatar change, and delete functionality)

## 3. Component Development

- [x] Create common atomic components (Buttons, Inputs, Forms, etc.).
- [x] Develop dynamic, theme-aware navigation/header components.
- [x] Develop theme-aware footer components.

## 4. Authentication & Protected Routes

- [x] Implement logic for user and seller login and registration.
- [x] Implement email verification flow for new users and sellers.
- [x] Create a mechanism for role-based protected routes.
- [x] Handle token management and authenticated API requests.
- [ ] Implement logic for Google Sign-In. *(Deferred to a future stage)*

## 5. UI/UX Enhancements

- [x] **Toast Notifications**: Implemented a centralized notification system with `react-hot-toast` and a custom `useNotify` hook, replacing all inline messages.
- [x] **Light/Dark Mode**: Implemented a persistent, system-aware theme switcher using TailwindCSS and a `zustand` store.
