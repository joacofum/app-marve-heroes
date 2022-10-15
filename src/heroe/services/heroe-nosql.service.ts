/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IComic } from "../databases/interfaces/IComic.interface";
import { IComicSummary } from "../databases/interfaces/IComicSummary.interface";
import { IHeroe } from "../databases/interfaces/IHeroe.interface";
import { Comic } from "../databases/schemas/comic.schema";
import { ComicSummary } from "../databases/schemas/commicsummary.schema";
import { Heroe } from "../databases/schemas/heroe.schema";
import { ComicDTO } from "../dto/dtoMONGO/comic.dto";
import { ComicSummaryDTO } from "../dto/dtoMONGO/comicsummary.dto";
import { HeroeDTO } from "../dto/dtoMONGO/heroe.dto";

@Injectable()
export class HeroeNoSQLService {
  constructor(
    @InjectModel(Heroe.name) private readonly heroeModel: Model<IHeroe>,
    @InjectModel(Comic.name) private readonly comicModel: Model<IComic>,
    @InjectModel(ComicSummary.name)
    private readonly comicSummaryModel: Model<IComicSummary>
  ) {}

  //HEROES
  async save(heroeId: number, createHeroeDto: HeroeDTO): Promise<IHeroe> {
    let existeEnDB: HeroeDTO;

    if (!isNaN(+heroeId)) {
      existeEnDB = await this.heroeModel.findOne({ id: heroeId });
    }

    if (existeEnDB) {
      throw new BadRequestException(
        `El héroe con id "${heroeId}" existe en la Base de Datos`
      );
    }

    if (!existeEnDB) {
      const heroe = await this.heroeModel.create(createHeroeDto);
      return heroe.save();
    }
  }

  async deleteHeroe(heroeID: string): Promise<IHeroe> {
    const heroeDelete = await this.heroeModel.findByIdAndDelete(heroeID);
    return heroeDelete;
  }

  async updateHeroe(
    heroeID: string,
    createHeroeDto: HeroeDTO
  ): Promise<IHeroe> {
    const updateHeroe = await this.heroeModel.findByIdAndUpdate(
      heroeID,
      createHeroeDto,
      { new: true }
    );
    return updateHeroe;
  }

  //COMICS
  async saveComic(comicDto: ComicDTO): Promise<IComic> {
    const comic = new this.comicModel(comicDto);
    return await comic.save();
  }

  async saveComics(comicsDtos: ComicDTO[]): Promise<IComic[]> {
    const comicsRetorno = comicsDtos.map(async (comicDTO) => {
      const comicExiste = await this.comicModel.findOne({ id: comicDTO.id });
      if (comicExiste == null) {
        const comic = new this.comicModel(comicDTO);
        return await comic.save();
      } else {
        return comicExiste;
      }
    });
    return Promise.all(comicsRetorno);
  }

  //COMICSUMMARY
  async saveComicSummary(
    comicSummaryDTO: ComicSummaryDTO,
    comicId: number
  ): Promise<IComicSummary> {
    const comicExiste = await this.comicModel.findOne({ id: comicId });
    if (comicExiste == null) {
      const comicSummary = new this.comicSummaryModel(comicSummaryDTO);
      return await comicSummary.save();
    } else {
      const comic = await this.comicModel
        .findOne({ id: comicId }, "description, resourceURI, _id")
        .populate("comicSummaryId");
      return new this.comicSummaryModel(comic);
    }
  }

  async getAllData() {
    const allData = await this.heroeModel.find({}).populate("idComics");
    return allData;
  }
}
