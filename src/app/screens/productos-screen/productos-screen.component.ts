import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProductosService } from 'src/app/services/productos.service';
import { debounceTime, distinctUntilChanged, startWith, Subscription, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EliminarProductosInventarioModalComponent } from 'src/app/modals/eliminar-productos-inventario-modal/eliminar-productos-inventario-modal.component';

import jsPDF from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';
import 'jspdf-autotable';

// Augmentación de tipos para acceder a lastAutoTable sin error TS
declare module 'jspdf' {
  interface jsPDF { lastAutoTable?: { finalY?: number } }
}

@Component({
  selector: 'app-productos-screen',
  templateUrl: './productos-screen.component.html',
  styleUrls: ['./productos-screen.component.scss']
})
export class ProductosScreenComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns: string[] = ['clave','nombre','categoria','presentacion','precio','stock','estado','eliminar'];
  dataSource = new MatTableDataSource<any>([]);
  buscando = new FormControl<string>('', { nonNullable: true });
  cargando = false;
  totalRegistros = 0;

  private sub?: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator; // "!" para evitar TS2564
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productosSrv: ProductosService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Búsqueda + carga desde backend con debounce
    this.sub = this.buscando.valueChanges.pipe(
      startWith(''),
      debounceTime(250),
      distinctUntilChanged(),
      switchMap(q => {
        this.cargando = true;
        return this.productosSrv.listarInventario(q || '');
      })
    ).subscribe({
      next: (lista: any[]) => {
        this.cargando = false;
        const datos = (lista || []).map(p => ({
          ...p,
          precio: Number(p.precio ?? 0),
          stock: Number(p.stock ?? 0),
          contenido: p.contenido !== null && p.contenido !== undefined ? Number(p.contenido) : null,
          unidad: p.unidad ?? null
        }));
        this.dataSource.data = datos;
        this.totalRegistros = datos.length;

        setTimeout(() => {
          if (this.paginator) this.dataSource.paginator = this.paginator;
          if (this.sort) this.dataSource.sort = this.sort;
          this.initPaginator(); // usa tu función sin modificarla
        });
      },
      error: () => {
        this.cargando = false;
        this.dataSource.data = [];
        this.totalRegistros = 0;
      }
    });

    // Filtro local adicional (cliente)
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const q = (filter || '').trim().toLowerCase();
      const presentacion = `${data.contenido ?? ''} ${data.unidad ?? ''}`.trim().toLowerCase();
      return (
        (data.clave || '').toLowerCase().includes(q) ||
        (data.nombre || '').toLowerCase().includes(q) ||
        (data.categoria || '').toLowerCase().includes(q) ||
        presentacion.includes(q)
      );
    };
  }

  ngAfterViewInit(): void {
    if (this.paginator) this.dataSource.paginator = this.paginator;
    if (this.sort) this.dataSource.sort = this.sort;
    this.initPaginator(); // asegura etiquetas en montado
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  applyClientFilter(value: string) {
    this.dataSource.filter = (value || '').trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  estadoStock(p: any): 'sin'|'bajo'|'ok' {
    const s = Number(p?.stock ?? 0);
    if (s <= 0) return 'sin';
    if (s <= 5) return 'bajo';
    return 'ok';
  }

  // === Tu función del paginador (sin modificarla) ===
  public initPaginator(){
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.paginator._intl.itemsPerPageLabel = 'Registros por página';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
          return `0 / ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} de ${length}`;
      };
      this.paginator._intl.firstPageLabel = 'Primera página';
      this.paginator._intl.lastPageLabel = 'Última página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Página siguiente';
    },500);
  }

  // === Eliminar producto usando tu modal personalizado ===
  public deleteProducto(p: any) {
    const dialogRef = this.dialog.open(EliminarProductosInventarioModalComponent, {
      data: { id: p.id, nombre: p.nombre, clave: p.clave },
      width: '360px',
      height: 'auto'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.isDelete) {
        // Quita el registro de la tabla sin recargar
        const nueva = this.dataSource.data.filter(x => x.id !== p.id);
        this.dataSource.data = nueva;
        this.totalRegistros = nueva.length;

        // Si la página queda vacía, retrocede una página (si existe)
        if (this.paginator && this.paginator.hasPreviousPage() && this.dataSource.data.length === 0) {
          this.paginator.previousPage();
        }

        alert('Producto eliminado correctamente');
      }
    });
  }

  // === Exportar PDF con totalValor calculado y lastAutoTable tipado ===
  public exportarPDF() {
    const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
    const fecha = new Date();
    const fmtMoneda = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

    // Encabezado
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Reporte de Inventario', 40, 40);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Generado: ${fecha.toLocaleString()}`, 40, 60);
    const filtroActual = this.buscando.value?.trim() ? `Filtro: "${this.buscando.value?.trim()}"` : 'Filtro: (ninguno)';
    doc.text(`${filtroActual}`, 40, 75);
    doc.text(`Total de registros: ${this.totalRegistros}`, 40, 90);

    // Datos a exportar (respeta filtro actual si lo hay)
    const datos = (this.dataSource.filteredData?.length ? this.dataSource.filteredData : this.dataSource.data) || [];

    // Calcular valor total inventario
    const totalValor = datos.reduce((acc: number, p: any) => {
      const precio = Number(p?.precio ?? 0);
      const stock  = Number(p?.stock ?? 0);
      return acc + (isNaN(precio) || isNaN(stock) ? 0 : precio * stock);
    }, 0);

    const head: RowInput[] = [[
      'Clave',
      'Producto',
      'Categoría',
      'Presentación',
      'Precio',
      'Stock',
      'Estado'
    ]];

    const body: RowInput[] = datos.map((p: any) => {
      const presentacion = (p?.contenido != null && p?.unidad)
        ? `${p.contenido} ${p.unidad}`
        : '—';

      const estado = this.estadoStock(p) === 'ok'
        ? 'OK'
        : (this.estadoStock(p) === 'bajo' ? 'Bajo' : 'Sin stock');

      return [
        p?.clave ?? '—',
        p?.nombre ?? '—',
        p?.categoria ?? '—',
        presentacion,
        fmtMoneda.format(Number(p?.precio ?? 0)),
        String(Number(p?.stock ?? 0)),
        estado
      ];
    });

    autoTable(doc, {
      head,
      body,
      startY: 110,
      styles: { font: 'helvetica', fontSize: 9, cellPadding: 6 },
      headStyles: { fillColor: [234, 88, 12] }, // naranja
      columnStyles: {
        4: { halign: 'right' },  // Precio
        5: { halign: 'center' }, // Stock
        6: { halign: 'center' }  // Estado
      },
      didDrawPage: () => {
        // Footer con número de página
        const pageSize = doc.internal.pageSize as any;
        const pageHeight = pageSize.height ?? pageSize.getHeight?.() ?? 842;
        const pageWidth  = pageSize.width  ?? pageSize.getWidth?.()  ?? 595;
        const page = doc.getNumberOfPages();
        doc.setFontSize(9);
        doc.text(`Página ${page}`, pageWidth - 60, pageHeight - 20);
      }
    });

    // Escribir total al final de la tabla
    const finalY = doc.lastAutoTable?.finalY ?? 110;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(
      `Valor estimado del inventario (precio x stock): ${fmtMoneda.format(totalValor)}`,
      40,
      finalY + 24
    );

    const stamp = fecha.toISOString().slice(0,19).replace(/[:T]/g, '-'); // yyyy-mm-dd-hh-mm-ss
    doc.save(`inventario-${stamp}.pdf`);
  }
}
