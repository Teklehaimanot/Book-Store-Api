import Customer from "../entity/Customer";
import * as customerRepository from "../repository/customerRepository";

export const createCustomer = async (
  name: string,
  email: string,
  address: string,
  phone: string
): Promise<Customer> => {
  return await customerRepository.createCustomer(name, email, address, phone);
};

export const getAllCustomers = async (): Promise<Customer[]> => {
  return await customerRepository.getAllCustomers();
};

export const getCustomerById = async (
  customerId: string
): Promise<Customer | null> => {
  return await customerRepository.getCustomerById(customerId);
};

export const updateCustomer = async (
  customerId: string,
  name: string,
  email: string,
  address: string,
  phone: string
): Promise<Customer | null> => {
  return await customerRepository.updateCustomer(
    customerId,
    name,
    email,
    address,
    phone
  );
};

export const deleteCustomer = async (customerId: string): Promise<void> => {
  await customerRepository.deleteCustomer(customerId);
};
