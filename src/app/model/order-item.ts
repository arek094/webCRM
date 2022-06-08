export interface OrderItem {
        zam_nag_dost_id: number,
        wytwor_id: number,
        nr_poz: number,
        wytwor_idm: string,
        wytwor_nazwa: string,
        ilosc_oczekiwana: number,
        ilosc_wydana: number,
        jm_idn: string,
        jm_id: number,
        uwagi_poz: string,
        czy_zamowienie_roznicowe: boolean,
        anulowany: string,
        zam_poz_dost_id?: number
  }