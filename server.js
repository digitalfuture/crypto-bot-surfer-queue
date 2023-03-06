const express = require("express");
const Queue = require("./queue");
const cron = require("node-cron");

const interval = JSON.parse(process.env.INTERVAL);

const app = express();
const queue = new Queue(interval);

let requestCount = 0;

app.use(express.json());

app.post("/tasks", async (req, res) => {
  console.log(`Request: ${requestCount}`);
  requestCount++;
  const { task } = req.body;
  await queue.push(task);
  res.sendStatus(200);
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
