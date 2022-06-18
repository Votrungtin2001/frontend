import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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



@NgModule({
  declarations: [
    DashboardComponent,
    UsersListComponent,
    UserCardComponent,
    AddUserComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatDialogModule
  ],
  exports: [
    DashboardComponent,
  ],
  entryComponents: [AddUserComponent]
})
export class DashboardModule { }
