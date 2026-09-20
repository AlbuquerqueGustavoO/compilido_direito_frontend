import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AnalyticsService } from './service/analytics.service';

const DESKTOP_BREAKPOINT = 993;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'adv site';

  // Em telas grandes a sidebar inicia expandida; em telas pequenas inicia
  // fechada (comporta-se como uma gaveta aberta pelo botão da topbar).
  sidebarOpen = window.innerWidth >= DESKTOP_BREAKPOINT;

  constructor(private analyticsService: AnalyticsService, private router: Router) { }

  ngOnInit(): void {
    this.analyticsService.trackEvent('Página inicial', 'Pagina inicial into view');

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        if (window.innerWidth < DESKTOP_BREAKPOINT) {
          this.sidebarOpen = false;
        }
      });
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
