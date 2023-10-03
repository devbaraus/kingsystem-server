[![Deploy](https://github.com/devbaraus/kingsystem-server/actions/workflows/deploy.yml/badge.svg)](https://github.com/devbaraus/kingsystem-server/actions/workflows/deploy.yml)
[![Test](https://github.com/devbaraus/kingsystem-server/actions/workflows/test.yml/badge.svg)](https://github.com/devbaraus/kingsystem-server/actions/workflows/test.yml)
[![Codecov](https://codecov.io/gh/devbaraus/kingsystem-server/graph/badge.svg?token=JULCNOSAAA)](https://codecov.io/gh/devbaraus/kingsystem-server)
![Uptimekuma](https://uptime.lab.baraus.dev/api/badge/14/uptime/720?label=Uptime%2030d)

![Codecov](https://codecov.io/gh/devbaraus/kingsystem-server/graphs/tree.svg?token=JULCNOSAAA)

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Production

```bash
docker compose up --build
```

## Development

```bash
docker compose -f docker-compose.dev.yml up --build
```

## Test

```bash
docker compose -f docker-compose.test.yml up --build --exit-code-from nest
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If
you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
