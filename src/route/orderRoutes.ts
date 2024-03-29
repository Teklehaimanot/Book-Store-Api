import express from "express";
import * as orderController from "../controller/orderController";

const router = express.Router();

router.post("/", orderController.createOrder);
router.put("/:orderId/cancel", orderController.cancelOrder);
router.get("/", orderController.getAllOrders);
router.get("/:orderId", orderController.getOrderById);
router.get("/customer/:customerId", orderController.getOrdersByCustomer);

export default router;
