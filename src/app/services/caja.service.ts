import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FacadeService } from './facade.service';

@Injectable({ providedIn: 'root' })
export class CajaService {
  constructor(private http: HttpClient, private facade: FacadeService) {}

  private headers(): HttpHeaders {
    const token = this.facade.getSessionToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
  }

  getResumenCaja(): Observable<{ saldo:number; vendido:number; gastado:number; }> {
    return this.http.get<any>(`${environment.url_api}/caja/resumen/`, { headers: this.headers() });
  }

  ingresarCaja(data: { monto:number; nota?:string }): Observable<any> {
    return this.http.post<any>(`${environment.url_api}/caja/ingreso/`, data, { headers: this.headers() });
  }

  listarVentas(q: string = ''): Observable<any[]> {
    const url = q
      ? `${environment.url_api}/lista-ventas/?q=${encodeURIComponent(q)}`
      : `${environment.url_api}/lista-ventas/`;
    return this.http.get<any[]>(url, { headers: this.headers() });
  }

  listarGastos(q: string = ''): Observable<any[]> {
    const headers = this.headers();
    const base = `${environment.url_api}/lista-gastos/`;  // <— AQUÍ el cambio
    const url = q ? `${base}?q=${encodeURIComponent(q)}` : base;
    return this.http.get<any[]>(url, { headers });
  }

  listarIngresosDirectos(q: string = ''): Observable<any[]> {
  const base = `${environment.url_api}/lista-ingresos/`;
  const url = q ? `${base}?q=${encodeURIComponent(q)}` : base;
  return this.http.get<any[]>(url, { headers: this.headers() });
  }
}
