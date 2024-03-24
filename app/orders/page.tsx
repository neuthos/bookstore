/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import bookService, {OrderStatus} from "@/services/bookstore.service";
import {Order} from "@/types/order.type";
import {User} from "@/types/user.type";
import {Button} from "@nextui-org/button";
import {Card, CardBody} from "@nextui-org/card";
import {Chip} from "@nextui-org/chip";
import {Image} from "@nextui-org/image";
import {Tab, Tabs} from "@nextui-org/tabs";
import {Spinner} from "@nextui-org/spinner";
import React, {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {useRouter} from "next/navigation";

const item = {
  uuid: "af364182-0fa3-4dff-ac0a-7e450b0f62ef",
  title: "Blindness",
  author: "José Saramago",
  cover_image: "images/blindness.jpg",
  point: "1.55",
  created_at: "2024-03-23T14:13:08.817Z",
  updated_at: "2024-03-23T14:13:08.817Z",
  tags: [
    {
      uuid: "c97af90d-791b-42a2-94d7-0fe038307da6",
      name: "Education & Teaching",
    },
  ],
};
const Page = () => {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>("PENDING");
  const [loading, setLoading] = useState(true);
  const [orderOnLoading, setOrderOnLoading] = useState<string | null>("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [cookie, setCookie] = useCookies();

  const [user, setUser] = useState<User | null>(null);

  const fetchOrders = async () => {
    const data = await bookService.getOrders({
      userId: user?.uuid ?? "",
      status: selectedStatus,
    });
    setOrders(data);
    setLoading(false);
  };

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    setOrderOnLoading(orderId);
    const response = await bookService.updateOrder({orderId, status: status});
    if (!response) {
      setOrderOnLoading(null);
      return;
    }

    // revalidate user point
    const updatedUser = await bookService.getUser(user?.uuid || "");
    if (updatedUser) setCookie("user", JSON.stringify(updatedUser));
    setOrderOnLoading(null);
    setSelectedStatus(status);
  };

  const CtaByStatus: {[key: string]: (order: Order) => React.ReactNode} = {
    PENDING: (order) => (
      <div className="flex gap-x-2 items-center">
        <Button
          color="danger"
          size="sm"
          onClick={() => updateStatus(order.uuid, "FAILED")}
          isLoading={orderOnLoading === order.uuid}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          size="sm"
          onClick={() => updateStatus(order.uuid, "SUCCESS")}
          isLoading={orderOnLoading === order.uuid}
        >
          Pay Now
        </Button>
      </div>
    ),
    SUCCESS: (_) => (
      <Chip color="success" className="text-white">
        Success
      </Chip>
    ),
    FAILED: (_) => <Chip className="text-white">Failed</Chip>,
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchOrders();
    }
  }, [selectedStatus, user]);

  useEffect(() => {
    if (cookie?.user) {
      setUser(cookie?.user || null);
    } else {
      router.replace("/");
    }
  }, [cookie]);

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center gap-5">
        <h1 className={"font-bold text-[24px] text-center"}>Your Orders</h1>
        <Tabs
          key={"primary"}
          color={"primary"}
          aria-label="Order Status"
          radius="full"
          selectedKey={selectedStatus}
          onSelectionChange={(key) => setSelectedStatus(key as OrderStatus)}
        >
          <Tab key="PENDING" title="Pending" />
          <Tab key="SUCCESS" title="Success" />
          <Tab key="FAILED" title="Failed" />
        </Tabs>

        <div className="p-3 lg:p-10 w-[90%] lg:w-[600px] space-y-5">
          {loading ? (
            <div className="flex items-center justify-center">
              <Spinner />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex items-center justify-center">No data</div>
          ) : (
            orders.map((el, key) => (
              <Card key={key} shadow="sm" className="">
                <CardBody>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-x-4 h-[150px] w-full">
                      <Image
                        shadow="sm"
                        radius="lg"
                        alt={el.orderDetails[0].book.title}
                        className="w-full h-[150px]"
                        src={el.orderDetails[0].book.cover_image}
                      />
                      <div className="flex flex-col justify-between items-between h-full w-full ">
                        <h3 className="font-bold">{el.invoice_code}</h3>
                        <div className="space-y-1">
                          <p className="font-semibold">
                            {el.orderDetails[0].book.title}
                          </p>
                          <p className="text-default-500">
                            {el.orderDetails[0].book.author}
                          </p>
                        </div>
                        <div className="flex items-end justify-between w-full">
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-1 items-center justify-center">
                              {el.orderDetails[0].book.tags.map((tag) => (
                                <Chip key={el.uuid} variant="flat" size="sm">
                                  {tag.name}
                                </Chip>
                              ))}
                            </div>
                            <p className="font-bold text-[16px]">${el.total}</p>
                          </div>

                          {CtaByStatus[el.status](el)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
