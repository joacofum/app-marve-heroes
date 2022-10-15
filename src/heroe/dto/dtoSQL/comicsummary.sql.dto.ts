/* eslint-disable prettier/prettier */
import { IsString } from "class-validator";

export class ComicSummarySqlDTO {
  @IsString()
  resourceURI: string;

  @IsString()
  title: string;

  @IsString()
  description: string;
}
