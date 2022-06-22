import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { faHomeUser } from '@fortawesome/free-solid-svg-icons';
import { catchError, concatMap, filter, map, mergeMap, Observable, of, pipe, tap } from 'rxjs';
import { BASE_URL, STORAGE_URL } from '../constants/variables';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersUrl = `${BASE_URL}/users`

  private sortOptions = [
    { id: 1, name: "Created date"},
    { id: 2, name: "Last Name" },
    { id: 3, name: "First Name" },
    { id: 4, name: "Email" }
  ]

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


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

  getSortOptions() {
    return this.sortOptions;
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl).pipe(
      tap(_ => console.log('fetched users')),
      catchError(this.handleError<User[]>('getUsers', []))
    )
  }

  getUsersByTitleId(titleId: number, users: User[]): User[] {
    const results = users.filter(user => user.titleId == titleId
    );
    return results;
  }

  getUserByEmail(email: string) {
    return this.http.get<any[]>(`${this.usersUrl}?email=${email}`);
  }

  getUsersBySortOption(sortOptionId: number, isASC: boolean, users: User[]) {
    const results = [...users];
    if(sortOptionId == 1) { //Created date
      if(isASC == true) {
        results.sort((a,b) => {
          return a.createdDate - b.createdDate;
        });
      }
      else {
        results.sort((a,b) => {
          return b.createdDate - a.createdDate;
        });
      }
    }
    else if(sortOptionId == 2) {
      if(isASC == true) {
        results.sort((a,b) => {
          return a.lastName.localeCompare(b.lastName);
        });
      }
      else {
        results.sort((a,b) => {
          return b.lastName.localeCompare(a.lastName);
        });
      }
    }
    else if(sortOptionId == 3) {
      if(isASC == true) {
        results.sort((a,b) => {
          return a.firstName.localeCompare(b.firstName);
        });
      }
      else {
        results.sort((a,b) => {
          return b.firstName.localeCompare(a.firstName);
        });
      }
    }
    else if(sortOptionId == 4) {
      if(isASC == true) {
        results.sort((a,b) => {
          return a.email.localeCompare(b.email);
        });
      }
      else {
        results.sort((a,b) => {
          return b.email.localeCompare(a.email);
        });
      }
    }


    return results;

  }

  getUsersBySearch(search: string, users: User[]) {
    const results = [...users];
    if(search == "") return results;
    else return results.filter((user) => {
      if(user.firstName.toLowerCase().includes(search) ||
        user.lastName.toLowerCase().includes(search) ||
        user.id.toString() == search ||
        user.gender == search ||
        user.company.toLowerCase() == search ||
        user.email.includes(search)) return user;
      else return null;
    })
  }

  uploadImageAndGetUrl(image: File) {
    const formData = new FormData()
    formData.append("file", image);
    formData.append("upload_preset", "ycm6bhqu")
    formData.append("cloud_name", "social-butterfly")

    return this.http.post(`${STORAGE_URL}`, formData);
  }

  getNewIdUser() {
    const users$ = this.getUsers();
    return users$.pipe(
      map(data => {
        const newUserID = data[data.length - 1].id + 1;
        return newUserID;
      })
    );
  }

  addUser(image: File, newUser: User) {
    if(image == null) {
      newUser.image = "https://firebasestorage.googleapis.com/v0/b/be-beauty-app.appspot.com/o/avatar.jpg?alt=media&token=4cb911b2-3282-4aea-b03a-0ab9b681602a";
      return this.getNewIdUser().pipe(
        mergeMap((data) => {
          newUser.id = data;
          return this.http.post<User>(this.usersUrl, newUser, this.httpOptions).pipe(
            tap((user: User) => {
              console.log('add user success')
            }),
            catchError(this.handleError<User>('addUser'))
          );
        })
      );
    }
    else {
      return this.uploadImageAndGetUrl(image).pipe(
        mergeMap((response: any) => {
          const imageUrl = response.secure_url;
          if (imageUrl != null) {
            newUser.image = imageUrl;
            return this.getNewIdUser().pipe(
              mergeMap((data) => {
                newUser.id = data;
                return this.http.post<User>(this.usersUrl, newUser, this.httpOptions).pipe(
                  tap((user: User) => {
                    console.log('add user success')
                  }),
                  catchError(this.handleError<User>('addUser'))
                );
              })
            );
          }
          else return null;

        })
      );
    }


  }

  deleteUser(userId: number) {
    return this.http.delete<User>(`${this.usersUrl}/` + userId).pipe(
      tap((user: User) => {
        console.log('delete user success')
      }),
      catchError(this.handleError<User>('deleteUser'))
    );
  }

  updateUser(image: File, user: User) {
    if(image == null) {
      return this.http.put<User>(`${this.usersUrl}/` + user.id, user).pipe(
        tap((user: User) => {
          console.log('update user success')
        }),
        catchError(this.handleError<User>('updateUser'))
      );
    }
    else {
      return this.uploadImageAndGetUrl(image).pipe(
        mergeMap((response: any) => {
          const imageUrl = response.secure_url;
          if (imageUrl != null) {
            user.image = imageUrl;
            return this.http.put<User>(`${this.usersUrl}/` + user.id, user).pipe(
              tap((user: User) => {
                console.log('update user success')
              }),
              catchError(this.handleError<User>('updateUser'))
            );
          }
          else return null;

        })
      );
    }
  }

  validateEmail(email: string) {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  }
}
