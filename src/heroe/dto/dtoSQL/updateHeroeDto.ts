/* eslint-disable prettier/prettier */
import { PartialType } from "@nestjs/mapped-types";
import { HeroeSqlDTO } from "./heroe.sql.dto";

export class UpdateHeroeDto extends PartialType(HeroeSqlDTO) {}