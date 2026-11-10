import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AdmFeature } from "../adm-feature/adm-feature.entity";

@Index("PK_ADM_MODULE", ["moduleId"], { unique: true })
@Entity("ADM_MODULE", { schema: "dbo" })
export class AdmModule {
  @PrimaryGeneratedColumn({ type: "int", name: "MODULE_ID" })
  moduleId: number;

  @Column("varchar", { name: "MODULE_NAME", length: 100 })
  moduleName: string;

  @Column("int", { name: "SORT_ORDER" })
  sortOrder: number;

  @OneToMany(() => AdmFeature, (admFeature) => admFeature.module)
  admFeatures: AdmFeature[];
}
