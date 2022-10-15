/* eslint-disable prettier/prettier */
import { ObjectId } from "mongoose";

export interface IComic {
  _id: ObjectId;
  id: number;
  title: string;
  issueNumber: number;
  comicSummaryId: ObjectId;
}
