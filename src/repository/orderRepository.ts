import { Pool } from "pg";
import Order from "../entity/Order";
import config from "../config";
import * as customerRepository from "../repository/customerRepository";
import * as bookRepository from "../repository/bookRepository";

const pool = new Pool(config.db);

export const createOrder = async (
  customerId: number,
  bookIds: number[],
  quantities: number[]
): Promise<Order> => {
  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");

    // Check if customer exists
    const customer = await customerRepository.getCustomerById(customerId);
    console.log(customer);
    if (!customer) {
      throw new Error(`Customer with ID ${customerId} not found`);
    }

    let totalAmount: number = 0;
    for (let i = 0; i < bookIds.length; i++) {
      const bookId = bookIds[i];
      const quantity = quantities[i];

      // Check if book exists
      const book = await bookRepository.getBookById(bookId);
      if (!book) {
        throw new Error(`Book with ID ${bookId} not found`);
      }

      const bookPrice = book.point;
      totalAmount += bookPrice * quantity;
    }

    // Check if customer has enough points
    if (customer.initialpoints < totalAmount) {
      throw new Error(
        `Customer does not have enough points to make the purchase`
      );
    }

    // Deduct points from customer's account
    const remainingPoints = customer.initialpoints - totalAmount;
    console.log(customer.initialpoints, totalAmount);
    await customerRepository.updateCustomerPoints(customerId, remainingPoints);

    const orderQuery =
      "INSERT INTO orders (customer_id, total_amount, status) VALUES ($1, $2, $3) RETURNING id";
    const orderValues = [customerId, totalAmount, "Pending"];
    const orderResult = await client.query(orderQuery, orderValues);
    const orderId = orderResult.rows[0].id;

    const orderDetailsQuery =
      "INSERT INTO order_details (order_id, book_id, quantity) VALUES ($1, $2, $3)";
    for (let i = 0; i < bookIds.length; i++) {
      const orderDetailsValues = [orderId, bookIds[i], quantities[i]];
      await client.query(orderDetailsQuery, orderDetailsValues);
    }

    await client.query("COMMIT");

    return {
      id: orderId,
      customerId,
      totalAmount,
      status: "Pending",
      bookIds,
      quantities,
    };
  } catch (error: any) {
    if (client) {
      await client.query("ROLLBACK");
    }
    throw new Error("Error creating order: " + error.message);
  } finally {
    if (client) {
      client.release();
    }
  }
};

export const cancelOrder = async (orderId: number): Promise<void> => {
  try {
    await pool.query("UPDATE orders SET status = $1 WHERE id = $2", [
      "Cancelled",
      orderId,
    ]);
  } catch (error: any) {
    throw new Error("Error cancelling order: " + error.message);
  }
};

export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const { rows } = await pool.query("SELECT * FROM orders");
    return rows;
  } catch (error: any) {
    throw new Error("Error fetching orders: " + error.message);
  }
};

export const getOrderById = async (orderId: number): Promise<Order | null> => {
  try {
    const query = "SELECT * FROM orders WHERE id = $1";
    const { rows } = await pool.query(query, [orderId]);
    return rows.length ? rows[0] : null;
  } catch (error: any) {
    throw new Error("Error fetching order: " + error.message);
  }
};

export const getOrdersByCustomer = async (
  customerId: number,
  offset: number,
  limit: number
): Promise<Order[]> => {
  try {
    const query =
      "SELECT * FROM orders WHERE customer_id = $1 ORDER BY id DESC LIMIT $2 OFFSET $3";
    const values = [customerId, limit, offset];
    const { rows } = await pool.query(query, values);
    return rows;
  } catch (error: any) {
    throw new Error("Error fetching orders: " + error.message);
  }
};
