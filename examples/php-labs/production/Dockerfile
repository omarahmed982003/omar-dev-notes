FROM composer:2 AS vendor

WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --classmap-authoritative

FROM php:8.4-fpm-alpine

WORKDIR /srv/app

RUN apk add --no-cache libpq \
    && apk add --no-cache --virtual .build-deps $PHPIZE_DEPS libpq-dev linux-headers \
    && docker-php-ext-install pdo_pgsql pcntl \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del .build-deps

COPY production/php.ini /usr/local/etc/php/conf.d/zz-production.ini
COPY production/app-pool.conf /usr/local/etc/php-fpm.d/zz-app.conf
COPY production/public/ /srv/app/public/
COPY production/bin/ /srv/app/bin/
COPY --from=vendor /app/vendor /srv/app/vendor

RUN chown -R www-data:www-data /srv/app

USER www-data

CMD ["php-fpm", "-F"]
