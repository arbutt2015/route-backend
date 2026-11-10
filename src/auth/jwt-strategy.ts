// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import * as jwksRsa from "jwks-rsa";
import { AdmUserService } from "src/adm-user/adm-user.service";
import { LoggerService } from "src/logger/logger.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private admUserService: AdmUserService,
    private readonly loggerService: LoggerService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksUri: `https://cognito-idp.${configService.get<string>("AWS_POOL_REGION")}.amazonaws.com/${configService.get<string>("AWS_POOL_USER_ID")}/.well-known/jwks.json`,
      }),
      algorithms: ["RS256"],
    });
    this.loggerService.log("JwtStrategy initialized");
  }

  async validate(payload: any) {
    const user: any = (
      await this.admUserService.getAllUsers({
        where: { cognitoId: payload.sub },
      })
    )[0];
    if (!user) {
      throw new UnauthorizedException("User not found ");
    }
    if (!user?.isActive) {
      throw new UnauthorizedException("User  not active ");
    }
    return {
      cognitoId: payload.sub,
      username: payload?.username,
      ...user,
    };
  }
}
