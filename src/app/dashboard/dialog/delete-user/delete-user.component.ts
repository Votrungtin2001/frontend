import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { UserService } from 'src/app/services/user.service';
import { AppState } from 'src/app/state/store/app.state';
import { deleteUser } from 'src/app/state/users/users.action';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent implements OnInit {


  userId = 0;
  userEmail = "";

  isMatchEmail = false;
  isEmailRequired = false;
  isWrongEmailFormat = false;

  constructor(
    public dialogRef: MatDialogRef<DeleteUserComponent>,
    private userService: UserService,
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.userId = this.data.userId;
    this.userEmail = this.data.userEmail;
  }

  showEmailErrors() {
    if(this.isEmailRequired) return "Please enter user email"
    else if(this.isWrongEmailFormat) return "Wrong email format"
    else if(this.isMatchEmail) return "Email input not match email user";

    return "";
  }

  onCloseDialog() {
    let data = {
      isDeleted: false
    }
    this.dialogRef.close(data);
  }

  onDelete() {
    const e = document.getElementById("confirmEmail") as HTMLInputElement;
    const input = e.value;
    if(input == "") {
      this.isEmailRequired = true;
      this.isMatchEmail = false;
      this.isWrongEmailFormat = false;

    }
    else if(!this.userService.validateEmail(input)) {
      this.isEmailRequired = false;
      this.isMatchEmail = false;
      this.isWrongEmailFormat = true;
    }

    else if(input != this.userEmail) {
      this.isEmailRequired = false;
      this.isMatchEmail = true;
      this.isWrongEmailFormat = false;
    }

    else {
      this.isEmailRequired = false;
      this.isMatchEmail = false;
      this.isWrongEmailFormat = false;
      this.userService.deleteUser(this.userId).subscribe((data) => {
        if(data != null) {
          this.store.dispatch(deleteUser({userId: this.userId}));
          let data = {
            isDeleted: true
          }
          this.dialogRef.close(data);
        }
        else {
          let data = {
            isDeleted: false
          }
          this.dialogRef.close(data);
        }
      })
    }
  }

}
