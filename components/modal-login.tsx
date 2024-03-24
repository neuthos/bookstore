"use client";

import React, {useState} from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import {Button} from "@nextui-org/button";
import {Input} from "@nextui-org/input";
import bookService from "@/services/bookstore.service";
import {useCookies} from "react-cookie";

export default function ModalLogin() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const [_, setCookie] = useCookies(["user"]);

  const handleMemberJoin = async () => {
    setLoading(true);
    const response = await bookService.joinMember(username);
    if (response) setCookie("user", JSON.stringify(response));
    setLoading(false);
    onClose();
  };

  return (
    <>
      <Button size="sm" onPress={onOpen}>
        Join now
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Join Neubook member!
              </ModalHeader>
              <ModalBody>
                <Input
                  onChange={(e) => setUsername(e.target.value)}
                  type="email"
                  label="Username"
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  isLoading={loading}
                  disabled={!username}
                  color="primary"
                  onPress={handleMemberJoin}
                >
                  Join
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
