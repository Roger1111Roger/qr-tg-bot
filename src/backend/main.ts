import express from "express";
import path from "path";
import { getUrlsDataUrl, UrlsData } from "../db/database.ts";

const app = express();
const port = 3000;
const delay = 5000;

app.use(express.json());

//const redirectMap: any = {
//  "/path/targetA": { targetUrl: "https://www.youtube.com/", delay: 5000 },
//  "/path/pathB": {
//    targetUrl: "http://localhost:${port}/targetB1",
//    delay: 3000,
//  },
//  "/path/pathC": {
//    targetUrl: "http://localhost:${port}/targetC1",
//    delay: 4000,
//  },
//};

app.get("/path/*", (req, res) => {
  console.log(req.params);

  res.sendFile(path.resolve(process.cwd(), "index.html"));
});

app.post("/get-redirect-url", async (req, res) => {
  const { path } = req.body;
  const redirectData: UrlsData[] | undefined = await getUrlsDataUrl(
    path.replace("/path", "")
  );

  if (redirectData) {
    res.json({ targetUrl: redirectData[0].url, delay: delay });
  } else {
    res.status(404).json({ error: "No redirect mapping found for this path" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
