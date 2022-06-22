import { DatePipe } from '@angular/common';
import { AfterContentChecked, AfterViewChecked, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Title } from 'src/app/model/title.model';
import { User } from 'src/app/model/user.model';
import { UserService } from 'src/app/services/user.service';
import { UniqueEmailValidatorDirective } from 'src/app/shared/unique-email-validator.directive';
import { AppState } from 'src/app/state/store/app.state';
import { getInitialTitles } from 'src/app/state/titles/titles.selectors';
import { addUser, deleteUser, updateUser } from 'src/app/state/users/users.action';
import { DeleteUserComponent } from '../delete-user/delete-user.component';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit, AfterContentChecked, AfterViewChecked{


  addForm: FormGroup;
  titles$: Observable<Title[]>;

  user?: User

  image: File = null;
  imageUrl: string;
  maxDate: any;
  minDate: any;
  sMinDate: string;
  sMaxDate: string;

  isFirstNameError = false;
  firstNameError = "";
  isLastNameError = false;
  lastNameError = "";
  isDateValid = true;
  isUniqueEmail = true;
  isTitleError = false;
  isEmailRequired = false;
  emailRequiredError = "";

  selectedDate = "";
  selectedGender = "Female";

  selectedTitleId = 0;

  dateFormat = 'yyyy-MM-dd';

  constructor(
    public dialogRef: MatDialogRef<AddUserComponent>,
    public datePipe: DatePipe,
    private cdRef : ChangeDetectorRef,
    private userService: UserService,
    private emailValidator: UniqueEmailValidatorDirective,
    private store: Store<AppState>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}


  ngAfterViewChecked(): void {
    if(this.user) {
      this.updateTitleId(this.user.titleId);
    }
  }

  ngAfterContentChecked(): void {
    let checkDate = this.checkValidDate();
    if(checkDate != this.isDateValid) {
      this.isDateValid = checkDate;
      this.cdRef.detectChanges();
    }
    this.checkFirstName();
    this.checkLastName();
    this.checkEmailRequired();
  }

  ngOnInit(): void {
    this.titles$ = this.store.select(getInitialTitles);
    this.user = this.data.user;
    this.dateFormat = 'MM-dd-yyyy';
    if(this.user) {
      const emailInput = document.getElementById("email") as HTMLInputElement;
      emailInput.readOnly = true;
      const user_date = this.datePipe.transform(this.user.dob, this.dateFormat);
      this.updateCheckGender(this.user.gender);

      this.addForm = new FormGroup({
        image: new FormControl(
          this.user.image,
        ),
        firstName: new FormControl(
          this.user.firstName,
          [Validators.required, Validators.maxLength(80)],
        ),
        lastName: new FormControl(
          this.user.lastName,
          [Validators.required, Validators.maxLength(80)],
        ),
        date: new FormControl(
          user_date,
        ),
        gender: new FormControl(
          "Female",
        ),
        company: new FormControl(
          "ROSEN",
        ),
        email: new FormControl(
          this.user.email,
          Validators.compose([Validators.required, Validators.email]),
        ),
      })
    }
    else {
      this.addForm = new FormGroup({
        image: new FormControl(
          "",
        ),
        firstName: new FormControl(
          null,
          [Validators.required, Validators.maxLength(80)],
        ),
        lastName: new FormControl(
          null,
          [Validators.required, Validators.maxLength(80)],
        ),
        date: new FormControl(
          null,
        ),
        gender: new FormControl(
          "Female",
        ),
        company: new FormControl(
          "ROSEN",
        ),
        email: new FormControl(
          null,
          Validators.compose([Validators.required, Validators.email]),
          this.emailValidator.validate.bind(this),
        ),

      })
    }


    this.dateFormat = 'yyyy-MM-dd';
    this.maxDate = new Date().toISOString().slice(0, 10);
    this.minDate = new Date(1900, 1, 1).toISOString().slice(0, 10);
    this.sMaxDate = this.datePipe.transform(this.maxDate, this.dateFormat);
    this.sMinDate = this.datePipe.transform(this.minDate, this.dateFormat);

  }


  getTitleDialog() {
    if(this.user) return "USER INFORMATION";
    else return "CREATE NEW USER";
  }

  selectImage(event:any) {
    if (event.target.files.length > 0) {
      this.image = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload=(event:any) => {
        this.imageUrl=event.target.result;
      }
    }

  }

  showFirstNameErrors() {
    const firstNameForm = this.addForm.get('firstName');
    if(firstNameForm.touched && !firstNameForm.valid) {
      if(firstNameForm.errors.required) {
        return 'Please enter user first name';
      }
      if(firstNameForm.errors.maxlength) {
        return 'The input line is too long';
      }
    }
    return "";
  }

  checkFirstName() {
    if(this.addForm.get('firstName').touched && this.addForm.get('firstName').hasError('required')) {
      this.isFirstNameError = true;
    }
    if(this.addForm.get('firstName').valid) this.isFirstNameError = false;

    if(this.isFirstNameError) this.firstNameError = "Please enter user first name";
    else {
      this.firstNameError = "";
    }
  }

  showLastNameErrors() {
    const lastNameForm = this.addForm.get('lastName');
    if(lastNameForm.touched && !lastNameForm.valid) {
      if(lastNameForm.errors.required) {
        return 'Please enter user last name';
      }
      if(lastNameForm.errors.maxlength) {
        return 'The input line is too long';
      }
    }
    return "";
  }

  checkLastName() {
    if(this.addForm.get('lastName').touched && this.addForm.get('lastName').hasError('required')) {
      this.isLastNameError = true;
    }
    if(this.addForm.get('lastName').valid) this.isLastNameError = false;

    if(this.isLastNameError) this.lastNameError = "Please enter user last name";
    else {
      this.lastNameError = "";
    }
  }

  showDateErrors() {
    const dateForm = this.addForm.get('date');
    if(dateForm.touched) {
      const selectedDate = dateForm.value;
      if(selectedDate != null) {
        var vSelectedDate = Date.parse(selectedDate);
        var vMinDate = Date.parse(this.sMinDate);
        var vMaxDate = Date.parse(this.sMaxDate);
        if(vSelectedDate < vMinDate || vSelectedDate > vMaxDate) {
          return "Wrong date format";
        }
        else {
          return "";
        }
      }
    }
    return "";
  }

  checkValidDate() {
    const dateForm = this.addForm.get('date');
    if(dateForm.touched) {
      const temp = dateForm.value;
      if(temp != null) {
        var vSelectedDate = Date.parse(temp);
        var vMinDate = Date.parse(this.sMinDate);
        var vMaxDate = Date.parse(this.sMaxDate);
        if(vSelectedDate < vMinDate || vSelectedDate > vMaxDate) {
          return false;
        }
        else {
          this.selectedDate = temp;
          return true;
        }
      }
      else this.selectedDate = "2001-01-07";
    }
    return true;
  }

  onGenderChange(event:any) {
    const selectedGenderValue = event.target.value;
    this.selectedGender = selectedGenderValue;
    return this.selectedGender;
  }

  checkGender() {
    const checkMale = document.getElementById("Male") as HTMLInputElement;
    const checkFemale = document.getElementById("Female") as HTMLInputElement;
    if(checkMale.checked == true) {
      this.selectedGender = "Male";
    }
    else {
      checkFemale.checked = true
      this.selectedGender = "Female";
    }

  }

  updateCheckGender(gender: string) {
    const checkMale = document.getElementById("Male") as HTMLInputElement;
    const checkFemale = document.getElementById("Female") as HTMLInputElement;
    if(gender == "Male") {
      this.selectedGender = "Male";
      checkMale.checked = true;
      checkFemale.checked = false;
    }
    else {
      this.selectedGender = "Female";
      checkMale.checked = false;
      checkFemale.checked = true;
    }

  }


  showEmailErrors() {
    if(this.isUniqueEmail == true) {
      const emailForm = this.addForm.get('email');
      if(emailForm.touched && !emailForm.valid) {
        if(emailForm.hasError('uniqueEmail')) {
          return "";
        }
        else {
          if(emailForm.hasError('required')) {
            return 'Please enter user email';
          }
          if(emailForm.hasError('email')){
            return 'Wrong email format';
          }
        }
      }
      return "";
    }
    else {
      return "Email existed in system";
    }
  }

  checkEmailRequired() {
    if(this.addForm.get('email').touched && this.addForm.get('email').hasError('required')) {
      this.isEmailRequired = true;
    }

    if(this.addForm.get('email').valid) this.isEmailRequired = false;

    if(this.isEmailRequired) this.emailRequiredError = "Please enter user email";
    else {
      this.emailRequiredError = "";
    }
  }

  getTitleId() {
    var e = document.getElementById('title') as HTMLSelectElement | null;
    this.selectedTitleId = parseInt(e.options[e.selectedIndex].value);
  }

  updateTitleId(titleId: number) {
    var e = document.getElementById('title') as HTMLSelectElement | null;
    for(var i, j = 0; i = e.options[j]; j++) {
      if(i.value == titleId) {
          e.selectedIndex = j;
          this.selectedTitleId = titleId;
          break;
      }
    }
  }

  getAddUpdateButtonName() {
    if(this.user) return "SAVE";
    else return "CREATE USER";
  }

  onCloseDialog() {
    this.dialogRef.close();
  }

  addUser() {
    var userFirstName = this.addForm.get('firstName').value;
    var userLastName = this.addForm.get('lastName').value;
    var userGender = this.selectedGender;
    if(this.selectedDate == "") this.selectedDate = "2001-01-01";
    var userCompany = "ROSEN";
    var userTitleId = this.selectedTitleId;
    var userEmail = this.addForm.get('email').value;
    var userCreatedDate = new Date().getTime();

    const newUser: User = {
      id: 0,
      firstName: userFirstName,
      lastName: userLastName,
      dob: this.selectedDate,
      gender: userGender,
      company: userCompany,
      titleId: userTitleId,
      email: userEmail,
      image: "",
      createdDate: userCreatedDate,
    }
    this.userService.addUser(this.image, newUser).subscribe((result) => {
      if(result.id > 0) {
        this.store.dispatch(addUser({user: result}));
        this.dialogRef.close();
      }
    });
  }

  updateUser() {
    var userFirstName = this.addForm.get('firstName').value;
    var userLastName = this.addForm.get('lastName').value;
    if(this.selectedDate == "") this.selectedDate = this.user.dob;
    var userGender = this.selectedGender;
    var userCompany = "ROSEN";
    var userTitleId = this.selectedTitleId;
    var userEmail = this.addForm.get('email').value;

    const newUser: User = {
      id: this.user.id,
      firstName: userFirstName,
      lastName: userLastName,
      dob: this.selectedDate,
      gender: userGender,
      company: userCompany,
      titleId: userTitleId,
      email: userEmail,
      image: this.user.image,
      createdDate: this.user.createdDate,
    }

    console.log(newUser);
    this.userService.updateUser(this.image, newUser).subscribe((result) => {
      if(result.id > 0) {
        this.store.dispatch(updateUser({user: result}));
        this.dialogRef.close();
      }
    });
  }



  onSubmit() {
    this.checkGender();
    this.getTitleId();

    if(this.addForm.get('firstName').hasError('required')) {
      this.isFirstNameError = true;
    }
    else this.isFirstNameError = false;

    if(this.addForm.get('lastName').hasError('required')) {
      this.isLastNameError = true;
    }
    else this.isLastNameError = false;

    if(this.addForm.get('email').hasError('required')) {
      this.isEmailRequired = true;
    }
    else this.isEmailRequired = false;

    if(!this.user) {
      if(this.addForm.get('email').hasError('uniqueEmail')) {
        this.isUniqueEmail = false;
      }
      else {
        this.isUniqueEmail = true;
        if(this.selectedTitleId <= 0) {
          this.isTitleError = true;
        }
        else {
          this.isTitleError = false;
          if(this.addForm.valid) {
            this.addUser();
          }
        }

      }
    }

    else {
      this.isUniqueEmail = true;
      if(this.selectedTitleId <= 0) {
        this.isTitleError = true;
      }
      else {
        this.isTitleError = false;
        if(this.addForm.valid) {
          this.updateUser();
        }
      }
    }
  }

  onDelete(userId: number, userEmail: string) {
    const dialogRef = this.dialog.open(DeleteUserComponent, {
      autoFocus: false,
      data: {userId: userId, userEmail: userEmail}
    });

    // Subscribe when the dialog box closes
    dialogRef.afterClosed().subscribe((res)=>{
      if(res != null) {
        if(res.isDeleted == true) this.dialogRef.close();
      }

    }
  );
  }

}
