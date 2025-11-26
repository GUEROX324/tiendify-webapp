import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FacadeService } from './facade.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StatsService {
  constructor(private http: HttpClient, private facade: FacadeService) {}

  private headers(): HttpHeaders {
    const token = this.facade.getSessionToken();
    return new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
  }

  public statsVentas(start?: string, end?: string): Observable<{
    rango: { start: string|null; end: string|null },
    sin_iva: number, iva: number, con_iva: number
  }> {
    const p = new URLSearchParams();
    if (start) p.set('start', start);
    if (end) p.set('end', end);
    const url = `${environment.url_api}/stats-ventas/${p.toString() ? '?' + p.toString() : ''}`;
    return this.http.get<any>(url, { headers: this.headers() });
  }

  public statsIngresosEgresos(start?: string, end?: string): Observable<{
    rango: { start: string|null; end: string|null },
    ventas_sin_iva: number, iva: number, ventas_con_iva: number,
    egresos: number, utilidad_neta: number
  }> {
    const p = new URLSearchParams();
    if (start) p.set('start', start);
    if (end) p.set('end', end);
    const url = `${environment.url_api}/stats-ingresos-egresos/${p.toString() ? '?' + p.toString() : ''}`;
    return this.http.get<any>(url, { headers: this.headers() });
  }
}
