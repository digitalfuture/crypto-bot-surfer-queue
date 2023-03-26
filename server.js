import express from "express";
import queue from "./queue.js";
import cron from "node-cron";

const app = express();

let requestCount = 0;

app.use(express.json());

app.post("/queue", async (req, res) => {
  requestCount++;

  // Добавляем запрос в очередь
  const result$ = queue.add(req.body);

  // Отправляем клиенту ответ от целевого адреса, когда он будет готов
  result$.subscribe((result) => {
    res.send(result);
  });
});

app.get("/healthcheck", async (req, res) => {
  res.sendStatus(200);
});

// Reset request counter and log every minute
cron.schedule("* * * * *", () => {
  console.log(`Requests per minute: ${requestCount}`);
  requestCount = 0;
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
