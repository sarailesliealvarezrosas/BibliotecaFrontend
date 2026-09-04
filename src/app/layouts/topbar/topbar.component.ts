import { Component, OnInit, EventEmitter, Output, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { EventService } from '../../core/services/event.service';

// Language
import { CookieService } from 'ngx-cookie-service';
import { LanguageService } from '../../core/services/language.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../../core/services/auth.service';
import { MENU } from '../sidebar/menu';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  menuItems: any[] = [];
  avatar = "default-profile1.png";
  @Output() mobileMenuButtonClicked = new EventEmitter();
  
  flagvalue: any;
  valueset: any;
  countryName: any;
  cookieValue: any;
  
  // Declarar las propiedades faltantes
  element: any;
  listLang: any[] = [
    { lang: 'es', text: 'Español', flag: 'assets/icons/flags/spain.svg' },
    { lang: 'en', text: 'English', flag: 'assets/icons/flags/us.svg' },
    // Agrega más idiomas según necesites
  ];

  constructor(
    @Inject(DOCUMENT) private document: any,
    private eventService: EventService,
    public languageService: LanguageService,
    public _cookiesService: CookieService,
    public translate: TranslateService,
    private authService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.element = document.documentElement;
    this.avatar = "default-profile1.png";
    this.menuItems = MENU;

    // Cookies wise Language set
    this.cookieValue = this._cookiesService.get('lang');
    const val = this.listLang.filter(x => x.lang === this.cookieValue);
    this.countryName = val.map(element => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) { this.valueset = 'assets/icons/flags/spain.svg'; }
    } else {
      this.flagvalue = val.map(element => element.flag);
    }
  }

  // ====== logout ======
  logout(): void {
    this.authService.logout();
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    document.querySelector('.hamburger-icon')?.classList.toggle('open');
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /***
   * Language Value Set
   */
  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
  }

}