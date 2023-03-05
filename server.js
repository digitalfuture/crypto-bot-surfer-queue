const express = require("express");
const Queue = require("./queue");

const app = express();
const queue = new Queue(1000);

app.use(express.json());

app.post("/tasks", async (req, res) => {
  const { task } = req.body;
  await queue.push(task);
  res.sendStatus(200);
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
