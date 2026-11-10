import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SecretsManager } from "aws-sdk";

@Injectable()
export class ConfigurationsService {
  private configs: any;
  private secretsManager: SecretsManager;
  constructor(private configurations: ConfigService) {
    this.secretsManager = new SecretsManager({
      region: this.configurations.get<string>("SECRET_NAME_REGION"),
      // Add any additional AWS configuration here
    });
  }

  async loadConfigurations() {
    // Fetch database configuration from AWS Secret Manager
    const dbSecretName = this.configurations.get<string>("SECRET_NAME");
    const dbConfig = this.configurations.get<string>("SECRET_NAME_DB");
    const dbConfigRead = this.configurations.get<string>(
      "SECRET_NAME_DB_READ_ONLY",
    );
    // Inject the AwsService here to fetch the secret value
    const awsConfig: any = await this.getSecretValue(dbSecretName);
    const dbInfo: any = await this.getSecretValue(dbConfig);
    const dbConfigReadOnly: any = await this.getSecretValue(dbConfigRead);
    this.configs = {
      ...awsConfig,
      SQL_USER: dbInfo?.username,
      SQL_PASSWORD: dbInfo?.password,
      SQL_HOST: dbInfo?.host,
      SQL_PORT: dbInfo?.port,
      SQL_DATABASE: dbInfo?.dbInstanceIdentifier,
      SQL_USER_READ_ONLY: dbConfigReadOnly?.username,
      SQL_PASSWORD_READ_ONLY: dbConfigReadOnly?.password,
      SQL_HOST_READ_ONLY: dbConfigReadOnly?.host,
      SQL_PORT_READ_ONLY: dbConfigReadOnly?.port,
      SQL_DATABASE_READ_ONLY: dbConfigReadOnly?.dbInstanceIdentifier,
    };

    await this.setConfigGlobally();
  }
  async setConfigGlobally() {
    for (const key in this.configs) {
      this.configurations.set(key, this.configs[key]);
    }
  }
  async getSecretValue(secretName: string): Promise<string | undefined> {
    try {
      const data = await this.secretsManager
        .getSecretValue({ SecretId: secretName })
        .promise();
      return JSON.parse(data.SecretString || "");
    } catch (err) {
      console.error("Error fetching secret:", err);
      return undefined;
    }
  }
}
