import Order from "../entity/Order";
import * as orderRepository from "../repository/orderRepository";

export const createOrder = async (
  customerId: number,
  bookIds: number[],
  quantities: number[]
): Promise<Order> => {
  return await orderRepository.createOrder(customerId, bookIds, quantities);
};

export const cancelOrder = async (orderId: number): Promise<void> => {
  await orderRepository.cancelOrder(orderId);
};

export const getAllOrders = async (): Promise<Order[]> => {
  return await orderRepository.getAllOrders();
};

export const getOrderById = async (orderId: number): Promise<Order | null> => {
  try {
    const order = await orderRepository.getOrderById(orderId);
    return order;
  } catch (error: any) {
    throw new Error("Error fetching order: " + error.message);
  }
};

export const getOrdersByCustomer = async (
  customerId: number,
  offset: number,
  limit: number
): Promise<Order[]> => {
  return await orderRepository.getOrdersByCustomer(customerId, offset, limit);
};
