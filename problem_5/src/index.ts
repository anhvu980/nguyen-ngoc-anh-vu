import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import resourcesRouter from "./routes/resources";

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use("/api/resources", resourcesRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Express.js backend with TypeScript!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
