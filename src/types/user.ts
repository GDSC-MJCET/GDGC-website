export type AppUser = {
  _id: string;
  id?: string;
  name?: string;
  fullName?: string;
  email: string;
  admin?: boolean;
  superadmin?: boolean;
};
