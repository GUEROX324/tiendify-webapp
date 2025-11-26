import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-eliminar-productos-inventario-modal',
  templateUrl: './eliminar-productos-inventario-modal.component.html',
  styleUrls: ['./eliminar-productos-inventario-modal.component.scss']
})
export class EliminarProductosInventarioModalComponent {

  public cargando = false;

  constructor(
    private productosService: ProductosService,
    private dialogRef: MatDialogRef<EliminarProductosInventarioModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id:number; nombre?:string; clave?:string }
  ) {}

  cerrar_modal() {
    this.dialogRef.close({ isDelete:false });
  }

  eliminarProducto() {
    if (!this.data?.id) {
      this.dialogRef.close({ isDelete:false });
      return;
    }
    this.cargando = true;
    this.productosService.eliminarProducto(this.data.id).subscribe({
      next: () => {
        this.cargando = false;
        this.dialogRef.close({ isDelete:true });
      },
      error: () => {
        this.cargando = false;
        this.dialogRef.close({ isDelete:false });
      }
    });
  }
}
