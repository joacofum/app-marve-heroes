/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { createHash } from "crypto";
import { ObjectId } from "mongoose";
import fetch from "node-fetch";
import { ComicDTO } from "../dto/dtoMONGO/comic.dto";
import { ComicSummaryDTO } from "../dto/dtoMONGO//comicsummary.dto";
import { HeroeDTO } from "../dto/dtoMONGO/heroe.dto";
import { HeroeNoSQLService } from "./heroe-nosql.service";
import { IComicSummary } from "../databases/interfaces/IComicSummary.interface";
import { HeroeSqlDTO } from "../dto/dtoSQL/heroe.sql.dto";
import { ComicSqlDTO } from "../dto/dtoSQL/comic.sql.dto";
import { HeroeSQLService } from "./heroe-sql.service";
import { ComicSummarySqlDTO } from "../dto/dtoSQL/comicsummary.sql.dto";

@Injectable()
export class MarvelHeroesService {
  httpService: any;
  constructor(
    private readonly heroeNoSQLService: HeroeNoSQLService,
    private readonly heroeSQLService: HeroeSQLService
  ) {}

  //CONSULTAS GLOBALES
  async getAllHeroes(count: number, page: number): Promise<Array<object>> {
    const md5 = this.crearHash();
    const result = await fetch(
      `https://gateway.marvel.com:443/v1/public/characters?limit=${count}&offset=${page}&ts=${process.env.TS}&apikey=${process.env.PUBLIC_KEY}&hash=${md5}`
    ).then((res) => res.json());
    return result;
  }

  async getComicsByPersonajeId(id: number): Promise<ComicDTO[]> {
    const md5 = this.crearHash();
    const result = await fetch(
      `https://gateway.marvel.com:443/v1/public/characters/${id}/comics?ts=${process.env.TS}&apikey=${process.env.PUBLIC_KEY}&hash=${md5}`
    )
      .then((res) => res.json())
      .then((comics) => {
        const comicsList: [] = comics.data.results;
        const comicsRetorno: ComicDTO[] = [];
        comicsList.forEach(async (elem: any) => {
          const comicsito = new ComicDTO();
          comicsito.id = elem.id;
          comicsito.title = elem.title;
          comicsito.description = elem.description;
          comicsito.issueNumber = elem.issueNumber;
          comicsRetorno.push(comicsito);
        });
        return comicsRetorno;
      });
    return result;
  }

  //NO SQL (MONGO)
  async getHeroeById(id: number): Promise<HeroeDTO> {
    const md5 = this.crearHash();
    const result = await fetch(
      `https://gateway.marvel.com:443/v1/public/characters/${id}?ts=${process.env.TS}&apikey=${process.env.PUBLIC_KEY}&hash=${md5}`
    );
    const dataHeroe = await result.json();
    const heroe = dataHeroe.data.results[0];
    const heroeDTO = new HeroeDTO();
    heroeDTO.id = heroe.id;
    heroeDTO.name = heroe.name;
    heroeDTO.description = heroe.description;
    heroeDTO.image = heroe.thumbnail;
    //Función que crea los comics y devuelve los ObjectId de los comics creados.
    heroeDTO.idComics = await this.crearComicsByHeroeId(id);
    return heroeDTO;
  }

  async crearComicsByHeroeId(id: number): Promise<ObjectId[]> {
    const md5 = this.crearHash();
    const result = await fetch(
      `https://gateway.marvel.com:443/v1/public/characters/${id}/comics?ts=${process.env.TS}&apikey=${process.env.PUBLIC_KEY}&hash=${md5}`
    )
      .then((res) => res.json())
      .then((comics) => {
        const result = comics.data.results.map(async (elem: any) => {
          const comicSummary = await this.saveComicSummary(elem.id);
          const comicsito = new ComicDTO();
          comicsito.id = elem.id;
          comicsito.title = elem.title;
          comicsito.description = elem.description;
          comicsito.issueNumber = elem.issueNumber;
          comicsito.comicSummaryId = comicSummary._id;
          return comicsito;
        });
        return Promise.all(result);
      });
    //Pregunto si existe antes de insertar.
    const comics = await this.heroeNoSQLService.saveComics(result);
    return comics.map((comic) => comic._id);
  }

  async saveComicSummary(comicId: number): Promise<IComicSummary> {
    const md5 = createHash("md5")
      .update(process.env.TS + process.env.PRIVATE_KEY + process.env.PUBLIC_KEY)
      .digest("hex");

    const result = await fetch(
      `https://gateway.marvel.com:443/v1/public/comics/${comicId}?ts=${process.env.TS}&apikey=${process.env.PUBLIC_KEY}&hash=${md5}`
    )
      .then((res) => res.json())
      .then(async (comic) => {
        const comics = comic.data.results[0];
        const comicSummaryDto = new ComicSummaryDTO();
        comicSummaryDto.description = comics.description;
        comicSummaryDto.resourceURI = comics.resourceURI;
        return await this.heroeNoSQLService.saveComicSummary(
          comicSummaryDto,
          comicId
        );
      });
    return result;
  }

  //SQL (MYSQL)
  async getHeroeSQL(id: number): Promise<HeroeSqlDTO> {
    const md5 = this.crearHash();
    const result = await fetch(
      `https://gateway.marvel.com:443/v1/public/characters/${id}?ts=${process.env.TS}&apikey=${process.env.PUBLIC_KEY}&hash=${md5}`
    );
    const dataHeroe = await result.json();
    const heroe = dataHeroe.data.results[0];
    const HeroeSqlDto = new HeroeSqlDTO();
    HeroeSqlDto.heroeId = heroe.id;
    HeroeSqlDto.name = heroe.name;
    HeroeSqlDto.description = heroe.description;
    HeroeSqlDto.path = heroe.thumbnail.path;
    HeroeSqlDto.extension = heroe.thumbnail.extension;
    //Obtengo los comics rancios
    HeroeSqlDto.comics = await this.getComicsSQL(id);

    return HeroeSqlDto;
  }

  async getComicsSQL(heroeId: number) {
    const md5 = createHash("md5")
      .update(process.env.TS + process.env.PRIVATE_KEY + process.env.PUBLIC_KEY)
      .digest("hex");
    const result = await fetch(
      `https://gateway.marvel.com:443/v1/public/characters/${heroeId}/comics?ts=${process.env.ts}&apikey=${process.env.public_key}&hash=${md5}`
    )
      .then((res) => res.json())
      .then((comics) => {
        const result = comics.data.results.map(async (comic) => {
          const comicsito = new ComicSqlDTO();
          comicsito.idComic = comic.id;
          comicsito.title = comic.title;
          comicsito.description = comic.description;
          comicsito.issueNumber = comic.issueNumber;
          comicsito.comicSummary = await this.getComicSummarySQL(comicsito.idComic)
          return comicsito;
        });
        return Promise.all(result);
      });
    const comics = await this.heroeSQLService.saveComics(result);
    return comics;
  }

  //obtengo comicsummary y devuelvo el idComicSummary
  async getComicSummarySQL(comicId: number){
    const md5 = createHash('md5').update(process.env.TS + process.env.PRIVATE_KEY + process.env.PUBLIC_KEY).digest("hex")

    const result = await fetch(
        `https://gateway.marvel.com:443/v1/public/comics/${comicId}?ts=${process.env.TS}&apikey=${process.env.PUBLIC_KEY}&hash=${md5}`)
        .then(res => res.json())
        .then(comic => {
            const comicsito = comic.data.results[0]
            const comicSummaryDto = new ComicSummarySqlDTO();
            comicSummaryDto.description = comicsito.description;
            comicSummaryDto.resourceURI = comicsito.resourceURI;
            return this.heroeSQLService.saveComicSummary(comicsito.id, comicSummaryDto)
        });
    return result;
}

  crearHash() {
    return createHash("md5")
      .update(process.env.TS + process.env.PRIVATE_KEY + process.env.PUBLIC_KEY)
      .digest("hex");
  }
}
