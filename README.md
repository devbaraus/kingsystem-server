[![Deploy](https://github.com/devbaraus/kingsystem-server/actions/workflows/deploy.yml/badge.svg)](https://github.com/devbaraus/kingsystem-server/actions/workflows/deploy.yml)
[![Test](https://github.com/devbaraus/kingsystem-server/actions/workflows/test.yml/badge.svg)](https://github.com/devbaraus/kingsystem-server/actions/workflows/test.yml)
[![Codecov](https://codecov.io/gh/devbaraus/kingsystem-server/graph/badge.svg?token=JULCNOSAAA)](https://codecov.io/gh/devbaraus/kingsystem-server)

# KingSystem Server

Uma API para gerenciar sistemas.

## Production

```bash
docker compose up --build
```

## Development

```bash
docker compose -f docker-compose.dev.yml up --build nest
```

## Test

```bash
docker compose -f docker-compose.test.yml up --build test
```

## Tech Stack
- NestJS
- Prisma
- PostgreSQL
- Passport
- JWT
- Jest
- Docker
- Github Actions
- Eslint
- Prettier

## Tools
- Prisma Studio
- WebStorm
- Hoppscotch
- Gitkraken
- Oracle Cloud Infrastructure