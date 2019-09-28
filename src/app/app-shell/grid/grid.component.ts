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
	selectedImage: File;
	
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

	onFileChanged(event) {
		this.selectedImage = event.target.files[0];
	}
		
	handleUploadImage() {
		this.gridService.uploadImage(this.selectedImage).subscribe(
			(response) => {
				this.gridImages.push(response);
			},
			error => {
				this.WarningMessageOpen = true;
				this.WarningMessageText = `Request to add Image failed: ${error}`;
			}
			);
	}

	handleDeleteImage(filename, i) {
		this.gridImages.splice(i);
		this.gridService.deleteImage(filename).subscribe(
			res => {

				console.log('image deleted ' + filename)
			},
			error => {
				this.WarningMessageOpen = true;
				this.WarningMessageText = `Request to delete image failed: ${error}`;
			}
		);
	}
		
	handleWarningClose(open: boolean) {
		this.WarningMessageOpen = open;
		this.WarningMessageText = '';
	}
}
	