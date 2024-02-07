import express from "express";
import * as customerController from "../controller/cutomerController";

const router = express.Router();

router.post("/", customerController.createCustomer);
router.get("/", customerController.getAllCustomers);
router.get("/:customerId", customerController.getCustomerById);
router.post("/login", customerController.loginCustomer);
router.put("/:customerId", customerController.updateCustomer);
router.delete("/:customerId", customerController.deleteCustomer);

export default router;
