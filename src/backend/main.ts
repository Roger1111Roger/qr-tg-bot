import express from "express";
import path from "path";
import { getUrlsDataUrl, UrlsData } from "../db/database.ts";

const app = express();
const port = 3000;
const delay = 5000;

//export const domain = "f1002046.xsph.ru";
export const domain = `localhost:${port}`;

app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on http://${domain}`);
});

app.get("/path/*", (req, res) => {
  console.log(req.params);

  res.sendFile(path.resolve(process.cwd(), "index.html"));
});

app.get("/news", (req, res) => {
  console.log(req.params);

  res.json([
    {
      title: "News 1",
      description: "Description 1",
      imageUrl: "https://picsum.photos/200/300",
      text: "Text 1",
    },
    {
      title: "News 2",
      description: "Description 2",
      imageUrl: "https://picsum.photos/200/301",
      text: "Text 2",
    },
    {
      title: "News 3",
      description: "Description 3",
      imageUrl: "https://picsum.photos/200/302",
      text: "Text 3",
    },
    {
      title: "News 4",
      description: "Description 4",
      imageUrl: "https://picsum.photos/200/304",
      text: "Text 4",
    },
    {
      title: "News 5",
      description: "Description 5",
      imageUrl: "https://picsum.photos/200/305",
      text: "Text 5",
    },
    {
      title: "News 6",
      description: "Description 6",
      imageUrl: "https://picsum.photos/200/306",
      text: "Text 6",
    },
  ]);
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
