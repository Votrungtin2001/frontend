import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BASE_URL } from '../constants/variables';
import { Title } from '../model/title.model';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  private titlesUrl = `${BASE_URL}/titles`

  constructor(private http: HttpClient) { }

   /**
 * Handle Http operation that failed.
 * Let the app continue.
 *
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
    private handleError<T>(operation = 'operation', result?: T) {
      return (error: any): Observable<T> => {

        // TODO: send the error to remote logging infrastructure
        console.error(error); // log to console instead

        // TODO: better job of transforming error for user consumption

        // Let the app keep running by returning an empty result.
        return of(result as T);
      };
    }

  getTitles(): Observable<Title[]> {
    return this.http.get<Title[]>(this.titlesUrl).pipe(
      tap(_ => console.log('fetched titles')),
      catchError(this.handleError<Title[]>('getTitles', []))
    )
  }
}
