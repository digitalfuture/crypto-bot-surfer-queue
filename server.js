import express from "express";
import queue from "./queue.js";
import cron from "node-cron";

const isDebugMode = JSON.parse(process.env.DEBUG_MODE);

const app = express();

let requestCount = 0;

app.use(express.json());

app.post("/queue", async (req, res) => {
  isDebugMode && console.log(`Request: ${req.headers}`);

  requestCount++;

  const result$ = queue.add(req.body);

  result$.subscribe((result) => {
    res.send(result);
  });
});

app.get("/healthcheck", async (req, res) => {
  res.sendStatus(200);
});

cron.schedule("* * * * *", () => {
  console.log(`Requests per minute: ${requestCount}`);
  requestCount = 0;
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
