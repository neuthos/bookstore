import ListBook from "@/components/list-book";
import Sidebar from "@/components/sidebar";
import bookService from "@/services/bookstore.service";

export default async function Home() {
  const tags = await bookService.getTags();

  return (
    <div className="flex w-screen ">
      <div className="flex-none w-64 fixed overflow-y-auto max-h-full">
        <Sidebar tags={tags} />
      </div>
      <div className="ml-64 w-full">
        <div className="w-full">
          <ListBook />
        </div>
      </div>
    </div>
  );
}
