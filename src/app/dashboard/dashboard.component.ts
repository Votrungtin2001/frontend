import { AfterContentChecked, AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog} from '@angular/material/dialog';
import {faPlus} from '@fortawesome/free-solid-svg-icons'
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, Observable, Subscription } from 'rxjs';
import { Title } from '../model/title.model';
import { TitleService } from '../services/title.service';
import { UserService } from '../services/user.service';
import { AppState } from '../state/store/app.state';
import { getInitialTitlesAction } from '../state/titles/titles.action';
import { getInitialTitles } from '../state/titles/titles.selectors';
import { getInitialUsers } from '../state/users/users.action';
import { getUsersByTitle } from '../state/users/users.selectors';
import { UsersGroupByTitle } from '../state/users/users.state';
import { AddUserComponent } from './dialog/add-user/add-user.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit,AfterContentChecked{

  //ICON
  faPlus = faPlus;

  //Title - DATA
  private titleSub: Subscription;
  titles$: Observable<Title[]>;
  expands: any[];

  //User - DATA
  private userSub: Subscription;
  usersByTitle$: Observable<UsersGroupByTitle[]>;
  usersByTitleId = [];
  initialUsersByTitleId = [];

  //SORT
  isASC = true;
  sortOptions = [];
  defaultSortOptionId = 1;
  selectedSortOptionId = 1;

  //SEARCH
  searchControl = new FormControl();

  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private titleService: TitleService,
    private store: Store<AppState>,
    private cdRef : ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    //Get initial sort options
    this.sortOptions = this.userService.getSortOptions();
    //Get initial titles
    this.getTitles();
    //Get initial users
    this.getUsers();
    //Get a list of users grouped by title id after searching
    this.getUsersByTitleWithSearch("");
    //Get a list of users grouped by title (after searching or not) and match with selected option id
    this.getUsersByTitleIdWithOptions();
    //Update list of users matching the change of search text
    this.detectChangeSearchText();
  }

  ngAfterViewInit(): void {
    var e = document.getElementById('sortOption') as HTMLSelectElement | null;
    this.selectedSortOptionId = parseInt(e.options[e.selectedIndex].value);
  }

  ngAfterContentChecked(): void {
    if(this.defaultSortOptionId != this.selectedSortOptionId) {
      this.defaultSortOptionId  = this.selectedSortOptionId;
    }
    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.titleSub) {
      this.titleSub.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  //INITIAL METHODS
  //Title - DATA
  getTitles(): void {
    this.titleSub = this.titleService.getTitles().subscribe((titles) => {
      this.expands = [];
      let results = [];
      titles.map((t) => {
        const title = this.titleService.createTitleModel(t);
        results.push(title);
        const object = {
          "TitleId": title.TitleId,
          "isExpand": false
        }
        this.expands.push(object);
      })
      this.store.dispatch(getInitialTitlesAction({titles : results}));
    })
  }

  //User - DATA
  //Get initial users
  getUsers(): void {
    this.userSub = this.userService.getUsers().subscribe((users) => {
      let results = [];
      users.map((u) => {
        const user = this.userService.createUserModel(u, 'MM-dd-yyyy');
        results.push(user);
      })
      this.store.dispatch(getInitialUsers({users}));
    })
  }

  //Get a list of users grouped by title id after searching
  getUsersByTitleWithSearch(searchText: string) {
    this.titles$ = this.store.select(getInitialTitles);
    this.titles$.subscribe((titles) => {
      this.userService.getUsersByTitle(titles, searchText);
    })
  }

  //SEARCHING
  //Update a list of users after searching whenever search text changes (debounce time 0.4s)
  detectChangeSearchText() {
    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged())
      .subscribe((value) => {
        this.expands.map((element) => {
          element.isExpand = true;
          return element;
        })
        this.getUsersByTitleWithSearch(value);
        this.getUsersByTitleIdWithOptions();
    });
  }

  //SORTING
  //Get a list of users grouped by title after searching based on sort option
  getUsersByTitleIdWithOptions() {
    this.titles$.subscribe((titles) => {
      this.usersByTitle$ = this.store.select(getUsersByTitle);
      this.usersByTitle$.subscribe((data) => {
        this.usersByTitleId = [];
        const results = [];
        titles.map((title) => {
          const result = data.find((u) => u.titleId == title.TitleId);
          if(result !== undefined) {
            results.push(result.users);
          }
          else results.push([]);
        })
        this.usersByTitleId = results;
        this.initialUsersByTitleId = [...this.usersByTitleId];

        this.usersByTitleId = this.userService.getUsersBySortOption(this.selectedSortOptionId,
          this.isASC, this.initialUsersByTitleId);
      })
    })
  }

  //isASC = true <=> ascending, isASC = false <=> descending, update a list of users after searching based
  //on sort option
  onClickOrder() {
    this.isASC = !this.isASC;
    this.getUsersByTitleIdWithOptions();
  }

  //Update sorting icon based on isASC
  getOrderIcon() {
    if(this.isASC) return "arrow_upward";
    else return "arrow_downward";
  }

  //Update selected sort option id
  selectedSortOption() {
    var e = document.getElementById('sortOption') as HTMLSelectElement | null;
    this.selectedSortOptionId = parseInt(e.options[e.selectedIndex].value);
    this.getUsersByTitleIdWithOptions();
  }

  //OPEN ADD-UPDATE DIALOG
  onOpenAddEmployeeDialog() {
    this.dialog.open(AddUserComponent, {
      autoFocus: false,
      data: {user: null}
    });
  }
}
