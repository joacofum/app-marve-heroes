/* eslint-disable prettier/prettier */
import { IsArray, IsInt, IsString } from "class-validator";
import { ComicEntity } from "src/heroe/databases/entities/comic.entity";

export class HeroeSqlDTO {
  @IsInt()
  heroeId: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  path: string;

  @IsString()
  extension: string;
  
  @IsArray()
  comics: ComicEntity[];

}
