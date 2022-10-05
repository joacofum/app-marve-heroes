import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { HeroeNoSQLService } from '../services/heroe-nosql.service';
import { HeroeSQLService } from '../services/heroe-sql.service';
import { MarvelHeroesService } from '../services/marvel-heroes.service';

@Controller('heroe')
export class HeroeController {
  constructor(
    private readonly marvelHeroeService: MarvelHeroesService,
    private readonly heroeNoSQLService: HeroeNoSQLService,
    private readonly heroeSQLService: HeroeSQLService,
  ) {}

  @Get(':count/:page')
  async findAll(
    @Param('count', ParseIntPipe) count: number,
    @Param('page', ParseIntPipe) page: number,
  ) {
    const heroes = await this.marvelHeroeService.getAllHeroes(count, page);
    return heroes;
  }

  @Post('nosql/:id')
  saveHeroeNoSQL(@Param('id') id: string) {
    // const heroe = this.marvelHeroeService.getHeroe(id);
    // transformar heroe en lo que requiero guardar
    this.heroeNoSQLService.save();
  }

  @Post('sql/:id')
  saveHeroeSQL(@Param('id') id: string) {
    // const heroe = this.marvelHeroeService.getHeroe(id);
    // transformar heroe en lo que requiero guardar
    this.heroeSQLService.save();
  }

  @Put('nosql/:idHeroeExistente/:idNuevoHeroe')
  updatedHeroeNoSQL(
    @Param('idHeroeExistente') idHeroeExistente: string,
    @Param('idNuevoHeroe') idNuevoHeroe: string,
  ) {
    // const newHeroe = this.marvelHeroeService.getHeroe(idNuevoHeroe);
    // transformar el nuevo heroe para reemplazar los datos del heroe señalado
    this.heroeNoSQLService.update();
  }

  @Put('nosql/:id')
  deleteHeroeNoSQL(@Param('id') id: string) {
    // buscar el heroe indicado en mi base de datos para poderlo borrar
    this.heroeNoSQLService.delete();
  }
}
