import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon'
import { HeaderModule } from './shared/header/header.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { UniqueEmailValidatorDirective } from './shared/unique-email-validator.directive';


const Ux_Modules = [
  MatSidenavModule,
  MatIconModule
]

@NgModule({
  declarations: [
    AppComponent,
    UniqueEmailValidatorDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    Ux_Modules,
    HeaderModule,
    DashboardModule,
    BrowserAnimationsModule,
    HttpClientModule,
    StoreModule.forRoot({}),
    StoreDevtoolsModule.instrument({
      logOnly: environment.production,
    }),
  ],
  exports: [
    UniqueEmailValidatorDirective,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
