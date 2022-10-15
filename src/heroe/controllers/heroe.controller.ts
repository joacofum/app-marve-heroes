/* eslint-disable prettier/prettier */
import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { HeroeNoSQLService } from '../services/heroe-nosql.service';
import { HeroeSQLService } from '../services/heroe-sql.service';
import { MarvelHeroesService } from '../services/marvel-heroes.service';

@Controller('heroes')
export class HeroeController {
  constructor(
    private readonly marvelHeroeService: MarvelHeroesService,
    private readonly heroeNoSQLService: HeroeNoSQLService,
    private readonly heroeSQLService: HeroeSQLService,
  ) {}

  //CONSULTAS GLOBALES
  @Get('/comicsByHeroeId/:id')
  async getComicsByHeroeId(
    @Param('id', ParseIntPipe) id: number,
  ) {
    const comics = await this.marvelHeroeService.getComicsByPersonajeId(id);
    return comics;
  }

  @Get('/allDataFromHeroes')
  async getAllDataFromHeroes(){
    const data = await this.heroeNoSQLService.getAllData();
    return data;
  }

  //NO SQL (MONGO)
  @Post('/nosql/:id')
  async saveHeroeNoSQL(
    @Param('id', ParseIntPipe) id: number,
  ) {
    const heroe = await this.marvelHeroeService.getHeroeById(id);
    //validar que no se repita el heroe
    return this.heroeNoSQLService.save(id, heroe)
  }

  @Put('update/nosql/:idHeroe/:id')
  async updateHeroeNoSQL(
    @Param('idHeroe') idHeroe: string,
    @Param('id') id: number
  ) {
    const newHeroe = await this.marvelHeroeService.getHeroeById(id)
    const heroe = await this.heroeNoSQLService.updateHeroe(idHeroe, newHeroe)
    if (!heroe) throw new NotFoundException('El heroe no existe')

    return {
      message: 'Heroe Updated Succesfully',
      heroe
    };
  }

  @Delete('/delete/nosql/:id')
  async deleteProduct(@Param('id') id: string) {
    const hero = await this.heroeNoSQLService.deleteHeroe(id);
    if (!hero) throw new NotFoundException('El heroe no existe')
    return {
      message: 'Heroe Deleted Succesfully',
      hero
    };
  }

  //SQL
  @Post('/sql/:id')
  async saveHeroeSQL(
    @Param('id', ParseIntPipe) id: number,
  ) {
    const heroe = await this.marvelHeroeService.getHeroeSQL(id);
    //validar que no se repita el heroe
    return this.heroeSQLService.save(id, heroe)
  }

  @Delete('/delete/sql/:id')
  async deleteHeroeSQL(@Param('id') id: string) {
    const hero = await this.heroeSQLService.delete(id);
    if (!hero) throw new NotFoundException('El heroe no existe')
    return {
      message: 'Heroe Deleted Succesfully',
      hero
    };
  }

  
  @Get(':count/:page')
  async findAll(
    @Param('count', ParseIntPipe) count: number,
    @Param('page', ParseIntPipe) page: number,
  ) {
    const heroes = await this.marvelHeroeService.getAllHeroes(count, page);
    return heroes;
  }
  
}
