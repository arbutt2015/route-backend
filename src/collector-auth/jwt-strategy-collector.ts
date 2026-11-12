import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class CustomJwtStrategy extends PassportStrategy(Strategy, "custom") {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("AWS_COGNITO_CLIENT_SECRET"),
    });
  }

  async validate(payload: any) {
    return {
      sub: payload.sub,
      collectorCode: payload.collectorCode ?? payload.sub,
      projectId: payload.projectId,
      projectNumber: payload.projectNumber,
    };
  }
}
