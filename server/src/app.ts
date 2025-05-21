import express, { type Application } from "express";

const port = process.env.SERVER_API_PORT || 3000;
const app: Application = express();

app.use("/", async (_req, res) => {
  res.json({ hello: "word!" });
});

app.use("/hello", (_req, res) => {
  res.json({ foo: "bar" });
});

app.listen(port);
