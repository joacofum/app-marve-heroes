/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  Relation,
} from "typeorm";
import { ComicEntity } from "./comic.entity";

@Entity({ name: "comic_summary" })
export class ComicSummaryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({nullable: true, length:2000})
  description: string;

  @Column()
  resourceURI: string;

  @OneToOne(() => ComicEntity, (comic) => comic.comicSummary)
  comic: Relation<ComicEntity>;
}
