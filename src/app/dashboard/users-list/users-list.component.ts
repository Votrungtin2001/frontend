import { AfterContentChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { faThList } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { map, Observable} from 'rxjs';
import { Title } from 'src/app/model/title.model';
import { User } from 'src/app/model/user.model';
import { UserService } from 'src/app/services/user.service';
import { AppState } from 'src/app/state/store/app.state';
import { getInitialTitles } from 'src/app/state/titles/titles.selectors';
import { getInitialUsers, getUsersByTitle} from 'src/app/state/users/users.selectors';
import { UsersGroupByTitle } from 'src/app/state/users/users.state';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  //INPUT
  @Input() usersByTitleId = [];
  @Input() expands = [];

  //Title - DATA
  titles$: Observable<Title[]>;

  //User - DATA
  users$: Observable<User[]>;

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.titles$ = this.store.select(getInitialTitles);
    this.users$ = this.store.select(getInitialUsers);
  }

  //Expand event
  onClickExpand(id: number) {
    this.expands.map((element) => {
      if(element.TitleId === id) {
        element.isExpand = !element.isExpand;
      }
      return element;
    })
  }
}
