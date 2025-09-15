# Sui Wallet

A web3 wallet interface for the Sui blockchain.

## Prerequisites

- Node.js 16.x or later
- npm or yarn
- Vercel CLI (optional, for deployment)

## Installation

```bash
# Install dependencies for both frontend and backend
npm run install-all
```

## Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Update the environment variables in `.env.local` as needed.

## Development

### Start both frontend and backend in development mode:

```bash
npm run dev
```

### Start frontend only:

```bash
npm run client
```

### Start backend only:

```bash
npm run server
```

## Building for Production

```bash
# Build both frontend and backend
cd frontend && npm run build
cd ../backend && npm run build
```

## Deployment

This project is configured for deployment on Vercel. The deployment includes:

- Frontend: Static site served from `/frontend/dist`
- Backend: Serverless functions under `/api` route

### Deploying to Vercel

1. Install Vercel CLI (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

### Environment Variables in Vercel

Make sure to set the following environment variables in your Vercel project settings:

- `VITE_API_URL` - The base URL for API requests (set to `/api` for production)
- `SUI_MAINNET_RPC_URL` - Mainnet RPC URL (optional, has default)
- `SUI_TESTNET_RPC_URL` - Testnet RPC URL (optional, has default)

## Project Structure

- `/frontend` - React + Vite frontend application
- `/backend` - Node.js + Express backend API
- `vercel.json` - Vercel deployment configuration
