/* eslint-disable prettier/prettier */
import { IsInt, IsOptional, IsPositive, IsString } from "class-validator";
import { ComicSummaryEntity } from "src/heroe/databases/entities/comicsummary.entity";

export class ComicSqlDTO {
  @IsString()
  id: string;

  @IsInt()
  idComic: number;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsInt()
  @IsPositive()
  issueNumber: number;

  comicSummary: ComicSummaryEntity
}
