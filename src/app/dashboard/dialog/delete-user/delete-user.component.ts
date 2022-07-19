import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { UnitMethodService } from 'src/app/services/unit-method.service';
import { UserService } from 'src/app/services/user.service';
import { AppState } from 'src/app/state/store/app.state';
import { deleteUser } from 'src/app/state/users/users.action';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent implements OnInit {

  //DEFAULT
  userId = 0;
  userEmail = "";

  //EMAIL
  emailControl = new FormControl();
  isMatchEmail = false;
  isEmailRequired = false;
  isWrongEmailFormat = false;

  //FORM
  isValid = false;

  constructor(
    public dialogRef: MatDialogRef<DeleteUserComponent>,
    private userService: UserService,
    private store: Store<AppState>,
    private unitMethodService: UnitMethodService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.userId = this.data.userId;
    this.userEmail = this.data.userEmail;
    this.detectChangesInEmailInput();
  }

  detectChangesInEmailInput() {
    this.emailControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged())
      .subscribe((value) => {
        if(value == "") {
          this.isEmailRequired = true;
          this.isMatchEmail = false;
          this.isWrongEmailFormat = false;
        }
        else if(!this.unitMethodService.validateEmail(value)) {
          this.isEmailRequired = false;
          this.isMatchEmail = false;
          this.isWrongEmailFormat = true;
        }
        else if(value != this.userEmail) {
          this.isEmailRequired = false;
          this.isMatchEmail = true;
          this.isWrongEmailFormat = false;
        }
        else {
          this.isEmailRequired = false;
          this.isMatchEmail = false;
          this.isWrongEmailFormat = false;
          this.isValid = true;
        }
    });
  }

  //CLOSE DELETE DIALOG
  onCloseDialog() {
    let data = {
      isDeleted: false
    }
    this.dialogRef.close(data);
  }

  //DELETE USER - BUTTON EVENT
  onDelete() {
    this.userService.deleteUser(this.userId).subscribe((data) => {
      if(data.toString() == "true") {
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
