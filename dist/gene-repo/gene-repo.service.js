"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneRepoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let GeneRepoService = class GeneRepoService {
    constructor(readAndWriteDataSource, readOnlyDataSource) {
        this.readAndWriteDataSource = readAndWriteDataSource;
        this.readOnlyDataSource = readOnlyDataSource;
    }
    async getRepository(entity, useReadOnly = false) {
        const dataSource = useReadOnly
            ? this.readOnlyDataSource
            : this.readAndWriteDataSource;
        return dataSource.getRepository(entity);
    }
    async create(repository, body) {
        const entityInstance = repository.create(body);
        await repository.save(entityInstance);
        return entityInstance;
    }
    async getAll(repository, filter, options) {
        const findOptions = {
            where: filter?.where,
            relations: options?.relations,
            select: options?.select,
            order: options?.order,
        };
        const result = await repository.find(findOptions);
        return result;
    }
    async getSorted(repository, filter, order, options) {
        const findOptions = {
            where: filter?.where,
            order: order,
            relations: options?.relations,
        };
        const result = await repository.find(findOptions);
        return result;
    }
    async getAndSelect(repository, filter, options) {
        const findOptions = {
            where: filter?.where,
            relations: options?.relations,
            select: options?.select,
        };
        const result = await repository.find(findOptions);
        return result;
    }
    async getById(repository, filter, options) {
        const findOptions = {
            where: filter?.where,
            relations: options?.relations,
            select: options?.select,
        };
        const result = await repository.findOne(findOptions);
        return result;
    }
    async getOne(repository, filter, options) {
        const findOptions = {
            where: filter?.where,
            relations: options?.relations,
            select: options?.select,
        };
        const result = await repository.findOne(findOptions);
        return result;
    }
    async getOneBySorted(repository, filter, order, options) {
        const findOptions = {
            where: filter?.where,
            order: order,
            relations: options?.relations,
        };
        const result = await repository.findOne(findOptions);
        return result;
    }
    async getDistinct(repository, filter, options) {
        const findOptions = {
            where: filter?.where,
            relations: options?.relations,
        };
        const result = await repository.find(findOptions);
        return result;
    }
    async updateMany(repository, filter, updateBody) {
        if (filter.where === undefined) {
            throw new Error("Update filter must include the where condition.");
        }
        return repository.update(filter.where, updateBody);
    }
    async updateById(repository, id, updateBody) {
        if (id !== null) {
            return repository.update(id, updateBody);
        }
        else {
            throw new Error("ID cannot be null");
        }
    }
    async updateManyByIds(repository, ids, updateBody) {
        if (!ids || ids.length === 0) {
            throw new Error("IDs array must not be empty.");
        }
        return repository.update({ id: (0, typeorm_2.In)(ids) }, updateBody);
    }
    async updateByWhereAndGetData(repository, updateFilter, updateBody, findFilter, options) {
        const { affected } = await repository.update(updateFilter.where, updateBody);
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
    async updateOne(repository, filter, updateBody) {
        const entityToUpdate = await repository.findOne(filter);
        if (!entityToUpdate) {
            return null;
        }
        Object.assign(entityToUpdate, updateBody);
        await repository.save(entityToUpdate);
        return entityToUpdate;
    }
    async deleteMany(repository, filter) {
        const entitiesToDelete = await repository.find(filter);
        await repository.remove(entitiesToDelete);
    }
    async deleteByFilter(repository, filter) {
        await repository.delete(filter);
    }
    async deleteById(repository, id) {
        if (id !== null) {
            await repository.delete(id);
        }
        else {
            throw new Error("ID cannot be null");
        }
    }
    async deleteOne(repository, filter) {
        await repository.delete(filter);
    }
    async count(repository, filter) {
        const count = filter
            ? await repository.count(filter)
            : await repository.count();
        return count;
    }
    async prepare(repository, body) {
        const entityInstance = repository.create(body);
        await repository.save(entityInstance);
        return entityInstance;
    }
    async query(rawQuery, useReadOnly = false) {
        const dataSource = useReadOnly
            ? this.readOnlyDataSource
            : this.readAndWriteDataSource;
        return dataSource.query(rawQuery);
    }
    async executeWriteQuery(query, params) {
        return this.readAndWriteDataSource.query(query, params);
    }
    async executeReadQuery(query, params) {
        return this.readOnlyDataSource.query(query, params);
    }
    async bulkUpdateWithDifferentValues(repository, updates) {
        await repository.manager.transaction(async (manager) => {
            const updatePromises = updates.map((update) => manager.update(repository.target, update.where, update.data));
            await Promise.all(updatePromises);
        });
    }
};
exports.GeneRepoService = GeneRepoService;
exports.GeneRepoService = GeneRepoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)("read_and_write")),
    __param(1, (0, typeorm_1.InjectDataSource)("read_only")),
    __metadata("design:paramtypes", [typeorm_2.DataSource,
        typeorm_2.DataSource])
], GeneRepoService);
//# sourceMappingURL=gene-repo.service.js.map