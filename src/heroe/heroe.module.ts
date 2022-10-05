import { Module } from '@nestjs/common';
import { HeroeController } from './controllers/heroe.controller';
import { MarvelHeroesService } from './services/marvel-heroes.service';

@Module({
  imports: [],
  controllers: [HeroeController],
  providers: [MarvelHeroesService],
})
export class HeroeModule {}
