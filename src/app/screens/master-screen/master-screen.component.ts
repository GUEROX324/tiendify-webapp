import { Component } from '@angular/core';
import { FacadeService } from 'src/app/services/facade.service';


@Component({
  selector: 'app-master-screen',
  templateUrl: './master-screen.component.html',
  styleUrls: ['./master-screen.component.scss']
})
export class MasterScreenComponent {

  public name_user:string ="";

  constructor(
    private facadeService: FacadeService
  ){}

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
  }

busqueda = '';
productos: Array<{ clave:string; nombre:string; precio:number; stock:number; categoria?:string }> = [];
productosFiltrados = this.productos;

carrito: Array<{ clave:string; nombre:string; precio:number; cantidad:number }> = [];

get subtotal() { return this.carrito.reduce((s, it) => s + it.precio * it.cantidad, 0); }
get iva() { return +(this.subtotal * 0.16).toFixed(2); }
get total() { return this.subtotal + this.iva; }
get totalItems() { return this.carrito.reduce((s, it) => s + it.cantidad, 0); }

recibido = 0;
cambio = 0;

onBuscar() {

}

agregarAlCarrito(p:any) {

}

aumentar(i:number) {

}

disminuir(i:number) {

}

eliminar(i:number) {

}

calcularCambio() {
}

onCobrar() {

}

onCancelar() {

}
}
