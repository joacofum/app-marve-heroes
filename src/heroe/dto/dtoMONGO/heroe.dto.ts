/* eslint-disable prettier/prettier */
import { ObjectId } from "mongoose";

export class HeroeDTO {
  id: number;
  name: string;
  description: string;
  image: {
    path: string;
    extension: string;
  };
  idComics: ObjectId[];
}
