import { AdmUser } from "../adm-user/adm-user.entity";
import { Project } from "../project/project.entity";
export declare class Agency {
    agencyId: number;
    agencyName: string;
    phone: string | null;
    website: string | null;
    city: string | null;
    state: string | null;
    zipCode: string | null;
    addressLine1: string | null;
    addressLine2: string | null;
    imageUrl: string | null;
    agencyCode: string | null;
    country: string | null;
    dateCreated: Date;
    dateUpdated: Date;
    users: AdmUser[];
    projects: Project[];
}
