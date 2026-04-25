# Agentic UI Engine

Type a sentence. Get a working UI component.

**Live Demo → [agentic-ui-engine-web.vercel.app](https://agentic-ui-engine-web.vercel.app)**

---

## Overview

Agentic UI Engine turns natural language into interactive React components. Describe what you want, and the system generates a live preview plus exportable code — powered by a custom Component DSL that maps AI output to real UI.

Built as a full-stack project to explore AI-driven developer tooling, cross-platform architecture, and prompt engineering.

## Features

- Natural language → rendered UI in under 3 seconds
- Interactive components — form validation, button actions, state management
- One-click code export (React + Tailwind)
- 9 component types: Button, Input, Card, List, Badge, Hero, Stat, Avatar, Divider
- Monorepo structure with shared logic across Web and Mobile

## Stack

| | |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Mobile | Expo (React Native) |
| Backend | Node.js, Express |
| AI | OpenAI GPT-4o-mini |
| Infra | Vercel + Railway |

## How it works

The core is a **Component DSL** — a JSON schema designed to bridge natural language and rendered UI components.

```
Prompt → GPT-4o-mini → Component DSL (JSON) → React
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

# Backend
cp backend/.env.example backend/.env
# Add OPENAI_API_KEY to backend/.env
cd backend && npm run dev

# Frontend (new terminal)
cd apps/web && npm run dev
```

## Structure

```
├── apps/web        # Next.js frontend
├── apps/mobile     # Expo (in progress)
├── packages/shared # Shared hooks and types
└── backend         # Express API + AI service
```

---

Made by [Josie Xiong](mailto:jaaonline8@gmail.com)