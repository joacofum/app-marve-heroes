/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ComicSummaryDocument = ComicSummary & Document;

@Schema()
export class ComicSummary {
  @Prop()
  id: number;

  @Prop()
  description: string;

  @Prop()
  resourceURI: string;

}

export const ComicSummarySchema = SchemaFactory.createForClass(ComicSummary);