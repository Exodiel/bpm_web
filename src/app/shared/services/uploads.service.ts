import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

const URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class UploadsService {

  constructor(
    public httpClient: HttpClient,
  ) { }

  uploadImage(image: File): Observable<{ filepath: string }> {
    const formData = new FormData();
    formData.append("image", image, image.name);

    return this.httpClient.post<{ filepath: string }>(`${URL}/upload-image`, formData);
  }
}
