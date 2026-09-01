import { Component, OnInit } from '@angular/core';
import { ToastService } from '../toast-service';
import { ChartType } from '../dashboard.model';

import { Vehicle } from 'src/app/core/models/vehicle.models';
import * as features from 'src/app/core/data/Features';

import { Inspection } from 'src/app/core/models/inspection.models';
import { EmissionParameter } from 'src/app/core/models/emission-parameter.models';
import { VehicleClass } from 'src/app/core/models/vehicleClass.models';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  
  userData: any;  
  vehiclesList:Vehicle[]=[];
  inspectionsList:Inspection[]=[];
  parametersList:EmissionParameter[]=[];
  vehicleClassesList:VehicleClass[]=[];
  filteredVehicles!:Vehicle[];
  filteredInspections!: Inspection[];
  currentDateRange: { from: Date, to: Date } | null = null;
  option = {
    startVal: 0,
    decimalPlaces: 0,
    duration: 2,
    useEasing: true,
    useGrouping: true,
    separator: ',',
    decimal: '.'
  };

  constructor(public toastService: ToastService,

  ) {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.currentDateRange = { from: firstDay, to: lastDay }
  }

  ngOnInit(): void {
   // const userString = window.sessionStorage.getItem('currentUser');
   // this.userData = userString ? JSON.parse(userString) : null;
    this.getVehicles();
    this.getInspections();
    this.getParameters();
    this.getClasses();
    if (sessionStorage.getItem('toast')) {
      this.toastService.show('¡Bienvenido!, Inicio de sesión exitoso', { classname: 'bg-success text-center text-white', delay: 5000 });
      sessionStorage.removeItem('toast');
    }
    this.initializeAllCharts();
  }
  initializeAllCharts() {
    setTimeout(() => {
      if (this.inspectionsList.length > 0 && this.parametersList.length > 0) {
        this.updateAllCharts();
        this.setdealvalue('yearly');
        this.setInspectionAnalytics('all');
      }
    }, 1000);
  }
  updateAllCharts() {
    this._vehiclesChart('["--vz-primary", "--vz-success", "--vz-danger"]', this.filteredVehicles);
    this._VehicleDistributionChart('["--vz-primary", "--vz-secondary", "--vz-success", "--vz-info", "--vz-warning", "--vz-danger"]', this.filteredVehicles);
    this._analyticsChart('["--vz-warning", "--vz-primary", "--vz-success"]');
    this._DealTypeChart('["--vz-warning", "--vz-secondary", "--vz-success"]', this.filteredInspections);
    this._EmissionParametersChart('["--vz-primary"]', this.filteredInspections);
    this._InspectionTrendsChart('["--vz-success", "--vz-primary", "--vz-danger"]');
  }
  onDateRangeChange(event: any) {
    this.currentDateRange = {
        from: new Date(event.from),
        to: new Date(event.to)
    };
    const { from, to } = this.currentDateRange;
    if (from instanceof Date && !isNaN(from.getTime()) &&
      to instanceof Date && !isNaN(to.getTime())) {
      this.filteredVehicles = this.vehiclesList.filter(vehicle => {
        const regDate = new Date(vehicle.fechaRegistro);
        return regDate >= from && regDate <= to;
      });    
      this.filteredInspections = this.inspectionsList.filter(inspection => {
        const inspectionDate = new Date(inspection.fechaInspeccion);
        return inspectionDate >= from && inspectionDate <= to;
      });
      this.setdealvalue('custom');
      this.setInspectionAnalytics('custom');
      this.analyzeParameterCompliance(this.filteredInspections);
      this.updateAllCharts();

      this.getInspectionStats(this.filteredInspections);
      this.getUpcomingInspections(this.filteredInspections);
      this.getPassedInspectionsCount(this.filteredInspections);
      this.getFailedInspectionsCount(this.filteredInspections);
      this.getVisualComplianceCount(this.filteredInspections);
      this.getGasComplianceCount(this.filteredInspections);
      this.getOverallPassRate(this.filteredInspections);
    } else {
      this.currentDateRange = null;
      this.filteredInspections = [...this.inspectionsList];
      this.filteredVehicles = [...this.vehiclesList];
      this.updateAllCharts();
    }
  }
  /**
  * Vehicles Charts
  */
  // Vehicle Service Class Distribution (Bar Chart)
  vehiclesChart: any;
  private _vehiclesChart(colors: any, filteredVehicles?: Vehicle[]) {
      colors = this.getChartColorsArray(colors);
      const listToUse = filteredVehicles || this.vehiclesList;
      const tooltipMap: Record<string, Record<string, number>> = {};
      listToUse.forEach(vehicle => {
        const servicio = vehicle.datoTecnicoDto?.servicio;
        const clase = vehicle.datoTecnicoDto?.tipoClaseVehiculoDto.nombre;
        if (!servicio || !clase) {
        return;
        }
        if (!tooltipMap[servicio]) {
          tooltipMap[servicio] = {};
        }
        tooltipMap[servicio][clase] = (tooltipMap[servicio][clase] || 0) + 1;
      });
      const serviceCounts = features.serviceTypes.reduce((acc, service) => {
        acc[service.value] = listToUse.filter(v => v.datoTecnicoDto.servicio === service.value).length;
        return acc;
      }, {} as Record<string, number>);
      this.vehiclesChart = {
        series: [{
          name: '',
          data: features.serviceTypes.map(service => serviceCounts[service.value])
        }],
        chart: {
          type: 'bar',
          height: 350,
          toolbar: { show: false },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '65%',
          },
        },
        stroke: {
          show: true,
          width: 5,
          colors: ['transparent']
        },
        xaxis: {
          categories: features.serviceTypes.map(service => service.label),
          title: {
            text: 'Servicio',
            offsetY: -45,
            style: {
              color: '#78909C',
              fontSize: '12px',
              fontWeight: 400,
            },
          },
        },
        yaxis: {
          labels: {
            formatter: (value:any) => value
          },
          tickAmount: 4,
          min: 0
        },
        fill: {
          opacity: 1
        },
        colors: colors,
        dataLabels: {
          enabled: true,
          formatter: (val:any) => val,
        },
        tooltip: {
        y: {
          formatter: (val: number, opts: any) => {
            const index = opts.dataPointIndex;
            const servicioValue = features.serviceTypes[index].value;
            const clasesObj = tooltipMap[servicioValue];
            if (!clasesObj) return 'Sin datos';
            const totalLine = `Total Vehículos: ${val}`;
            const lines = Object.entries(clasesObj)
              .map(([clase, count]) => `${clase}: ${count}`);
            return [...lines,totalLine].join('<br>');
          }
        }
      }
      };
  }
  selectedPeriodLabel: string = 'Todo'; // Por defecto
  setVehiclesChartvalue(period: '1M' | '6M' | '1Y' | 'all') {
      const now = new Date();
      let filteredList: Vehicle[] = [];
      switch (period) {
        case '1M':
          this.selectedPeriodLabel = 'Último Mes';
          const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          filteredList = this.vehiclesList.filter(v =>
            new Date(v.fechaRegistro) >= oneMonthAgo
          );
          break;
        case '6M':
          this.selectedPeriodLabel = 'Últimos 6 Meses';
          const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
          filteredList = this.vehiclesList.filter(v =>
            new Date(v.fechaRegistro) >= sixMonthsAgo
          );
          break;
        case '1Y':
          this.selectedPeriodLabel = 'Último Año';
          const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
          filteredList = this.vehiclesList.filter(v =>
            new Date(v.fechaRegistro) >= oneYearAgo
          );
          break;
        case 'all':
        default:
          this.selectedPeriodLabel = 'Todo';
          filteredList = this.vehiclesList;
          break;
      }
      this._vehiclesChart('["--vz-primary", "--vz-success", "--vz-danger"]', filteredList);
  }
  // Vehicle Class Distribution (Pie Chart)
  VehicleDistributionChart: any;
  private _VehicleDistributionChart(colors: any, filteredVehicles?: Vehicle[])  {
    colors = this.getChartColorsArray(colors);
    const listToUse = filteredVehicles || this.vehiclesList;
    const distributionData = this.getVehicleClassDistribution(listToUse);
    this.VehicleDistributionChart = {
      series: distributionData.values,
      chart: {
        type: 'pie',
        height: 350
      },
      labels: distributionData.labels,
      colors: colors,
      dataLabels: {
        enabled: true,
        formatter: function(val: number) {
          return val.toFixed(1) + '%';
        }
      },
      legend: {
        position: 'bottom'
      },
      tooltip: {
        y: {
          formatter: function(val: number) {
            return val + ' registros';
          }
        }
      }
    };
  }
  private getVehicleClassDistribution(vehicles: Vehicle[]) {
    const classCount: { [key: string]: number } = {};  
    vehicles.forEach((item: Vehicle) => {
      const vehicleClass = item.datoTecnicoDto?.tipoClaseVehiculoDto.nombre || 'Otro';
      classCount[vehicleClass] = (classCount[vehicleClass] || 0) + 1;
    });  
    return {
      labels: Object.keys(classCount),
      values: Object.values(classCount)
    };
  }

  /**
   * Inspection Analytics Chart - Shows inspection trends over time
   */
  analyticsChart!: ChartType;
  selectedInspectionPeriod: string = '1Y'; 
  inspectionStats: any = { total: 0, passed: 0, failed: 0, complianceRate: 0 };
  private _analyticsChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.analyticsChart = {
      chart: {
        height: 370,
        type: "line",
        toolbar: {
          show: false,
        },
      },
      stroke: {
        curve: "straight",
        dashArray: [0, 0, 8],
        width: [2, 0, 2.2],
      },
      colors: colors,
      series: [{
        name: 'Total de Inspecciones',
        type: 'area',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }, {
        name: 'Inspecciones Aprobadas',
        type: 'bar',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }, {
        name: 'Inspecciones Reprobadas',
        type: 'line',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }],
      fill: {
        opacity: [0.1, 0.9, 1],
      },
      markers: {
        size: [0, 0, 0],
        strokeWidth: 2,
        hover: {
          size: 4,
        },
      },
      xaxis: {
        categories: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", 
                    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
      yaxis: {
        title: {
          text: 'Numero de Inspecciones'
        }
      },
      grid: {
        show: true,
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: false,
          },
        },
        padding: {
          top: 0,
          right: -2,
          bottom: 15,
          left: 10,
        },
      },
      legend: {
        show: true,
        horizontalAlign: "center",
        offsetX: 0,
        offsetY: -5,
        markers: {
          width: 9,
          height: 9,
          radius: 6,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 0,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: "30%",
          barHeight: "70%",
        },
      },
    };
  }
  setInspectionAnalytics(value: any) {
    const filteredInspections = this.filterInspectionsByPeriod(value);
    const monthlyData:any = this.groupInspectionsByMonth(filteredInspections, value);    
    this.analyticsChart.series = [{
      name: 'Total de Inspecciones',
      type: 'area',
      data: monthlyData.totalInspections
    }, {
      name: 'Inspecciones Aprobadas',
      type: 'bar',
      data: monthlyData.passedInspections
    }, {
      name: 'Inspecciones Reprobadas',
      type: 'line',
      data: monthlyData.failedInspections
    }];
    this.analyticsChart.xaxis = {
      ...this.analyticsChart.xaxis,
      categories: monthlyData.categories
    };
  }
  private groupInspectionsByMonth(inspections: Inspection[], period: string) {
    const now = new Date();
    let categories: string[] = [];
    let dataLength: number;

    if (period === 'custom') {
      const from = this.currentDateRange?.from;
      const to = this.currentDateRange?.to;
      if (from && to) {
        const diffInDays = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        if (diffInDays <= 30) {
          dataLength = diffInDays;
          categories = this.generateDayLabels(dataLength);
          return this.groupInspectionsByDay(inspections, dataLength);
        } else if (diffInDays <= 365) {
          const monthCount = this.getMonthDifference(from, to);
          categories = this.generateMonthLabelsFromDate(from, monthCount);
          return this.groupInspectionsByMonthDate(inspections, monthCount);
        } else {
          const yearCount = this.getYearDifference(from, to);
          categories = this.generateYearLabels(from, yearCount);
          return this.groupInspectionsByYearPeriod(inspections, yearCount);
        }
      } else {
        return [];
      }
    }

    switch (period) {
      case '1M':
        dataLength = 30;
        categories = this.generateDayLabels(30);
        return this.groupInspectionsByDay(inspections, 30);
      case '6M':
        dataLength = 6;
        categories = this.generateMonthLabels(6);
        return this.groupInspectionsByMonthPeriod(inspections, 6);
      case '1Y':
        dataLength = 12;
        categories = this.generateMonthLabels(12);
        return this.groupInspectionsByMonthPeriod(inspections, 12);
      default: // 'all'
        if (inspections.length === 0) {
          categories = ["Ene", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
          dataLength = 12;
        } else {
          const firstInspection = new Date(Math.min(...inspections.map(i => new Date(i.fechaInspeccion).getTime())));
          const monthsDiff = (now.getFullYear() - firstInspection.getFullYear()) * 12 +
                            (now.getMonth() - firstInspection.getMonth()) + 1;
          dataLength = Math.max(monthsDiff, 12);
          categories = this.generateMonthLabelsFromDate(firstInspection, dataLength);
        }
        return this.groupInspectionsForAllPeriod(inspections, categories);
    }
  }
private getMonthDifference(from: Date, to: Date): number {
  return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth()) + 1;
}
private getYearDifference(from: Date, to: Date): number {
  return to.getFullYear() - from.getFullYear() + 1;
}
private generateYearLabels(startDate: Date, count: number): string[] {
  const years: string[] = [];
  for (let i = 0; i < count; i++) {
    years.push((startDate.getFullYear() + i).toString());
  }
  return years;
}

  private generateDayLabels(days: number): string[] {
    const labels: string[] = [];
    const now = new Date();  
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      labels.push(date.getDate().toString());
    }  
    return labels;
  }
  private generateMonthLabels(months: number): string[] {
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", 
                      "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const labels: string[] = [];
    const now = new Date();  
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      labels.push(monthNames[date.getMonth()]);
    }  
    return labels;
  }
  private generateMonthLabelsFromDate(startDate: Date, months: number): string[] {
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", 
                      "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const labels: string[] = [];  
    for (let i = 0; i < months; i++) {
      const date = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
      labels.push(monthNames[date.getMonth()]);
    }  
    return labels;
  }

  private groupInspectionsByDay(inspections: Inspection[], days: number) {
    const dailyStats = Array(days).fill(0).map(() => ({
      total: 0,
      passed: 0,
      failed: 0
    }));
    const now = new Date();  
    inspections.forEach(inspection => {
      const inspectionDate = new Date(inspection.fechaInspeccion);
      const daysDiff = Math.floor((now.getTime() - inspectionDate.getTime()) / (1000 * 60 * 60 * 24));    
      if (daysDiff >= 0 && daysDiff < days) {
        const index = days - 1 - daysDiff;
        dailyStats[index].total++;
        
        if (inspection.resultado) {
          dailyStats[index].passed++;
        } else {
          dailyStats[index].failed++;
        }
      }
    });  
    return {
      totalInspections: dailyStats.map(stat => stat.total),
      passedInspections: dailyStats.map(stat => stat.passed),
      failedInspections: dailyStats.map(stat => stat.failed),
      categories: this.generateDayLabels(days)
    };
  }
  private groupInspectionsByMonthPeriod(inspections: Inspection[], months: number) {
    const monthlyStats = Array(months).fill(0).map(() => ({
      total: 0,
      passed: 0,
      failed: 0
    }));  
    const now = new Date();  
    inspections.forEach(inspection => {
      const inspectionDate = new Date(inspection.fechaInspeccion);
      const monthsDiff = (now.getFullYear() - inspectionDate.getFullYear()) * 12 + 
                        (now.getMonth() - inspectionDate.getMonth());    
      if (monthsDiff >= 0 && monthsDiff < months) {
        const index = months - 1 - monthsDiff;
        monthlyStats[index].total++;
        
        if (inspection.resultado) {
          monthlyStats[index].passed++;
        } else {
          monthlyStats[index].failed++;
        }
      }
    });  
    return {
      totalInspections: monthlyStats.map(stat => stat.total),
      passedInspections: monthlyStats.map(stat => stat.passed),
      failedInspections: monthlyStats.map(stat => stat.failed),
      categories: this.generateMonthLabels(months)
    };
  }
  private groupInspectionsForAllPeriod(inspections: Inspection[], categories: string[]) {
    const monthlyStats = Array(categories.length).fill(0).map(() => ({
      total: 0,
      passed: 0,
      failed: 0
    }));  
    if (inspections.length === 0) {
      return {
        totalInspections: monthlyStats.map(stat => stat.total),
        passedInspections: monthlyStats.map(stat => stat.passed),
        failedInspections: monthlyStats.map(stat => stat.failed),
        categories: categories
      };
    }  
    const firstInspection = new Date(Math.min(...inspections.map(i => new Date(i.fechaInspeccion).getTime())));
    inspections.forEach(inspection => {
      const inspectionDate = new Date(inspection.fechaInspeccion);
      const monthsDiff = (inspectionDate.getFullYear() - firstInspection.getFullYear()) * 12 + 
                        (inspectionDate.getMonth() - firstInspection.getMonth());    
      if (monthsDiff >= 0 && monthsDiff < categories.length) {
        monthlyStats[monthsDiff].total++;
        
        if (inspection.resultado) {
          monthlyStats[monthsDiff].passed++;
        } else {
          monthlyStats[monthsDiff].failed++;
        }
      }
    });  
    return {
      totalInspections: monthlyStats.map(stat => stat.total),
      passedInspections: monthlyStats.map(stat => stat.passed),
      failedInspections: monthlyStats.map(stat => stat.failed),
      categories: categories
    };
  }
  private groupInspectionsByYearPeriod(inspections: Inspection[], yearCount: number): any[] {
    if (!this.currentDateRange) {
      return []; 
    }
    const from = this.currentDateRange.from;
    const groupedData: { [year: string]: number } = {};
    for (let i = 0; i < yearCount; i++) {
      const year = from.getFullYear() + i;
      groupedData[year] = 0;
    }
    inspections.forEach(inspection => {
      const inspectionDate = new Date(inspection.fechaInspeccion);
      const year = inspectionDate.getFullYear();
      if (groupedData.hasOwnProperty(year)) {
        groupedData[year]++;
      }
    });
    return Object.values(groupedData);
  }

  private groupInspectionsByMonthDate(inspections: Inspection[], months: number) {
    if (!this.currentDateRange) return;
    const startDate = this.currentDateRange.from; // Use custom start
    const monthlyStats = Array(months).fill(0).map(() => ({
      total: 0,
      passed: 0,
      failed: 0
    }));
    inspections.forEach(inspection => {
      const inspectionDate = new Date(inspection.fechaInspeccion);
      const monthsDiff = (inspectionDate.getFullYear() - startDate.getFullYear()) * 12 +
                        (inspectionDate.getMonth() - startDate.getMonth());

      if (monthsDiff >= 0 && monthsDiff < months) {
        monthlyStats[monthsDiff].total++;
        if (inspection.resultado) {
          monthlyStats[monthsDiff].passed++;
        } else {
          monthlyStats[monthsDiff].failed++;
        }
      }
    });
    return {
      totalInspections: monthlyStats.map(stat => stat.total),
      passedInspections: monthlyStats.map(stat => stat.passed),
      failedInspections: monthlyStats.map(stat => stat.failed),
      categories: this.generateMonthLabelsFromDate(startDate, months)
    };
  }

  private filterInspectionsByPeriod(period: string): Inspection[] {
    const now = new Date();
    let startDate: Date; 
    let endDate: Date;   
    switch(period) {
      case 'custom':        
        if (this.currentDateRange?.from instanceof Date &&
          !isNaN(this.currentDateRange.from.getTime()) &&
          this.currentDateRange?.to instanceof Date &&
          !isNaN(this.currentDateRange.to.getTime()) ) {
          startDate = this.currentDateRange.from;
          endDate = this.currentDateRange.to;
        } else {
          return [];
        }
        break;
      case '1M':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        endDate = now;
        break;
      case '6M':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        endDate = now;
        break;
      case '1Y':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        endDate = now;
        break;
      default: // 'all'
        return this.inspectionsList;
    }        
    return this.inspectionsList.filter(inspection => {
      const inspectionDate = new Date(inspection.fechaInspeccion);
      return inspectionDate >= startDate && inspectionDate <= endDate;
    });
  }

  /**
   * Deal Type Chart - Radar chart showing inspection metrics by vehicle class
   */
  DealTypeChart: any; 
  private _DealTypeChart(colors: any, filteredInspections?:Inspection[]) {
    colors = this.getChartColorsArray(colors);
    const listToUse = filteredInspections || this.inspectionsList;
    const analysisData = this.analyzeInspectionData(listToUse);  
    this.DealTypeChart = {
      series: [
        {
          name: 'Tasa de Aprobación %',
          data: analysisData.passRates
        },
        {
          name: 'Cumplimiento Visual %',
          data: analysisData.visualCompliance
        },
        {
          name: 'Cumplimiento de Emisión de Gases %',
          data: analysisData.gasCompliance
        }
      ],
      chart: {
        height: 350,
        type: 'radar',
        dropShadow: {
          enabled: true, blur: 1, left: 1, top: 1
        },
        toolbar: {
          show: false
        },
      },
      stroke: {
        width: 2
      },
      fill: {
        opacity: 0.2
      },
      markers: {
        size: 5
      },
      colors: colors,
      xaxis: {
        categories: analysisData.categories
      },
      yaxis: {
        min: 0,
        max: 100,
        tickAmount: 5
      },
      tooltip: {
        y: {
          formatter: function(val: number) {
            return val.toFixed(1) + '%';
          }
        }
      }
    };
  }
  selectedDealPeriodLabel: string = 'yearly';
  setdealvalue(value: 'today' | 'weekly' | 'monthly' | 'yearly' | 'custom') {
    switch (value) {
      case 'today':
        this.selectedDealPeriodLabel = 'Hoy';
        break;
      case 'weekly':
        this.selectedDealPeriodLabel = 'Esta Semana';
        break;
      case 'monthly':
        this.selectedDealPeriodLabel = 'Este Mes';
        break;
      case 'yearly':
        this.selectedDealPeriodLabel = 'Este Año';
        break;
      case 'custom':
        if (this.currentDateRange && this.currentDateRange.from && this.currentDateRange.to) {
          const from = this.formatDateLabel(this.currentDateRange.from);
          const to = this.formatDateLabel(this.currentDateRange.to);
          this.selectedDealPeriodLabel = `${from} - ${to}`;
        } else {
          this.selectedDealPeriodLabel = 'Personalizado';
        }
        break;
      default:
        this.selectedDealPeriodLabel = 'Todo';
        break;
    }
    const analysisData = this.getFilteredAnalysisData(value);
    this.DealTypeChart.series= [
      {
        name: 'Tasa de Aprobación %',
        data: analysisData.passRates
      },
      {
        name: 'Cumplimiento Visual %',
        data: analysisData.visualCompliance
      },
      {
        name: 'Cumplimiento de Emisión de Gases %',
        data: analysisData.gasCompliance
      }
    ];
  }
// Method to filter data based on time period
  private getFilteredAnalysisData(period: string) {
    let inspections: any[] = [];

    if (period === 'custom' && this.filteredInspections) {
      inspections = this.filteredInspections;
    } else if (['today', 'weekly', 'monthly', 'yearly'].includes(period)) {
      const now = new Date();
      let startDate: Date;

      switch (period) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'weekly':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'monthly':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'yearly':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(0); // fallback to all
      }

      inspections = this.inspectionsList.filter(inspection => {
        const inspectionDate = new Date(inspection.fechaInspeccion);
        return inspectionDate >= startDate;
      });
    } else {
      inspections = this.inspectionsList;
    }

    return this.analyzeInspectionData(inspections);
  }


// analyze inspection data for meaningful insights
  private analyzeInspectionData(inspections:Inspection[]) {  
    const services = features.serviceTypes.map(s => s.value);
    const clases =this.vehicleClassesList.map(c => c.nombre);
    if (!inspections || inspections.length === 0) {
      return {
        passRates: [0, 0, 0, 0, 0, 0],
        visualCompliance: [0, 0, 0, 0, 0, 0],
        gasCompliance: [0, 0, 0, 0, 0, 0],
        categories: features.vehicleCategory.map(c => c.value)
      };
    }
    const vehicleClasses =clases;
    const categories = features.vehicleCategory.map(c => c.value);  
    const passRates: number[] = [];
    const visualCompliance: number[] = [];
    const gasCompliance: number[] = [];

    vehicleClasses.forEach((vehicleClass, index) => {
      const classInspections = inspections.filter(inspection => {
        return inspection.vehiculoDto?.datoTecnicoDto.tipoClaseVehiculoDto?.nombre.toLowerCase().includes(vehicleClass) ||
              inspection.vehiculoDto?.datoTecnicoDto.categoriaVehiculo?.toLowerCase().includes(vehicleClass);
      });
      if (classInspections.length === 0) {
        passRates.push(0);
        visualCompliance.push(0);
        gasCompliance.push(0);
        return;
      }
      const passedInspections = classInspections.filter(i => i.resultado === true).length;
      const passRate = (passedInspections / classInspections.length) * 100;
      passRates.push(passRate);
      const visuallyCompliant = classInspections.filter(i => i.examenVisualConforme === true).length;
      const visualRate = (visuallyCompliant / classInspections.length) * 100;
      visualCompliance.push(visualRate);
      const gasCompliant = classInspections.filter(i => i.gasesEscapeConforme === true).length;
      const gasRate = (gasCompliant / classInspections.length) * 100;
      gasCompliance.push(gasRate);
    });
    return {
      passRates,
      visualCompliance,
      gasCompliance,
      categories
    };
  }
  private formatDateLabel(date: Date): string {
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  }


// 1. Emission Parameters Compliance Chart (Bar Chart)
  EmissionParametersChart: any;
  private _EmissionParametersChart(colors: any, filteredInspections?:Inspection[]) {
    colors = this.getChartColorsArray(colors);
      const listToUse = filteredInspections || this.inspectionsList;
    const parameterAnalysis = this.analyzeParameterCompliance(listToUse);  
    this.EmissionParametersChart = {
      series: [{
        name: 'Tasa de Cumplimiento (%)',
        data: parameterAnalysis.map(p => p.complianceRate)
      }],
      chart: {
        type: 'bar',
        height: 350,
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function(val: number) {
          return val.toFixed(1) + '%';
        }
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: parameterAnalysis.map(p => p.parameterName),
        labels: {
          rotate: -45
        }
      },
      yaxis: {
        title: { text: 'Tasa de Cumplimiento (%)' },
        min: 0,
        max: 100
      },
      fill: { opacity: 1 },
      colors: colors,
      tooltip: {
        y: {
          formatter: function(val: number) {
            return val.toFixed(1) + '%';
          }
        }
      }
    };
  }
  // parameter-based analysis
  private analyzeParameterCompliance(inspections:Inspection[]) {
    if (!inspections || !this.parametersList) {
      return [];
    }
    return this.parametersList.map(parameter => {
      const relevantInspections = inspections.filter(inspection => 
        inspection.detalleInspeccionDtoList?.some((detail:any) => 
          detail.tipoParametroDto === parameter.uuid || 
          (typeof detail.tipoParametroDto === 'object' && detail.tipoParametroDto?.uuid === parameter.uuid)
        )
      );
      if (relevantInspections.length === 0) {
        return {
          parameterName: parameter.nombre,
          complianceRate: 0,
          totalTests: 0
        };
      }
      const passedTests = relevantInspections.filter(inspection => 
        inspection.detalleInspeccionDtoList?.some((detail:any) => 
          (detail.tipoParametroDto === parameter.uuid || 
          (typeof detail.tipoParametroDto === 'object' && detail.tipoParametroDto?.uuid === parameter.uuid)) &&
          detail.resultadoParcial === true
        )
      ).length;

      return {
        parameterName: parameter.nombre,
        complianceRate: (passedTests / relevantInspections.length) * 100,
        totalTests: relevantInspections.length
      };
    });
  }
  filterParameterChart(filterType: string) {
    let filteredData = this.getParameterComplianceDetails();  
    switch (filterType) {
      case 'active':
        filteredData = filteredData.filter(param => param.totalTests > 0);
        break;
      case 'low-compliance':
        filteredData = filteredData.filter(param => param.complianceRate < 80);
        break;
      default:
        break;
    }
    this.EmissionParametersChart.series = [{
      name: 'Tasa de Cumplimiento (%)',
      data: filteredData.map(p => p.complianceRate)
    }];  
    this.EmissionParametersChart.xaxis = {
      categories: filteredData.map(p => p.parameterName),
      labels: {
        rotate: -45
      }
    };
  }
  // Parameter Compliance Details for Table
  getParameterComplianceDetails() {
  const filteredInspections = this.currentDateRange && this.filteredInspections? this.filteredInspections.filter(inspection => {
        const date = new Date(inspection.fechaInspeccion);
        return date >= this.currentDateRange!.from && date <= this.currentDateRange!.to;
      })
    : this.inspectionsList;
  return this.parametersList.map(parameter => {
    const relevantInspections = filteredInspections.filter((inspection: any) =>
      inspection.detalleInspeccionDtoList?.some((detail: any) =>
        detail.tipoParametroDto?.nombre === parameter.nombre
      )
    );
      let complianceCount = 0;
      if (relevantInspections.length > 0) {
        complianceCount = relevantInspections.filter(inspection => 
          inspection.detalleInspeccionDtoList?.some((detail:any) => 
            (detail.tipoParametroDto.uuid === parameter.uuid)  &&
            detail.resultadoParcial === true
          )
        ).length;
      }
      const complianceRate = relevantInspections.length > 0 
        ? (complianceCount / relevantInspections.length) * 100 
        : 0;
      return {
        parameterName: parameter.nombre,
        description: parameter.descripcion,
        unit: parameter.unidad,
        totalTests: relevantInspections.length,
        complianceRate: complianceRate,
        uuid: parameter.uuid
      };
    });
  }
// 2. Monthly Inspection Trends (Line Chart)
  InspectionTrendsChart: any;
  private _InspectionTrendsChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    const trendData = this.getMonthlyInspectionTrends(); 
    this.InspectionTrendsChart = {
      series: [
        {
          name: 'Total de Inspecciones',
          data: trendData.totalInspections
        },
        {
          name: 'Inspecciones Aprobadas',
          data: trendData.passedInspections
        },
        {
          name: 'Inspecciones Reprobadas',
          data: trendData.failedInspections
        }
      ],
      chart: {
        height: 350,
        type: 'line',
        zoom: { enabled: false },
        toolbar: { show: false }
      },
      dataLabels: { enabled: false },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5
        }
      },
      xaxis: {
        categories: trendData.months,
        title: { text: 'Mes' }
      },
      yaxis: {
        title: { text: 'Numero de Inspecciones' }
      },
      colors: colors,
      legend: {
        position: 'top',
        horizontalAlign: 'right'
      }
    };
  }



// Helper methods for data analysis
  private getMonthlyInspectionTrends() {
    const monthlyData: { [key: string]: { total: number, passed: number, failed: number } } = {};
    this.inspectionsList.forEach(inspection => {
      const date = new Date(inspection.fechaInspeccion);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { total: 0, passed: 0, failed: 0 };
      }      
      monthlyData[monthKey].total++;
      if (inspection.resultado) {
        monthlyData[monthKey].passed++;
      } else {
        monthlyData[monthKey].failed++;
      }
    });
    
    const sortedMonths = Object.keys(monthlyData).sort();
    
    return {
      months: sortedMonths.map(m => {
        const [year, month] = m.split('-');
        return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      }),
      totalInspections: sortedMonths.map(m => monthlyData[m].total),
      passedInspections: sortedMonths.map(m => monthlyData[m].passed),
      failedInspections: sortedMonths.map(m => monthlyData[m].failed)
    };
  }


  // dashboard statistics
  getInspectionStats(inspections: any[] = this.inspectionsList) {
    const totalInspections = inspections.length;
    const passedInspections = inspections.filter(i => i.resultado).length;
    const failedInspections = totalInspections - passedInspections;
    const complianceRate = totalInspections > 0 ? (passedInspections / totalInspections * 100).toFixed(2) : '0';
    return {
      total: totalInspections,
      passed: passedInspections,
      failed: failedInspections,
      complianceRate: parseFloat(complianceRate)
    };
  }

  getParameterStats() {
    const activeParameters = this.parametersList.filter(p => p.activo).length;
    const totalParameters = this.parametersList.length;
    return {
      active: activeParameters,
      total: totalParameters,
      inactive: totalParameters - activeParameters
    };
  }

  getUpcomingInspections(inspections: any[] = this.inspectionsList) {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);    
    return inspections.filter(inspection => {
      const nextInspectionDate = new Date(inspection.fechaProximaInspeccion);
      return nextInspectionDate <= thirtyDaysFromNow && nextInspectionDate >= new Date();
    }).length;
  }

  getPassedInspectionsCount(inspections: any[] = this.inspectionsList): number {
    return inspections.filter(inspection => inspection.resultado === true).length;
  }

  getFailedInspectionsCount(inspections: any[] = this.inspectionsList): number {
    return inspections.filter(inspection => inspection.resultado === false).length;
  }

  getVisualComplianceCount(inspections: any[] = this.inspectionsList): number {
    return inspections.filter(inspection => inspection.examenVisualConforme === true).length;
  }

  getGasComplianceCount(inspections: any[] = this.inspectionsList): number {
    return inspections.filter(inspection => inspection.gasesEscapeConforme === true).length;
  }

  getOverallPassRate(inspections: any[] = this.inspectionsList): number {
    if (!inspections || inspections.length === 0) return 0;
    const passedCount = this.getPassedInspectionsCount(inspections);
    return Math.round((passedCount / inspections.length) * 100);
  }

  // Trend Range Methods
  selectedTrendLabel: string = 'Últimos 12 Meses';
  setTrendRange(range: '6months' | '12months' | '24months' | 'all') {
    switch (range) {
      case '6months':
        this.selectedTrendLabel = 'Últimos 6 Meses';
        break;
      case '12months':
        this.selectedTrendLabel = 'Últimos 12 Meses';
        break;
      case '24months':
        this.selectedTrendLabel = 'Últimos 24 Meses';
        break;
      case 'all':
        this.selectedTrendLabel = 'Todo';
        break;
      default:
        this.selectedTrendLabel = 'Últimos 12 Meses';
        break;
    }
    const trendData = this.getFilteredTrendData(range);
    this.InspectionTrendsChart.series = [
      {
        name: 'Total Inspecciones',
        data: trendData.totalInspections
      },
      {
        name: 'Inspecciones Aprobadas',
        data: trendData.passedInspections
      },
      {
        name: 'Inspecciones Reprobadas',
        data: trendData.failedInspections
      }
    ];
    this.InspectionTrendsChart.xaxis = {
      categories: trendData.months,
      title: { text: 'Mes' }
    };
  }

  private getFilteredTrendData(range: string) {
    const now = new Date();
    let startDate: Date;
    switch (range) {
      case '6months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        break;
      case '12months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 12, 1);
        break;
      case '24months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 24, 1);
        break;
      default:
        startDate = new Date(2020, 0, 1); // All time
        break;
    }

    const filteredInspections = this.inspectionsList.filter(inspection => {
      const inspectionDate = new Date(inspection.fechaInspeccion);
      return inspectionDate >= startDate;
    });

    // Use the filtered inspections to calculate trends
    const originalList = this.inspectionsList;
    this.inspectionsList = filteredInspections;
    const result = this.getMonthlyInspectionTrends();
    this.inspectionsList = originalList;

    return result;
  }

  refreshVehicleDistribution() {
    this._VehicleDistributionChart('["--vz-primary", "--vz-secondary", "--vz-success", "--vz-info", "--vz-warning", "--vz-danger"]', this.vehiclesList);
  }
  exportVehicleDistribution() {
  const listToUse = this.filteredVehicles.length>0? this.filteredVehicles : this.vehiclesList;
  const distributionData = this.getVehicleClassDistribution(listToUse);
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Vehicle Class,Count\n"
      + distributionData.labels.map((label, index) => 
          `${label},${distributionData.values[index]}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "vehicle_distribution.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  exportParameterData() {
    const parameterData = this.getParameterComplianceDetails();
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Parameter,Unit,Total Tests,Compliance Rate (%)\n"
      + parameterData.map(param => 
          `"${param.parameterName}","${param.unit}",${param.totalTests},${param.complianceRate.toFixed(2)}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "parameter_compliance.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /* API REQUESTS */
  private getVehicles() {

  }
  private getInspections() {

  }
  private getParameters() {

  }
  private getClasses() {

  }

  // Chart Colors Set
  private getChartColorsArray(colors: any) {
    colors = JSON.parse(colors);
    return colors.map(function (value: any) {
      var newValue = value.replace(" ", "");
      if (newValue.indexOf(",") === -1) {
        var color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
        if (color) {
          color = color.replace(" ", "");
          return color;
        }
        else return newValue;;
      } else {
        var val = value.split(',');
        if (val.length == 2) {
          var rgbaColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
          rgbaColor = "rgba(" + rgbaColor + "," + val[1] + ")";
          return rgbaColor;
        } else {
          return newValue;
        }
      }
    });
  }
}