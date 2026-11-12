import { Injectable, NotFoundException } from "@nestjs/common";
import { AdmUserRepo } from "./adm-user.repo";
import { CreateUser } from "./interfaces/user.interface";
import { AWSCognitoService } from "src/aws/aws-cognito.service";
import { AdmUser } from "./adm-user.entity";
import { UpdateProfileDto } from "./dto/update-profile.dto";
@Injectable()
export class AdmUserService {
  constructor(
    private userRepo: AdmUserRepo,
    private readonly cognitoService: AWSCognitoService,
  ) {}

  async getProfile(userId: number) {
    const user: AdmUser = await this.userRepo.getUser(
      { where: { userId } },
      { relations: ["agency"] },
    );
    if (!user) throw new NotFoundException("User not found");
    return this.toProfile(user);
  }

  async updateProfile(userId: number, profile: UpdateProfileDto) {
    const [user] = await this.userRepo.updateUserByWhereAndGetData(
      { where: { userId } },
      {
        firstName: profile.firstName,
        lastName: profile.lastName,
        title: profile.title ?? "",
        phoneNumber: profile.phoneNumber ?? "",
        dateUpdated: new Date(),
      },
      { where: { userId } },
      { relations: ["agency"] },
    );
    if (!user) throw new NotFoundException("User not found");
    return this.toProfile(user);
  }

  private toProfile(user: AdmUser) {
    const {
      userId,
      email,
      firstName,
      lastName,
      title,
      phoneNumber,
      agencyId,
      userType,
      isActive,
      dateCreated,
      dateUpdated,
      agency,
    } = user;
    const agencyName = agency?.agencyName ?? "";
    return {
      userId,
      email,
      firstName,
      lastName,
      title: title ?? "",
      phoneNumber: phoneNumber ?? "",
      agencyId,
      agencyName,
      // Logical alias of agencyName — the profile form field is named companyName
      companyName: agencyName,
      userType,
      isActive,
      dateCreated,
      dateUpdated,
    };
  }

  async getAllUsers(filter?: any, options?: any) {
    return await this.userRepo.getAllUsers(filter, options);
  }

  async getSdUsers(filter?: any, options?: any) {
    return await this.userRepo.getSdUsers(filter, options);
  }
  async createUser(createUser: CreateUser) {
    return this.userRepo.createUser(createUser);
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
    if (user.cognitoId) {
      await this.cognitoService.deleteUser(user.cognitoId);
    }
  }
}
