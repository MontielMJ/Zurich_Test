#!/usr/bin/env bash
# wait-for-it.sh
# Usage: wait-for-it.sh host:port -t timeout
set -e

HOSTPORT=$1
TIMEOUT=${2:-30}

HOST=$(echo $HOSTPORT | cut -d: -f1)
PORT=$(echo $HOSTPORT | cut -d: -f2)

echo "Waiting for $HOST:$PORT..."
for i in $(seq 1 $TIMEOUT); do
    nc -z $HOST $PORT && echo "$HOST:$PORT is available!" && exit 0
    sleep 1
done

echo "Timeout waiting for $HOST:$PORT"
exit 1
