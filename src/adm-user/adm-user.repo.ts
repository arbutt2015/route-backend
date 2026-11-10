import { Injectable } from "@nestjs/common";
import { GeneRepoService } from "src/gene-repo/gene-repo.service";
import { CreateUser } from "./interfaces/user.interface";

@Injectable()
export class AdmUserRepo {
  private userRepository: any;
  constructor(private geneRepoService: GeneRepoService) {
    (async () => {
      this.userRepository = await this.geneRepoService.getRepository("AdmUser");
    })();
  }

  async getAllUsers(filter?: any, options?: any) {
    const users = await this.geneRepoService.getAll(
      this.userRepository,
      filter,
      options,
    );
    return users;
  }

  async getSdUsers(filter?: any, options?: any) {
    const users = await this.geneRepoService.getAll(
      this.userRepository,
      filter,
      options,
    );
    return users;
  }

  async createUser(user: CreateUser) {
    return this.geneRepoService.create(this.userRepository, user);
  }

  async getUser(filter?: any, options?: any) {
    return await this.geneRepoService.getOne(
      this.userRepository,
      filter,
      options,
    );
  }

  async getDeleteById(id: number) {
    return await this.geneRepoService.deleteById(this.userRepository, id);
  }

  async updateUserByWhereAndGetData(
    updateFilter: any,
    updateBody: any,
    findFilter?: any,
    options?: any,
  ) {
    return await this.geneRepoService.updateByWhereAndGetData(
      this.userRepository,
      updateFilter,
      updateBody,
      findFilter,
      options,
    );
  }
}
