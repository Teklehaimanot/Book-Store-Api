import express from "express";
import bookRoutes from "./route/bookRoutes";
import cutomerRoutes from "./route/cutomerRoute";
import orderRoutes from "./route/orderRoutes";
require("dotenv/config");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/v1/books", bookRoutes);
app.use("/api/v1/customers", cutomerRoutes);
app.use("/api/v1/orders", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
