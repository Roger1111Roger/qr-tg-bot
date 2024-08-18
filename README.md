Настройка сервера:

1) Создание ssh 
    ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

    cat ~/.ssh/id_rsa.pub

2) Устанавливаем компоненты для работы
    sudo apt update
    sudo apt install git
    sudo apt install nodejs npm
    sudo apt install tree

3) Клонируем репозиторий и запускаем

а) Для запуска dev:
    1) npm run back
    2) npm run bot
или
    npm run start-bot && npm run start-back

б) Для запуска demo:
    npm run main
или
    node --no-warnings=ExperimentalWarning --loader ts-node/esm /root/qr-tg-bot/src/backend/main.ts &
    node --no-warnings=ExperimentalWarning --loader ts-node/esm /root/qr-tg-bot/src/bot/main.ts

Для просмотра базы лучше использовать апликейшен в Майкрософт вижуал коде и наверху ввести:
>SQLite: Open