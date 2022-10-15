/* eslint-disable prettier/prettier */
// Libraries
import { Module } from "@nestjs/common";

// Controllers
import { HeroeController } from "./controllers/heroe.controller";

// Services
import { HeroeSQLService } from "./services/heroe-sql.service";
import { HeroeNoSQLService } from "./services/heroe-nosql.service";
import { MarvelHeroesService } from "./services/marvel-heroes.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HeroeEntity } from "./databases/entities/heroe.entity";
import { MongooseModule } from "@nestjs/mongoose";
import { Heroe, HeroeSchema } from "./databases/schemas/heroe.schema";
import { Comic, ComicSchema } from "./databases/schemas/comic.schema";
import {
  ComicSummary,
  ComicSummarySchema,
} from "./databases/schemas/commicsummary.schema";
import { ComicEntity } from "./databases/entities/comic.entity";
import { ComicSummaryEntity } from "./databases/entities/comicsummary.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([HeroeEntity, ComicEntity, ComicSummaryEntity]),
    MongooseModule.forFeature([
      { name: Heroe.name, schema: HeroeSchema },
      { name: Comic.name, schema: ComicSchema },
      { name: ComicSummary.name, schema: ComicSummarySchema },
    ]),
  ],
  controllers: [HeroeController],
  providers: [MarvelHeroesService, HeroeSQLService, HeroeNoSQLService],
})
export class HeroeModule {}
