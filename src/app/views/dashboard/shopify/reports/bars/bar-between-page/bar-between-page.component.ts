import {
  Component,
  OnDestroy,
  OnInit,
  ElementRef,
  ViewChild,
  Input,
} from "@angular/core";
import { ReportService } from "../../report.service";
import Swal from "sweetalert2";
import { Subject, takeUntil } from "rxjs";
import { ChartjsComponent } from "@coreui/angular-chartjs";
import Chart from "chart.js/auto";
import type {
  ChartConfiguration,
  ChartData,
  ChartType,
  Plugin,
} from "chart.js";
import { LoadingComponent } from "../../../../../shared/components/loading/loading.component";
import { ActivatedRoute } from "@angular/router";
import { BarService } from "../bar.service";

const dataLabelPlugin: Plugin<"bar"> = {
  id: "dataLabelPlugin",
  afterDatasetsDraw(chart) {
    const ctx = chart.ctx;
    chart.data.datasets.forEach((dataset, i) => {
      const meta = chart.getDatasetMeta(i);
      meta.data.forEach((bar: any, index: number) => {
        const value = (dataset.data as number[])[index] ?? 0;
        // Obtener los datos originales
        const rawData = (chart as any).rawData || [];
        const total = rawData[index]?.total || 0;
        const comision = rawData[index]?.comision || 0;
        
        ctx.save();
        
        // Mostrar order_count y total en la parte superior - MÁS GRANDE Y NEGRITA
        ctx.font = "bold 14px sans-serif";
        ctx.fillStyle = "#1a1a2e";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        const label = `${value} (S/${total.toFixed(2)})`;
        const yOffset = value === 0 ? -2 : -8;
        ctx.fillText(label, bar.x, bar.y + yOffset);
        
        // Mostrar comisión en la parte inferior de la barra - MÁS GRANDE Y NEGRITA
        if (comision > 0) {
          ctx.font = "bold 12px sans-serif";
          ctx.fillStyle = "#4B5563";
          ctx.textBaseline = "top";
          const comisionLabel = `Com: S/${comision.toFixed(2)}`;
          ctx.fillText(comisionLabel, bar.x, bar.y + 8);
        }
        
        ctx.restore();
      });
    });
  },
};

@Component({
  selector: "app-bar-between-page",
  imports: [ChartjsComponent, LoadingComponent],
  templateUrl: "./bar-between-page.component.html",
  styleUrl: "./bar-between-page.component.scss",
})
export class BarBetweenPageComponent implements OnInit, OnDestroy {
  @ViewChild("chartCanvas") chartCanvas!: ElementRef;
  chart!: Chart<"bar">;
  loading = false;
  private chartInitialized = false;
  private chartData: any[] = [];

  day_start: string = "";
  day_end: string = "";

  months: number = 12;

  constructor(
    private _bar: BarService,
    private route: ActivatedRoute,
  ) {
    Chart.register(dataLabelPlugin);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.months = params["months"] ? params["months"] : this.months;

      this.day_start = params["day_start"];
      this.day_end = params["day_end"];

      console.log(this.day_start);

      if (this.chart) this.chart.destroy();
      this.reportInit();
    });
  }

  ngAfterViewChecked(): void {
    if (!this.chartInitialized && this.chartCanvas && !this.loading) {
      this.chartInitialized = true;
      this.createChart();
    }
  }

  private createChart(): void {
    const labels = this.chartData.map((r) => this.formatMonth(r.date));
    const values = this.chartData.map((r) => r.order_count);

    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);

    // Paleta pastel
    const pastelPalette = [
      "#A8DADC",
      "#F4A261",
      "#E9C46A",
      "#BDE0FE",
      "#CDB4DB",
      "#FFC8DD",
      "#FFAFCC",
    ];

    // Asignar color según valor
    const backgroundColors = values.map((v, i) => {
      if (v === maxValue) return "#A8E6CF";
      if (v === minValue && v > 0) return "#FF8B94";
      if (v === 0) return "rgba(255, 99, 99, 0.1)";
      return pastelPalette[i % pastelPalette.length];
    });

    const borderColors = values.map((v) =>
      v === 0 ? "#FF3B30" : backgroundColors[values.indexOf(v)],
    );
    const borderWidths = values.map((v) => (v === 0 ? 3 : 1));

    const data: ChartData<"bar"> = {
      labels,
      datasets: [
        {
          label: "Pedidos por mes",
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: borderWidths,
          borderSkipped: false,
          data: values,
        },
      ],
    };

    const config: ChartConfiguration<"bar"> = {
      type: "bar",
      data,
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const index = context.dataIndex;
                const dataItem = this.chartData[index];
                if (dataItem) {
                  return [
                    `Pedidos: ${dataItem.order_count}`,
                    `Total: S/${dataItem.total.toFixed(2)}`,
                    `Comisión (2%): S/${dataItem.comision?.toFixed(2) || '0.00'}`
                  ];
                }
                return `Pedidos: ${context.formattedValue}`;
              },
              title: (items) => {
                const index = items[0].dataIndex;
                const dataItem = this.chartData[index];
                if (dataItem) {
                  return this.formatMonth(dataItem.date);
                }
                return items[0].label;
              }
            }
          },
          title: {
            display: true,
            text: "Mostrando pedidos",
            font: { size: 16, weight: "bold" },
          },
        },
        scales: {
          x: {
            title: { display: true, text: "Fecha" },
            ticks: { font: { size: 12 } },
          },
          y: {
            title: { display: true, text: "Pedidos" },
            beginAtZero: true,
            ticks: { precision: 0 },
            suggestedMax: maxValue + 2,
          },
        },
      },
      plugins: [dataLabelPlugin],
    };

    // Guardar datos completos en el chart para acceso en el plugin
    (config as any).rawData = this.chartData;
    this.chart = new Chart(this.chartCanvas.nativeElement, config);
    (this.chart as any).rawData = this.chartData;
  }

  private formatDate(dateStr: string): string {
    const [year, month, day] = dateStr.split("-").map(Number);
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString("es-PE", {
      weekday: "short",
      day: "2-digit",
    });
  }

  private formatMonth(dateStr: string): string {
    const [year, month] = dateStr.split("-").map(Number);
    const d = new Date(year, month - 1, 1);

    return d.toLocaleDateString("es-PE", {
      month: "short",
      year: "numeric",
    });
  }

  reportInit() {
    this.loading = true;

    Swal.fire({
      title: "Espere...",
      html: "Generando su reporte por mes",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this._bar
      .between(this.day_start, this.day_end)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp: any) => {
          console.log(resp);
          this.chartData = (resp ?? [])
            .slice()
            .sort((a: any, b: any) => a.date.localeCompare(b.date));

          this.loading = false;

          Swal.close();
        },

        error: (error: any) => {
          Swal.fire(
            "Error",
            "Ocurrió un problema al traer los registros. Inténtalo nuevamente.",
            "error",
          );
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