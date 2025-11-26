import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-eliminar-producto-carrito-modal',
  templateUrl: './eliminar-producto-modal.component.html',
  styleUrls: ['./eliminar-producto-modal.component.scss']
})
export class EliminarProductoModalComponent {

  constructor(
    private dialogRef: MatDialogRef<EliminarProductoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { nombre: string }
  ) {}

  cerrar(){ this.dialogRef.close({ isDelete: false }); }
  confirmar(){ this.dialogRef.close({ isDelete: true }); }
}
