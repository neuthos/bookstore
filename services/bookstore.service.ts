import {BookData} from "@/types/book.type";
import {Order} from "@/types/order.type";
import {Tags} from "@/types/tags.type";
import {User} from "@/types/user.type";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type OrderStatus = "PENDING" | "SUCCESS" | "FAILED";

const bookService = {
  getTags: async (): Promise<Tags[]> => {
    const request = await fetch(`${API_URL}/api/tags`);
    if (!request.ok) {
      throw new Error("Failed to fetch data");
    }
    const response = await request.json();

    return response.data || [];
  },

  getBooks: async (payload: {
    skip: number;
    tags?: string;
    search?: string;
  }): Promise<{result: BookData[]; hasMore: boolean}> => {
    const request = await fetch(
      `${API_URL}/api/books?skip=${payload.skip}&tags=${
        payload.tags || ""
      }&search=${payload.search || ""}`,
      {cache: "no-cache"}
    );
    if (!request.ok) {
      throw new Error("Failed to fetch data");
    }

    const response = await request.json();

    await sleep(1500);
    return response.data || [];
  },

  getUser: async (
    userId: string
  ): Promise<{
    result: BookData[];
    hasMore: boolean;
  }> => {
    const request = await fetch(`${API_URL}/api/users/${userId}`, {
      cache: "no-cache",
    });

    if (!request.ok) {
      throw new Error("Failed to fetch data");
    }

    const response = await request.json();
    return response.data || null;
  },

  joinMember: async (username: string): Promise<User> => {
    const request = await fetch(`${API_URL}/api/users/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({username}),
    });

    if (!request.ok) {
      throw new Error("Failed to fetch data");
    }
    const response = await request.json();

    await sleep(1500);
    return response.data || null;
  },

  getOrders: async (payload: {
    userId: string;
    status: OrderStatus;
  }): Promise<Order[]> => {
    const request = await fetch(
      `${API_URL}/api/orders/user/${payload.userId}?status=${payload.status}`,
      {cache: "no-cache"}
    );

    if (!request.ok) {
      throw new Error("Failed to fetch data");
    }

    const response = await request.json();

    await sleep(1500);
    return response.data || [];
  },

  createOrder: async (body: {
    userId: string;
    bookId: string;
  }): Promise<{data: Order; msg: string} | null> => {
    const request = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({...body}),
    });

    if (!request.ok) {
      const response = await request.json();
      window.alert(response.msg);
      return null;
    }

    const response = await request.json();

    await sleep(1500);
    return response.data || [];
  },

  updateOrder: async (payload: {
    orderId: string;
    status: OrderStatus;
  }): Promise<{data: Order; msg: string} | null> => {
    const request = await fetch(
      `${API_URL}/api/orders/${payload.orderId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({status: payload.status}),
      }
    );

    if (!request.ok) {
      const response = await request.json();
      window.alert(response.msg);
      return null;
    }

    const response = await request.json();

    await sleep(1500);
    return response.data || [];
  },
};

export default bookService;
