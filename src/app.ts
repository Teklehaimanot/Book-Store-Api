import express from "express";
import bodyParser from "body-parser";
import bookRoutes from "./route/bookRoutes";
require("dotenv/config");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/v1/books", bookRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
