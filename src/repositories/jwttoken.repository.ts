/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { JwtTokenEntity } from 'src/typeOrm/entities/JwtToken';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class JwtTokenRepository extends BaseAbstractRepository<JwtTokenEntity> {
  constructor(
    @InjectRepository(JwtTokenEntity)
    jwtTokenRepository: Repository<JwtTokenEntity>,
  ) {
    super(jwtTokenRepository);
  }
}
