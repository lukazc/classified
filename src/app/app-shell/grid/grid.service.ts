import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class GridService {
	
	private imagesUrl = environment.endpoint.image;
	
	constructor(private http: HttpClient) { }
	
	getImages(): Observable<IGridImageItem[]> {
		return this.http.get<IGridImageItem[]>(this.imagesUrl);
	}
	
	uploadImage(image): Observable<IGridImageItem> {
		
		const formData =  new FormData();
		formData.append('image', image);
		
		return this.http.post<IGridImageItem>(this.imagesUrl, formData);
	}
	
	deleteImage(name: string) {
		return this.http.delete(`${environment.endpoint.image}/${name}`);
	}
	
}

export interface IGridImageItem {
	b64: string;
	filename: string;
	labelAnnotations: Object[];
}
