import { Permission } from "./permission";

export interface User {
    regulamin_panel_uzytk: boolean;
    dane_osobowe_panel_uzytk: boolean;
    permission: Permission[];
    jezyk: string;
    email:string;
    czy_aktywny:boolean;
    nazwisko:string;
    imie:string;
    haslo:string;
    nazwa_uzytkownika:string;
    firma:string;
    grupa_id: number;
    kontrahent_nazwa: string;
    kontrahent_id : number;
    uzytkownik_id?:number;
}