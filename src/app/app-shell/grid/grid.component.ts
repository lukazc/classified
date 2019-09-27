import { Component, OnInit } from '@angular/core';

import { GridService, IGridImageItem } from './grid.service';

@Component({
	selector: 'app-grid',
	templateUrl: './grid.component.html',
	styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {
	
	WarningMessageText = 'Request to get grid images failed:';
	WarningMessageOpen = false;
	gridImages: IGridImageItem[] = [];
	
	constructor(private gridService: GridService) { }
	
	ngOnInit() {
		this.gridService.getImages().subscribe(
			result => {
				this.gridImages = result;
			},
			error => {
				this.WarningMessageOpen = true;
				this.WarningMessageText = `Request to get grid images failed: ${error}`;
			}
		);
	}
		
	handleWarningClose(open: boolean) {
		this.WarningMessageOpen = open;
		this.WarningMessageText = '';
	}
}
	