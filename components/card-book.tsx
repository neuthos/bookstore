"use client";

import {BookData} from "@/types/book.type";
import {Card, CardBody, CardFooter} from "@nextui-org/card";
import {Chip} from "@nextui-org/chip";
import {Image} from "@nextui-org/image";
import {useState} from "react";
import ModalDetail from "./modal-detail";

const CardBook = ({item}: {item: BookData}) => {
  const [selectedBook, setSelectedBook] = useState<null | BookData>(null);

  const openDetail = () => {
    setSelectedBook(item);
  };

  return (
    <>
      <Card
        shadow="sm"
        key={item.title}
        isPressable
        onPress={() => openDetail()}
        className="hover:bg-gray-200 dark:hover:bg-gray-800 w-full"
      >
        <CardBody className="flex items-center justify-center">
          <Image
            shadow="sm"
            radius="lg"
            alt={item.title}
            className="w-full h-[200px]"
            src={item.cover_image}
          />
        </CardBody>
        <div className="flex flex-col items-center justify-center w-full text-small">
          <p className="text-center font-semibold h-[40px]">{item.title}</p>
          <div className="flex flex-wrap gap-1 items-center justify-center px-1 my-1">
            {item.tags.map((el) => (
              <Chip key={el.uuid} variant="flat" size="sm">
                {el.name}
              </Chip>
            ))}
          </div>
        </div>
        <CardFooter className="text-xs justify-between">
          <p className="text-default-500">{item.author}</p>
          <p className="font-bold">${item.point}</p>
        </CardFooter>
      </Card>

      {selectedBook && (
        <ModalDetail
          onModalClose={() => setSelectedBook(null)}
          item={selectedBook}
        />
      )}
    </>
  );
};

export default CardBook;
