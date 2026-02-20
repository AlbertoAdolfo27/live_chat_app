# live_chat_app
Live chat app with Express, SocketIO and Next.js
A highly scalable real-time chat ecosystem, structured as a monorepo to facilitate type sharing and service orchestration.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime Ecosystem | Node.js |
| Language | TypeScript (Strict Mode) |
| Backend (API) | Express.js |
| Real-time | Socket.IO |
| Frontend | Next.js |
| ORM | Prisma |
| Package Manager | PNPM (Workspaces) |

---

## 📂 Folder Architecture

```
live_chat_app/
├── apps/
│   ├── api/      # Backend – REST API with Express Server
│   ├── socket/   # Backend – WebSocket Server (Socket.IO)
│   └── web/      # Frontend – Client-side Application (Next.js)
├── pnpm-workspace.yaml
├── package.json
└── turbo.json
```

The project uses PNPM Workspaces and Turborepo for orchestration::

-   `pnpm-workspace.yaml`:Defines the location of packages and applications within the monorepo, allowing PNPM to manage dependencies in a shared and efficient way.
-   `package.json` (Root): Manages global commands and monorepo dependencies.
-   `turbo.json`: Configures the execution pipeline and task caching.

---

## ⚙️ System Requirements

Make sure you have the following installed on your machine:

- **Node.js**
- **pnpm** (Essential for monorepo management)
- **npm + npx** (For running Prisma scripts)

---

## 🚀 Installation and Initial Setup

At the project root, install all dependencies:

```bash
pnpm install
```

---

## 🔧 6. Backend (API) Configuration

### 6.1 Integration Credentials

The API requires credentials so the Socket Server and Web Client can communicate securely.

#### 6.1.1 Configure the Socket Server

Generate the credentials:

```bash
pnpm generate-app-credentials:socket
```

In `apps/api/.env`, save the returned credential values:

```env
SOCKET_IO_APP_NAME=SocketIO Server
SOCKET_IO_APP_ID=<returned_app_id>
SOCKET_IO_APP_API_KEY_HASH=<returned_app_hash>
```

In `apps/socket/.env`, save the key:

```env
API_KEY=<returned_API_key>
```

#### 6.1.2 Configure the Web Client

Generate the credentials:

```bash
pnpm generate-app-credentials:web
```

In `apps/api/.env`, add:

```env
WEB_APP_NAME=Web Client
WEB_APP_ID=<returned_app_id>
WEB_APP_API_KEY_HASH=<returned_app_hash>
```

In `apps/web/.env`, add:

```env
API_KEY=<returned_API_key>
```

---

### 6.2 Database Configuration (Prisma)

The project is natively configured for **MySQL**.

Set the connection variables in `apps/api/.env`:

```env
DATABASE_URL="mysql://username:password@localhost:3306/mydb"
DATABASE_USER="username"
DATABASE_PASSWORD="password"
DATABASE_NAME="mydb"
DATABASE_HOST="localhost"
DATABASE_PORT=3306
```

> **PostgreSQL note:** If you prefer Postgres, replace the adapter:
>
> ```bash
> pnpm remove --filter ./apps/api @prisma/adapter-mariadb
> pnpm add --filter ./apps/api @prisma/adapter-pg pg
> ```
>
> Update the connection in: `apps/api/src/infra/database/prisma.js`.

Run the migrations and seed:

```bash
cd apps/api
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed
```

---

### 6.3 Authentication Key Generation (JWT PKCS#8)

Use **OpenSSL** to generate the signing and verification keys.

**Generate RSA private key (PKCS#8):**

```bash
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048
```

**Extract the public key:**

```bash
openssl rsa -pubout -in private_key.pem -out public_key.pem
```

**Key distribution:**

- Move `private_key.pem` and `public_key.pem` to `apps/api/secrets/`
- Move `public_key.pem` to `apps/socket/secrets/`

---

### 6.4 Additional API Variables

In `apps/api/.env`, set the port and the "pepper" (secret value for hashing):

```env
SERVER_PORT=3000
API_KEY_PEPPER=<secret_pepper_value>
```

---

## 🔌 7. Socket Server Configuration

In `apps/socket/.env`, configure the API integration:

```env
API_KEY=<API_KEY_generated_in_step_6.1.1>
SERVER_PORT=3001
```

---

## 💻 8. Web Client (Frontend) Configuration

In `apps/web/.env`, add the environment definitions:

```env
API_KEY=<API_KEY_generated_in_step_6.1.2>
COOKIE_LOGGED_USER=<uuid_for_cookie_identification>
API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_SOCKET_BASE_URL=http://localhost:3001
NODE_ENV=development
```

---

## 🚀 9. Running the Project

### Development Mode (All services)

```bash
pnpm dev
```

### Individual Commands (Dev)

| Service | Command |
|---|---|
| API | `pnpm dev:api` |
| Web | `pnpm dev:web` |
| Socket | `pnpm dev:socket` |

### Build and Production

| Action | Command |
|---|---|
| Build All | `pnpm build` |
| Start All | `pnpm start` |
| Build API | `pnpm build:api` |
| Build Web | `pnpm build:web` |
| Build Socket | `pnpm build:socket` |
| Start API | `pnpm start:api` |
| Start Web | `pnpm start:web` |
| Start Socket | `pnpm start:socket` |
