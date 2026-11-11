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
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("@nestjs/config");
const jwksRsa = require("jwks-rsa");
const adm_user_service_1 = require("../adm-user/adm-user.service");
const auth_service_1 = require("./auth.service");
const logger_service_1 = require("../logger/logger.service");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(configService, admUserService, loggerService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKeyProvider: jwksRsa.passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksUri: `https://cognito-idp.${configService.get("AWS_POOL_REGION")}.amazonaws.com/${configService.get("AWS_POOL_USER_ID")}/.well-known/jwks.json`,
            }),
            algorithms: ["RS256"],
        });
        this.admUserService = admUserService;
        this.loggerService = loggerService;
        this.loggerService.log("JwtStrategy initialized");
    }
    async validate(payload) {
        const user = (await this.admUserService.getAllUsers({
            where: { cognitoId: payload.sub },
        }))[0];
        if (!user) {
            throw new common_1.UnauthorizedException("User not found ");
        }
        if (!user?.isActive) {
            throw new common_1.UnauthorizedException("User  not active ");
        }
        const isAdmin = user.userType === auth_service_1.USER_TYPE.SUPER_USER;
        return {
            cognitoId: payload.sub,
            username: payload?.username,
            ...user,
            usersAccess: isAdmin,
            createProjectAccess: isAdmin,
            assetsAccess: isAdmin,
        };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        adm_user_service_1.AdmUserService,
        logger_service_1.LoggerService])
], JwtStrategy);
//# sourceMappingURL=jwt-strategy.js.map