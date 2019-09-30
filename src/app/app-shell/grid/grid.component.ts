import { Component, OnInit } from '@angular/core';

import { GridService, IGridImageItem } from './grid.service';

import { faUpload } from '@fortawesome/free-solid-svg-icons'

// angular animations
import {
	trigger,
	style,
	animate,
	transition
} from '@angular/animations';

@Component({
	selector: 'app-grid',
	templateUrl: './grid.component.html',
	styleUrls: ['./grid.component.css'],
	animations: [
		trigger('images', [
		  transition(':enter', [
			style({ transform: 'scale(0.5)', opacity: 0 }),  // initial
			animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)', 
			  style({ transform: 'scale(1)', opacity: 1 }))  // final
		  ]),
		  transition(':leave', [
			style({ transform: 'scale(1)', opacity: 1, height: '*' }),
			animate('1s cubic-bezier(.8, -0.6, 0.2, 1.5)', 
			 style({ 
			   transform: 'scale(0.5)', opacity: 0, 
			   height: '0px', margin: '0px' 
			 })) 
		  ])
		])
	  ]
})
export class GridComponent implements OnInit {

	WarningMessageText = 'Request to get grid images failed:';
	WarningMessageOpen = false;

	gridImages: IGridImageItem[] = [];
	allImageLabels: string[] = [];
	searchQuery: string = '';

	
	selectedImage: File[];
	uploadInProgress = false;
	fileUploadIcon = faUpload;

	constructor(private gridService: GridService) { }
	
	ngOnInit() {
		this.gridService.getImages().subscribe(
			result => {
				this.gridImages = result;

				// collect all image annotations into an array
				this.getAllImageLabels();
			},
			error => {
				this.WarningMessageOpen = true;
				this.WarningMessageText = `Request to get grid images failed: ${error}`;
			}
		);
	}

	onFileChanged(event) {
		this.selectedImage = Array.from(event.target.files);

		this.handleUploadImage();
	}
		
	handleUploadImage() {
		this.uploadInProgress = true;

		this.gridService.uploadImage(this.selectedImage).subscribe(
			(response) => {
				this.gridImages.push(...response);
				this.getAllImageLabels();
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
		this.gridImages.splice(i, 1);
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

	getAllImageLabels() {
		// collect all image annotations into an array
		this.allImageLabels = this.gridImages.reduce((labels, image) => {
			if(!image.labelAnnotations || !image.labelAnnotations.length) return [];
			return labels.concat(image.labelAnnotations.map(annotation => annotation['description']));
		}, []).filter((value, index, self) => self.indexOf(value) === index);
	}
}
	