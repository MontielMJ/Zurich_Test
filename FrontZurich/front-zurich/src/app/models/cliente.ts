export interface Cliente {
    id?: number;
    fullname: string;
    email: Email;
    phone: string;
    identificationNumber: string;
    createAt: Date;
    status: boolean;
}
export interface Email {
  value: string;
}