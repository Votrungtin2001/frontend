import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable} from 'rxjs';
import { Title } from 'src/app/model/title.model';
import { User } from 'src/app/model/user.model';
import { UserService } from 'src/app/services/user.service';
import { AppState } from 'src/app/state/store/app.state';
import { getInitialTitles } from 'src/app/state/titles/titles.selectors';
import { getInitialUsers} from 'src/app/state/users/users.selectors';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, OnChanges {

  titles$: Observable<Title[]>;
  users$: Observable<User[]>;
  expand: number[] = new Array();

  @Input() sortOptionId: number;
  @Input() isASC: boolean;
  @Input() searchQuery: string;


  constructor(
    private store: Store<AppState>,
    private userService: UserService,
    private cdRef : ChangeDetectorRef,
  ) { }

  ngOnChanges(): void {
  }

  ngOnInit(): void {
    this.titles$ = this.store.select(getInitialTitles);
    this.users$ = this.store.select(getInitialUsers);
    this.expand = [];
  }

  onClickExpand(id: number) {
    const temp = this.expand.find((element) => id == element);
    if(!temp) {
      return this.expand.push(id);
    }
    else {
      this.expand = this.expand.filter((element) => id != element);
      return this.expand;
    }
  }

   isCollapseOrExpand(id: number) {
    if(this.expand.length > 0) {
      const temp = this.expand.find((element) => id == element);
      if(temp) {
        return true;
      }
      else {
        return false;
      }
    }
    else return false;
   }

   getCollapseOrExpandIcon(id: number) {
    if(this.expand.length > 0) {
      const temp = this.expand.find((element) => id == element);
      if(temp) {
        return "keyboard_arrow_down"
      }
      else {
        return "keyboard_arrow_right";
      }
    }
    return "keyboard_arrow_right";

  }

  getUsersByTitleId(titleId: number, users: User[]): User[]{
    const usersBeforeSortBeforeSearch = this.userService.getUsersByTitleId(titleId, users);
    const usersAfterSortBeforeSearch = this.userService.getUsersBySortOption(this.sortOptionId, this.isASC, usersBeforeSortBeforeSearch);
    const usersAfterSortAfterSearch = this.userService.getUsersBySearch(this.searchQuery.toLowerCase(), usersAfterSortBeforeSearch);
    const results = usersAfterSortAfterSearch;
    return results;
  }

}
