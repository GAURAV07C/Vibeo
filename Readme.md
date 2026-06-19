# Vibeo

A social streaming platform built with Next.js 16, React 19, Prisma 7, and PostgreSQL. Currently in active development.

---

## Overview

Vibeo is a real-time social streaming application where users can:

- Add YouTube or Spotify streams via URL
- Upvote/downvote streams
- Create and join live rooms where multiple users can listen/watch together
- Communicate in real-time via WebRTC audio/video
- Synchronize playback across all participants in a room

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Frontend | React 19 + Tailwind CSS v4 |
| Authentication | NextAuth v5 (Google OAuth) |
| Database | PostgreSQL 15+ |
| ORM | Prisma 7 |
| Validation | Zod v4 |
| Video Search | youtube-search-api |
| Real-Time (Planned) | Socket.io + Redis |
| P2P Media (Planned) | WebRTC via mediasoup (SFU) |

---

## Project Structure

```
Vibeo/
├── app/                           # Next.js App Router
│   ├── api/
│   │   ├── auth/[...nextauth]/    # NextAuth route handler
│   │   ├── stream/                # Stream CRUD + voting endpoints
│   │   │   ├── route.ts
│   │   │   ├── upvote/route.ts
│   │   │   └── downvote/route.ts
│   │   └── test/route.ts
│   ├── generated/prisma/          # Auto-generated Prisma client
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── Appbar.tsx                  # Navigation bar
├── lib/
│   ├── auth.ts                    # NextAuth configuration
│   ├── prisma.ts                  # Prisma client singleton
│   └── provider.tsx               # SessionProvider wrapper
├── prisma/
│   ├── schema.prisma              # Database schema definition
│   └── migrations/
├── public/                        # Static assets
├── proxy.ts                       # Auth middleware (Next.js 16)
├── package.json
└── tsconfig.json
```

---

## Database Schema

```prisma
model User {
  id       String   @id @default(uuid())
  email    String   @unique
  provider Provider @default(Google)
  streams  Stream[]
  upvotes  Upvote[]
}

model Stream {
  id          String     @id @default(uuid())
  type        StreamType @default(Youtube)
  url         String
  extractedId String
  title       String     @default("")
  SmallImage  String     @default("")
  BigImage    String     @default("")
  active      Boolean    @default(true)
  userId      String
  user        User       @relation(fields: [userId], references: [id])
  upvotes     Upvote[]
}

model Upvote {
  id       String @id @default(uuid())
  userId   String
  streamId String
  stream   Stream @relation(fields: [streamId], references: [id])
  user     User   @relation(fields: [userId], references: [id])

  @@unique([userId, streamId])
}

enum StreamType {
  Spotify
  Youtube
}

enum Provider {
  Google
}
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Redis (planned for Socket.io infrastructure)

### Installation

```bash
# Install dependencies
npm install

# Configure environment
cp app/.env.example app/.env

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### Environment Variables

```env
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/vibeo
AUTH_SECRET=your-auth-secret
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
AUTH_GITHUB_ID=your-github-client-id
AUTH_GITHUB_SECRET=your-github-client-secret
REDIS_URL=redis://localhost:6379
```

---

## Development Status

This project is currently in **active development**. Core authentication and stream management APIs are implemented. Room-based real-time features, WebRTC integration, and Socket.io infrastructure are planned and not yet implemented.

### Implemented

- Google OAuth authentication via NextAuth v5
- Stream CRUD operations (create, read)
- Upvote/downvote system
- Prisma ORM with PostgreSQL
- Basic UI layout and navigation

### Roadmap

#### Phase 1 — Room System (In Planning)
- Room creation with unique invite links
- Room types: public, private (password protected), and permanent (always-on)
- Room metadata: tags, genre, max participants, host controls
- User presence tracking (online/offline, currently listening)

#### Phase 2 — Socket.io Real-Time Infrastructure
- Live queue synchronization across all room participants
- Real-time chat and reactions inside rooms
- Host controls: play, pause, skip, seek — reflected instantly for everyone
- Raise hand / request queue feature
- Redis adapter for Socket.io horizontal scaling across multiple server instances

#### Phase 3 — WebRTC via mediasoup (SFU)
- mediasoup-based Select Forwarding Unit for scalable multi-user rooms
- Server-side routing of audio/video streams — no direct peer-to-peer relay
- Low-latency broadcasting optimized for real-time room communication
- Screen sharing support for hosts and participants
- Transport management: plain RTP, plain UDP, or WebRTC for browser clients

#### Phase 4 — Enhanced Streaming Integration
- Native Spotify embed with Web Playback SDK
- YouTube IFrame API integration for synchronized playback
- Search and queue management UI
- Stream metadata enrichment (thumbnails, duration, artist info)

#### Phase 5 — Scalability & Reliability
- Object storage for thumbnails and recorded clips
- CDN integration for stream caching and low-latency delivery
- Rate limiting and abuse prevention on Socket.io events
- Monitoring and observability (logs, metrics, traces)

---

## Scripts

```bash
npm run dev        # Start development server with hot reload
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Run ESLint
npx prisma studio  # Open Prisma Studio (database browser)
```

---

## License

MIT
