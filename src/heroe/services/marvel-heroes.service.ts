import { Injectable } from '@nestjs/common';

@Injectable()
export class MarvelHeroesService {
  getAllHeroes(count, page): Array<object> {
    return [{}];
  }
}
