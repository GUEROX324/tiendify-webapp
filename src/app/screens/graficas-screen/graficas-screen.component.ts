import { Component, OnInit } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { StatsService } from 'src/app/services/stats.service'; // <— servicio para las nuevas gráficas

@Component({
  selector: 'app-graficas-screen',
  templateUrl: './graficas-screen.component.html',
  styleUrls: ['./graficas-screen.component.scss']
})
export class GraficasScreenComponent implements OnInit {


  public total_user: any = {};

  // Barras (usuarios)
  barChartData = {
    labels: ["Administradores", "Trabajadores", "Master"],
    datasets: [
      {
        data:[0, 0, 0],
        label: 'Registro de usuarios',
        backgroundColor: [
          '#F88406',
          '#FCFF44',
          '#82D3FB',
          '#FB82F5',
          '#2AD84A'
        ]
      }
    ]
  }
  barChartOption = {
    responsive:false
  }
  barChartPlugins = [ DatalabelsPlugin ];

  // Dona (usuarios)
  doughnutChartData = {
    labels: ["Administradores", "Maestros", "Trabajadores"],
    datasets: [
      {
        data:[0, 0, 0],
        label: 'Registro de usuarios',
        backgroundColor: [
          '#F88406',
          '#FCFF44',
          '#31E7E7'
        ]
      }
    ]
  }
  doughnutChartOption = {
    responsive:false
  }
  doughnutChartPlugins = [ DatalabelsPlugin ];

  // ====== Ventas con/sin IVA ======
  ventasIvaDoughnutData = {
    labels: ['Sin IVA', 'Con IVA'],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ['#31E7E7', '#F88406']
      }
    ]
  };
  ventasIvaBarData = {
    labels: ['Sin IVA', 'Con IVA'],
    datasets: [
      {
        data: [0, 0],
        label: 'Ventas',
        backgroundColor: ['#31E7E7', '#F88406']
      }
    ]
  };
  ventasIvaOptions = { responsive: false };
  ventasIvaPlugins = [DatalabelsPlugin];

  // ====== Ventas sin IVA vs IVA vs Egresos ======
  ingEgreDoughnutData = {
    labels: ['Ventas sin IVA', 'IVA', 'Egresos'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#82D3FB', '#FCFF44', '#FB6D6D']
      }
    ]
  };
  ingEgreBarData = {
    labels: ['Ventas sin IVA', 'IVA', 'Egresos'],
    datasets: [
      {
        data: [0, 0, 0],
        label: 'Montos',
        backgroundColor: ['#82D3FB', '#FCFF44', '#FB6D6D']
      }
    ]
  };
  ingEgreOptions = { responsive: false };
  ingEgrePlugins = [DatalabelsPlugin];

  constructor(
    private administradoresServices: AdministradoresService,
    private stats: StatsService
  ){}

  ngOnInit(): void {

    this.obtenerTotalUsers();
    this.cargarVentasConSinIVA();
    this.cargarIngresosEgresos();
  }

  public obtenerTotalUsers(){
    this.administradoresServices.getTotalUsuarios().subscribe(
      (response)=>{
        this.total_user = response;
        // Actualizar los datos de las gráficas
        this.barChartData.datasets[0].data = [
          this.total_user.admins,
          this.total_user.trabajadores,
          this.total_user.master
        ];
        this.doughnutChartData.datasets[0].data = [
          this.total_user.admins,
          this.total_user.trabajadores,
          this.total_user.master
        ];
        // Forzar la actualización de las gráficas
        this.updateCharts();
      }, (error)=>{
        // si falla, mantenemos 0's
      }
    );
  }

  private updateCharts() {
    // Forzar la actualización de las gráficas
    this.barChartData = { ...this.barChartData };
    this.doughnutChartData = { ...this.doughnutChartData };
  }

  // =================== NUEVAS ===================
  private cargarVentasConSinIVA(start?: string, end?: string) {
    this.stats.statsVentas(start, end).subscribe({
      next: (res) => {
        const sin = Number(res?.sin_iva || 0);
        const con = Number(res?.con_iva || 0);
        // dona
        this.ventasIvaDoughnutData = {
          ...this.ventasIvaDoughnutData,
          datasets: [{ ...this.ventasIvaDoughnutData.datasets[0], data: [sin, con] }]
        };
        // barras
        this.ventasIvaBarData = {
          ...this.ventasIvaBarData,
          datasets: [{ ...this.ventasIvaBarData.datasets[0], data: [sin, con] }]
        };
      },
      error: () => {
        // deja 0,0
      }
    });
  }

  private cargarIngresosEgresos(start?: string, end?: string) {
    this.stats.statsIngresosEgresos(start, end).subscribe({
      next: (res) => {
        const sin  = Number(res?.ventas_sin_iva || 0);
        const iva  = Number(res?.iva || 0);
        const eg   = Number(res?.egresos || 0);

        // dona
        this.ingEgreDoughnutData = {
          ...this.ingEgreDoughnutData,
          datasets: [{ ...this.ingEgreDoughnutData.datasets[0], data: [sin, iva, eg] }]
        };
        // barras
        this.ingEgreBarData = {
          ...this.ingEgreBarData,
          datasets: [{ ...this.ingEgreBarData.datasets[0], data: [sin, iva, eg] }]
        };
      },
      error: () => {
        // deja 0,0,0
      }
    });
  }
}
