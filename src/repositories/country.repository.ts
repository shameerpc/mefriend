/* eslint-disable prettier/prettier */
import { Repository } from "typeorm";
import { BaseAbstractRepository } from "./base/base.abstract.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { CountryEntity } from "src/typeOrm/entities/Country";

export class CountryRepository extends BaseAbstractRepository<CountryEntity> {
  constructor(
    @InjectRepository(CountryEntity) repository: Repository<CountryEntity>
  ) {
    super(repository);
  }
}
