// Libraries
import { Module } from '@nestjs/common';

// Controllers
import { HeroeController } from './controllers/heroe.controller';

// Services
import { HeroeSQLService } from './services/heroe-sql.service';
import { HeroeNoSQLService } from './services/heroe-nosql.service';
import { MarvelHeroesService } from './services/marvel-heroes.service';

@Module({
  imports: [],
  controllers: [HeroeController],
  providers: [MarvelHeroesService, HeroeSQLService, HeroeNoSQLService],
})
export class HeroeModule {}
