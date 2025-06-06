FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app

FROM base AS prod-deps

WORKDIR /app
RUN pnpm install --prod --frozen-lockfile

FROM base

COPY --from=prod-deps /app/node_modules /app/node_modules
WORKDIR /app
EXPOSE 3000
CMD [ "pnpm", "start" ]
