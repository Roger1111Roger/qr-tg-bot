#!/bin/bash

# Запуск backend
node --no-warnings=ExperimentalWarning --loader ts-node/esm /root/qr-tg-bot/src/backend/main.ts &
BACKEND_PID=$!

# Запуск bot
node --no-warnings=ExperimentalWarning --loader ts-node/esm /root/qr-tg-bot/src/bot/main.ts &
BOT_PID=$!

# Ожидание завершения процессов
wait $BACKEND_PID
wait $BOT_PID
