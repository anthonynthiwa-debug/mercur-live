# Enterprise Live-Shopping Platform (MercurJS + Agora)

This project transforms the MercurJS storefront into a high-scale live-shopping platform using Agora for real-time video, chat, and signaling.

## Architecture

- **Backend:** Medusa.js with a custom `mercur-liveshopping` plugin.
- **Frontend:** Next.js 14 App Router, Tailwind CSS.
- **Real-time:** Agora RTC (Interactive Live Streaming), Agora RTM (Signaling & Chat).
- **VOD:** Agora Cloud Recording with S3 storage.

## Features

### Host Experience
- Start/End live streams with low latency.
- Real-time product pinning (broadcasts to all viewers).
- Flash deals with countdown timers.
- Beauty effects and Virtual Background (blur).
- Real-time viewer count and moderation (mute/kick).

### Viewer Experience
- Watch streams in real-time with synchronized product overlays.
- **In-Stream Checkout:** Add to cart and complete purchase without leaving the video.
- Real-time chat and reactions.
- VOD replays with synced product timelines.

## Setup Instructions

### 1. Agora Configuration
You need an Agora account and a project with:
- **App ID**
- **App Certificate** (Primary)
- **Cloud Recording** enabled and configured with an S3 bucket.

### 2. Environment Variables
Add the following to your `.env` files:

**Backend (`apps/api/.env`):**
```env
AGORA_APP_ID=your_app_id
AGORA_APP_CERTIFICATE=your_app_certificate
AGORA_CUSTOMER_ID=your_agora_rest_id
AGORA_CUSTOMER_SECRET=your_agora_rest_secret
S3_BUCKET=your_bucket
S3_REGION=your_region
S3_ACCESS_KEY=your_key
S3_SECRET_KEY=your_secret
```

**Frontend (`apps/storefront/.env.local`):**
```env
NEXT_PUBLIC_AGORA_APP_ID=your_app_id
NEXT_PUBLIC_MEDUSA_URL=http://localhost:9000
```

### 3. Installation
```bash
bun install
```

### 4. Database Migrations
```bash
cd packages/mercur-liveshopping
bun run build # to compile the plugin
cd ../../apps/api
npx medusa db:migrate
```

### 5. Running
```bash
bun run dev
```

## Testing

### Unit Tests
```bash
cd packages/mercur-liveshopping
bun test
```

### E2E Tests (Playwright)
```bash
cd apps/storefront
npx playwright test
```

## Implementation Details

- **Plugin:** `packages/mercur-liveshopping` contains the full service layer for Agora token generation and Cloud Recording.
- **Components:** `apps/storefront/src/components/live/` contains the modular UI for RTC, RTM, and Checkout.
- **Hooks:** `useLiveStream` and `useLiveChat` manage the complex Agora client lifecycles.
