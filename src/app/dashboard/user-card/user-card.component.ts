import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/model/user.model';
import { AddUserComponent } from '../dialog/add-user/add-user.component';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {

  @Input() user: User;
  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  onOpenUpdateEmployeeDialog() {
    this.dialog.open(AddUserComponent, {
      autoFocus: false,
      data: {user: this.user},
    });
  }

}
