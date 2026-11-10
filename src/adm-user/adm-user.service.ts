import { Injectable, NotFoundException } from "@nestjs/common";
import { AdmUserRepo } from "./adm-user.repo";
import { CreateUser } from "./interfaces/user.interface";
import { AWSCognitoService } from "src/aws/aws-cognito.service";
@Injectable()
export class AdmUserService {
  constructor(
    private userRepo: AdmUserRepo,
    private readonly cognitoService: AWSCognitoService,
  ) {}

  async getAllUsers(filter?: any, options?: any) {
    return await this.userRepo.getAllUsers(filter, options);
  }

  async getSdUsers(filter?: any, options?: any) {
    return await this.userRepo.getSdUsers(filter, options);
  }
  async createUser(
    createUser: CreateUser & { isPasswordChangeRequired: boolean },
  ) {
    this.userRepo.createUser(createUser);
  }

  async getUser(filter?: any, options?: any): Promise<any> {
    return await this.userRepo.getUser(filter, options);
  }

  async updateUserByWhereAndGetData(
    updateFilter: any,
    updateBody: any,
    option?: any,
  ) {
    return await this.userRepo.updateUserByWhereAndGetData(
      updateFilter,
      updateBody,
      updateFilter,
      option,
    );
  }

  async deleteUser(userId: number) {
    const user = await this.userRepo.getUser({
      where: { userId },
      select: ["cognitoId"],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    await this.userRepo.getDeleteById(userId);
    await this.cognitoService.deleteUser(user.cognitoId);
  }
}
