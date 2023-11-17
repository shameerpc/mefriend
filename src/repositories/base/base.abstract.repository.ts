/* eslint-disable prettier/prettier */
import {
  DeepPartial,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { BaseInterfaceRepository } from './base.interface.repository';
import { FindOneOptions, Entity } from 'typeorm';

interface HasId {
  id: number;
  delete_status: number;
}
export abstract class BaseAbstractRepository<T extends HasId>
  implements BaseInterfaceRepository<T>
{
  private repository: Repository<T>;

  protected constructor(repository: Repository<T>) {
    this.repository = repository;
  }
  protected createQueryBuilder(alias: string): SelectQueryBuilder<T> {
    return this.repository.createQueryBuilder(alias);
  }
  protected addJoins(
    queryBuilder: SelectQueryBuilder<T>,
    joinTables: string[],
  ): void {
    if (joinTables && joinTables.length > 0) {
      for (const table of joinTables) {
        queryBuilder.leftJoinAndSelect(`${queryBuilder.alias}.${table}`, table);
      }
    }
  }

  public async save(data: DeepPartial<T>): Promise<T> {
    return await this.repository.save(data);
  }

  public async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    return await this.repository.save(data);
  }

  public async create(data: DeepPartial<T>): Promise<T> {
    return this.repository.create(data);
  }

  public async createMany(data: DeepPartial<T>[]): Promise<T[]> {
    return await this.repository.create(data);
  }

  public async findOneById(id: any): Promise<T> {
    const options: FindOptionsWhere<T> = {
      id: id,
    };
    return await this.repository.findOneBy(options);
  }

  public async findByCondition(filterCondition: any): Promise<T[]> {
    const options: FindManyOptions<T> = {
      where: filterCondition,
    };
    return await this.repository.find(options);
  }

  public async findAndUpdate(
    condition: Partial<T>,
    updateData: any,
  ): Promise<Boolean> {
    const queryBuilder = this.repository.createQueryBuilder();

    for (const key in condition) {
      if (condition.hasOwnProperty(key)) {
        queryBuilder.andWhere(`${key} = :${key}`, { [key]: condition[key] });
      }
    }

    const response = await queryBuilder.update().set(updateData).execute();
    if (response.affected === 0) return false;
    return true;
  }

  public async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find(options);
  }
  public async remove(data: T): Promise<T> {
    //force remove
    return await this.repository.remove(data);
  }

  public async delete(id: number): Promise<Boolean> {
    //soft delete
    const data: any = {
      delete_status: 1,
      status: 0,
      deleted_at: new Date(),
    } as unknown as any;

    const response = await this.repository.update(id, data);
    if (response.affected === 0) return false;
    return true;
  }

  public async update(id: number, data: any): Promise<UpdateResult> {
    return await this.repository.update(id, data);
  }

  // async findAllWIthPaginate(
  //   page: number,
  //   limit: number,
  //   sort?: string
  // ): Promise<{ data: T[]; total: number }> {
  //   const [data, total] = await this.repository.findAndCount({
  //     skip: (page - 1) * limit,
  //     take: limit,
  //   });
  //   return { data, total };
  // }
  async findAllWIthPaginate(
    page: number,
    limit: number,
    sort?: string,
  ): Promise<{ data: T[]; total: number; page: number; limit: number }> {
    const options: FindManyOptions<T> = {
      skip: (page - 1) * limit,
      take: limit,
    };

    if (sort) {
      const [sortField, sortOrder] = sort.split(':');
      options.order = {
        [sortField]: sortOrder === 'asc' ? 'ASC' : 'DESC',
      } as FindManyOptions<T>['order'];
    }

    const [data, total] = await this.repository.findAndCount(options);
    return { data, total, page, limit };
  }
  async findByConditionWithPagination(
    condition: FindOptionsWhere<T>,
    page: number,
    limit: number,
    sort?: string,
  ): Promise<{ data: T[]; total: number }> {
    const options: FindManyOptions<T> = {
      where: condition,
      skip: (page - 1) * limit,
      take: limit,
    };

    if (sort) {
      const [sortField, sortOrder] = sort.split(':');
      const order = {
        [sortField]: sortOrder === 'asc' ? 'ASC' : 'DESC',
      } as FindManyOptions<T>['order'];
      options.order = order;
    }

    const [data, total] = await this.repository.findAndCount(options);
    return { data, total };
  }
  public async findByConditionithSort(
    filterCondition: any,
    sort?: string,
  ): Promise<T[]> {
    const options: FindManyOptions<T> = {
      where: filterCondition,
    };
    if (sort) {
      const [sortField, sortOrder] = sort.split(':');
      const order = {
        [sortField]: sortOrder === 'asc' ? 'ASC' : 'DESC',
      } as FindManyOptions<T>['order'];
      options.order = order;
    }
    return await this.repository.find(options);
  }
  // Add other shared TypeORM-specific repository methods here

  public async findByConditionWithSelect(
    filterCondition: any,
    select: any,
  ): Promise<T[]> {
    const options: FindManyOptions<T> = {
      where: filterCondition,
      select: select,
    };
    return await this.repository.find(options);
  }
  async findByConditionWithPaginationAndJoin(
    condition: FindOptionsWhere<T>,
    page: number,
    limit: number,
    sort?: string,
    relations?: any,
  ): Promise<{ data: T[]; total: number }> {
    const options: FindManyOptions<T> = {
      where: condition,
      skip: (page - 1) * limit,
      take: limit,
      relations: relations,
    };
    // console.log(options);
    if (sort) {
      const [sortField, sortOrder] = sort.split(':');
      const order = {
        [sortField]: sortOrder === 'asc' ? 'ASC' : 'DESC',
      } as FindManyOptions<T>['order'];
      options.order = order;
    }

    const [data, total] = await this.repository.findAndCount(options);
    return { data, total };
  }

  async findOneByIdWithJoin(
    condition: FindOptionsWhere<T>,

    relations?: any,
  ): Promise<{ data: T[]; total: number }> {
    const options: FindManyOptions<T> = {
      where: condition,

      relations: relations,
    };

    const [data, total] = await this.repository.findAndCount(options);
    return { data, total };
  }
  //   async findWithDynamicJoinsAndPagination(
  //     condition: FindOptionsWhere<T>,
  //     page: number,
  //     perPage: number,
  //     joinTables: string[],
  //   ): Promise<{ data: T[]; total: number }> {
  //     const queryBuilder = this.createQueryBuilder('entityAlias');
  //     this.addJoins(queryBuilder, joinTables);

  //     const [data, total] = await queryBuilder
  //       .skip((page - 1) * perPage)
  //       .take(perPage)
  //       .getManyAndCount();

  //     return { data, total };
  //   }
  // }

  async findByConditionWithDelete(
    filterCondition: any,
    withDeleted: boolean = false,
  ): Promise<T[]> {
    const options: FindManyOptions<T> = {
      where: filterCondition,
      withDeleted,
    };
    return await this.repository.find(options);
  }

  async findWithDynamicJoinsAndPagination(
    condition: FindOptionsWhere<T>,
    page: number,
    perPage: number,
    joinTables: string[],
    additionalConditions?: Record<string, any>, // Additional conditions as an object
  ): Promise<{ data: T[]; total: number }> {
    const queryBuilder = this.createQueryBuilder('entityAlias');
    this.addJoins(queryBuilder, joinTables);

    // Add additional conditions if provided
    if (additionalConditions) {
      for (const key in additionalConditions) {
        if (additionalConditions.hasOwnProperty(key)) {
          queryBuilder.andWhere(`entityAlias.${key} = :${key}`, {
            [key]: additionalConditions[key],
          });
        }
      }
    }

    const [data, total] = await queryBuilder
      .where(condition) // Apply the original condition
      .skip((page - 1) * perPage)
      .take(perPage)
      .getManyAndCount();

    return { data, total };
  }
  async findOneWithDynamicJoins(
    id: number, // ID of the row you want to retrieve
    joinTables: string[],
    additionalConditions?: Record<string, any>,
  ): Promise<T | undefined> {
    const queryBuilder = this.createQueryBuilder('entityAlias');
    this.addJoins(queryBuilder, joinTables);

    // Add additional conditions if provided
    if (additionalConditions) {
      for (const key in additionalConditions) {
        if (additionalConditions.hasOwnProperty(key)) {
          queryBuilder.andWhere(`entityAlias.${key} = :${key}`, {
            [key]: additionalConditions[key],
          });
        }
      }
    }

    // Add the ID condition
    queryBuilder.andWhere(`entityAlias.id = :id`, { id });

    const data = await queryBuilder.getOne();

    return data;
  }
}
// async function updateEntity(id: number, updatedData: Partial<Entity>) {
//   const entityRepository = getRepository(Entity);
//   const existingEntity = await entityRepository.findOne(id);

//   if (existingEntity) {
//     // Merge the updated data with the existing entity
//     const updatedEntity = entityRepository.merge(existingEntity, updatedData);
//     await entityRepository.save(updatedEntity);
//     return updatedEntity;
//   }

//   return null; // Entity with the given ID not found
// }
// Add other shared TypeORM-specific repository methods here
