import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-grid-box',
  templateUrl: './grid-box.component.html',
  styleUrls: ['./grid-box.component.css']
})
export class GridBoxComponent implements OnInit {

  @Input() filename: number;
  @Input() header: string;
  @Input() labels: string;
  @Input() image: string;

  constructor() { }

  ngOnInit() { }

}
