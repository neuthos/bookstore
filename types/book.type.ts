import {Tags} from "./tags.type";

export interface BookData {
  uuid: string;
  title: string;
  author: string;
  cover_image: string;
  point: number;
  created_at: string;
  updated_at: string;
  tags: Tags[];
}
