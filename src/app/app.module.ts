import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon'
import { CommonModule } from '@angular/common';
import { HeaderModule } from './shared/header/header.module';
import { DashboardModule } from './dashboard/dashboard.module';


const Ux_Modules = [
  MatSidenavModule,
  MatIconModule
]

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    Ux_Modules,
    HeaderModule,
    DashboardModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
