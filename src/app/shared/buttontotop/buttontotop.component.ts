import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-buttontotop',
  templateUrl: './buttontotop.component.html',
  styleUrls: ['./buttontotop.component.scss']
})
export class ButtontotopComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
}
