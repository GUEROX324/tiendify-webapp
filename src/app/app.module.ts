import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

//Este import es para los servicios HTTP
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginScreenComponent } from './screens/login-screen/login-screen.component';
import { RegistroScreenComponent } from './screens/registro-screen/registro-screen.component';
import { NavbarComponent } from './partials/navbar/navbar.component';

//Elementos de Material
import {MatInputModule} from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import {MatIconModule} from '@angular/material/icon';
import { MAT_DATE_LOCALE } from '@angular/material/core';


//Para usar el mask
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { AdminScreenComponent } from './screens/admin-screen/admin-screen.component';
import { TrabajadoresScreenComponent } from './screens/trabajadores-screen/trabajadores-screen.component';
import { MasterScreenComponent } from './screens/master-screen/master-screen.component';
import { RegistroAdminComponent } from './partials/registro-admin/registro-admin.component';
import { RegistroTrabajadoresComponent } from './partials/registro-trabajadores/registro-trabajadores.component';
import { RegistroMasterComponent } from './partials/registro-master/registro-master.component';
import { HomeScreenComponent } from './screens/home-screen/home-screen.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginScreenComponent,
    RegistroScreenComponent,
    NavbarComponent,
    AdminScreenComponent,
    TrabajadoresScreenComponent,
    MasterScreenComponent,
    RegistroAdminComponent,
    RegistroTrabajadoresComponent,
    RegistroMasterComponent,
    HomeScreenComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatInputModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule,
    HttpClientModule,
    NgxMaskDirective,
  ],
  providers: [
    {provide:MAT_DATE_LOCALE, useValue: 'es-ES'},
    provideNgxMask()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
