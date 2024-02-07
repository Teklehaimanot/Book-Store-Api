class Order {
  constructor(
    public id: number,
    public customerId: number,
    public totalAmount: number,
    public status: string,
    public bookIds: number[],
    public quantities: number[]
  ) {}
}

export default Order;
