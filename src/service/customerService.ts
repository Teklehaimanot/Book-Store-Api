import Customer from "../entity/Customer";
import * as customerRepository from "../repository/customerRepository";

export const createCustomer = async (
  name: string,
  email: string,
  address: string,
  phone: string,
  password: string
): Promise<Customer> => {
  return await customerRepository.createCustomer(
    name,
    email,
    address,
    phone,
    password
  );
};

export const getAllCustomers = async (): Promise<Customer[]> => {
  return await customerRepository.getAllCustomers();
};

export const getCustomerById = async (
  customerId: string
): Promise<Customer | null> => {
  return await customerRepository.getCustomerById(customerId);
};

export const loginCustomer = async (
  email: string,
  password: string
): Promise<Customer | null> => {
  try {
    const customer = await customerRepository.loginCustomer(email, password);
    return customer;
  } catch (error: any) {
    throw new Error("Error logging in customer: " + error.message);
  }
};

export const updateCustomer = async (
  customerId: string,
  name: string,
  email: string,
  address: string,
  phone: string,
  password: string
): Promise<Customer | null> => {
  return await customerRepository.updateCustomer(
    customerId,
    name,
    email,
    address,
    phone,
    password
  );
};

export const deleteCustomer = async (customerId: string): Promise<void> => {
  await customerRepository.deleteCustomer(customerId);
};
