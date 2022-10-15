/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToOne,
  JoinColumn,
  Relation,
} from "typeorm";
import { ComicSummaryEntity } from "./comicsummary.entity";
import { HeroeEntity } from "./heroe.entity";

@Entity({ name: "comic" })
export class ComicEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  idComic: number;

  @Column()
  title: string;

  @Column()
  issueNumber: number;

  @ManyToMany(() => HeroeEntity, (heroe) => heroe.comics)
  heroes: HeroeEntity[];

  @OneToOne(() => ComicSummaryEntity, (comicsummary) => comicsummary.comic)
  @JoinColumn()
  comicSummary: Relation<ComicSummaryEntity>;
}
