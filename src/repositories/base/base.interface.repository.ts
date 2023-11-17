/* eslint-disable prettier/prettier */
import {
  DeepPartial,
  Repository,
  FindOneOptions,
  Entity,
  FindOptionsWhere,
  FindManyOptions,
  UpdateResult,
} from 'typeorm';
export interface BaseInterfaceRepository<T> {
  create(data: DeepPartial<T>): Promise<T>;
  createMany(data: DeepPartial<T>[]): Promise<T[]>;
  save(data: DeepPartial<T>): Promise<T>;
  saveMany(data: DeepPartial<T>[]): Promise<T[]>;
  findOneById(id: number): Promise<T>;
  findByCondition(filterCondition: any): Promise<T[]>;
  findAndUpdate(condition: Partial<T> | any, data: T | any): Promise<Boolean>;
  findAll(options?: FindManyOptions<T>): Promise<T[]>;
  remove(data: T): Promise<T>;
  delete(id: number): Promise<Boolean>;
  update(id: number, data: Partial<T>): Promise<UpdateResult>;
  findAllWIthPaginate(
    page: number,
    limit: number,
    sort?: string,
  ): Promise<{ data: T[]; total: number }>;
  findByConditionWithPagination(
    condition: FindOptionsWhere<T>,
    page: number,
    limit: number,
    sort?: string,
  ): Promise<{ data: T[]; total: number }>;
  findByConditionWithSelect(filterCondition: any, select: any): Promise<T[]>;
  findByConditionithSort(filterCondition: any, sort?: string): Promise<T[]>;
  findByConditionWithPaginationAndJoin(
    condition: FindOptionsWhere<T>,
    page: number,
    limit: number,
    sort?: string,
    relations?: any,
  ): Promise<{ data: T[]; total: number }>;

  findOneByIdWithJoin(
    condition: FindOptionsWhere<T>,
    relations?: any,
  ): Promise<{ data: T[]; total: number }>;
  findWithDynamicJoinsAndPagination(
    condition: FindOptionsWhere<T>,
    page: number,
    perPage: number,
    joinTables: string[],
  ): Promise<{ data: T[]; total: number }>;
  findOneWithDynamicJoins(
    id: number, // ID of the row you want to retrieve
    joinTables: string[],
    additionalConditions?: Record<string, any>,
  ): Promise<T | undefined>;

  findByConditionWithDelete(
    filterCondition: Record<string, any>,
    withDeleted: boolean,
  ): Promise<T[]>;
}
