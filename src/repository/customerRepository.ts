import { Pool } from "pg";
import Customer from "../entity/Customer";
import config from "../config";

const pool = new Pool(config.db);

export const createCustomer = async (
  name: string,
  email: string,
  address: string,
  phone: string
): Promise<Customer> => {
  try {
    const query =
      "INSERT INTO customers (name, email, address, phone) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [name, email, address, phone];
    const { rows } = await pool.query(query, values);
    return rows[0];
  } catch (error: any) {
    throw new Error("Error creating customer: " + error.message);
  }
};

export const getAllCustomers = async (): Promise<Customer[]> => {
  try {
    const { rows } = await pool.query("SELECT * FROM customers");
    return rows;
  } catch (error: any) {
    throw new Error("Error fetching customers: " + error.message);
  }
};

export const getCustomerById = async (
  customerId: string
): Promise<Customer | null> => {
  try {
    const query = "SELECT * FROM customers WHERE id = $1";
    const { rows } = await pool.query(query, [customerId]);
    return rows[0] || null;
  } catch (error: any) {
    throw new Error("Error fetching customer: " + error.message);
  }
};

export const updateCustomer = async (
  customerId: string,
  name: string,
  email: string,
  address: string,
  phone: string
): Promise<Customer | null> => {
  try {
    const query =
      "UPDATE customers SET name = $1, email = $2, address = $3, phone = $4 WHERE id = $5 RETURNING *";
    const values = [name, email, address, phone, customerId];
    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  } catch (error: any) {
    throw new Error("Error updating customer: " + error.message);
  }
};

export const deleteCustomer = async (customerId: string): Promise<void> => {
  try {
    const query = "DELETE FROM customers WHERE id = $1";
    await pool.query(query, [customerId]);
  } catch (error: any) {
    throw new Error("Error deleting customer: " + error.message);
  }
};
