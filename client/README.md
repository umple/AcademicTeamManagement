# Client - Academic Team Management

This directory contains the frontend code for the **Academic Team Management** web application, built with **React**. The client side is responsible for providing a user-friendly interface for managing academic teams, students, and projects.

## Features

- **Role-Based Access**: Secure navigation and functionality based on user roles (e.g., Student, Professor, Admin).
- **Dynamic Translations**: Supports English and French through i18n integration.
- **Responsive Design**: Optimized for desktop and mobile devices.
- **State Management**: Efficient state handling using React's `useState` and `useEffect`.

## Structure Overview

- **Components**: Reusable UI elements like buttons, forms, and modals.
- **Pages**: Views that correspond to application routes (e.g., Dashboard, Student Groups, Projects).
- **Helpers**: Utility functions and quick scripts for handling specific tasks like session checks.
- **Services**: Comprehensive modules for API interaction and data fetching.
- **Styles**: CSS and styling configurations for maintaining a consistent design.

## Key Files

- **`App.js`**: Main application entry point, defines routing and layout.
- **`i18n.js`**: Handles app localization and translations.
- **`.env`**: Configuration file for environment variables (e.g., backend API URL).

## Development Workflow

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Run Development Server**:
   ```bash
   npm start
   ```
   The app will be accessible at `http://localhost:3000`.
3. **Build for Production**:
   ```bash
   npm run build
   ```

## Environment Variables

- **`REACT_APP_BACKEND_HOST`**: Backend API URL (e.g., `http://localhost:5000`).

## Technologies Used

- **React**: For building the user interface.
- **React Router**: For navigation and routing.
- **i18next**: For internationalization.
- **Axios/Fetch**: For API communication.