# FROM kyma/docker-nginx
# RUN printf "deb http://archive.debian.org/debian/ jessie main\ndeb-src http://archive.debian.org/debian/ jessie main\ndeb http://security.debian.org jessie/updates main\ndeb-src http://security.debian.org jessie/updates main" > /etc/apt/sources.list
# RUN apt-get update
# RUN apt-get install -y curl
# RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
# RUN apt-get install -y nodejs
# COPY ./ ~/dac-web-app
# WORKDIR ~/dac-web-app
# RUN npm install
# RUN npm run build
# ENV SIMPLUS_AUTH_SERVER_URL ${SIMPLUS_AUTH_SERVER_URL}
# RUN mkdir /var/www
# RUN mv dist/* /var/www
# For react router and nginx
# RUN rm /etc/nginx/conf.d/default.conf
# COPY nginx/nginx.conf /etc/nginx/conf.d
# CMD 'nginx'

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
ENV SIMPLUS_AUTH_ACCOUNT_SERVER_URL ${SIMPLUS_AUTH_ACCOUNT_SERVER_URL}

FROM mhart/alpine-node
RUN yarn global add serve
WORKDIR /app
COPY --from=builder /app/dist .
CMD ["serve", "-p", "80", "-s", "."]