import { DataSource, FindManyOptions, FindOneOptions, FindOptionsWhere, ObjectLiteral, Repository } from "typeorm";
export declare class GeneRepoService {
    private readonly readAndWriteDataSource;
    private readonly readOnlyDataSource;
    constructor(readAndWriteDataSource: DataSource, readOnlyDataSource: DataSource);
    getRepository<T = any>(entity: string, useReadOnly?: boolean): Promise<Repository<T>>;
    create(repository: Repository<any>, body: any): Promise<any>;
    getAll(repository: Repository<any>, filter?: FindOneOptions<any>, options?: any): Promise<any[]>;
    getSorted(repository: Repository<any>, filter: FindOneOptions<any>, order: FindOneOptions<any>["order"], options?: Pick<any, "relations">): Promise<any[]>;
    getAndSelect(repository: Repository<any>, filter: FindOneOptions<any>, options?: Pick<any, "relations" | "select">): Promise<any[]>;
    getById(repository: Repository<any>, filter: FindOneOptions<any>, options?: Pick<any, "relations" | "select">): Promise<any | undefined>;
    getOne(repository: Repository<any>, filter: FindOneOptions<any>, options?: any): Promise<any>;
    getOneBySorted(repository: Repository<any>, filter: FindOneOptions<any>, order: FindOneOptions<any>["order"], options?: Pick<any, "relations">): Promise<any[]>;
    getDistinct(repository: Repository<any>, filter?: FindManyOptions<any>, options?: Pick<any, "relations">): Promise<ObjectLiteral | ObjectLiteral[][]>;
    updateMany(repository: Repository<any>, filter: FindOneOptions<any>, updateBody: Partial<any>): Promise<any>;
    updateById(repository: Repository<any>, id: number | null, updateBody: Partial<any>): Promise<any>;
    updateManyByIds(repository: Repository<any>, ids: number[], updateBody: Partial<any>): Promise<any>;
    updateByWhereAndGetData(repository: Repository<any>, updateFilter: FindOptionsWhere<any>, updateBody: any, findFilter?: any, options?: Pick<any, "relations" | "select">): Promise<any[]>;
    updateOne(repository: Repository<any>, filter: FindOptionsWhere<any>, updateBody: Partial<any>): Promise<any>;
    deleteMany(repository: Repository<any>, filter: FindOptionsWhere<any>): Promise<void>;
    deleteByFilter(repository: Repository<any>, filter: FindOptionsWhere<any>): Promise<void>;
    deleteById(repository: Repository<any>, id: number | null): Promise<void>;
    deleteOne(repository: Repository<any>, filter: FindOptionsWhere<any>): Promise<void>;
    count(repository: Repository<any>, filter?: FindOptionsWhere<any>): Promise<number>;
    prepare(repository: Repository<any>, body: ObjectLiteral | ObjectLiteral[]): Promise<ObjectLiteral | ObjectLiteral[]>;
    query(rawQuery: string, useReadOnly?: boolean): Promise<any[]>;
    executeWriteQuery(query: string, params: any[]): Promise<any[]>;
    executeReadQuery(query: string, params: any[]): Promise<any[]>;
    bulkUpdateWithDifferentValues(repository: Repository<any>, updates: {
        where: any;
        data: any;
    }[]): Promise<void>;
}
