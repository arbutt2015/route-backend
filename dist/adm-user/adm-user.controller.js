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
exports.AdmUserController = void 0;
const common_1 = require("@nestjs/common");
const adm_user_service_1 = require("./adm-user.service");
const logger_service_1 = require("../logger/logger.service");
const swagger_1 = require("@nestjs/swagger");
let AdmUserController = class AdmUserController {
    constructor(userService, loggerService) {
        this.userService = userService;
        this.loggerService = loggerService;
    }
    async getAllUsers() {
        try {
            const response = await this.userService.getAllUsers({
                where: { isVerified: true },
            });
            return {
                message: "Users fetched successfully",
                data: response,
                statusCode: 200,
            };
        }
        catch (error) {
            this.loggerService.error(error);
            throw error;
        }
    }
    async getSdUsers() {
        try {
            const response = await this.userService.getSdUsers({
                where: { isSdUser: true, isActive: true },
            });
            return {
                message: "Users fetched successfully",
                data: response,
                statusCode: 200,
            };
        }
        catch (error) {
            this.loggerService.error(error);
            throw error;
        }
    }
    async getUserById(userId) {
        try {
            const response = await this.userService.getUser({
                where: { userId: userId },
            });
            return {
                message: "User fetched successfully",
                data: response,
                statusCode: 200,
            };
        }
        catch (error) {
            this.loggerService.error(error);
            throw error;
        }
    }
    async updateUserById(userUpdateDto) {
        try {
            const userId = userUpdateDto?.userId;
            delete userUpdateDto.userId;
            const response = (await this.userService.updateUserByWhereAndGetData({
                where: { userId },
            }, {
                ...userUpdateDto,
            }))[0];
            return {
                message: "User updated successfully",
                data: response,
                statusCode: 200,
            };
        }
        catch (error) {
            this.loggerService.error(error);
            throw error;
        }
    }
    async deleteUser(userId) {
        try {
            await this.userService.deleteUser(userId);
            return {
                message: "User deleted",
                data: null,
                statusCode: 200,
            };
        }
        catch (error) {
            this.loggerService.error(error);
            throw error;
        }
    }
};
exports.AdmUserController = AdmUserController;
__decorate([
    (0, common_1.Get)("get-all"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdmUserController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)("get-sd-users"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdmUserController.prototype, "getSdUsers", null);
__decorate([
    (0, common_1.Get)("get-user-by-id"),
    __param(0, (0, common_1.Query)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdmUserController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Patch)("update-user-by-id"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdmUserController.prototype, "updateUserById", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdmUserController.prototype, "deleteUser", null);
exports.AdmUserController = AdmUserController = __decorate([
    (0, common_1.Controller)("users"),
    (0, swagger_1.ApiTags)("User"),
    __metadata("design:paramtypes", [adm_user_service_1.AdmUserService,
        logger_service_1.LoggerService])
], AdmUserController);
//# sourceMappingURL=adm-user.controller.js.map