# SpectrumMoodTracker (backend)

Servidor backend para o aplicativo mobile SpectrumMoodTracker.

## Database specifications

- PostgresSQL 16.4
- DBeaver Community 24.1.4
- Implemented with Prisma Object-Relational-Mapper 5.18

## Run these commands in this sequence to boot up the application

### Install the dependencies

```bash
npm install
```

### Generate prisma client with the schema.prisma file

```bash
npm run prisma:generate
```

### Apply pendind migrations

```bash
npm run prisma:deploy
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
npm run dev:server
```

## Optional

### Make other migrations with Prisma

```bash
npm run prisma:migrate <xx_descrição_da_migration>
```
