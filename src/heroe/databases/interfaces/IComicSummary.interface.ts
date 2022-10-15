/* eslint-disable prettier/prettier */
import { ObjectId } from "mongoose";

export interface IComicSummary {
  _id: ObjectId;
  id: number;
  description: string;
  resourceURI: string;
}
