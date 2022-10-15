/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { isUUID } from "class-validator";
import { Repository } from "typeorm";
import { ComicEntity } from "../databases/entities/comic.entity";
import { ComicSummaryEntity } from "../databases/entities/comicsummary.entity";
import { HeroeEntity } from "../databases/entities/heroe.entity";
import { ComicSqlDTO } from "../dto/dtoSQL/comic.sql.dto";
import { ComicSummarySqlDTO } from "../dto/dtoSQL/comicsummary.sql.dto";
import { HeroeSqlDTO } from "../dto/dtoSQL/heroe.sql.dto";
import { UpdateHeroeDto } from "../dto/dtoSQL/updateHeroeDto";

@Injectable()
export class HeroeSQLService {
  private logger = new Logger("HeroeSQLService");

  constructor(
    @InjectRepository(HeroeEntity)
    private readonly heroeRepository: Repository<HeroeEntity>,
    @InjectRepository(ComicEntity)
    private readonly comicRepository: Repository<ComicEntity>,
    @InjectRepository(ComicSummaryEntity)
    private readonly comicSummaryRepository: Repository<ComicSummaryEntity>
  ) {}

  //----------         HEROE
  async save(heroeID: number, createHeroeDto: HeroeSqlDTO) {
    const existeEnDB = await this.heroeRepository.findOneBy({
      heroeId: heroeID,
    });
    if (!existeEnDB) {
      return await this.heroeRepository.save(createHeroeDto);
    } else {
      throw new BadRequestException(
        `El héroe con el id ${heroeID} ya existe en la Base de Datos`
      );
    }
  }

  async findHeroeBy(uuid: string) {
    let heroe: HeroeEntity;

    if (isUUID(uuid)) {
      heroe = await this.heroeRepository.findOneBy({ id: uuid });
    }
    if (!heroe) {
      throw new NotFoundException(`Heroe con el id ${uuid} no fue encontrado`);
    }
    return heroe;
  }

  async update(id: string, updateHeroeDto: UpdateHeroeDto) {
    const heroe = await this.heroeRepository.preload({
      id: id,
      ...updateHeroeDto,
    });

    if (!heroe)
      throw new NotFoundException(`El héroe con el id ${id} no fue encontrado`);

    try {
      await this.heroeRepository.save(heroe);
      return heroe;
    } catch (error) {}
  }

  async delete(uuid: string) {
    const heroe = await this.findHeroeBy(uuid);
    if (heroe) {
      await this.heroeRepository.remove(heroe);
      return "El héroe fue removido exitosamente";
    }
  }

  async saveComics(comicDto: ComicSqlDTO[]) {
    const comicsRetorno = comicDto.map(async (comicDTO) => {
      const comicExiste = await this.comicRepository.findOneBy({
        idComic: comicDTO.idComic,
      });
      if (!comicExiste) {
        return await this.comicRepository.save(comicDTO);
      } else {
        return comicExiste;
      }
    });
    return Promise.all(comicsRetorno);
  }

  async saveComicSummary(comicId: number, createComicSummaryDto: ComicSummarySqlDTO) {
    const existeComic = await this.comicRepository.findOneBy({ idComic: comicId })
    //ME DEVUELVE UN COMIC ENTERITO SI LO MUESTRO DESDE WORKBENCH
    /*  const ranciada = await this.comicRepository
    .createQueryBuilder("ComicData")
    .innerJoin("ComicData.comicSummary", "comic")
    .where("ComicData.idComic = :id", { id: comicId })
    .getOne() */
    if (!existeComic) {
        return await this.comicSummaryRepository.save(createComicSummaryDto);
    } else {
      return await this.comicSummaryRepository
            .createQueryBuilder("ComicSummaryData")
            .leftJoinAndSelect("ComicSummaryData.comic", "comic")
            .where("comic.idComic = :id", { id: comicId })
            .getOne()
    }
}

  private handleDBExceptions(error: any) {
    if (error.code === "23505") throw new BadRequestException(error.detail);

    this.logger.error(error);

    throw new InternalServerErrorException(
      "unexpected error, check server logs"
    );
  }
}
