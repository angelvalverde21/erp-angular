import { Color } from "../views/dashboard/colors/color.interface";
import { Attribute } from "./attribute.interface";
import { Category } from "./category.interface";
import { Size } from "./size.interface";
import { Image } from "./image.interface";

export interface Product {
  id: number;               // bigint en MySQL → number en TS
  status: 0 | 1 | 2 | 3;   // tinyint con valores específicos
  name?: string | null;     // varchar, nullable
  slug: string;             // varchar, no nullable
  body?: string | null;     // text, nullable
  price?: number | null;    // decimal, nullable
  user_id?: number | null;  // bigint, nullable
  store_id?: number | null; // bigint, nullable
  created_at?: string | null; // timestamp, nullable → se puede usar string o Date
  updated_at?: string | null; // timestamp
  category?: Category;
  sizes: Size[];
  image?: Image | null;
  attributes?: Attribute[];
  colors: Color[];
}