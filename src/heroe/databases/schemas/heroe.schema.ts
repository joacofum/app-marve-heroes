/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Comic } from './comic.schema';

export type PersonajeDocument = Heroe & Document;

@Schema()
export class Heroe {
  @Prop()
  id: number;
  
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({ type: {} })
  image: {
    path: string;
    extension: string;
  };

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Comic.name}])   
  idComics: number; 
}

export const HeroeSchema = SchemaFactory.createForClass(Heroe);
