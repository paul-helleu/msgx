import express, { type Application } from 'express'
const app: Application = express();

app.use("/hello", (_req, res) => {
    res.json({ foo: "bar" });
});

app.listen(3300);