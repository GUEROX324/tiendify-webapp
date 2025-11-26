import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, Subscription, debounceTime, distinctUntilChanged, startWith, switchMap } from 'rxjs';
import { CajaService } from 'src/app/services/caja.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';

interface VentaRow { id: number; fecha: string; subtotal: number; iva: number; total: number; }
interface GastoRow { id: number; fecha: string; tipo: string; monto: number; }
interface IngresoRow { id: number; fecha: string; monto: number; nota?: string; }

@Component({
  selector: 'app-caja-screen',
  templateUrl: './caja-screen.component.html',
  styleUrls: ['./caja-screen.component.scss']
})
export class CajaScreenComponent implements OnInit, AfterViewInit, OnDestroy {
  // Resumen
  saldoCaja = 0; totalVendido = 0; totalGastado = 0;

  // Ingreso directo
  ingresoCtrl = new FormControl<string>('', { nonNullable: true });
  notaCtrl = new FormControl<string>('', { nonNullable: true });
  guardandoIngreso = false; msgIngreso = '';

  // Mini gráfico
  doughnutData = { labels: ['Vendido (c/IVA)', 'Gastado'], datasets: [{ data: [0, 0], backgroundColor: ['#10b981', '#ef4444'], label: 'Caja' }] };
  doughnutOptions = { responsive: false };
  doughnutPlugins = [ DatalabelsPlugin ];

  // Ventas
  colsVentas: string[] = ['id','fecha','subtotal','iva','total'];
  dsVentas = new MatTableDataSource<VentaRow>([]);
  buscarVentas = new FormControl<string>('', { nonNullable: true });
  @ViewChild('pagVentas') pagVentas!: MatPaginator;
  @ViewChild('sortVentas') sortVentas!: MatSort;
  cargandoVentas = false;

  // Gastos
  colsGastos: string[] = ['id','fecha','tipo','monto'];
  dsGastos = new MatTableDataSource<GastoRow>([]);
  buscarGastos = new FormControl<string>('', { nonNullable: true });
  @ViewChild('pagGastos') pagGastos!: MatPaginator;
  @ViewChild('sortGastos') sortGastos!: MatSort;
  cargandoGastos = false;

  // Ingresos directos
  colsIngresos: string[] = ['id','fecha','monto','nota'];
  dsIngresos = new MatTableDataSource<IngresoRow>([]);
  buscarIngresos = new FormControl<string>('', { nonNullable: true });
  @ViewChild('pagIngresos') pagIngresos!: MatPaginator;
  @ViewChild('sortIngresos') sortIngresos!: MatSort;
  cargandoIngresos = false;

  private subs: Subscription[] = [];

  constructor(private cajaSrv: CajaService) {}

  ngOnInit(): void {
    this.cargarResumen();

    // Ventas
    this.armarTabla<VentaRow>({
      input: this.buscarVentas,
      dataSource: this.dsVentas,
      setCargando: v => this.cargandoVentas = v,
      request: (q) => this.cajaSrv.listarVentas(q) as Observable<any[]>,
      normalizar: (lista) => (lista || []).map(v => ({
        id: Number(v.id), fecha: String(v.fecha ?? ''),
        subtotal: Number(v.subtotal ?? 0), iva: Number(v.iva ?? 0), total: Number(v.total ?? 0),
      })),
      setPaginatorSort: () => {
        if (this.pagVentas) this.dsVentas.paginator = this.pagVentas;
        if (this.sortVentas) this.dsVentas.sort = this.sortVentas;
        this.initPaginator(this.pagVentas);
      },
      filterPredicate: (data, filter) => {
        const q = (filter || '').trim().toLowerCase();
        return data.total.toString().toLowerCase().includes(q)
            || data.subtotal.toString().toLowerCase().includes(q)
            || data.iva.toString().toLowerCase().includes(q)
            || data.fecha.toLowerCase().includes(q);
      }
    });

    // Gastos
    this.armarTabla<GastoRow>({
      input: this.buscarGastos,
      dataSource: this.dsGastos,
      setCargando: v => this.cargandoGastos = v,
      request: (q) => this.cajaSrv.listarGastos(q) as Observable<any[]>,
      normalizar: (lista) => (lista || []).map(g => ({
        id: Number(g.id), fecha: String(g.fecha ?? ''), tipo: String(g.tipo ?? ''), monto: Number(g.monto ?? 0),
      })),
      setPaginatorSort: () => {
        if (this.pagGastos) this.dsGastos.paginator = this.pagGastos;
        if (this.sortGastos) this.dsGastos.sort = this.sortGastos;
        this.initPaginator(this.pagGastos);
      },
      filterPredicate: (data, filter) => {
        const q = (filter || '').trim().toLowerCase();
        return data.tipo.toLowerCase().includes(q)
            || data.monto.toString().toLowerCase().includes(q)
            || data.fecha.toLowerCase().includes(q);
      }
    });

    // Ingresos directos
    this.armarTabla<IngresoRow>({
      input: this.buscarIngresos,
      dataSource: this.dsIngresos,
      setCargando: v => this.cargandoIngresos = v,
      request: (q) => this.cajaSrv.listarIngresosDirectos(q) as Observable<any[]>,
      normalizar: (lista) => (lista || []).map(i => ({
        id: Number(i.id), fecha: String(i.fecha ?? ''), monto: Number(i.monto ?? 0), nota: i.nota ? String(i.nota) : undefined
      })),
      setPaginatorSort: () => {
        if (this.pagIngresos) this.dsIngresos.paginator = this.pagIngresos;
        if (this.sortIngresos) this.dsIngresos.sort = this.sortIngresos;
        this.initPaginator(this.pagIngresos);
      },
      filterPredicate: (data, filter) => {
        const q = (filter || '').trim().toLowerCase();
        return (data.nota || '').toLowerCase().includes(q)
            || data.monto.toString().toLowerCase().includes(q)
            || data.fecha.toLowerCase().includes(q);
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.pagVentas) this.dsVentas.paginator = this.pagVentas;
    if (this.sortVentas) this.dsVentas.sort = this.sortVentas;
    if (this.pagGastos) this.dsGastos.paginator = this.pagGastos;
    if (this.sortGastos) this.dsGastos.sort = this.sortGastos;
    if (this.pagIngresos) this.dsIngresos.paginator = this.pagIngresos;
    if (this.sortIngresos) this.dsIngresos.sort = this.sortIngresos;

    this.initPaginator(this.pagVentas);
    this.initPaginator(this.pagGastos);
    this.initPaginator(this.pagIngresos);
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s?.unsubscribe());
  }

  // ---------- Tabla genérica tipada ----------
  private armarTabla<T extends object>(cfg: {
    input: FormControl<string>,
    dataSource: MatTableDataSource<T>,
    setCargando: (v: boolean) => void,
    request: (q: string) => Observable<any[]>,
    normalizar: (lista: any[]) => T[],
    setPaginatorSort: () => void,
    filterPredicate: (data: T, filter: string) => boolean
  }) {
    cfg.dataSource.filterPredicate = cfg.filterPredicate as any;

    const sub = cfg.input.valueChanges.pipe(
      startWith(''),
      debounceTime(250),
      distinctUntilChanged(),
      switchMap((q: string) => {
        cfg.setCargando(true);
        return cfg.request(q || '');
      })
    ).subscribe({
      next: (lista: any[]) => {
        cfg.setCargando(false);
        const rows = cfg.normalizar(lista || []);
        cfg.dataSource.data = rows;
        setTimeout(cfg.setPaginatorSort);
      },
      error: () => {
        cfg.setCargando(false);
        cfg.dataSource.data = [];
      }
    });
    this.subs.push(sub);
  }

  private cargarResumen() {
    this.cajaSrv.getResumenCaja().subscribe({
      next: (r) => {
        this.saldoCaja    = Number(r?.saldo ?? 0);
        this.totalVendido = Number(r?.vendido ?? 0);
        this.totalGastado = Number(r?.gastado ?? 0);
        this.doughnutData = { ...this.doughnutData, datasets: [{ ...this.doughnutData.datasets[0], data: [this.totalVendido, this.totalGastado] }] };
      },
      error: () => { this.saldoCaja = 0; this.totalVendido = 0; this.totalGastado = 0; }
    });
  }

  public registrarIngreso() {
    this.msgIngreso = '';
    const monto = Number(this.ingresoCtrl.value || 0);
    const nota  = (this.notaCtrl.value || '').trim();
    if (!Number.isFinite(monto) || monto <= 0) { this.msgIngreso = 'Ingresa un monto válido (> 0).'; return; }

    this.guardandoIngreso = true;
    this.cajaSrv.ingresarCaja({ monto, nota }).subscribe({
      next: () => {
        this.guardandoIngreso = false;
        this.ingresoCtrl.setValue(''); this.notaCtrl.setValue('');
        this.msgIngreso = 'Ingreso registrado.';
        this.cargarResumen();
        // refrescar ingresos
        this.buscarIngresos.setValue(this.buscarIngresos.value || '');
      },
      error: () => { this.guardandoIngreso = false; this.msgIngreso = 'No se pudo registrar el ingreso.'; }
    });
  }

  private initPaginator(pag: MatPaginator){
    if (!pag) return;
    setTimeout(() => {
      pag._intl.itemsPerPageLabel = 'Registros por página';
      pag._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) return `0 / ${length}`;
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} de ${length}`;
      };
      pag._intl.firstPageLabel = 'Primera página';
      pag._intl.lastPageLabel = 'Última página';
      pag._intl.previousPageLabel = 'Página anterior';
      pag._intl.nextPageLabel = 'Página siguiente';
    }, 300);
  }

  public exportarPDF() {
    const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
    const fecha = new Date();
    const mxn = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

    doc.setFont('helvetica', 'bold'); doc.setFontSize(16); doc.text('Reporte de Caja', 40, 40);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
    doc.text(`Generado: ${fecha.toLocaleString()}`, 40, 60);
    doc.text(`Saldo en caja: ${mxn.format(this.saldoCaja)}`, 40, 75);
    doc.text(`Vendido (c/IVA): ${mxn.format(this.totalVendido)}`, 40, 90);
    doc.text(`Gastado: ${mxn.format(this.totalGastado)}`, 40, 105);

    const ventas = this.dsVentas.filteredData?.length ? this.dsVentas.filteredData : this.dsVentas.data;
    const gastos = this.dsGastos.filteredData?.length ? this.dsGastos.filteredData : this.dsGastos.data;
    const ingresos = this.dsIngresos.filteredData?.length ? this.dsIngresos.filteredData : this.dsIngresos.data;

    autoTable(doc, {
      head: [['ID','Fecha','Subtotal','IVA','Total']],
      body: ventas.map(v => [v.id, v.fecha, mxn.format(v.subtotal), mxn.format(v.iva), mxn.format(v.total)]),
      startY: 130,
      styles: { font: 'helvetica', fontSize: 9, cellPadding: 6 },
      headStyles: { fillColor: [16, 185, 129] },
      columnStyles: { 2: { halign: 'right' }, 3: { halign: 'right' }, 4: { halign: 'right' } },
      didDrawPage: () => {
        const pageSize: any = doc.internal.pageSize;
        const pageHeight = pageSize.height ?? pageSize.getHeight?.() ?? 842;
        const pageWidth  = pageSize.width  ?? pageSize.getWidth?.()  ?? 595;
        const page = doc.getNumberOfPages();
        doc.setFontSize(9); doc.text(`Página ${page}`, pageWidth - 60, pageHeight - 20);
      }
    });
    let y = (doc as any).lastAutoTable?.finalY ?? 130;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
    const totalVentas = ventas.reduce((a, b) => a + b.total, 0);
    doc.text(`Total ventas: ${mxn.format(totalVentas)}`, 40, y + 18);

    y = y + 40;
    autoTable(doc, {
      head: [['ID','Fecha','Tipo/Proveedor','Monto']],
      body: gastos.map(g => [g.id, g.fecha, g.tipo, mxn.format(g.monto)]),
      startY: y,
      styles: { font: 'helvetica', fontSize: 9, cellPadding: 6 },
      headStyles: { fillColor: [239, 68, 68] },
      columnStyles: { 3: { halign: 'right' } }
    });
    y = (doc as any).lastAutoTable?.finalY ?? y;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
    const totalGastos = gastos.reduce((a, b) => a + b.monto, 0);
    doc.text(`Total gastos: ${mxn.format(totalGastos)}`, 40, y + 18);

    y = y + 40;
    autoTable(doc, {
      head: [['ID','Fecha','Monto','Nota']],
      body: ingresos.map(i => [i.id, i.fecha, mxn.format(i.monto), i.nota || '—']),
      startY: y,
      styles: { font: 'helvetica', fontSize: 9, cellPadding: 6 },
      headStyles: { fillColor: [234, 88, 12] },
      columnStyles: { 2: { halign: 'right' } }
    });
    y = (doc as any).lastAutoTable?.finalY ?? y;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
    const totalIngresos = ingresos.reduce((a, b) => a + b.monto, 0);
    doc.text(`Total ingresos directos: ${mxn.format(totalIngresos)}`, 40, y + 18);

    const stamp = fecha.toISOString().slice(0,19).replace(/[:T]/g, '-');
    doc.save(`caja-${stamp}.pdf`);
  }
}
