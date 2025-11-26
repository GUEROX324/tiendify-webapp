import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-ingresar-productos-screen',
  templateUrl: './ingresar-productos-screen.component.html',
  styleUrls: ['./ingresar-productos-screen.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IngresarProductosScreenComponent implements OnInit {

  ngOnInit(): void {}

  // catálogo de unidades
  unidadesCat = ['pza','g','Kg','ml','L','pack','caja','bolsa','sobre','par','docena',];

  // si eligen "otro", aparece el input para escribir una unidad
  usarUnidadPersonalizada = false;

  // ====== NUEVO PRODUCTO ======
  form: any = {
    clave: '',
    nombre: '',
    precio: '',
    stock: '',
    categoria: '',
    contenido: '',
    unidad: 'pza',
    unidadPersonalizada: ''
  };

  loading = false;
  errorMsg = '';
  successMsg = '';
  errors: any = {};

  // ====== ACTUALIZAR EXISTENTE ======
  modo: 'nuevo' | 'existente' = 'nuevo';

  criterio: 'nombre' | 'clave' = 'nombre';
  termino = '';
  buscando = false;
  resultados: any[] = [];
  seleccionado: any = null;

  nuevoPrecio: string = '';
  cantidadAgregar: string = '';

  constructor(
    private productosService: ProductosService,
    private router: Router
  ) {}

  // ---------- Helpers ----------
  private normalizaTrim(v: any): string {
    return (v ?? '').toString().trim();
  }
  private toNumberSafe(v: any): number {
    const n = Number(v);
    return isNaN(n) ? 0 : n;
  }

  // ---------- Validación de nuevo producto ----------
  private validarNuevo(): boolean {
    this.errors = {};
    const clave = this.normalizaTrim(this.form.clave);
    const nombre = this.normalizaTrim(this.form.nombre);
    const precio = this.toNumberSafe(this.form.precio);
    const stock  = this.toNumberSafe(this.form.stock);

    if (!clave)  this.errors.clave  = 'La clave es obligatoria.';
    if (!nombre) this.errors.nombre = 'El nombre es obligatorio.';
    if (precio < 0.01) this.errors.precio = 'El precio debe ser mayor a 0.';
    if (stock < 0) this.errors.stock = 'El stock no puede ser negativo.';

    if (this.form.contenido !== '' && this.toNumberSafe(this.form.contenido) <= 0) {
      this.errors.contenido = 'El contenido debe ser mayor a 0.';
    }

    // Validación de unidad: si es "otro", exige unidadPersonalizada
    if (this.usarUnidadPersonalizada) {
      const up = this.normalizaTrim(this.form.unidadPersonalizada);
      if (!up) this.errors.unidadPersonalizada = 'Escribe la unidad.';
    } else {
      if (!this.form.unidad) this.errors.unidad = 'Selecciona una unidad.';
    }

    return Object.keys(this.errors).length === 0;
  }

  // Verifica clave única contra el backend antes de crear
  private verificarClaveUnica(clave: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.productosService.obtenerListaProductos(clave).subscribe({
        next: (lista: any[]) => {
          const existe = (lista || []).some(p => (p?.clave || '').toLowerCase() === clave.toLowerCase());
          resolve(!existe);
        },
        error: () => resolve(true) // si falla la búsqueda, no bloqueamos
      });
    });
  }

  // handler del select de unidad
  onUnidadChange(value: string) {
    this.usarUnidadPersonalizada = (value === 'otro');
    if (!this.usarUnidadPersonalizada) {
      this.form.unidadPersonalizada = '';
    }
  }

  public guardarNuevo() {
    this.errorMsg = '';
    this.successMsg = '';

    if (!this.validarNuevo()) {
      this.errorMsg = 'Revisa los campos marcados.';
      return;
    }

    const clave = this.normalizaTrim(this.form.clave);
    this.loading = true;

    this.verificarClaveUnica(clave).then(unica => {
      if (!unica) {
        this.loading = false;
        this.errors.clave = 'No se puede agregar: ya existe un producto con esa clave.';
        this.errorMsg = 'La clave ya existe.';
        return;
      }

      const unidadFinal = this.usarUnidadPersonalizada
        ? this.normalizaTrim(this.form.unidadPersonalizada)
        : this.normalizaTrim(this.form.unidad);

      const payload: any = {
        clave,
        nombre: this.normalizaTrim(this.form.nombre),
        precio: this.toNumberSafe(this.form.precio),
        stock: this.toNumberSafe(this.form.stock),
        categoria: this.normalizaTrim(this.form.categoria) || null,
        contenido: this.form.contenido !== '' ? this.toNumberSafe(this.form.contenido) : null,
        unidad: unidadFinal || null
      };

      this.productosService.crearProducto(payload).subscribe({
        next: () => {
          this.loading = false;
          this.successMsg = 'Producto registrado correctamente.';
          this.form = {
            clave: '', nombre: '', precio: '', stock: '', categoria: '',
            contenido: '', unidad: 'pza', unidadPersonalizada: ''
          };
          this.usarUnidadPersonalizada = false;
          this.errors = {};
        },
        error: (e) => {
          this.loading = false;
          const msg = e?.error?.detail || e?.error?.clave || 'No se pudo registrar el producto.';
          this.errorMsg = typeof msg === 'string' ? msg : 'No se pudo registrar el producto.';
        }
      });
    });
  }

  public cancelarNuevo() {
    this.router.navigate(['productos']);
  }

  // ---------- Buscar / seleccionar existente ----------
  public buscarExistente() {
    this.resultados = [];
    this.seleccionado = null;
    this.nuevoPrecio = '';
    this.cantidadAgregar = '';

    const q = this.normalizaTrim(this.termino);
    if (!q) return;

    this.buscando = true;
    this.productosService.obtenerListaProductos(q).subscribe({
      next: (lista: any[]) => {
        this.buscando = false;

        if (this.criterio === 'clave') {
          const exact = (lista || []).filter(p => (p?.clave || '').toLowerCase() === q.toLowerCase());
          this.resultados = exact.length ? exact : (lista || []);
        } else {
          this.resultados = lista || [];
        }
      },
      error: () => {
        this.buscando = false;
        this.resultados = [];
      }
    });
  }

  public seleccionarProducto(p: any) {
    this.seleccionado = p;
    this.nuevoPrecio = String(p?.precio ?? '');
    this.cantidadAgregar = '';
  }

  // ---------- Actualizar existente (precio + sumar stock) ----------
  public actualizarExistente() {
    this.errorMsg = '';
    this.successMsg = '';

    if (!this.seleccionado?.id) {
      this.errorMsg = 'Selecciona un producto.';
      return;
    }
    const precioNum = this.toNumberSafe(this.nuevoPrecio);
    const addNum = this.toNumberSafe(this.cantidadAgregar);

    const payload: any = { id: this.seleccionado.id };
    if (precioNum > 0) payload.precio = precioNum;
    if (addNum > 0) payload.stock = (Number(this.seleccionado.stock || 0) + addNum);

    if (!payload.precio && typeof payload.stock === 'undefined') {
      this.errorMsg = 'Indica un nuevo precio y/o una cantidad a ingresar.';
      return;
    }

    this.loading = true;
    this.productosService.editarProducto(payload).subscribe({
      next: (resp) => {
        this.loading = false;
        this.successMsg = 'Producto actualizado.';
        this.seleccionado = { ...this.seleccionado, ...resp };
        if (addNum > 0 && this.seleccionado) {
          this.seleccionado.stock = Number(this.seleccionado.stock || 0); // reflejo
        }
      },
      error: () => {
        this.loading = false;
        this.errorMsg = 'No se pudo actualizar el producto.';
      }
    });
  }
}
