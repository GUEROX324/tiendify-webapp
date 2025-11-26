import { Component } from '@angular/core';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
  selector: 'app-trabajadores-screen',
  templateUrl: './trabajadores-screen.component.html',
  styleUrls: ['./trabajadores-screen.component.scss']
})
export class TrabajadoresScreenComponent {

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
  const q = this.busqueda.trim().toLowerCase();
  this.productosFiltrados = !q ? this.productos :
    this.productos.filter(p => p.nombre.toLowerCase().includes(q));
}

agregarAlCarrito(p:any) {
  if (p.stock <= 0) return;
  const idx = this.carrito.findIndex(i => i.clave === p.clave);
  if (idx >= 0) this.carrito[idx].cantidad++;
  else this.carrito.push({ clave: p.clave, nombre: p.nombre, precio: p.precio, cantidad: 1 });
  p.stock--;
  this.calcularCambio();
}

aumentar(i:number) {
  const item = this.carrito[i];
  const prod = this.productos.find(p => p.clave === item.clave);
  if (prod && prod.stock > 0) { item.cantidad++; prod.stock--; }
  this.calcularCambio();
}

disminuir(i:number) {
  const item = this.carrito[i];
  if (item.cantidad > 1) {
    item.cantidad--;
    const prod = this.productos.find(p => p.clave === item.clave);
    if (prod) prod.stock++;
  } else { this.eliminar(i); }
  this.calcularCambio();
}

eliminar(i:number) {
  const item = this.carrito[i];
  const prod = this.productos.find(p => p.clave === item.clave);
  if (prod) prod.stock += item.cantidad;
  this.carrito.splice(i,1);
  this.calcularCambio();
}

calcularCambio() {
  this.cambio = Math.max(0, this.recibido - this.total);
}

onCobrar() {
  // TODO: invocar endpoint -> crear venta, generar ticket, etc.
  // Luego limpiar:
  this.carrito = [];
  this.recibido = 0;
  this.cambio = 0;
  this.onBuscar();
}

onCancelar() {
  // Regresar stock y vaciar
  for (const it of this.carrito) {
    const p = this.productos.find(x => x.clave === it.clave);
    if (p) p.stock += it.cantidad;
  }
  this.carrito = [];
  this.recibido = 0;
  this.cambio = 0;
}
}
