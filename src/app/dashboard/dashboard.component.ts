import { AfterContentChecked, AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {faPlus} from '@fortawesome/free-solid-svg-icons'
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Title } from '../model/title.model';
import { TitleService } from '../services/title.service';
import { UserService } from '../services/user.service';
import { AppState } from '../state/store/app.state';
import { getInitialTitles } from '../state/titles/titles.action';
import { getInitialUsers } from '../state/users/users.action';
import { AddUserComponent } from './dialog/add-user/add-user.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit,AfterContentChecked, OnChanges {

  faPlus = faPlus;
  isASC = true;

  private titleSub: Subscription;
  private userSub: Subscription;

  sortOptions = [];
  defaultSearchQuery = "";
  searchQuery = "";
  defaultSortOptionId = 1;
  selectedSortOptionId = 1;

  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private titleService: TitleService,
    private store: Store<AppState>,
    private cdRef : ChangeDetectorRef,
  ) { }


  ngOnChanges(): void {
  }

  ngAfterViewInit(): void {
    var e = document.getElementById('sortOption') as HTMLSelectElement | null;
    this.selectedSortOptionId = parseInt(e.options[e.selectedIndex].value);
  }


  ngOnDestroy(): void {
    if (this.titleSub) {
      this.titleSub.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  ngAfterContentChecked(): void {
    if(this.defaultSortOptionId != this.selectedSortOptionId) {
      this.defaultSortOptionId  = this.selectedSortOptionId;

    }

    if(this.defaultSearchQuery != this.searchQuery) {
      this.defaultSearchQuery = this.searchQuery;
    }
    this.cdRef.detectChanges();
  }



  ngOnInit(): void {
    this.getTitles();
    this.getUsers();
    this.sortOptions = this.userService.getSortOptions();
  }

  onClickOrder() {
    this.isASC = !this.isASC;
  }

  getOrderIcon() {
    if(this.isASC) return "arrow_upward";
    else return "arrow_downward";
  }

  onOpenAddEmployeeDialog() {
    this.dialog.open(AddUserComponent, {
      autoFocus: false,
      data: {user: null}
    });
  }

  getTitles(): void {
    this.titleSub = this.titleService.getTitles().subscribe((titles) => {
      this.store.dispatch(getInitialTitles({titles}));
    })
  }

  getUsers(): void {
    this.userSub = this.userService.getUsers().subscribe((users) => {
      this.store.dispatch(getInitialUsers({users}));
    })
  }

  selectedSortOption() {
    var e = document.getElementById('sortOption') as HTMLSelectElement | null;
    this.selectedSortOptionId = parseInt(e.options[e.selectedIndex].value);
  }

  changeSearch(event) {
    this.searchQuery = event.target.value;
  }

}
