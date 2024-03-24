"use client";
import {Tags} from "@/types/tags.type";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Button} from "@nextui-org/button";
import {CheckboxGroup, Checkbox} from "@nextui-org/checkbox";
import {Input} from "@nextui-org/input";
import {useRouter, useSearchParams} from "next/navigation";
import {useState} from "react";

const Sidebar = ({tags}: {tags: Tags[]}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryTag: string = searchParams.get("t") ?? "";
  const defaultTags = convertUrlToTags(queryTag);
  const [search, setSearch] = useState("");

  function convertTagsToUrl(tags: string[]) {
    const formattedTags = tags.map((tag) =>
      encodeURIComponent(tag.replace(/\s+/g, "-"))
    );
    return formattedTags.join(",");
  }

  function convertUrlToTags(urlParams: string) {
    const encodedTags = urlParams.split(",");
    const decodedTags = encodedTags.map((tag) =>
      decodeURIComponent(tag).replace(/-/g, " ")
    );
    return decodedTags;
  }

  function handleSelectTag(tags: string[]) {
    const tagQuery = convertTagsToUrl(
      tags.filter((tagName: string) => !!tagName)
    );
    let urlQuery = `?t=${tagQuery}`;

    const searchQuery = searchParams.get("s");
    if (searchQuery) urlQuery += `&s=${searchQuery}`;

    router.push(urlQuery, {
      scroll: false,
    });
  }

  function handleSearchName() {
    let urlQuery = `?s=${search}`;
    const tagQuery = searchParams.get("t");

    if (tagQuery) {
      const searchQuery = encodeURIComponent(tagQuery.replace(/\s+/g, "-"));
      urlQuery += `&t=${searchQuery}`;
    }

    router.push(urlQuery, {
      scroll: false,
    });
  }

  return (
    <div className="relative p-3 max-h-full">
      <div className="mb-3 ">
        <Input
          type="search"
          size="sm"
          placeholder="Search by name"
          onChange={(e) => setSearch(e.target.value)}
          endContent={
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onClick={handleSearchName}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </Button>
          }
        />
      </div>
      <CheckboxGroup
        label="Select categories"
        onChange={(val) => {
          handleSelectTag(val as string[]);
        }}
        defaultValue={defaultTags}
      >
        {tags &&
          tags.map((tag, key: number) => (
            <Checkbox key={key} value={tag.name}>
              {tag.name}
            </Checkbox>
          ))}
      </CheckboxGroup>
    </div>
  );
};

export default Sidebar;
