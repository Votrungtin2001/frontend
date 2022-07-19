import { DatePipe } from '@angular/common';
import { AfterContentChecked, AfterViewChecked, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, Observable } from 'rxjs';
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
  //DATA
  //Title - DATA
  titles$: Observable<Title[]>;

  //User - DATA
  user?: User

  //FORM GROUP
  addForm: FormGroup;
  isReadOnly = true;

  //IMAGE
  image: File = null;
  imageUrl: string;

  //CHECK ERROR
  //First Name Error
  isFirstNameError = false;
  //Last Name Error
  isLastNameError = false;
  //Date Error
  isDateValid = true;
  maxDate: any;
  minDate: any;
  sMinDate: string;
  sMaxDate: string;
  selectedDate = "";

  //Gender
  selectedGender = "Female";

  //Email
  isUniqueEmail = true;
  isEmailRequired = false;

  //Title
  isTitleError = false;
  selectedTitleId = 0;

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

  ngOnInit(): void {
    this.titles$ = this.store.select(getInitialTitles);
    this.user = this.data.user;
    if(this.user) {
      this.setUpViewWithUserData(this.user);
    }
    else {
      this.setUpViewWithoutUserData();
    }
    this.maxDate = new Date().toISOString().slice(0, 10);
    this.minDate = new Date(1900, 1, 1).toISOString().slice(0, 10);
    this.sMaxDate = this.datePipe.transform(this.maxDate, "yyyy-MM-dd");
    this.sMinDate = this.datePipe.transform(this.minDate, "yyyy-MM-dd");
  }

  ngAfterViewChecked(): void {
    if(this.user) {
      this.updateTitleId(this.user.UserTitleId);
    }
  }

  ngAfterContentChecked(): void {
    let checkDate = this.checkValidDate();
    if(checkDate != this.isDateValid) {
      this.isDateValid = checkDate;
      this.cdRef.detectChanges();
    }
  }

  //DEFAULT
  //With user
  setUpViewWithUserData(User: User) {
    const emailInput = document.getElementById("email") as HTMLInputElement;
    emailInput.readOnly = true;
    const user = this.userService.createUserModel(User, 'MM-dd-yyyy');
    this.updateCheckGender(user.UserGender);

    this.addForm = new FormGroup({
      image: new FormControl(
        user.UserImage,
      ),
      firstName: new FormControl(
        user.UserFirstName,
        [Validators.required, Validators.maxLength(80)],
      ),
      lastName: new FormControl(
        user.UserLastName,
        [Validators.required, Validators.maxLength(80)],
      ),
      date: new FormControl(
        user.UserDob,
      ),
      gender: new FormControl(
        user.UserGender,
      ),
      company: new FormControl(
        user.UserCompany,
      ),
      email: new FormControl(
        user.UserEmail,
        Validators.compose([Validators.required, Validators.email]),
      ),
    })
  }

   //Without user
   setUpViewWithoutUserData() {
    this.isReadOnly = false;
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

  //Turn on/off Edit function
  onClickEdit() {
    this.isReadOnly = !this.isReadOnly;
    const editButton = document.getElementById("edit") as HTMLButtonElement;
    if(this.isReadOnly) {
      editButton.style.color = "#bebebe"
    }
    else editButton.style.color = "#3D3D3D"
  }

  //IMAGE
  //Upload image on input
  selectImage(event:any) {
    if(!this.isReadOnly) {
      if (event.target.files.length > 0) {
        this.image = event.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload=(event:any) => {
          this.imageUrl=event.target.result;
        }
      }
    }
  }

  //Detect changes in input fields
  checkChanges() {
    const dateForm = this.addForm.get('date');
    dateForm.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged())
      .subscribe((value) => {
        const selectedDate = dateForm.value;
        if(selectedDate != null) {
          var vSelectedDate = Date.parse(selectedDate);
          var vMinDate = Date.parse(this.sMinDate);
          var vMaxDate = Date.parse(this.sMaxDate);
          if(vSelectedDate < vMinDate || vSelectedDate > vMaxDate) {
            this.isDateValid = false;
          }
          else {
            this.isDateValid = false;
          }
        }
      }
    );
  }

  //FIRST NAME
  checkFirstName() {
    if(this.addForm.get('firstName').touched && this.addForm.get('firstName').hasError('required')) {
      this.isFirstNameError = true;
    }
    if(this.addForm.get('firstName').valid) this.isFirstNameError = false;
  }

  //LAST NAME
  checkLastName() {
    if(this.addForm.get('lastName').touched && this.addForm.get('lastName').hasError('required')) {
      this.isLastNameError = true;
    }
    if(this.addForm.get('lastName').valid) this.isLastNameError = false;
  }

  //DATE
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

  //Change input type text -> date
  onFocusDate() {
    if(!this.isReadOnly) {
      const dateInput = document.getElementById("dob") as HTMLInputElement;
      dateInput.type = 'date';
      dateInput.placeholder = 'MM-dd-yyyy'
    }
  }

  //Check valid date
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

  //GENDER
  //Change event
  onGenderChange(event:any) {
    const selectedGenderValue = event.target.value;
    this.selectedGender = selectedGenderValue;
    return this.selectedGender;
  }

  //Update selected gender
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

  //Make gender combobox to ratio
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

  //EMAIL
  checkEmail() {
    if(this.addForm.get('email').valid) {
      this.isEmailRequired = false;
      this.isUniqueEmail = true;
    }
    else {
      this.isEmailRequired = true;
      this.isUniqueEmail = false;
    }
  }


  //TITLE OPTION
  getTitleId() {
    var e = document.getElementById('title') as HTMLSelectElement | null;
    this.selectedTitleId = parseInt(e.options[e.selectedIndex].value);
  }

  //UPDATE DEFAULT TITLE OPTION (user)
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
      UserId: 0,
      UserFirstName: userFirstName,
      UserLastName: userLastName,
      UserDob: this.selectedDate,
      UserGender: userGender,
      UserCompany: userCompany,
      UserTitleId: userTitleId,
      UserEmail: userEmail,
      UserImage: "",
      UserCreatedDate: userCreatedDate,
    }
    this.userService.addUser(this.image, newUser).subscribe((result) => {
      if(result.UserId > 0) {
        const userModel = this.userService.createUserModel(result, 'MM-dd-yyyy');
        this.store.dispatch(addUser({user: userModel}));
        this.dialogRef.close();
      }
    });
  }

  updateUser() {
    var userFirstName = this.addForm.get('firstName').value;
    var userLastName = this.addForm.get('lastName').value;
    if(this.selectedDate == "") this.selectedDate = this.user.UserDob;
    var userGender = this.selectedGender;
    var userCompany = "ROSEN";
    var userTitleId = this.selectedTitleId;
    var userEmail = this.addForm.get('email').value;

    const newUser: User = {
      UserId: this.user.UserId,
      UserFirstName: userFirstName,
      UserLastName: userLastName,
      UserDob: this.selectedDate,
      UserGender: userGender,
      UserCompany: userCompany,
      UserTitleId: userTitleId,
      UserEmail: userEmail,
      UserImage: this.user. UserImage,
      UserCreatedDate: this.user.UserCreatedDate,
    }

    this.userService.updateUser(this.image, newUser).subscribe((result) => {
      if(result.UserId > 0) {
        this.store.dispatch(updateUser({user: result}));
        this.dialogRef.close();
      }
    });
  }

  //CHECK FORM
  checkForm() {
    this.checkFirstName();
    this.checkLastName();
    this.checkGender();
    this.checkEmail();
  }

  //SUBMIT FORM
  onSubmit() {
    this.checkForm();
    this.getTitleId();

    //ADD USER
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

    //UPDATE USER
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
