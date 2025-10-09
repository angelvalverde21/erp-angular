import { Component, OnDestroy, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { ReportService } from '../report.service';
import Swal from 'sweetalert2';
import { Subject, takeUntil } from 'rxjs';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import {
  Chart,
  ChartConfiguration,
  ChartData,
  ChartType,
  Plugin

} from 'chart.js';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ActivatedRoute } from '@angular/router';

const dataLabelPlugin: Plugin<'bar'> = {
  id: 'dataLabelPlugin',
  afterDatasetsDraw(chart) {
    const ctx = chart.ctx;
    chart.data.datasets.forEach((dataset, i) => {
      const meta = chart.getDatasetMeta(i);
      meta.data.forEach((bar: any, index: number) => {
        const value = (dataset.data as number[])[index] ?? 0;
        ctx.save();
        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = '#444';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        // Si el valor es 0, lo colocamos un poco por encima para que no se superponga al eje
        const yOffset = value === 0 ? -2 : -5;
        ctx.fillText(String(value), bar.x, bar.y + yOffset);
        ctx.restore();
      });
    });
  }
};

@Component({
  selector: 'app-report-daily-page',
  imports: [ChartjsComponent, LoadingComponent],
  templateUrl: './report-daily-page.component.html',
  styleUrl: './report-daily-page.component.scss'
})
export class ReportDailyPageComponent implements OnInit, OnDestroy {

  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  chart!: Chart<'bar'>;
  loading = false;
  private chartInitialized = false;
  private chartData: any[] = [];

  days: number = 7;

  constructor(private _report: ReportService, private route: ActivatedRoute) {
    Chart.register(dataLabelPlugin);
  }

  ngOnInit(): void {
    
    this.route.params.subscribe(params => {
      this.days = params['days'];
      console.log(this.days);
      
      this.reportInit();
    });

  }

  // loadData(): void {
  //   this.loading = true;
  //   this.http.get<any[]>('/api/reports/daily-orders?days=7').subscribe((res) => {
  //     this.chartData = res;
  //     this.loading = false; // dispara el @else del template
  //   });
  // }

  ngAfterViewChecked(): void {
    // Espera a que el canvas exista y el gráfico no se haya creado aún
    if (!this.chartInitialized && this.chartCanvas && !this.loading) {
      this.chartInitialized = true;
      this.createChart();
    }
  }

  private createChart(): void {
    const labels = this.chartData.map((r) => this.formatDate(r.date));
    const values = this.chartData.map((r) => r.order_count);

    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);

    // 🎨 Paleta pastel
    const pastelPalette = [
      '#A8DADC', '#F4A261', '#E9C46A', '#BDE0FE', '#CDB4DB', '#FFC8DD', '#FFAFCC'
    ];

    // 🧠 Asignar color según valor
    const backgroundColors = values.map((v, i) => {
      if (v === maxValue) return '#A8E6CF'; // verde pastel
      if (v === minValue && v > 0) return '#FF8B94'; // rojo pastel (mínimo distinto de 0)
      if (v === 0) return 'rgba(255, 99, 99, 0.1)'; // transparente suave para 0
      return pastelPalette[i % pastelPalette.length];
    });

    // 🧱 Barras con borde especial si valor = 0
    const borderColors = values.map((v) =>
      v === 0 ? '#FF3B30' : backgroundColors[values.indexOf(v)]
    );
    const borderWidths = values.map((v) => (v === 0 ? 3 : 1));

    const data: ChartData<'bar'> = {
      labels,
      datasets: [
        {
          label: 'Pedidos por día',
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: borderWidths,
          borderSkipped: false,
          data: values
        }
      ]
    };

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data,
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `Pedidos: ${ctx.formattedValue}`
            }
          },
          title: {
            display: true,
            text: 'Pedidos de los últimos ' + this.days + ' días',
            font: { size: 16, weight: 'bold' }
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'Fecha' },
            ticks: { font: { size: 12 } }
          },
          y: {
            title: { display: true, text: 'Pedidos' },
            beginAtZero: true,
            ticks: { precision: 0 }
          }
        }
      },
      plugins: [dataLabelPlugin]
    };

    this.chart = new Chart(this.chartCanvas.nativeElement, config);
  }


  private formatDate(dateStr: string): string {
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString('es-PE', {
      weekday: 'short',
      day: '2-digit'
    });
  }

  reportInit() {

    this.loading = true;

    this._report.daily(this.days).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        // Swal.fire('Guardado', 'El registro ha sido creado', 'success');
        console.log(resp);
        this.chartData = (resp ?? []).slice().sort((a: any, b: any) => a.date.localeCompare(b.date));

        this.loading = false;


      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al traer los registros. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });
  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }



}
