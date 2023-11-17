/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { FavouriteEntity } from './../typeOrm/entities/Favourites';

export class FavouriteRepository extends BaseAbstractRepository<FavouriteEntity> {
  constructor(
    @InjectRepository(FavouriteEntity) repository: Repository<FavouriteEntity>,
  ) {
    super(repository);
  }
}
