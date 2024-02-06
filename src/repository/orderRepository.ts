import { Pool } from "pg";
import Order from "../entity/Order";
import config from "../config";

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
    const customerQuery = "SELECT id FROM customers WHERE id = $1";
    const customerResult = await client.query(customerQuery, [customerId]);
    if (customerResult.rows.length === 0) {
      throw new Error(`Customer with ID ${customerId} not found`);
    }

    let totalAmount: number = 0;
    for (let i = 0; i < bookIds.length; i++) {
      const bookId = bookIds[i];
      const quantity = quantities[i];

      // Check if book exists
      const bookQuery = "SELECT point FROM books WHERE id = $1";
      const bookResult = await client.query(bookQuery, [bookId]);
      if (bookResult.rows.length === 0) {
        throw new Error(`Book with ID ${bookId} not found`);
      }

      const bookPrice = parseFloat(bookResult.rows[0].point);
      totalAmount += bookPrice * quantity;
    }

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
