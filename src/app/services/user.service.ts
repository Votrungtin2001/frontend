import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { faHomeUser } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { catchError, concatMap, filter, map, mergeMap, Observable, of, pipe, tap } from 'rxjs';
import { BASE_URL, INTERNAPP_URL ,STORAGE_URL } from '../constants/variables';
import { Title } from '../model/title.model';
import { User } from '../model/user.model';
import { AppState } from '../state/store/app.state';
import { getInitialUsersByTitle } from '../state/users/users.action';
import { UsersGroupByTitle } from '../state/users/users.state';
import { ErrorService } from './error.service';
import { ImageService } from './image.service';
import { UnitMethodService } from './unit-method.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  //private usersUrl = `${BASE_URL}/users`
  private usersUrl = `${INTERNAPP_URL}/user`

  private sortOptions = [
    { id: 1, name: "Created date"},
    { id: 2, name: "Last Name" },
    { id: 3, name: "First Name" },
    { id: 4, name: "Email" }
  ]

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private errorService: ErrorService,
    private unitMethodService: UnitMethodService,
    private imageService: ImageService) { }

  //DEFAULT METHOD
  //Create model based on input
  createUserModel(user: User, dateFormatter: string): User {
    const userDob = this.unitMethodService.dateFormatter(user.UserDob, dateFormatter);
    const userModel: User = {
      UserId: user.UserId,
      UserFirstName: user.UserFirstName,
      UserLastName: user.UserLastName,
      UserDob: userDob,
      UserGender: user.UserGender,
      UserCompany: user.UserCompany,
      UserTitleId: user.UserTitleId,
      UserEmail: user.UserEmail,
      UserImage: user.UserImage,
      UserCreatedDate: user.UserCreatedDate,
    }
    return userModel;
  }

  createUsersGroupByTitle(titleId: number, users: User[]): UsersGroupByTitle{
    const usersGroupByTitleModel: UsersGroupByTitle = {
      users: users,
      titleId: titleId,
    }
    return usersGroupByTitleModel;
  }

  //SORTING
  //Get initial sort options
  getSortOptions() {
    return this.sortOptions;
  }

  //Get a list of users based on sort option after searching
  getUsersBySortOption(sortOptionId: number, isASC: boolean, usersByTitle: any[]) {
    const temps = [...usersByTitle];
    const results = [];
    temps.forEach((temp) => {
      const arrayForSort = temp.slice();
      if (arrayForSort.length > 1) {
        switch(sortOptionId) {
          case 1: //Created Date
            if(isASC == true) {
              arrayForSort.sort((a,b) => a.UserCreatedDate - b.UserCreatedDate);
            }
            else {
              arrayForSort.sort((a,b) => b.UserCreatedDate - a.UserCreatedDate);
            }
            break;
          case 2: // User Last Name
            if(isASC == true) {
              arrayForSort.sort((a,b) => a.UserLastName.localeCompare(b.UserLastName));
            }
            else {
              arrayForSort.sort((a,b) => b.UserLastName.localeCompare(a.UserLastName));
            }
            break;
          case 3: //User First Name
            if(isASC == true) {
              arrayForSort.sort((a,b) => a.UserFirstName.localeCompare(b.UserFirstName));
            }
            else {
              arrayForSort.sort((a,b) => b.UserFirstName.localeCompare(a.UserFirstName));
            }
            break;
          default: //User Email
            if(isASC == true) {
              arrayForSort.sort((a,b) => a.UserEmail.localeCompare(b.UserEmail));
            }
            else {
              arrayForSort.sort((a,b) => b.UserEmail.localeCompare(a.UserEmail));
            }
        }
      }
      results.push(arrayForSort);
    })
    return results;
  }

  //Get a list of users (without condition)
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl).pipe(
      tap(_ => console.log('fetched users')),
      catchError(this.errorService.handleError<User[]>('getUsers', []))
    )
  }

  //Get a list of users grouped by title id after searching
  getUsersByTitleId(titleId: number, searchText: string): Observable<User[]> {
    if(searchText == "") {
      return this.http.get<any>(`${this.usersUrl}/bytitle/${titleId}`)
      .pipe(
        tap(),
        catchError(this.errorService.handleError<User[]>('getUserByTitleId', []))
      );
    }
    //Create data model
    let data = {
      titleId: titleId,
      searchText: searchText
    }

    return this.http.post<any>(`${this.usersUrl}/bytitlewithsearch`, data,  this.httpOptions)
    .pipe(
      tap(),
      catchError(this.errorService.handleError<User[]>('getUserByTitleId', []))
    );
  }

  //Get a list of users grouped by all title after searching
  getUsersByTitle(titles: Title[], searchText: string) {
    let usersByTitle: UsersGroupByTitle[] = [];
    titles.map((title) => {
      const usersByTitleId = this.getUsersByTitleId(title.TitleId, searchText);
      usersByTitleId.subscribe((data) => {
        let users = [];
        if(data.length > 0) {
          data.map((u) => {
            const user = this.createUserModel(u, 'MM-dd-yyyy');
            users.push(user);
          })
        }
        if(users.length > 0) {
          const result = this.createUsersGroupByTitle(title.TitleId, users);
          usersByTitle = [...usersByTitle, result];
        }
        //Save usersByTitle in store
        this.store.dispatch(getInitialUsersByTitle({usersGroupByTitle : usersByTitle}));
      })
    })
  }

  //EMAIL
  checkEmailExists(email: string) {
    return this.http.get<boolean>(`${this.usersUrl}/email/${email}`);
  }

  //ADD USER
  addUser(image: File, newUser: User) {
    if(image == null) {
      newUser.UserImage = "https://firebasestorage.googleapis.com/v0/b/be-beauty-app.appspot.com/o/avatar.jpg?alt=media&token=4cb911b2-3282-4aea-b03a-0ab9b681602a";
      return this.http.post<User>(this.usersUrl, newUser, this.httpOptions).pipe(
        tap((user: User) => {
          console.log('add user success')
        }),
        catchError(this.errorService.handleError<User>('addUser'))
      );
    }
    return this.imageService.uploadImageAndGetUrl(image).pipe(
      mergeMap((response: any) => {
        const imageUrl = response.secure_url;
        if (imageUrl != null) {
          newUser.UserImage = imageUrl;
          return this.http.post<User>(this.usersUrl, newUser, this.httpOptions).pipe(
            tap((user: User) => {
              console.log('add user success')
            }),
            catchError(this.errorService.handleError<User>('addUser'))
          );
        }
        return null;
      })
    );
  }

  //UPDATE USER
  updateUser(image: File, user: User) {
    if(image == null) {
      return this.http.patch<User>(`${this.usersUrl}`, user, this.httpOptions).pipe(
        tap((user: User) => {
          console.log('update user success')
        }),
        catchError(this.errorService.handleError<User>('updateUser'))
      );
    }
    return this.imageService.uploadImageAndGetUrl(image).pipe(
      mergeMap((response: any) => {
        const imageUrl = response.secure_url;
        if (imageUrl != null) {
          user.UserImage = imageUrl;
          return this.http.patch<User>(`${this.usersUrl}`, user, this.httpOptions).pipe(
            tap((user: User) => {
              console.log('update user success')
            }),
            catchError(this.errorService.handleError<User>('updateUser'))
          );
        }
        return null;
      })
    );
  }

  //DELETE USER
  deleteUser(userId: number) {
    return this.http.delete<any>(`${this.usersUrl}/` + userId).pipe(
      tap(_ => {
        console.log('delete user success')
      }),
      catchError(this.errorService.handleError<any>('deleteUser'))
    );
  }
}
