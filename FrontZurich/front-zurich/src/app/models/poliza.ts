export interface Folio {
  value: number;
}

export interface Poliza {
  id?: number;
  folio: Folio;
  idTypePolicy: string;
  initDate: string | Date;
  endDate: string | Date;
  insuredAmount: number;
  idClient: number;
  status: boolean;
  cliente?: { // Opcional: para cuando traigas datos del cliente
    fullname: string;
    email: { value: string };
  };
}