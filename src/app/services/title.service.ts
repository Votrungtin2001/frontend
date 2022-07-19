import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BASE_URL, INTERNAPP_URL } from '../constants/variables';
import { Title } from '../model/title.model';
import { catchError, map, tap } from 'rxjs/operators';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  private titlesUrl = `${INTERNAPP_URL}/title`

  constructor(
    private http: HttpClient,
    private errorService: ErrorService) { }

  //Default methods
  //Create model based on data
  createTitleModel(title: Title): Title {
    const titleModel: Title = {
      TitleId: title.TitleId,
      TitleName: title.TitleName
    }
    return titleModel;
  }

  //Get a list of title
  getTitles(): Observable<Title[]> {
    return this.http.get<any>(this.titlesUrl).pipe(
      tap(_ => console.log('fetched titles')),
      catchError(this.errorService.handleError<Title[]>('getTitles', []))
    )
  }
}
