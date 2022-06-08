import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { TranslateCacheService } from 'ngx-translate-cache';
import { of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-change-language',
  templateUrl: './change-language.component.html',
  styleUrls: ['./change-language.component.scss']
})
export class ChangeLanguageComponent implements OnInit {

  formLanguage:FormGroup;
  public browserLang: string;

  language  = [
    {value:'en', label:'Angielski',src:'././assets/images/icon-language/united-states.png'},
    {value:'pl',label:'Polski',src:'././assets/images/icon-language/poland.png'}
  ]

  constructor(
    private formBuilder: FormBuilder,
    public translate: TranslateService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.buildForm()
  }

  onChange($event) {
    this.translate.setDefaultLang($event.value)
    this.translate.use($event.value)
}

  private buildForm(){

    let user_lang;
    ​​try { 
    ​​  user_lang = this.authService.user.jezyk
    ​​} catch (error) { 
    ​​  user_lang = null;
    ​​};

    if (user_lang == null){
      var lang = this.translate.getDefaultLang()
    } else {
      var lang = this.authService.user.jezyk
    }

    var getlanguage = this.language.filter(s => s.value.includes(lang));

    this.formLanguage=this.formBuilder.group({
      jezyk: [getlanguage[0].label],
    })}
  

}
