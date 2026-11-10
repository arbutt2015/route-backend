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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdmUserService = void 0;
const common_1 = require("@nestjs/common");
const adm_user_repo_1 = require("./adm-user.repo");
const aws_cognito_service_1 = require("../aws/aws-cognito.service");
let AdmUserService = class AdmUserService {
    constructor(userRepo, cognitoService) {
        this.userRepo = userRepo;
        this.cognitoService = cognitoService;
    }
    async getProfile(userId) {
        const user = await this.userRepo.getUser({ where: { userId } });
        if (!user)
            throw new common_1.NotFoundException("User not found");
        return this.toProfile(user);
    }
    async updateProfile(userId, profile) {
        const [user] = await this.userRepo.updateUserByWhereAndGetData({ where: { userId } }, {
            firstName: profile.firstName,
            middleInitial: profile.middleInitial ?? "",
            lastName: profile.lastName,
            companyName: profile.companyName,
            title: profile.title ?? "",
            phoneNumber: profile.phoneNumber ?? "",
            dateUpdated: new Date(),
        }, { where: { userId } });
        if (!user)
            throw new common_1.NotFoundException("User not found");
        return this.toProfile(user);
    }
    toProfile(user) {
        const { userId, email, firstName, middleInitial, lastName, companyName, title, phoneNumber, isPasswordChangeRequired, } = user;
        return {
            userId,
            email,
            firstName,
            middleInitial: middleInitial ?? "",
            lastName,
            companyName,
            title: title ?? "",
            phoneNumber: phoneNumber ?? "",
            isPasswordChangeRequired,
        };
    }
    async getAllUsers(filter, options) {
        return await this.userRepo.getAllUsers(filter, options);
    }
    async getSdUsers(filter, options) {
        return await this.userRepo.getSdUsers(filter, options);
    }
    async createUser(createUser) {
        this.userRepo.createUser(createUser);
    }
    async getUser(filter, options) {
        return await this.userRepo.getUser(filter, options);
    }
    async updateUserByWhereAndGetData(updateFilter, updateBody, option) {
        return await this.userRepo.updateUserByWhereAndGetData(updateFilter, updateBody, updateFilter, option);
    }
    async deleteUser(userId) {
        const user = await this.userRepo.getUser({
            where: { userId },
            select: ["cognitoId"],
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        await this.userRepo.getDeleteById(userId);
        await this.cognitoService.deleteUser(user.cognitoId);
    }
};
exports.AdmUserService = AdmUserService;
exports.AdmUserService = AdmUserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [adm_user_repo_1.AdmUserRepo,
        aws_cognito_service_1.AWSCognitoService])
], AdmUserService);
//# sourceMappingURL=adm-user.service.js.map