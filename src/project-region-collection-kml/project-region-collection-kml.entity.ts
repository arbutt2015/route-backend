import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ProjectRegion } from "../project-region/project-region.entity";

@Index("PK_PROJECT_REGION_RECOLLECTION_KML", ["regionCollectionKmlId"], {
  unique: true,
})
@Entity("PROJECT_REGION_COLLECTION_KML", { schema: "dbo" })
export class ProjectRegionCollectionKml {
  @PrimaryGeneratedColumn({ type: "int", name: "REGION_COLLECTION_KML_ID" })
  regionCollectionKmlId: number;

  @Column("varchar", { name: "COLLECTION_KML_PATH", length: 200 })
  collectionKmlPath: string;

  @Column("int", { name: "COLLECTION_ROUND" })
  collectionRound: number;

  @Column("varchar", { name: "COLLECTION_NAME", length: 100 })
  collectionName: string;

  @Column("varchar", {
    name: "COLLECTION_KML_GEO_JSON_PATH",
    nullable: true,
    length: 150,
  })
  collectionKmlGeoJsonPath: string | null;

  @Column("bit", { name: "IS_ACTIVE", default: () => "(0)" })
  isActive: boolean;

  @Column("bit", { name: "IS_PENDING", nullable: true, default: () => "(1)" })
  isPending: boolean | null;

  @ManyToOne(
    () => ProjectRegion,
    (projectRegion) => projectRegion.projectRegionCollectionKmls,
    { onDelete: "CASCADE" },
  )
  @JoinColumn([{ name: "REGION_ID", referencedColumnName: "regionId" }])
  region: ProjectRegion;
}
