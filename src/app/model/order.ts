import { OrderItem } from "./order-item";

export interface Order {
        operacja_id: number;
        kontrahent_id: number;
        kontrahent_nazwa: string;
        uzytkownik_id_zatw: number;
        uzytkownik_id_utworzenia: number;
        data_utworzenia: Date;
        anulowany: boolean;
        data_anulowania: Date;
        status_id:number;
        eksport: boolean;
        eksportWMS: boolean;
        eksportERP: boolean;
        magazynierWMS: number;
        data_realizacji: Date;
        data_realizacji_magazyn: Date;
        uwagi: string;
        numer_zam : string;
        typ_dok_erp_idm: string;
        order_item: OrderItem[];
        zam_nag_dost_id?: number;

  }



