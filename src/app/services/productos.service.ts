import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FacadeService } from './facade.service';

@Injectable({ providedIn: 'root' })
export class ProductosService {

  constructor(
    private http: HttpClient,
    private facadeService: FacadeService
  ) {}


  public esquemaProducto() {
    return {
      clave: '',
      nombre: '',
      precio: '' as any,
      stock: '' as any,
      categoria: '',
      contenido: '' as any,
      unidad: ''
    };
  }

  public validarProducto(data: any, _editar = false) {
    const err: any = {};

    // clave
    if (!data?.clave?.toString().trim()) {
      err.clave = 'Campo requerido';
    } else if (data.clave.toString().length > 30) {
      err.clave = 'Máximo 30 caracteres';
    }

    // nombre
    if (!data?.nombre?.toString().trim()) {
      err.nombre = 'Campo requerido';
    } else if (data.nombre.toString().length > 120) {
      err.nombre = 'Máximo 120 caracteres';
    }

    // precio
    if (data?.precio === '' || data?.precio === null || data?.precio === undefined) {
      err.precio = 'Campo requerido';
    } else if (isNaN(Number(data.precio))) {
      err.precio = 'Debe ser numérico';
    } else if (Number(data.precio) < 0) {
      err.precio = 'No puede ser negativo';
    }

    // stock
    if (data?.stock === '' || data?.stock === null || data?.stock === undefined) {
      err.stock = 'Campo requerido';
    } else if (!Number.isFinite(Number(data.stock))) {
      err.stock = 'Debe ser numérico';
    } else if (Number(data.stock) < 0) {
      err.stock = 'No puede ser negativo';
    } else if (!Number.isInteger(Number(data.stock))) {
      err.stock = 'Debe ser entero';
    }

    // categoría (opcional)
    if (data?.categoria && data.categoria.toString().length > 80) {
      err.categoria = 'Máximo 80 caracteres';
    }

    return err;
  }

  // ========= Helpers HTTP =========
  private getHeaders(): HttpHeaders {
    const token = this.facadeService.getSessionToken();
    return new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
  }

  // ========= Endpoints =========
  /** Lista de productos (si pasas q, filtra por nombre) */
  public obtenerListaProductos(q: string = ''): Observable<any> {
    const headers = this.getHeaders();
    const url = q
      ? `${environment.url_api}/products/?q=${encodeURIComponent(q)}`
      : `${environment.url_api}/products/`;
    return this.http.get<any>(url, { headers });
  }

  /** Obtener un producto por ID */
  public getProductoByID(id: number): Observable<any> {
    return this.http.get<any>(`${environment.url_api}/product/?id=${id}`, { headers: this.getHeaders() });
  }

  /** Editar producto */
  public editarProducto(data: any): Observable<any> {
    return this.http.put<any>(`${environment.url_api}/products-edit/`, data, { headers: this.getHeaders() });
  }

  /** Eliminar producto (catálogo) */
  public eliminarProducto(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.url_api}/products-edit/?id=${id}`, { headers: this.getHeaders() });
  }

  /** Crear producto */
  public crearProducto(data: any): Observable<any> {
    const token = this.facadeService.getSessionToken();
    const headers = new HttpHeaders({'Content-Type': 'application/json','Authorization': 'Bearer ' + token});
    return this.http.post<any>(`${environment.url_api}/products/`, data, { headers });
  }

  /** Crear venta (descuenta stock en el backend) */
  public crearVenta(data: {
    items: Array<{ producto_id:number; cantidad:number; precio_unit:number }>;
    subtotal:number; iva:number; total:number; recibido:number; cambio:number;
  }) {
    const token = this.facadeService.getSessionToken();
    const headers = new HttpHeaders({'Content-Type': 'application/json','Authorization': `Bearer ${token}`});
    return this.http.post<any>(`${environment.url_api}/ventas/`, data, { headers });
  }

  public listarInventario(q: string = ''): Observable<any[]> {
    return this.obtenerListaProductos(q);
  }
}
