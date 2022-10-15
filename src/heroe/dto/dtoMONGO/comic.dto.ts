/* eslint-disable prettier/prettier */

import { ObjectId } from "mongoose";

export class ComicDTO {
  id: number;
  title: string;
  issueNumber: number;
  description: string;
  comicSummaryId: ObjectId;
}
