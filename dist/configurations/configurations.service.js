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
exports.ConfigurationsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const aws_sdk_1 = require("aws-sdk");
let ConfigurationsService = class ConfigurationsService {
    constructor(configurations) {
        this.configurations = configurations;
        this.secretsManager = new aws_sdk_1.SecretsManager({
            region: this.configurations.get("SECRET_NAME_REGION"),
        });
    }
    async loadConfigurations() {
        const dbSecretName = this.configurations.get("SECRET_NAME");
        const dbConfig = this.configurations.get("SECRET_NAME_DB");
        const awsConfig = await this.getSecretValue(dbSecretName);
        const dbInfo = await this.getSecretValue(dbConfig);
        this.configs = {
            ...awsConfig,
            SQL_USER: dbInfo?.username,
            SQL_PASSWORD: dbInfo?.password,
            SQL_HOST: dbInfo?.host,
            SQL_PORT: dbInfo?.port,
            SQL_DATABASE: dbInfo?.dbInstanceIdentifier,
        };
        await this.setConfigGlobally();
    }
    async setConfigGlobally() {
        for (const key in this.configs) {
            this.configurations.set(key, this.configs[key]);
        }
    }
    async getSecretValue(secretName) {
        try {
            const data = await this.secretsManager
                .getSecretValue({ SecretId: secretName })
                .promise();
            return JSON.parse(data.SecretString || "");
        }
        catch (err) {
            console.error("Error fetching secret:", err);
            return undefined;
        }
    }
};
exports.ConfigurationsService = ConfigurationsService;
exports.ConfigurationsService = ConfigurationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ConfigurationsService);
//# sourceMappingURL=configurations.service.js.map