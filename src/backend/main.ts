import express from "express";
import path from "path";
import { getUrlsDataUrl, UrlsData } from "../db/database.ts";

export const domain = "f1002046.xsph.ru";

const app = express();
const port = 3000;
const delay = 5000;

app.use(express.json());

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
    try {
      res.json({ targetUrl: redirectData[0].url, delay: delay });
    } catch {
      res
        .status(400)
        .json({ error: "No redirect mapping found for this path" });
    }
  } else {
    res.status(404).json({ error: "No redirect mapping found for this path" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
