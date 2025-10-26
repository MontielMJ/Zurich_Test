#!/bin/sh
# wait-for-sql.sh
# Espera a que un host:puerto TCP esté disponible
# Uso: sh wait-for-sql.sh <host> <port> [timeout-seconds]

HOST=$1
PORT=$2
TIMEOUT=${3:-60}  # segundos por defecto

echo "Waiting for $HOST:$PORT..."

i=0
while ! nc -z $HOST $PORT; do
  i=$((i+1))
  if [ $i -ge $TIMEOUT ]; then
    echo "Timeout waiting for $HOST:$PORT"
    exit 1
  fi
  sleep 1
done

echo "$HOST:$PORT is available!"
exit 0
