export interface Lead {
  Code: number;
  Email: string;
  Name: string;
  MachineCode: string;
  Phone: string;
  Birthday: string;
  Photo: string;
  City: string;
  State: string;
  Company: string;
  Gender: string;
  Score: number;
  RegistrationDate: string;
}

export interface GetLeadsResponse {
  Data: Lead[];
  Links: {
    Self: string | null;
    Next: string | null;
    Prev: string | null;
  };
}

export interface Tags {
  Id: number;
  Title: string;
  Count: number;
}

export interface CreateLeadResponse {
  Message: string;
}

export type UpdateLeadResponse =
  | {
      Code: number;
      Email: string;
      Name: string;
      MachineCode: string;
      Phone: string;
      Birthday: string;
      Photo: string;
      City: string;
      State: string;
      Company: string;
      Gender: string;
      Score: number;
      Srce: string;
      Level: number;
      Id: number;
      Status: string;
      Tags: Tags[];
      EmailSequenceCode: number;
      SequenceLevelCode: number;
      StatusCode: 'SUCCESS' | 'OK' | 'Created' | 'NoContent' | 'PartialContent' | 'Accepted';
      Message: string;
      Exception?: {
        Message: string;
      };
    }
  | {
      StatusCode: 'ERROR' | 'BadRequest' | 'Unauthorized' | 'NotFound';
      Message: string;
    };

export interface DeleteLeadResponse {
  Message: string;
}

export interface Machines {
  MachineCode: number;
  MachineName: string;
  MachineImage: string;
  Views: number;
  Leads: number;
}

export interface GetMachinesResponse {
  Items: Machines[];
  CurrentPage: number;
  Registers: number;
}

export interface GetMachineDetailsResponse {
  Items: Machines[];
}

export interface SequenceEmail {
  SequenceCode: number;
  SequenceName: string;
}

export interface GetSequenceEmailsResponse {
  Items: SequenceEmail[];
}

export interface ApiResponse {
  Message: string;
}
