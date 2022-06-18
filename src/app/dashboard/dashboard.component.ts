import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {faPlus} from '@fortawesome/free-solid-svg-icons'
import { UserService } from '../shared/user.service';
import { AddUserComponent } from './dialog/add-user/add-user.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  faPlus = faPlus;
  isASC = true;

  sortOptions = [
    { id: 1, name: "Created date" },
    { id: 2, name: "Australia" },
    { id: 3, name: "Canada" },
    { id: 4, name: "Brazil" },
    { id: 5, name: "England" }
  ]

  constructor(
    private dialog: MatDialog,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
  }

  onClickOrder() {
    this.isASC = !this.isASC;
  }

  getOrderIcon() {
    if(this.isASC) return "arrow_upward";
    else return "arrow_downward";
  }

  onOpenAddEmployeeDialog() {
    this.dialog.open(AddUserComponent);
  }

}
