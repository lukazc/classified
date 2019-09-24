import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private listUrl = environment.endpoint.list;
  private photosUrl = environment.endpoint.photo;

  constructor(private http: HttpClient) { }

  getListItems(): Observable<IListItem[]> {
    return this.http.get<IListItem[]>(this.listUrl);
  }

  addListItem(inputText: string): Observable<IListItem> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const body = JSON.stringify({
      text: inputText
    });
    return this.http.post<IListItem>(this.listUrl, body, httpOptions);
  }

  deleteListItem(id: number): Observable<IListItem> {
    return this.http.delete<IListItem>(`${environment.endpoint.list}/${id}`);
  }

  getPhotos(): Observable<Object> {
    // const headers = new HttpHeaders().set('Accept-Encoding', 'base64');
    return this.http.get<Object>(this.photosUrl);
    // return this.http.get(this.photosUrl, { responseType: 'text'});
  }

  // getSinglePhoto(imageName): Observable<string> {
  //   const params = new HttpParams().set('name', imageName);
  //   return this.http.get(this.photosUrl, { params: params , responseType: 'text' });
  // };

  addPhoto(photo): Observable<IListItem> {
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'img/*'
    //   })
    // };

    const formData =  new FormData();
    formData.append('photo', photo);

    return this.http.post<IListItem>(this.photosUrl, formData);
  }

  deletePhoto(name: string) {
    return this.http.delete(`${environment.endpoint.photo}/${name}`);
  }
}

export interface IListItem {
  _id: number;
  text: string;
}

