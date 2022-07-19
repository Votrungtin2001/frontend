import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { STORAGE_URL } from '../constants/variables';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(
    private http: HttpClient,
  ) { }

  //UPLOAD AND RETURN URL
  uploadImageAndGetUrl(image: File) {
    const formData = new FormData()
    formData.append("file", image);
    formData.append("upload_preset", "ycm6bhqu")
    formData.append("cloud_name", "social-butterfly")
    return this.http.post(`${STORAGE_URL}`, formData);
  }
}
