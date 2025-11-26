import { Component, OnDestroy, OnInit } from '@angular/core';
import { FacadeService } from 'src/app/services/facade.service';
import { ProductosService } from 'src/app/services/productos.service';
import { Subject, Subscription, switchMap, debounceTime, distinctUntilChanged, startWith } from 'rxjs';

type Producto = { id?: number; clave: string; nombre: string; precio: number; stock: number; categoria?: string };
type ItemCarrito = { id?: number; clave: string; nombre: string; precio: number; cantidad: number };

@Component({
  selector: 'app-admin-screen',
  templateUrl: './admin-screen.component.html',
  styleUrls: ['./admin-screen.component.scss']
})
export class AdminScreenComponent implements OnInit, OnDestroy {

  public name_user: string = '';
  public busqueda = '';
  private buscar$ = new Subject<string>();

  public productos: Producto[] = [];
  public productosFiltrados: Producto[] = [];

  public carrito: ItemCarrito[] = [];

  // Mapa de stock restante por producto (clave: id||clave)
  private stockLeft: Record<string, number> = {};

  // Caja
  recibido = 0;
  cambio = 0;

  private sub?: Subscription;

  constructor(
    private facadeService: FacadeService,
    private productosService: ProductosService
  ){}

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();

    // Carga inicial + búsqueda por servidor con debounce
    this.sub = this.buscar$.pipe(
      startWith(''),                      // carga inicial
      debounceTime(250),
      distinctUntilChanged(),
      switchMap(q => this.productosService.obtenerListaProductos(q))
    ).subscribe({
      // 👇 Tipamos la lista para evitar any implícito
      next: (lista: unknown) => {
        const arr = (lista as any[]) ?? [];
        // 👇 Tipamos p y normalizamos stock a número
        this.productos = arr.map((p: any): Producto => ({
          id: p.id,
          clave: String(p.clave),
          nombre: String(p.nombre),
          precio: Number(p.precio ?? 0),
          stock: Number(p.stock ?? 0),
          categoria: p.categoria != null ? String(p.categoria) : undefined
        }));
        this.productosFiltrados = [...this.productos];

        this.rellenarStockLeftDesde(this.productos);
        this.descuentoCarritoSobreStockLeft();
      },
      error: () => {
        this.productos = [];
        this.productosFiltrados = [];
        this.stockLeft = {};
        console.error('No se pudo obtener la lista de productos');
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  // ===== Helpers de stock =====
  private keyOf(p: {id?: number; clave: string}): string {
    return String(p.id ?? p.clave);
  }

  private rellenarStockLeftDesde(lista: Producto[]) {
    const next: Record<string, number> = {};
    for (const p of lista) {
      next[this.keyOf(p)] = Number(p.stock ?? 0);
    }
    this.stockLeft = next;
  }

  private descuentoCarritoSobreStockLeft() {
    for (const it of this.carrito) {
      const k = this.keyOf(it);
      if (this.stockLeft[k] !== undefined) {
        this.stockLeft[k] = Math.max(0, this.stockLeft[k] - it.cantidad);
      }
    }
  }

  getStock(p: Producto): number {
    const k = this.keyOf(p);
    return Number(this.stockLeft[k] ?? 0);
  }

  // ===== Totales =====
  get subtotal() { return this.carrito.reduce((s, it) => s + it.precio * it.cantidad, 0); }
  get iva()      { return +(this.subtotal * 0.16).toFixed(2); }
  get total()    { return this.subtotal + this.iva; }
  get totalItems(){ return this.carrito.reduce((s, it) => s + it.cantidad, 0); }

  // ===== Búsqueda =====
  onBuscar() {
    this.buscar$.next(this.busqueda.trim());
  }

  // ===== Carrito =====
  agregarAlCarrito(p: Producto) {
    if (!p) return;
    const k = this.keyOf(p);
    const disponible = this.getStock(p);
    if (disponible <= 0) return;

    const idx = this.carrito.findIndex(i => this.keyOf(i) === k);
    if (idx >= 0) {
      this.carrito[idx].cantidad++;
    } else {
      this.carrito.push({ id: p.id, clave: p.clave, nombre: p.nombre, precio: p.precio, cantidad: 1 });
    }
    this.stockLeft[k] = disponible - 1;
    this.calcularCambio();
  }

  aumentar(i: number) {
    const item = this.carrito[i];
    if (!item) return;
    const prod = this.productos.find(p => this.keyOf(p) === this.keyOf(item));
    if (!prod) return;

    const k = this.keyOf(prod);
    const disponible = this.getStock(prod);
    if (disponible > 0) {
      item.cantidad++;
      this.stockLeft[k] = disponible - 1;
      this.calcularCambio();
    }
  }

  disminuir(i: number) {
    const item = this.carrito[i];
    if (!item) return;
    const prod = this.productos.find(p => this.keyOf(p) === this.keyOf(item));
    const k = prod ? this.keyOf(prod) : this.keyOf(item);

    if (item.cantidad > 1) {
      item.cantidad--;
      this.stockLeft[k] = (this.stockLeft[k] ?? 0) + 1;
    } else {
      this.stockLeft[k] = (this.stockLeft[k] ?? 0) + 1;
      this.carrito.splice(i, 1);
    }
    this.calcularCambio();
  }

  eliminar(i: number) {
    const item = this.carrito[i];
    if (!item) return;
    const prod = this.productos.find(p => this.keyOf(p) === this.keyOf(item));
    const k = prod ? this.keyOf(prod) : this.keyOf(item);

    this.stockLeft[k] = (this.stockLeft[k] ?? 0) + item.cantidad;
    this.carrito.splice(i, 1);
    this.calcularCambio();
  }

  onCancelar() {
    for (const it of this.carrito) {
      const k = this.keyOf(it);
      this.stockLeft[k] = (this.stockLeft[k] ?? 0) + it.cantidad;
    }
    this.carrito = [];
    this.recibido = 0;
    this.cambio = 0;
  }



  calcularCambio() {
    this.cambio = Math.max(0, this.recibido - this.total);
  }

  onCobrar() {
  if (this.total <= 0 || this.recibido < this.total) return;

  const items = this.carrito.map(it => ({
    producto_id: it.id!,         // asegúrate que en el carrito guardas id
    cantidad: it.cantidad,
    precio_unit: it.precio
  }));

  const dto = {
    items,
    subtotal: this.subtotal,
    iva: this.iva,
    total: this.total,
    recibido: this.recibido,
    cambio: this.cambio
  };

  this.productosService.crearVenta(dto).subscribe({
    next: () => {
      // Limpia sin reponer stock local
      this.carrito = [];
      this.recibido = 0;
      this.cambio = 0;

      // Recarga lista desde el backend para ver el stock ya descontado
      this.buscar$.next(this.busqueda.trim());
    },
    error: (e) => {
      console.error(e);
      // Aquí podrías mostrar un toast con el detalle del error
    }
  });
}


}
