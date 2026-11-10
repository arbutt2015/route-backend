import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { AdmFeature } from "../adm-feature/adm-feature.entity";

@Index("PK_ROLE_FEATURE", ["roleId", "featureId"], { unique: true })
@Entity("ADM_ROLE_FEATURE", { schema: "dbo" })
export class AdmRoleFeature {
  @Column("int", { primary: true, name: "ROLE_ID" })
  roleId: number;

  @Column("int", { primary: true, name: "FEATURE_ID" })
  featureId: number;

  @Column("bit", { name: "CREATE_PERMISSION" })
  createPermission: boolean;

  @Column("bit", { name: "READ_PERMISSIONS" })
  readPermissions: boolean;

  @Column("bit", { name: "UPDATE_PERMISSION" })
  updatePermission: boolean;

  @Column("bit", { name: "DELETE_PERMISSIONS" })
  deletePermissions: boolean;

  @ManyToOne(() => AdmFeature, (admFeature) => admFeature.admRoleFeatures, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "FEATURE_ID", referencedColumnName: "featureId" }])
  feature: AdmFeature;
}
