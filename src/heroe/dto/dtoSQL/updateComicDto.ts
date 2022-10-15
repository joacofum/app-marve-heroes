/* eslint-disable prettier/prettier */
import { PartialType } from "@nestjs/mapped-types";
import { ComicSqlDTO } from "./comic.sql.dto";

export class UpdateComicDto extends PartialType(ComicSqlDTO) {}
