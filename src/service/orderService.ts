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

export const getOrdersByCustomer = async (
  customerId: number,
  offset: number,
  limit: number
): Promise<Order[]> => {
  return await orderRepository.getOrdersByCustomer(customerId, offset, limit);
};
