# Chat Support System — Customer View

The customer-facing half of a two-sided support platform: a person with a problem opens this app, starts a conversation, and talks to a support agent in real time.

The other half is [ChatSupportSystemAgentView](https://github.com/Moodinocode/ChatSupportSystemAgentView), where agents pick that conversation up as a ticket, assign it, categorise it and reply. Both talk to the same backend, which is not public.

Built at Tecfrac, September–October 2025.

## What it does

- **Register and sign in**, with refresh-token rotation so a session survives an expired access token
- **Start and continue conversations** with support, backed by Twilio Conversations
- **See messages arrive live**, along with typing indicators from the agent
- **System messages** marking events in the thread — assignment, category changes, closure
- **Notifications** when a reply arrives while the window is not focused
- **Inactive-conversation handling**, so a thread that has gone quiet is treated differently from a live one
- A **chatbot** first line, with escalation to a human

## Stack

| Concern | Choice |
|---|---|
| Framework | React + Vite |
| State | Zustand |
| Styling | Tailwind CSS + DaisyUI |
| Messaging | Twilio Conversations SDK |
| Voice | Twilio Voice SDK |
| HTTP | axios, through a shared instance handling auth and refresh |

## Structure

```
src/
├── Pages/              Login, Registration, Chat
├── Components/
│   ├── AuthComponents/     Email, password and username inputs
│   └── ChatComponents/     Chat interface, message, sidebar,
│                           typing indicator, system message
├── Context/            AuthContext
├── Services/           auth, conversations, Twilio
├── Stores/             Zustand conversation store
├── fixtures/           Captured Twilio Content responses for local development
└── Utils/              axios instance, typing-indicator helper
```

## Running it

```bash
npm install
npm run dev
```

The app expects the support backend to be reachable through the configured proxy. That backend is a private service, so this repository is not runnable end to end on its own — it is published to show the client-side architecture rather than as a deployable product.

## Known debt

The two halves of this system were built as separate repositories, and the code they share has drifted rather than staying in step. `AuthContext`, `ProtectedRoute`, `axiosInstance`, `authService`, the auth input components and the Zustand conversation store all exist in both repositories in slightly different versions — the conversation store alone differs by around 70 lines between them.

The right structure is a single repository with `apps/customer`, `apps/agent` and a shared package holding auth, the API client and the conversation store. That consolidation has not been done; it is the first thing worth fixing if this were taken further.
