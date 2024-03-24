"use client";

import React, {useEffect, useState} from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import {BookData} from "@/types/book.type";
import {Button} from "@nextui-org/button";
import {Image} from "@nextui-org/image";
import {Chip} from "@nextui-org/chip";
import {useCookies} from "react-cookie";
import ModalLogin from "./modal-login";
import {User} from "@/types/user.type";
import {useRouter} from "next/navigation";
import bookService from "@/services/bookstore.service";

export default function ModalDetail({
  item,
  onModalClose,
}: {
  item: BookData;
  onModalClose: () => void;
}) {
  const router = useRouter();
  const [cookie] = useCookies();
  const [user, setUser] = useState<User | null>(null);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [loadingOrder, setLoadingOrder] = useState(false);

  const handleOrder = async () => {
    setLoadingOrder(true);
    const response = await bookService.createOrder({
      bookId: item.uuid,
      userId: user?.uuid ?? "",
    });

    setLoadingOrder(false);
    if (response) router.push("/orders");
  };
  useEffect(() => {
    if (item) onOpen();
  }, [item, onOpen]);

  useEffect(() => {
    setUser(cookie?.user || null);
  }, [cookie]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={(val) => {
          onModalClose();
          onOpenChange();
        }}
        placement={"bottom-center"}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {item.title}
              </ModalHeader>
              <ModalBody className="flex flex-col items-center justify-center">
                <Image
                  shadow="sm"
                  radius="lg"
                  alt={item.title}
                  className="w-full h-[200px]"
                  src={item.cover_image}
                />

                <h3 className="font-bold">{item.title}</h3>

                <div className="flex flex-wrap gap-1 items-center justify-center px-1 my-1">
                  {item.tags.map((el) => (
                    <Chip key={el.uuid} variant="flat" size="sm">
                      {el.name}
                    </Chip>
                  ))}
                </div>

                <p className="text-default-500"> {item.author}</p>
                <p className="font-bold">${item.point}</p>
                {user ? (
                  <Button
                    onClick={handleOrder}
                    size="lg"
                    color="primary"
                    className="mb-5"
                    isLoading={loadingOrder}
                  >
                    Buy now
                  </Button>
                ) : (
                  <div className="mb-5">
                    <ModalLogin />
                  </div>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
