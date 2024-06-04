import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../service/analytics.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {


    constructor(private analyticsService: AnalyticsService) { }

    ngOnInit(): void {
        this.analyticsService.trackEvent('Home', 'Home into view');
    }


}
