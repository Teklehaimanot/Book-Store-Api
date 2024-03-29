import { Request, Response } from "express";
import * as customerService from "../service/customerService";
import Customer from "../entity/Customer";

export const createCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, address, phone, password } = req.body;
  try {
    if (!name || !email || !address || !phone || !password) {
      res.status(400).json({ eror: "All fields are required" });
      return;
    }
    const initialPoints: number = 100;
    const createdCustomer: Customer = await customerService.createCustomer(
      name,
      email,
      address,
      phone,
      password,
      initialPoints
    );
    res.status(201).json(createdCustomer);
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllCustomers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const customers: Customer[] = await customerService.getAllCustomers();
    res.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCustomerById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const customerId: number = parseFloat(req.params.customerId);
  try {
    const customer: Customer | null = await customerService.getCustomerById(
      customerId
    );
    if (!customer) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }
    res.json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const loginCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }
    const customer = await customerService.loginCustomer(email, password);
    if (customer) {
      res.json(customer); // Return customer data on successful login
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error logging in customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  const customerId: string = req.params.customerId;
  const { name, email, address, phone, password } = req.body;
  try {
    if (!name || !email || !address || !phone) {
      res.status(400).json({ eror: "All fields are required" });
      return;
    }
    const updatedCustomer: Customer | null =
      await customerService.updateCustomer(
        customerId,
        name,
        email,
        address,
        phone,
        password
      );
    if (!updatedCustomer) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }
    res.json(updatedCustomer);
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  const customerId: number = parseFloat(req.params.customerId);
  try {
    const customer: Customer | null = await customerService.getCustomerById(
      customerId
    );
    if (!customer) {
      res.status(404).json({ error: "Customer not found" });
      return;
    }
    await customerService.deleteCustomer(customerId);
    res.status(204).send(); // No content
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
