import sqlite3 from "sqlite3";
import { open } from "sqlite";
import TelegramBot from "node-telegram-bot-api";

export type Users = {
  id: number;
  chat_id: number;
  first_name: string;
  last_name: string;
  username: string;
  language_code: string;
};

export type UrlsData = {
  id: number;
  user_id: number;
  local_url: string;
  url: string;
  redir_index: number;
};

async function setupDatabase() {
  const db = await open({
    filename: "redirect.db",
    driver: sqlite3.Database,
  });

  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chat_id INTEGER NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT,
        username TEXT NOT NULL,
        language_code TEXT
      )
    `);
  } catch (error) {
    console.error("Error creating users table:", error);
  }

  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS urls_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        local_url TEXT UNIQUE,
        url TEXT,
        password TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
  } catch (error) {
    console.error("Error creating urls_data table:", error);
  }

  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        chat_id INTEGER,
        last_message TEXT NOT NULL,
        time DATE NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
  } catch (error) {
    console.error("Error creating logs table:", error);
  }

  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        chat_id INTEGER,
        last_message TEXT NOT NULL,
        time DATE NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
  } catch (error) {
    console.error("Error creating logs table:", error);
  }

  return db;
}

export default setupDatabase;

const db = await setupDatabase();

export async function getUser(chatId: number) {
  return await db.get(`SELECT * FROM users WHERE chat_id = ${chatId}`);
}

export function addUser(chatId: number, msg: TelegramBot.Message) {
  db.run(
    "INSERT INTO users (chat_id, first_name, last_name, username, language_code) VALUES (?, ?, ?, ?, ?)",
    [
      chatId,
      msg.from!.first_name,
      msg.from!.last_name,
      msg.from!.username,
      msg.from!.language_code,
    ]
  );
}

export function addLogBotMessage(
  userData: Users | undefined,
  chat_id: number,
  message: string,
  time: Date
) {
  db.run(
    "INSERT INTO logs (user_id, chat_id, last_message, time) VALUES (?, ?, ?, ?)",
    [
      userData ? userData.id : null,
      userData ? userData.chat_id : chat_id,
      message,
      time,
    ]
  );
}

export function addLogUserMessage(
  userData: Users | undefined,
  chat_id: number,
  message: string,
  time: Date
) {
  db.run(
    "INSERT INTO messages (user_id, chat_id, last_message, time) VALUES (?, ?, ?, ?)",
    [
      userData ? userData.id : null,
      userData ? userData.chat_id : chat_id,
      message,
      time,
    ]
  );
}

export async function getUrlsDataUser(user_id: number): Promise<UrlsData[]> {
  const find = await db.all(
    `SELECT * FROM urls_data WHERE user_id = ${user_id}`
  );

  return find ? find : [];
}

export async function getUrlsDataUrl(localUrl: string): Promise<UrlsData[]> {
  const find = await db.all(
    `SELECT * FROM urls_data WHERE local_url = "${localUrl}"`
  );

  return find ? find : [];
}

export async function getUrlsData1(local_url: string): Promise<UrlsData[]> {
  const find = await db.all(
    `SELECT * FROM urls_data WHERE local_url = '${local_url}'`
  );

  return find ? find : [];
}

export function addUrlsData(userData: Users, localUrl: string) {
  db.run("INSERT INTO urls_data (user_id, local_url) VALUES (?, ?)", [
    userData.id,
    localUrl,
  ]);
}

export function editUrlsData(localUrl: string, newUrl: string | null) {
  db.run(`UPDATE urls_data SET url = ? WHERE (local_url = "${localUrl}")`, [
    newUrl,
  ]);
}
