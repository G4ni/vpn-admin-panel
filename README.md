# VPN Admin Panel

A simple admin interface for managing VPN users.

## Configuration

The app reads its configuration from environment variables. `VITE_API_BASE` must point to the root of the server API. Use an absolute URL (including protocol and host) when the API is served from a different origin.

Sample configuration files are provided:

- `.env.development` – defaults to a local API (`http://localhost:3000/api`).
- `.env.production` – example configuration for production (`https://vpn.example.com/api`).

Copy the appropriate file to `.env` or adjust the variables for your environment.

## Scripts

- `npm run dev` – start the development server
- `npm run build` – build for production
- `npm run preview` – preview the production build
