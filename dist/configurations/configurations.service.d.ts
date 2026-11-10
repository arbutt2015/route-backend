import { ConfigService } from "@nestjs/config";
export declare class ConfigurationsService {
    private configurations;
    private configs;
    private secretsManager;
    constructor(configurations: ConfigService);
    loadConfigurations(): Promise<void>;
    setConfigGlobally(): Promise<void>;
    getSecretValue(secretName: string): Promise<string | undefined>;
}
