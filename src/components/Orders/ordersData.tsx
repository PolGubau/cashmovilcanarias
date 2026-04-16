export interface OrderItem {
  orderId: string;
  createdAt: string;
  status: "delivered" | "processing" | "on-hold" | "cancelled";
  total: string;
  title: string;
}

const ordersData: OrderItem[] = [
  {
    orderId: "234c56",
    createdAt: "18th May, 2022",
    status: "delivered",
    total: "$100",
    title: "Sunglasses",
  },
  {
    orderId: "234c56",
    createdAt: "18th May, 2022",
    status: "processing",
    total: "$100",
    title: "Watchs",
  },
  {
    orderId: "234c56",
    createdAt: "18th May, 2022",
    status: "delivered",
    total: "$100",
    title: "Cancelled",
  }
];

export default ordersData;
