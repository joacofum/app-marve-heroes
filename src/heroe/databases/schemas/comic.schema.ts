/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { ComicSummary } from "./commicsummary.schema";

export type ComicDocument = Comic & Document;

@Schema()
export class Comic {
  @Prop()
  id: number;

  @Prop()
  title: string;

  @Prop()
  issueNumber: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: ComicSummary.name})
  comicSummaryId: number;

}

export const ComicSchema = SchemaFactory.createForClass(Comic);
