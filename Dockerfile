FROM mhart/alpine-node:10 AS builder
WORKDIR /app
RUN apk add --update \
  bash \
  lcms2-dev \
  libpng-dev \
  gcc \
  g++ \
  make \
  autoconf \
  automake \
  && rm -rf /var/cache/apk/*
COPY . .
RUN npm install
RUN npm run build
ENV SERVER_URL ${SERVER_URL}

FROM mhart/alpine-node
RUN yarn global add serve
WORKDIR /app
COPY --from=builder /app/dist .
CMD ["serve", "-p", "80", "-s", "."]