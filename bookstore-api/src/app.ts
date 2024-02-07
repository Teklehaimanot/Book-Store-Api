import express from "express";
import bookRoutes from "./route/bookRoutes";
import cutomerRoutes from "./route/cutomerRoute";
import orderRoutes from "./route/orderRoutes";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

require("dotenv/config");

const app = express();
const PORT = process.env.PORT || 5000;

try {
  const swaggerCustomerDocument = YAML.load("./swagger-customer.yaml");
  const swaggerBookDocument = YAML.load("./swagger-book.yaml");

  app.use(
    "/api-docs/customers",
    swaggerUi.serve,
    (req: any, res: any, next: any) => {
      swaggerUi.setup(swaggerCustomerDocument)(req, res, next);
    }
  );

  app.use(
    "/api-docs/books",
    swaggerUi.serve,
    (req: any, res: any, next: any) => {
      swaggerUi.setup(swaggerBookDocument)(req, res, next);
    }
  );
} catch (error) {
  console.error("Error loading Swagger YAML files:", error);
}

app.use(express.json());

app.use("/api/v1/books", bookRoutes);
app.use("/api/v1/customers", cutomerRoutes);
app.use("/api/v1/orders", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
