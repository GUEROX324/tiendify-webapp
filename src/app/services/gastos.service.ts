import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FacadeService } from './facade.service';

@Injectable({ providedIn: 'root' })
export class GastosService {
  constructor(private http: HttpClient, private facade: FacadeService) {}

  private headers(): HttpHeaders {
    const token = this.facade.getSessionToken();
    return new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
  }

  // ===== Esquema y validación =====
  esquemaGasto() {
    return {
      monto: '' as any,         
      tipo: 'proveedor',
      nombre: '',
      notas: ''
    };
  }

  validarGasto(data: any) {
    const err: any = {};
    const monto = Number(data?.monto);
    if (isNaN(monto) || monto <= 0) err.monto = 'Monto inválido (mayor a 0).';

    const tipo = (data?.tipo || '').trim();
    if (!tipo) err.tipo = 'Selecciona un tipo.';

    const nombre = (data?.nombre || '').trim();
    if (!nombre) err.nombre = 'Especifica el nombre del proveedor/servicio u otro gasto.';

    if (data?.notas && data.notas.length > 300) err.notas = 'Máximo 300 caracteres.';
    return err;
  }

  // ===== Endpoints =====
  public crearGasto(body: {monto:number; tipo:string; nombre:string; notas?:string}): Observable<any> {
    return this.http.post(`${environment.url_api}/gastos/`, body, { headers: this.headers() });
  }

  public listarGastos(q = '', tipo = '', start?: string, end?: string): Observable<any[]> {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (tipo) params.set('tipo', tipo);
    if (start) params.set('start', start);
    if (end) params.set('end', end);
    const url = `${environment.url_api}/lista-gastos/${params.toString() ? '?' + params.toString() : ''}`;
    return this.http.get<any[]>(url, { headers: this.headers() });
  }

  public editarGasto(id: number, patch: Partial<{monto:number; tipo:string; nombre:string; notas:string}>): Observable<any> {
    const url = `${environment.url_api}/gastos-edit/?id=${id}`;
    return this.http.put<any>(url, patch, { headers: this.headers() });
  }

  public eliminarGasto(id: number): Observable<void> {
    const url = `${environment.url_api}/gastos-edit/?id=${id}`;
    return this.http.delete<void>(url, { headers: this.headers() });
  }
}
