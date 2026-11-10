import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AdmModule } from "../adm-module/adm-module.entity";
import { AdmRoleFeature } from "../adm-role-feature/adm-role-feature.entity";

@Index("PK_ADM_FEATURE", ["featureId"], { unique: true })
@Entity("ADM_FEATURE", { schema: "dbo" })
export class AdmFeature {
  @PrimaryGeneratedColumn({ type: "int", name: "FEATURE_ID" })
  featureId: number;

  @Column("varchar", { name: "FEATURE_NAME", length: 100 })
  featureName: string;

  @Column("varchar", { name: "FEATURE_URL", length: 200 })
  featureUrl: string;

  @Column("int", { name: "SORT_ORDER" })
  sortOrder: number;

  @ManyToOne(() => AdmModule, (admModule) => admModule.admFeatures, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "MODULE_ID", referencedColumnName: "moduleId" }])
  module: AdmModule;

  @OneToMany(() => AdmRoleFeature, (admRoleFeature) => admRoleFeature.feature)
  admRoleFeatures: AdmRoleFeature[];
}
