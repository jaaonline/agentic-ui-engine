# Agentic UI Engine

Type a sentence. Get a working UI component.

**Live Demo → [agentic-ui-engine-web.vercel.app](https://agentic-ui-engine-web.vercel.app)**

## Screenshots

### Web
![web](apps/web/public/screenshot-web.jpg)

### Mobile (React Native)
| Login Form | Dashboard |
|-----------|-----------|
| ![login](apps/mobile/assets/screenshots/mobile-login.jpg) | ![dashboard](apps/mobile/assets/screenshots/mobile-dashboard.jpg) |

---

## Overview

Agentic UI Engine turns natural language into interactive React components. Describe what you want, and the system generates a live preview plus exportable code — powered by a custom Component DSL that maps AI output to real UI.

Built as a full-stack microservice project featuring AI-driven UI generation, cross-platform rendering, and a complete user system with persistent history.

## Features

- Natural language → rendered UI in under 3 seconds
- Interactive components — form validation, button actions, state management
- One-click code export (React + Tailwind)
- 13 component types: Button, Input, Card, List, Badge, Hero, Stat, Avatar, Divider, Table, Navbar, Alert, Progress
- User authentication with JWT (register, login, guest mode)
- Generation history saved per user
- Cross-platform — Web (Next.js) and Mobile (React Native / Expo)
- Microservice architecture: Node.js AI service + Spring Boot user service

## Stack

| | |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Mobile | Expo (React Native) |
| AI Service | Node.js, Express, OpenAI GPT-4o |
| User Service | Spring Boot 3.5, Java 21, JWT |
| Database | PostgreSQL, Spring Data JPA |
| Infra | Vercel (frontend) + Railway (backend + DB) |
| Testing | Jest, React Testing Library |
| CI/CD | GitHub Actions |

## How it works

The core is a **Component DSL** — a JSON schema designed to bridge natural language and rendered UI components.

```
Prompt → GPT-4o → Component DSL (JSON) → React / React Native
```

```json
{
  "components": [
    { "type": "input", "id": "email", "props": { "label": "Email", "required": true }},
    { "type": "button", "id": "submit", "props": { "label": "Sign in", "variant": "primary" }}
  ],
  "interactions": [
    { "trigger": "click", "sourceId": "submit", "action": "submit", "successMessage": "Welcome back!" }
  ]
}
```

The DSL separates concerns: AI handles semantics, the renderer handles presentation.

## Running locally

```bash
git clone https://github.com/jaaonline/agentic-ui-engine.git
cd agentic-ui-engine
npm install

# Node.js AI service
cp backend/.env.example backend/.env
# Add OPENAI_API_KEY to backend/.env
cd backend && npm run dev

# Spring Boot user service
cd java-backend
# Configure PostgreSQL in src/main/resources/application.properties
./mvnw spring-boot:run

# Frontend (new terminal)
cd apps/web && npm run dev

# Mobile (new terminal)
cd apps/mobile && npx expo start
```

## Structure

```
├── apps/
│   ├── web/          # Next.js frontend
│   └── mobile/       # Expo React Native app
├── backend/          # Node.js AI generation service
├── java-backend/     # Spring Boot user & history service
├── packages/shared/  # Shared types and hooks
└── .github/workflows # CI/CD pipeline
```

---

Made by [Josie Xiong](mailto:jaaonline8@gmail.com)