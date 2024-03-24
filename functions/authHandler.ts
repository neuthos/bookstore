import {User} from "@/types/user.type";
import Cookies from "js-cookie";

export const setUser = (userData: User) => {
  Cookies.set("user", JSON.stringify(userData));
};

export const getUser = (): User | null => {
  const userDataStr: string = Cookies.get("user") ?? "";
  try {
    const user: User = JSON.parse(userDataStr);
    return user;
  } catch (error) {
    return null;
  }
};

export const logoutUser = () => {
  Cookies.remove("user");
};
