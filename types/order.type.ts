import {BookData} from "./book.type";
import {User} from "./user.type";

export interface OrderDetail {
  uuid: string;
  order_id: string;
  book: BookData;
  book_price: number;
  created_at: Date;
  updated_at: Date;
}

export interface Order {
  uuid: string;

  user: User;

  invoice_code: string;

  total: number;

  status: string;
  is_paid: boolean;

  created_at: Date;

  updated_at: Date;

  orderDetails: OrderDetail[];
}
