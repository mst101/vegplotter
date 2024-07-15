#!/usr/bin/env bash
# see https://carstenwindler.de/php/enable-xdebug-on-demand-in-your-local-docker-environment/
WWWGROUP=$(id -g)
WWWUSER=$(id -u)

export WWWGROUP
export WWWUSER

if [ "$#" -ne 1 ]; then
    SCRIPT_PATH=$(basename "$0")
    echo "Usage: $SCRIPT_PATH enable|disable"
    exit 1;
fi

# Expects service to be called app in docker-compose.yml
SERVICE_ID=$(docker compose ps -q laravel.test)

if [ "$1" == "disable" ]; then
    docker exec -i "$SERVICE_ID" bash -c \
        '[ -f /etc/php/8.3/cli/conf.d/20-xdebug.ini ] && cd /etc/php/8.3/cli/conf.d && mkdir --parents ../disabled; mv 20-xdebug.ini $_ || echo "Xdebug already disabled"'
else
    docker exec -i "$SERVICE_ID" bash -c \
        '[ -f /etc/php/8.3/cli/disabled/20-xdebug.ini ] && cd /etc/php/8.3/cli/disabled && mv 20-xdebug.ini ../conf.d || echo "Xdebug already enabled"'
fi

docker restart "$SERVICE_ID"

docker exec -i "$SERVICE_ID" bash -c '$(php -m | grep -q Xdebug) && echo "Status: Xdebug ENABLED" || echo "Status: Xdebug DISABLED"'
