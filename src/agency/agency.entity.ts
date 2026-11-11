import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { AdmUser } from "../adm-user/adm-user.entity";
import { Project } from "../project/project.entity";

@Index("PK_AGENCY", ["agencyId"], { unique: true })
@Entity("AGENCY", { schema: "dbo" })
export class Agency {
  @PrimaryGeneratedColumn({ type: "int", name: "AGENCY_ID" })
  agencyId: number;

  @Column("nvarchar", { name: "AGENCY_NAME", length: 200 })
  agencyName: string;

  @Column("varchar", { name: "PHONE", nullable: true, length: 50 })
  phone: string | null;

  @Column("varchar", { name: "WEBSITE", nullable: true, length: 200 })
  website: string | null;

  @Column("varchar", { name: "CITY", nullable: true, length: 100 })
  city: string | null;

  @Column("varchar", { name: "STATE", nullable: true, length: 100 })
  state: string | null;

  @Column("varchar", { name: "ZIP_CODE", nullable: true, length: 20 })
  zipCode: string | null;

  @Column("varchar", { name: "ADDRESS_LINE_1", nullable: true, length: 200 })
  addressLine1: string | null;

  @Column("varchar", { name: "ADDRESS_LINE_2", nullable: true, length: 200 })
  addressLine2: string | null;

  @Column("varchar", { name: "IMAGE_URL", nullable: true, length: 500 })
  imageUrl: string | null;

  @Column("varchar", { name: "AGENCY_CODE", nullable: true, length: 50 })
  agencyCode: string | null;

  @Column("varchar", { name: "COUNTRY", nullable: true, length: 100 })
  country: string | null;

  @CreateDateColumn({ type: "datetime2", name: "DATE_CREATED", nullable: true })
  dateCreated: Date;

  @UpdateDateColumn({ type: "datetime2", name: "DATE_UPDATED", nullable: true })
  dateUpdated: Date;

  @OneToMany(() => AdmUser, (user) => user.agency)
  users: AdmUser[];

  @OneToMany(() => Project, (project) => project.agency)
  projects: Project[];
}
