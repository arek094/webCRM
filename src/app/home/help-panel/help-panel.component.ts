import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HelpMessageComponent } from 'src/app/core/help-message/help-message.component';

interface Instrukcja {
  sciezka: string
  instrukcja_nazwa: string;
  instrukcja_id?:number;
}

interface KategoriaInstrukcje {
  instrukcja: Instrukcja[];
  kategoria_nazwa: string;
  kategoria_id?:number;
}


@Component({
  selector: 'app-help-panel',
  templateUrl: './help-panel.component.html',
  styleUrls: ['./help-panel.component.scss']
})
export class HelpPanelComponent implements OnInit {

  pdfSrc: string = './././assets/help-instructions/konto_konfiguracja_systemu/zakladanie_konta_w_systemie_webcrm.pdf'
  nazwa_instrukcji = 'Zakładanie konta w systemie webCRM'

  public instrukcje: KategoriaInstrukcje[] = [
    {
      kategoria_id: 1,
      kategoria_nazwa: 'Konto - konfiguracja konta',
      instrukcja: [
        {instrukcja_id:1, instrukcja_nazwa:'Zakładanie konta w systemie webCRM',sciezka:'./././assets/help-instructions/konto_konfiguracja_systemu/zakladanie_konta_w_systemie_webcrm.pdf'},
        {instrukcja_id:2, instrukcja_nazwa:'Logowanie do systemu webCRM',sciezka:'./././assets/help-instructions/konto_konfiguracja_systemu/logowanie_do_systemu_webcrm.pdf'},
        {instrukcja_id:3, instrukcja_nazwa:'Zmiana lub przypomnienie hasła',sciezka:'./././assets/help-instructions/konto_konfiguracja_systemu/zmiana_lub_przypomnienie_hasla.pdf'}
      ]
    }, {
      kategoria_id: 2,
      kategoria_nazwa: 'Zamówienia surowców',
      instrukcja: [
        {instrukcja_id:4, instrukcja_nazwa:'Podstawowe standardy',sciezka:'./././assets/help-instructions/zamowienia_surowcow/podstawowe_standardy.pdf'},
        {instrukcja_id:5, instrukcja_nazwa:'Interfejs',sciezka:'./././assets/help-instructions/zamowienia_surowcow/interfejs.pdf'},
        {instrukcja_id:6, instrukcja_nazwa:'Nowe zamówienie',sciezka:'./././assets/help-instructions/zamowienia_surowcow/nowe_zamowienie.pdf'},
        {instrukcja_id:7, instrukcja_nazwa:'Zamówienie różnicowe',sciezka:'./././assets/help-instructions/zamowienia_surowcow/zamowienie_roznicowe.pdf'},
        {instrukcja_id:8, instrukcja_nazwa:'Szczegóły / Edycja zamówienia',sciezka:'./././assets/help-instructions/zamowienia_surowcow/szczegoly_edycja_zamowienia.pdf'},
        {instrukcja_id:9, instrukcja_nazwa:'Kopiowanie',sciezka:'./././assets/help-instructions/zamowienia_surowcow/kopiowanie.pdf'},
        {instrukcja_id:10, instrukcja_nazwa:'Zatwierdzanie',sciezka:'./././assets/help-instructions/zamowienia_surowcow/zatwierdzanie.pdf'},
        {instrukcja_id:11, instrukcja_nazwa:'Anulowanie',sciezka:'./././assets/help-instructions/zamowienia_surowcow/anulowanie.pdf'},
        {instrukcja_id:12, instrukcja_nazwa:'Usuwanie',sciezka:'./././assets/help-instructions/zamowienia_surowcow/usuwanie.pdf'},
      ]
    },
    {
      kategoria_id: 3,
      kategoria_nazwa: 'Zamówienia dostawców',
      instrukcja: [
        
      ]
    }
  ];

  constructor(
    private dialog: MatDialog
  ) { 
    
  }

 

  ngOnInit() {
  }

  helpMessage(){
    this.dialog.open(HelpMessageComponent, {
      panelClass: 'matDialog',
      disableClose: false
    })
  }

  changeInstructions(instrukcja_sciezka, instrukcja_nazwa){
    this.pdfSrc = instrukcja_sciezka
    this.nazwa_instrukcji = instrukcja_nazwa
  }

}
