export interface CreateUser {
  email: string;
  firstName: string;
  middleInitial: string;
  lastName: string;
  companyName: string;
  title: string;
  phoneNumber: string;
  password?: string;
  collectorCode?: string;
  isActive?: boolean;
  cognitoId?: string;
  isVerified?: boolean;
  isSdUser?: boolean;
}
