Для старта нужно запустить две консоли:
1) npm run start-back
2) npm run start-bot

или
 npm run start-bot && npm run start-back

 node --no-warnings=ExperimentalWarning --loader ts-node/esm /root/qr-tg-bot/src/backend/main.ts &&
 node --no-warnings=ExperimentalWarning --loader ts-node/esm /root/qr-tg-bot/src/bot/main.ts

для просмотра базы лучше использовать апликейшен в Майкрософт вижуал коде и наверху ввести:
>SQLite: Open