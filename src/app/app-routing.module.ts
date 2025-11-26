import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginScreenComponent } from './screens/login-screen/login-screen.component';
import { RegistroScreenComponent } from './screens/registro-screen/registro-screen.component';
import { AdminScreenComponent } from './screens/admin-screen/admin-screen.component';
import { TrabajadoresScreenComponent } from './screens/trabajadores-screen/trabajadores-screen.component';
import { MasterScreenComponent } from './screens/master-screen/master-screen.component';
import { HomeScreenComponent } from './screens/home-screen/home-screen.component';
import { IngresarProductosScreenComponent } from './screens/ingresar-productos-screen/ingresar-productos-screen.component';
import { ProductosScreenComponent } from './screens/productos-screen/productos-screen.component';
import { ListaAdminScreenComponent } from './screens/lista-admin-screen/lista-admin-screen.component';
import { ListaTrabajadoresScreenComponent } from './screens/lista-trabajadores-screen/lista-trabajadores-screen.component';
import { ListaMasterScreenComponent } from './screens/lista-master-screen/lista-master-screen.component';
import { GraficasScreenComponent } from './screens/graficas-screen/graficas-screen.component';
import { GastosScreenComponent } from './screens/gastos-screen/gastos-screen.component';
import { CajaScreenComponent } from './screens/caja-screen/caja-screen.component';

const routes: Routes = [
   //Pantalla principal del login
  { path: '', component: LoginScreenComponent, pathMatch: 'full' },
  { path: 'registro-usuarios', component: RegistroScreenComponent, pathMatch: 'full' },
  { path: 'registro-usuarios/:rol/:id', component: RegistroScreenComponent, pathMatch: 'full' },
  { path: 'administrador', component: AdminScreenComponent, pathMatch: 'full' },
  { path: 'trabajadores', component: TrabajadoresScreenComponent, pathMatch: 'full' },
  { path: 'maestros', component: MasterScreenComponent, pathMatch: 'full' },
  { path: 'home', component: HomeScreenComponent, pathMatch: 'full' },
  { path: 'administrador', component: AdminScreenComponent, pathMatch: 'full' },
  { path: 'trabajadores', component: TrabajadoresScreenComponent, pathMatch: 'full' },
  { path: 'master', component: MasterScreenComponent, pathMatch: 'full' },
  { path: 'ingresar-productos', component: IngresarProductosScreenComponent, pathMatch: 'full' },
  { path: 'productos', component: ProductosScreenComponent, pathMatch: 'full' },
  { path: 'lista-admin', component: ListaAdminScreenComponent, pathMatch: 'full' },
  { path: 'lista-trabajador', component: ListaTrabajadoresScreenComponent, pathMatch: 'full' },
  { path: 'lista-master', component: ListaMasterScreenComponent, pathMatch: 'full' },
  { path: 'graficas', component: GraficasScreenComponent, pathMatch: 'full' },
  { path: 'gastos', component: GastosScreenComponent, pathMatch: 'full' },
  { path: 'caja', component: CajaScreenComponent, pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
