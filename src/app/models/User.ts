export class User {
  constructor(
    public email: string,
    public firstName: string,
    public lastName: string,
    public password: string,
    public password2?: string,
    public address?: string,
    public biography?: string,
    public cellPhone?: string,
    public created_at?: string,
    public img?: string,
    public isConfirmed?: boolean,
    public lawyer?: string,
    public practice_areas?: any,
    public public_lawyer_id?: string,
    public ratings?: any,
    public role?: string,
    public speciality?: any,
    public status?: boolean,
    public _id?: string
  ) {}
}

export class UsersPagination {
  constructor(
    public docs: User[],
    public total: number,
    public pages: number,
    public page: number,
    public limit: number
  ) {}
}
