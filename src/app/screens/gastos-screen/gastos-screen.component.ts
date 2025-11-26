import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { GastosService } from 'src/app/services/gastos.service';

@Component({
  selector: 'app-gastos-screen',
  templateUrl: './gastos-screen.component.html',
  styleUrls: ['./gastos-screen.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GastosScreenComponent implements OnInit {

  form: any = {};
  loading = false;
  errorMsg = '';
  successMsg = '';
  errors: any = {};

  // catálogos básicos (puedes ajustar a tu negocio)
  catalogoProveedores = ['Proveedor A','Proveedor B','Proveedor C','Proveedor D','Proveedor E',];
  catalogoServicios   = ['Luz','Agua','Internet','Teléfono','Mantenimiento'];

  constructor(private gastosSrv: GastosService, private router: Router) {}

  ngOnInit(): void {
    this.form = this.gastosSrv.esquemaGasto();
  }

  public guardar() {
    this.errorMsg = ''; this.successMsg = ''; this.errors = {};
    const errs = this.gastosSrv.validarGasto(this.form);
    if (Object.keys(errs).length) {
      this.errors = errs;
      this.errorMsg = 'Revisa los campos marcados.';
      return;
    }

    this.loading = true;
    const payload = {
      monto: Number(this.form.monto),
      tipo: (this.form.tipo || '').trim(),
      nombre: (this.form.nombre || '').trim(),
      notas: (this.form.notas || '').trim() || undefined
    };

    this.gastosSrv.crearGasto(payload).subscribe({
      next: () => {
        this.loading = false;
        this.successMsg = 'Gasto registrado correctamente.';
        this.form = this.gastosSrv.esquemaGasto(); // limpia
      },
      error: (e) => {
        this.loading = false;
        this.errorMsg = e?.error?.detail || 'No se pudo registrar el gasto.';
      }
    });
  }

  public cancelar() {
    this.router.navigate(['home']); // o a donde quieras volver
  }
}
