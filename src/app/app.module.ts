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
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { ReactiveFormsModule } from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';





//Para usar el mask
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

import { AdminScreenComponent } from './screens/admin-screen/admin-screen.component';
import { TrabajadoresScreenComponent } from './screens/trabajadores-screen/trabajadores-screen.component';
import { MasterScreenComponent } from './screens/master-screen/master-screen.component';
import { RegistroAdminComponent } from './partials/registro-admin/registro-admin.component';
import { RegistroTrabajadoresComponent } from './partials/registro-trabajadores/registro-trabajadores.component';
import { RegistroMasterComponent } from './partials/registro-master/registro-master.component';
import { HomeScreenComponent } from './screens/home-screen/home-screen.component';
import { EliminarProductoModalComponent } from './modals/eliminar-producto-modal/eliminar-producto-modal.component';
import { IngresarProductosScreenComponent } from './screens/ingresar-productos-screen/ingresar-productos-screen.component';
import { ProductosScreenComponent } from './screens/productos-screen/productos-screen.component';
import { ListaAdminScreenComponent } from './screens/lista-admin-screen/lista-admin-screen.component';
import { ListaTrabajadoresScreenComponent } from './screens/lista-trabajadores-screen/lista-trabajadores-screen.component';
import { ListaMasterScreenComponent } from './screens/lista-master-screen/lista-master-screen.component';
import { EliminarUserModalComponent } from './modals/eliminar-user-modal/eliminar-user-modal.component';
import { GraficasScreenComponent } from './screens/graficas-screen/graficas-screen.component';
import { NgChartsModule } from 'ng2-charts';
import { EliminarProductosInventarioModalComponent } from './modals/eliminar-productos-inventario-modal/eliminar-productos-inventario-modal.component';
import { GastosScreenComponent } from './screens/gastos-screen/gastos-screen.component';
import { CajaScreenComponent } from './screens/caja-screen/caja-screen.component';




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
    EliminarProductoModalComponent,
    IngresarProductosScreenComponent,
    ProductosScreenComponent,
    ListaAdminScreenComponent,
    ListaTrabajadoresScreenComponent,
    ListaMasterScreenComponent,
    EliminarUserModalComponent,
    GraficasScreenComponent,
    EliminarProductosInventarioModalComponent,
    GastosScreenComponent,
    CajaScreenComponent,
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
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatDialogModule,
    CommonModule,
    NgChartsModule
  ],
  providers: [
    {provide:MAT_DATE_LOCALE, useValue: 'es-ES'},
    provideNgxMask()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
