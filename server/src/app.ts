import express, { type Application } from 'express'
import User from './database/models/User';

const port = process.env.SERVER_PORT || 3300;
const app: Application = express();

app.use("/", async (_req, res) => {
    const john = await User.create({ username: 'John Doe' });
    console.log(john.toJSON());
    res.json({ hello: "word!" });
});

app.use("/hello", (_req, res) => {
    res.json({ foo: "bar" });
});

app.listen(port);