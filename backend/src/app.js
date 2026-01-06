import express from "express";
import cors from "cors";
import routes from "./routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Campus Resource Optimizer backend is running"
  });
});

app.use("/api", routes);

export default app;
