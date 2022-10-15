/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { ComicEntity } from "./comic.entity";

@Entity({ name: "heroe" })
export class HeroeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  heroeId: number;

  @Column()
  name: string;

  @Column({nullable: true})
  description: string;

  @Column()
  path: string;

  @Column()
  extension: string;

  @ManyToMany(() => ComicEntity, (comic) => comic.heroes)
  @JoinTable({ name: "comic_heroe" })
  comics: ComicEntity[];
}
