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
exports.AdmRoleController = void 0;
const common_1 = require("@nestjs/common");
const adm_role_service_1 = require("./adm-role.service");
const create_update_dto_1 = require("./dto/create-update.dto");
const graylog_common_1 = require("../common/graylog.common");
let AdmRoleController = class AdmRoleController {
    constructor(admRoleService, loggerService) {
        this.admRoleService = admRoleService;
        this.loggerService = loggerService;
    }
    async getRolesById(roleId) {
        try {
            const response = await this.admRoleService.getRolesById(roleId);
            return {
                message: "Role details fetched successfully",
                data: response,
                statusCode: 200,
            };
        }
        catch (error) {
            this.loggerService.error(error);
            throw error;
        }
    }
    async getAllRoles() {
        try {
            const response = await this.admRoleService.getAllRoles();
            return {
                message: "All roles fetched successfully",
                data: response,
                statusCode: 200,
            };
        }
        catch (error) {
            this.loggerService.error(error);
            throw error;
        }
    }
    async create(createRoleDto) {
        try {
            const response = await this.admRoleService.createRole({
                roleId: createRoleDto?.roleId,
                roleName: createRoleDto?.roleName,
                roleDescription: createRoleDto?.roleDescription,
                roleCode: createRoleDto?.roleCode,
            });
            return {
                message: "Role created successfully",
                data: response,
                statusCode: 201,
            };
        }
        catch (error) {
            this.loggerService.error(error);
            throw error;
        }
    }
    async delete(createRoleDto) {
        try {
            const response = await this.admRoleService.deleteRole(createRoleDto.roleId);
            return {
                message: "Role deleted successfully",
                data: response,
                statusCode: 201,
            };
        }
        catch (error) {
            this.loggerService.error(error);
            throw error;
        }
    }
};
exports.AdmRoleController = AdmRoleController;
__decorate([
    (0, common_1.Get)("role-by-id"),
    __param(0, (0, common_1.Query)("roleId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdmRoleController.prototype, "getRolesById", null);
__decorate([
    (0, common_1.Get)("getAll"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdmRoleController.prototype, "getAllRoles", null);
__decorate([
    (0, common_1.Post)("create-update"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_update_dto_1.CreateRoleDto]),
    __metadata("design:returntype", Promise)
], AdmRoleController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)("delete"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdmRoleController.prototype, "delete", null);
exports.AdmRoleController = AdmRoleController = __decorate([
    (0, common_1.Controller)("role"),
    __metadata("design:paramtypes", [adm_role_service_1.AdmRoleService,
        graylog_common_1.LoggingService])
], AdmRoleController);
//# sourceMappingURL=adm-role.controller.js.map