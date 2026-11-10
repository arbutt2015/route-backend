import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import {
  DataSource,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  In,
  ObjectLiteral,
  Repository,
} from "typeorm";

@Injectable()
export class GeneRepoService {
  constructor(
    @InjectDataSource("read_and_write")
    private readonly readAndWriteDataSource: DataSource,

    @InjectDataSource("read_only")
    private readonly readOnlyDataSource: DataSource,
  ) {}

  async getRepository<T = any>(
    entity: string,
    useReadOnly: boolean = false,
  ): Promise<Repository<T>> {
    const dataSource = useReadOnly
      ? this.readOnlyDataSource
      : this.readAndWriteDataSource;

    return dataSource.getRepository<T>(entity as any);
  }

  async create(repository: Repository<any>, body: any): Promise<any> {
    const entityInstance = repository.create(body);
    await repository.save(entityInstance);
    return entityInstance;
  }

  async getAll(
    repository: Repository<any>,
    filter?: FindOneOptions<any>,
    options?: any,
  ) {
    const findOptions: FindManyOptions<ObjectLiteral> = {
      where: filter?.where,
      relations: options?.relations,
      select: options?.select,
      order: options?.order,
    };
    const result = await repository.find(findOptions);
    return result;
  }

  async getSorted(
    repository: Repository<any>,
    filter: FindOneOptions<any>,
    order: FindOneOptions<any>["order"],
    options?: Pick<any, "relations">,
  ): Promise<any[]> {
    const findOptions: any = {
      where: filter?.where,
      order: order,
      relations: options?.relations,
    };
    const result: any = await repository.find(findOptions);
    return result;
  }

  async getAndSelect(
    repository: Repository<any>,
    filter: FindOneOptions<any>,
    options?: Pick<any, "relations" | "select">,
  ): Promise<any[]> {
    const findOptions: FindOneOptions<ObjectLiteral> = {
      where: filter?.where,
      relations: options?.relations,
      select: options?.select,
    };

    const result: any = await repository.find(findOptions);
    return result;
  }

  async getById(
    repository: Repository<any>,
    filter: FindOneOptions<any>,
    options?: Pick<any, "relations" | "select">,
  ): Promise<any | undefined> {
    const findOptions: FindOneOptions<ObjectLiteral> = {
      where: filter?.where,
      relations: options?.relations,
      select: options?.select,
    };
    const result: any = await repository.findOne(findOptions);
    return result;
  }

  async getOne(
    repository: Repository<any>,
    filter: FindOneOptions<any>,
    options?: any,
  ): Promise<any> {
    const findOptions: FindOneOptions<ObjectLiteral> = {
      where: filter?.where,
      relations: options?.relations,
      select: options?.select,
    };

    const result: any = await repository.findOne(findOptions);
    return result;
  }
  async getOneBySorted(
    repository: Repository<any>,
    filter: FindOneOptions<any>,
    order: FindOneOptions<any>["order"],
    options?: Pick<any, "relations">,
  ): Promise<any[]> {
    const findOptions: any = {
      where: filter?.where,
      order: order,
      relations: options?.relations,
    };

    const result: any = await repository.findOne(findOptions);
    return result;
  }
  async getDistinct(
    repository: Repository<any>,
    filter?: FindManyOptions<any>,
    options?: Pick<any, "relations">,
  ): Promise<ObjectLiteral | ObjectLiteral[][]> {
    const findOptions: FindManyOptions<ObjectLiteral | ObjectLiteral[]> = {
      where: filter?.where,
      relations: options?.relations,
    };
    const result = await repository.find(findOptions);
    return result;
  }
  async updateMany(
    repository: Repository<any>,
    filter: FindOneOptions<any>,
    updateBody: Partial<any>,
  ): Promise<any> {
    if (filter.where === undefined) {
      throw new Error("Update filter must include the where condition.");
    }
    return repository.update(filter.where, updateBody);
  }

  async updateById(
    repository: Repository<any>,
    id: number | null,
    updateBody: Partial<any>,
  ): Promise<any> {
    if (id !== null) {
      return repository.update(id, updateBody);
    } else {
      throw new Error("ID cannot be null");
    }
  }
  async updateManyByIds(
    repository: Repository<any>,
    ids: number[],
    updateBody: Partial<any>,
  ): Promise<any> {
    if (!ids || ids.length === 0) {
      throw new Error("IDs array must not be empty.");
    }

    return repository.update({ id: In(ids) }, updateBody);
  }
  async updateByWhereAndGetData(
    repository: Repository<any>,
    updateFilter: FindOptionsWhere<any>,
    updateBody: any,
    findFilter?: any,
    options?: Pick<any, "relations" | "select">,
  ) {
    // Update the assets and get the affected row count
    const { affected } = await repository.update(
      updateFilter.where,
      updateBody,
    );
    // If there are affected rows, fetch the updated rows
    if (affected > 0) {
      const updatedRows = await repository.find({
        where: findFilter?.where,
        relations: options?.relations,
        select: options?.select,
      });
      return updatedRows;
    }
    return [];
  }
  async updateOne(
    repository: Repository<any>,
    filter: FindOptionsWhere<any>,
    updateBody: Partial<any>,
  ): Promise<any> {
    const entityToUpdate = await repository.findOne(filter);
    if (!entityToUpdate) {
      return null; // Return null if entity to update is not found
    }
    // Update the entity with the provided update body
    Object.assign(entityToUpdate, updateBody);
    // Save the updated entity back to the database
    await repository.save(entityToUpdate);

    return entityToUpdate;
  }

  async deleteMany(
    repository: Repository<any>,
    filter: FindOptionsWhere<any>,
  ): Promise<void> {
    const entitiesToDelete = await repository.find(filter);
    await repository.remove(entitiesToDelete);
  }
  async deleteByFilter(
    repository: Repository<any>,
    filter: FindOptionsWhere<any>,
  ): Promise<void> {
    await repository.delete(filter);
  }
  async deleteById(
    repository: Repository<any>,
    id: number | null,
  ): Promise<void> {
    if (id !== null) {
      await repository.delete(id);
    } else {
      throw new Error("ID cannot be null");
    }
  }

  async deleteOne(
    repository: Repository<any>,
    filter: FindOptionsWhere<any>,
  ): Promise<void> {
    await repository.delete(filter);
  }

  async count(
    repository: Repository<any>,
    filter?: FindOptionsWhere<any>,
  ): Promise<number> {
    const count = filter
      ? await repository.count(filter)
      : await repository.count();
    return count;
  }

  async prepare(
    repository: Repository<any>,
    body: ObjectLiteral | ObjectLiteral[],
  ): Promise<ObjectLiteral | ObjectLiteral[]> {
    const entityInstance = repository.create(body);
    await repository.save(entityInstance);
    return entityInstance;
  }

  async query(rawQuery: string, useReadOnly = false): Promise<any[]> {
    const dataSource = useReadOnly
      ? this.readOnlyDataSource
      : this.readAndWriteDataSource;

    return dataSource.query(rawQuery);
  }
  async executeWriteQuery(query: string, params: any[]): Promise<any[]> {
    return this.readAndWriteDataSource.query(query, params);
  }

  async executeReadQuery(query: string, params: any[]): Promise<any[]> {
    return this.readOnlyDataSource.query(query, params);
  }

  // Add this to GeneRepoService
  async bulkUpdateWithDifferentValues(
    repository: Repository<any>,
    updates: { where: any; data: any }[],
  ): Promise<void> {
    await repository.manager.transaction(async (manager) => {
      const updatePromises = updates.map((update) =>
        manager.update(repository.target, update.where, update.data),
      );
      await Promise.all(updatePromises);
    });
  }
}
