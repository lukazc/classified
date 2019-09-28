import { Component, OnInit } from '@angular/core';

import { GridService, IGridImageItem } from './grid.service';

import { faUpload } from '@fortawesome/free-solid-svg-icons'

@Component({
	selector: 'app-grid',
	templateUrl: './grid.component.html',
	styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {

	WarningMessageText = 'Request to get grid images failed:';
	WarningMessageOpen = false;

	gridImages: IGridImageItem[] = [];
	allImageLabels: string[] = [];
	searchQuery: string = '';

	
	selectedImage: File;
	uploadInProgress = false;
	fileUploadIcon = faUpload;

	constructor(private gridService: GridService) { }
	
	ngOnInit() {
		this.gridService.getImages().subscribe(
			result => {
				this.gridImages = result;

				// collect all image annotations into an array
				this.allImageLabels = this.gridImages.reduce((labels, image) => {
					if(!image.labelAnnotations || !image.labelAnnotations.length) return [];
					return labels.concat(image.labelAnnotations.map(annotation => annotation['description']));
				}, []);
			},
			error => {
				this.WarningMessageOpen = true;
				this.WarningMessageText = `Request to get grid images failed: ${error}`;
			}
		);
	}

	onFileChanged(event) {
		this.selectedImage = event.target.files[0];

		this.handleUploadImage();
	}
		
	handleUploadImage() {
		this.uploadInProgress = true;

		this.gridService.uploadImage(this.selectedImage).subscribe(
			(response) => {
				this.gridImages.push(response);
				this.uploadInProgress = false;
			},
			error => {
				this.WarningMessageOpen = true;
				this.WarningMessageText = `Request to add Image failed: ${error}`;
				this.uploadInProgress = false;
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

	filterImages(searchQuery) {
		this.searchQuery = searchQuery;
	}
}
	