# School Management Dashboard

## First come

### Setup environment
Create `.env` file based on `.env.template`

### Init and start postgres DB with Docker
Docker run (should match username and password with your `.env`):
```sh
docker run -d --name postgres-school-db -p 5432:5432 -e POSTGRES_DB=school -e POSTGRES_USER=[your db username] -e POSTGRES_PASSWORD=[your db password] postgres:latest
```

### Migrate schema to DB
To map your data model to the database schema, you need to use the prisma migrate CLI commands:
```sh
npx prisma migrate dev --name init
```
This command does two things:
1. It creates a new SQL migration file for this migration
2. It runs the SQL migration file against the database

### Seeding data to DB
```sh
npx prisma db seed
```

## Tool

### Visual editor for postgres database
Should run in the location that has `.env` and `prisma/schema.prisma`
```sh
npx prisma studio
```
Open [http://localhost:5555](http://localhost:5555) with your browser

## Getting Started

### Start postgres DB with Docker
```sh
docker start postgres-school-db
```

### Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result
