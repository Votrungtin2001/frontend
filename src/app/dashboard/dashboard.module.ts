import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatIconModule} from '@angular/material/icon'
import {MatSelectModule} from '@angular/material/select'
import {MatInputModule} from '@angular/material/input'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatDialogModule} from '@angular/material/dialog';
import { UsersListComponent } from './users-list/users-list.component';
import { UserCardComponent } from './user-card/user-card.component';
import { AddUserComponent } from './dialog/add-user/add-user.component';
import { ReactiveFormsModule,FormsModule } from "@angular/forms";
import { StoreModule } from '@ngrx/store';
import { TITLE_STATE_NAME } from '../state/titles/titles.selectors';
import { titlesReducer } from '../state/titles/titles.reducer';
import { USERS_STATE_NAME } from '../state/users/users.selectors';
import { usersReducer } from '../state/users/users.reducer';
import { UniqueEmailValidatorDirective } from '../shared/unique-email-validator.directive';
import { DeleteUserComponent } from './dialog/delete-user/delete-user.component';



@NgModule({
  declarations: [
    DashboardComponent,
    UsersListComponent,
    UserCardComponent,
    AddUserComponent,
    DeleteUserComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    StoreModule.forFeature(TITLE_STATE_NAME, titlesReducer),
    StoreModule.forFeature(USERS_STATE_NAME, usersReducer),
  ],
  exports: [
    DashboardComponent,
  ],
  providers: [
    DatePipe,
    UniqueEmailValidatorDirective
  ],
  entryComponents: [AddUserComponent, DeleteUserComponent]
})
export class DashboardModule { }
