import { Global, Module } from "@nestjs/common";
import { GeneRepoService } from "./gene-repo.service";

@Global()
@Module({
  providers: [GeneRepoService],
  exports: [GeneRepoService],
})
export class GeneRepoModule {}
