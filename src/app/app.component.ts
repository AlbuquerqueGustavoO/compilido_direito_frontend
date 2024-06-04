import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './service/analytics.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'adv site';

  constructor(private analyticsService: AnalyticsService){}

  ngOnInit(): void {
    this.analyticsService.trackEvent('Página inicial','Pagina inicial into view');
  }

}
