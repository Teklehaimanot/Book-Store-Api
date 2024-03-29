import { Request, Response } from "express";
import * as orderService from "../service/orderService";

export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { customerId, bookIds, quantities } = req.body;
  try {
    if (!customerId || !bookIds.length || !quantities.length) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const createdOrder = await orderService.createOrder(
      customerId,
      bookIds,
      quantities
    );
    res.status(201).json(createdOrder);
  } catch (error: any) {
    if (error.message.includes("not found")) {
      res.status(404).json({ error: error.message });
    } else if (error.message.includes("Book")) {
      res.status(404).json({ error: error.message });
    } else if (error.message.includes("not have enough points")) {
      res.status(404).json({ error: error.message });
    } else {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const cancelOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  const orderId = parseInt(req.params.orderId);
  if (!orderId || isNaN(orderId) || orderId <= 0) {
    res.status(400).json({ error: "Invalid orderId" });
    return;
  }
  try {
    const order = await orderService.getOrderById(orderId);
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    if (order.status === "Cancelled") {
      res.status(400).json({ error: "Order is already cancelled" });
      return;
    }

    await orderService.cancelOrder(orderId);
    res.status(204).json({ message: "Order cancellation successful" }); // No content
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getOrderById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const orderId = parseInt(req.params.orderId);
  try {
    const order = await orderService.getOrderById(orderId);
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getOrdersByCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  const customerId = parseInt(req.params.customerId);
  const offset = parseInt(req.query.offset as string) || 0;
  const limit = parseInt(req.query.limit as string) || 10;
  try {
    const orders = await orderService.getOrdersByCustomer(
      customerId,
      offset,
      limit
    );
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
