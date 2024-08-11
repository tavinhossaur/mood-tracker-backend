# MoodTracker (backend)

Servidor backend para o app mobile MoodTracker.

## Install the dependencies

```bash
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
npm run dev:server
```

### Build app with tsup

```bash
npm run build
```

### Generate prisma client with the schema.prisma file

```bash
npm run prisma:generate
```

### Apply pendind migrations

```bash
npm run prisma:deploy
```

### Make migrations with Prisma

```bash
npm run prisma:migrate <xx_descrição_da_migration>
```
