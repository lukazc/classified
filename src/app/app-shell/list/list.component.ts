import { Component, OnInit } from '@angular/core';

import { ListService, IListItem } from './list.service';

@Component({
	selector: 'app-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
	listItems: IListItem[] = [];
	photos = [];
	chosenPhoto: File;
	WarningMessageText = 'Request to get list items failed:';
	WarningMessageOpen = false;
	constructor(private listService: ListService) { }
	
	ngOnInit() {
		this.listService.getListItems().subscribe(
			response => {
				this.listItems = response;
			},
			error => {
				this.WarningMessageOpen = true;
				this.WarningMessageText = `Request to get list items failed: ${error}`;
			}
		);
		
		this.listService.getPhotos().subscribe(
			res => {
				this.photos = res;
			},
			error => {
				console.log(error)
				this.WarningMessageOpen = true;
				this.WarningMessageText = `Request to get PHOTOS failed: ${error}`;
			}
		);
	}

	// getPhotoBase64(filename) {
	// 	this.listService.getSinglePhoto(filename).subscribe(
	// 		res => 'data:image/jpeg;base64,' + res,
	// 		error => {
	// 			console.log(error)
	// 			this.WarningMessageOpen = true;
	// 			this.WarningMessageText = `Request to get SINGLE PHOTO failed: ${error}`;
	// 		}
	// 	);
	// }
		
	handleAddListItem(inputText: string) {
		this.listService.addListItem(inputText).subscribe(
			(response) => {
				this.listItems.splice(0, 0, response);
			},
			error => {
				this.WarningMessageOpen = true;
				this.WarningMessageText = `Request to add list item failed: ${error}`;
			}
			);
	}
		
	
	handleDeleteListItem(id: number) {
		
		this.listService.deleteListItem(id).subscribe(
			response => {
				this.listItems = this.listItems.filter(item => item._id !== response._id);
			},
			error => {
				this.WarningMessageOpen = true;
				this.WarningMessageText = `Request to delete list item failed: ${error}`;
			}
			);
	}

	onFileChanged(event) {
		this.chosenPhoto = event.target.files[0];
	}
		
	handleUploadPhoto() {
		this.listService.addPhoto(this.chosenPhoto).subscribe(
			(response) => {
				// this.photos.splice(0, 0, response);
				this.photos.push(response);
			},
			error => {
				this.WarningMessageOpen = true;
				this.WarningMessageText = `Request to add photo failed: ${error}`;
			}
			);
	}

	handleDeletePhoto(filename, i) {
		this.photos.splice(i, 1);
		this.listService.deletePhoto(filename).subscribe(
			res => {

				console.log('photo deleted ' + filename)
			},
			error => {
				this.WarningMessageOpen = true;
				this.WarningMessageText = `Request to delete photo failed: ${error}`;
			}
		);
	}
		
	handleWarningClose(open: boolean) {
		this.WarningMessageOpen = open;
		this.WarningMessageText = '';
	}
}
				