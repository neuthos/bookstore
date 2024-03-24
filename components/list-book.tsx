"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import {useState, useEffect} from "react";
import {BookData} from "@/types/book.type";
import CardBook from "./card-book";
import InfiniteScroll from "react-infinite-scroll-component";
import bookService from "@/services/bookstore.service";
import {Spinner} from "@nextui-org/spinner";
import {Card} from "@nextui-org/card";
import {useSearchParams} from "next/navigation";
import {subtitle} from "./primitives";
import {Chip} from "@nextui-org/chip";

const ListBook = () => {
  const searchParams = useSearchParams();
  const queryTagStr: string = searchParams.get("t") ?? "";
  const querySearch: string = searchParams.get("s") ?? "";
  const [appliedTag, setAppliedTag] = useState<string>("");
  const [searched, setSearched] = useState<string>("");
  const [books, setBooks] = useState<BookData[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const take = 20;

  const fetchBooks = async (isMore = false, tags?: string, search?: string) => {
    try {
      setLoading(true);
      let dataToSkip = skip;
      const isNotFindMore = appliedTag !== tags || searched !== search;
      if (isNotFindMore) dataToSkip = 0;

      const response = await bookService.getBooks({
        skip: dataToSkip,
        tags,
        search,
      });

      setHasMore(response.hasMore);

      if (isNotFindMore || !isMore) {
        setSkip(0);
        setBooks(response.result);
      } else if (isMore) {
        setBooks((prevBooks) => [...prevBooks, ...response.result]);
        setSkip((prev) => prev + take);
      }

      setAppliedTag(tags || "");
      setSearched(search || "");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const queryTag = encodeURIComponent(queryTagStr.replace(/\s+/g, "-"));
    fetchBooks(false, queryTag, querySearch);
  }, [queryTagStr, querySearch]);

  return (
    <>
      {loading && (
        <div className="fixed top-[65px] z-50 w-full left-0 flex items-center justify-center">
          <Card className="px-10 py-2  rounded-[8px] border">
            <Spinner />
          </Card>
        </div>
      )}

      <h2 className={subtitle({class: ""})}>All Books</h2>
      {queryTagStr && (
        <>
          <div className="flex gap-x-2">
            {queryTagStr.split(",").map((el: string) => (
              <Chip key={el}>{el.replaceAll("-", " ")}</Chip>
            ))}
          </div>
        </>
      )}
      <InfiniteScroll
        dataLength={books.length}
        next={() => {
          const queryTag = encodeURIComponent(queryTagStr.replace(/\s+/g, "-"));
          fetchBooks(true, queryTag, querySearch);
        }}
        hasMore={hasMore}
        loader={
          <>
            <div className="flex items-center justify-center w-full gap-2 h-[330px] mt-2">
              {[1, 2, 3, 4].map((el) => (
                <Card
                  key={el}
                  shadow="sm"
                  isPressable
                  className="hover:bg-gray-200 dark:hover:bg-gray-800 w-full h-full flex items-center  justify-center"
                >
                  <Spinner />
                </Card>
              ))}
            </div>
          </>
        }
        scrollThreshold={0.8}
        endMessage={<p>No more books</p>}
        className="w-full p-5"
        style={{overflow: "visible"}}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {books.map((item: BookData, index: number) => (
            <div className="w-full" key={index}>
              <CardBook item={item} />
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </>
  );
};

export default ListBook;
