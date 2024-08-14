import TelegramBot from "node-telegram-bot-api";
import {
  addLogBotMessage,
  addUser,
  getUser,
  getUrlsDataUser,
  Users,
  UrlsData,
  editUrlsData,
  getUrlsDataUrl,
  addUrlsData,
  addLogUserMessage,
} from "../db/database.ts";
import { commsnds, messages } from "./messeges.ts";

const token = "7129307166:AAGqUjmPmGYb0AhjovGoSRgSHKNzu0id4J8";

console.log("=> Bot is running <=");

const bot = new TelegramBot(token!, { polling: true }); // Создаем бота, который использует «опрос» для получения новых обновлений

type logList = {
  chat_id: number;
  lastTypeMessege: string;
  time: Date;
};

const logList: logList[] = [];
const logListUserMessages: logList[] = [];

// Прослушивание любого типа сообщений. Существуют различные типы сообщений
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  let message = messages.hz;
  let findUser: Users | undefined;
  let userData: UrlsData[] = [];

  if (!msg.from?.is_bot) {
    findUser = await getUser(chatId);
    if (findUser) {
      const foundedData = await getUrlsDataUser(findUser.id);
      if (foundedData) {
        userData = foundedData;
      }
    }

    try {
      switch (msg.text) {
        case commsnds.start:
          if (!findUser) {
            message = `Привет ${msg.from!.first_name}, ${messages.start}`;

            addUser(chatId, msg);
          } else {
            message = `Привет ${msg.from!.first_name}, ${messages.start2}`;
          }
          break;
        case commsnds.registrate:
          message = messages.registrate;
          break;
        case commsnds.redirect:
          if (userData.length === 1) {
            message = messages.redirect;
          } else if (userData.length > 1) {
            const findUrls = userData.map((item) => item.local_url).join(", ");

            message = `${messages.redirect5} ${findUrls}`;
          } else {
            message = messages.registrate0;
          }
          break;
        case commsnds.help:
          message = messages.help;
          break;
        case commsnds.cancel:
          message = messages.cancel;
          break;
        case commsnds.delete:
          if (userData.length === 1) {
            message = `${messages.delete} ${userData[0].local_url}`;
          } else if (userData.length > 1) {
            const findUrls = userData.map((item) => item.local_url).join(", ");

            message = `${messages.delete1} ${findUrls}`;
          }
          break;
        case commsnds.info:
          const result = userData
            .map((item) => `${item.local_url} => ${item.url}`)
            .join("\n");

          message = `${messages.info}\n ${result}`;
          break;
        default:
          if (msg.text) {
            const chackLastMess: logList[] = getLastMessages(chatId);

            if (chackLastMess.length === 0) {
              break;
            }

            if (
              chackLastMess[0].lastTypeMessege.startsWith(messages.registrate)
            ) {
              const findUrl = await getUrlsDataUrl(msg.text);

              if (findUrl.length === 0) {
                addUrlsData(findUser!, msg.text);
                message = messages.registrated;
              } else {
                message = messages.registrated1;
              }
            } else if (
              msg.text.startsWith("https://") &&
              (chackLastMess[0].lastTypeMessege.startsWith(messages.redirect) ||
                chackLastMess[0].lastTypeMessege.startsWith(messages.redirect1))
            ) {
              const chackLastUserMess: logList[] = getLastUserMessages(chatId);

              editUrlsData(chackLastUserMess[0].lastTypeMessege, msg.text!);

              message = messages.redirected;
            } else if (
              chackLastMess[0].lastTypeMessege.startsWith(messages.delete) ||
              chackLastMess[0].lastTypeMessege.startsWith(messages.delete1)
            ) {
              editUrlsData(msg.text!, null);

              message = messages.deleted;
            } else if (
              chackLastMess[0].lastTypeMessege.startsWith(messages.redirect5)
            ) {
              message = messages.redirect1;
            }

            addLogUserMessage(findUser, chatId, msg.text, new Date());

            logListUserMessages.push({
              chat_id: chatId,
              lastTypeMessege: msg.text,
              time: new Date(),
            });
          }
      }
    } catch (error) {
      console.log(error);

      message = messages.error;
    }
  } else {
    message = messages.bot;
  }

  addLogBotMessage(findUser, chatId, message, new Date());

  logList.push({ chat_id: chatId, lastTypeMessege: message, time: new Date() });

  bot.sendMessage(chatId, message);
});

function getLastMessages(chatId: number) {
  return logList
    .sort((a, b) => Number(b.time) - Number(a.time))
    .filter((item) => item.chat_id === chatId);
}

function getLastUserMessages(chatId: number) {
  return logListUserMessages
    .sort((a, b) => Number(b.time) - Number(a.time))
    .filter((item) => item.chat_id === chatId);
}
