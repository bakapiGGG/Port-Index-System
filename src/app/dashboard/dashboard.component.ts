import {
  Component,
  Output,
  EventEmitter,
  OnDestroy,
  NgZone,
  OnInit,
} from '@angular/core';
import { HttpClient } from '@angular/common/http'; // HTTP Client
import { ColDef, ColumnSparklineOptions } from 'ag-grid-community'; // AG Grid Column Definition
import * as Papa from 'papaparse'; // CSV Parser
import { ViewChild, ElementRef } from '@angular/core';
import { ColumnFormatterParams } from 'ag-grid-community';
import { ScoreChartComponent } from '../score-chart/score-chart.component';

interface DataRow {
  ID: string;
  Name: string;
  Stakeholder: string;
  Country: string;
  City: string;
  Efficiency: number;
  Smartness: number;
  Greenness: number;
  Resilience: number;
  Score: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('efficiencyModal') efficiencyModal!: ElementRef;

  uniqueContainerPorts: string[] = [
    'Shanghai',
    'Singapore',
    'Ningbo Zhoushan',
    'Shenzhen',
    'Qingdao',
    'Guangzhou',
    'Busan',
    'Tianjin',
    'Hong Kong',
    'Rotterdam',
    'Jabel Ali',
    'Antwerp-Bruges',
    'Port Klang',
    'Xiamen',
    'Tanjung Pelepas',
    'Kaohsiung',
    'Los Angeles',
    'New York and New Jersey',
    'Long Beach',
    'Laem Chabang',
    'Singapore',
  ];

  csvBlob: Blob | null = null;
  calculateEfficiencyOnly: boolean = false;
  calculateSmartnessOnly: boolean = false;
  calculateGreennessOnly: boolean = false;
  calculateResilienceOnly: boolean = false;
  selectedIndicator: string = 'Indicators';
  selectedStakeholder: string = 'Stakeholders';
  modalTitle = 'Default Title';
  frameworkComponents: any;
  enableCharts = true;
  autoGroupColumnDef = {
    headerName: 'Container Port',
    sortable: false,
    cellRendererParams: {
      suppressCount: true,
      showOpenedGroup: true,
    },
    cellRendererSelector: (params: any) => {
      if (this.uniqueContainerPorts.includes(params.node.key)) {
        return; // use Default Cell Renderer
      }
      return { component: 'agGroupCellRenderer' };
    },
  };
  @Output() modalOpened = new EventEmitter<void>();

  constructor(private http: HttpClient, private zone: NgZone) {
    this.frameworkComponents = {
      scoreChart: ScoreChartComponent,
    };
    this.fetchCSV();
  }

  private counter: number = 0;

  public labelFormatter = (params: any) => {
    this.counter += 1;

    if (this.counter % 4 == 1) {
      // return "Efficiency" + '\n' + params.value.toFixed(2);
      return params.value.toFixed(1) + '%' + '\n\n' + 'E';
    } else if (this.counter % 4 == 2) {
      // return "Smartness" + '\n' + params.value.toFixed(2);
      return params.value.toFixed(1) + '%' + '\n\n' + 'S';
    } else if (this.counter % 4 == 3) {
      // return "Greenness" + '\n' + params.value.toFixed(2);
      return params.value.toFixed(1) + '%' + '\n\n' + 'G';
    } else {
      // return "Resilience" + '\n' + params.value.toFixed(2);
      return params.value.toFixed(1) + '%' + '\n\n' + 'R';
    }
  };

  public columnFormatter = (params: ColumnFormatterParams) => {
    let color;
    if (params.xValue.toString() === 'Efficiency') {
      color = '#37C9EE';
    } else if (params.xValue.toString() === 'Smartness') {
      color = '#6F6CF9';
    } else if (params.xValue.toString() === 'Greenness') {
      color = '#01B9AF';
    } else {
      color = '#3794FF';
    }

    return {
      fill: color,
      stroke: color,
    };
  };

  columnDefs: ColDef[] = [
    {
      headerName: 'Rank',
      sortingOrder: ['asc', 'desc'],
      field: 'Rank',
      sortable: false, // Disable sorting for this column
      valueGetter: (params) => {
        if (params.node && params.node.rowIndex !== null) {
          return params.node.rowIndex + 1;
        }
        return null;
      },
      
      
      // valueGetter: 'node.rowIndex + 1', // Static
      // valueGetter: (params) => {
      //   if (params.node && params.node.rowIndex !== null) {

      //     return params.node.rowIndex + 1;
      //   }
      //   return null;
      // },

      width: 50,
    },
    { field: 'ID', headerName: 'ID', hide: true },
    { field: 'Name', headerName: 'Name', hide: true },

    {
      field: 'City',
      headerName: 'City',
      rowGroup: true,
      filter: true,
      hide: true,
    },
    {
      field: 'Stakeholder',
      headerName: 'Stakeholder',
      rowGroup: true,
      filter: true,
      hide: true,
    },

    {
      headerName: 'Total Score',
      field: 'avg_score',
      sortingOrder: ['asc', 'desc'],
      colId: 'avg_score',
      sortable: false, // Disable sorting for this column
      width: 150,
      valueGetter: (params) => {
        const efficiency = Number(params.getValue('Efficiency')) || 0;
        const smartness = Number(params.getValue('Smartness')) || 0;
        const greenness = Number(params.getValue('Greenness')) || 0;
        const resilience = Number(params.getValue('Resilience')) || 0;

        const weightedAverage = efficiency + smartness + greenness + resilience;

        // Debugging purposes
        // console.log('Efficiency:', efficiency);
        // console.log('Smartness:', smartness);
        // console.log('Greenness:', greenness);
        // console.log('Resilience:', resilience);
        // console.log('efficiencySum:', efficiencySum);
        // console.log(params);

        // For the latest spreadsheet
        if (this.calculateEfficiencyOnly) {
          // return efficiency;
          const efficiencyAvg = Number(params.getValue('AvgEfficiency')) || 0;
          return efficiencyAvg;
        } else if (this.calculateSmartnessOnly) {
          const smartnessAvg = Number(params.getValue('AvgSmartness')) || 0;
          return smartnessAvg;
        } else if (this.calculateGreennessOnly) {
          const greennessAvg = Number(params.getValue('AvgGreenness')) || 0;
          return greennessAvg;
        } else if (this.calculateResilienceOnly) {
          const resilienceAvg = Number(params.getValue('AvgResilience')) || 0;
          return resilienceAvg;
        } else {
          return weightedAverage;
        }
      },
      valueFormatter: (params) => params.value.toFixed(2),
      sort: 'desc',
      // cellStyle: { 'text-align': 'center' },
    },
    {
      headerName: 'Chart',
      field: 'sparkline',
      colId: 'score',
      width: 60,
      sortable: false, // Disable sorting for this column
      cellRenderer: 'agSparklineCellRenderer',
      cellRendererParams: {
        sparklineOptions: {
          type: 'column',
          // fill: 'lightgrey',
          label: {
            enabled: true,
            placement: 'insideBase',
            color: '#000000',
            fontWeight: 'bold',
            fontSize: 11,
            fontFamily: 'Arial, Helvetica, sans-serif',
            formatter: this.labelFormatter,
          },
          formatter: this.columnFormatter,
          highlightStyle: {
            fill: 'black',
            placement: 'center',
          },
          tooltip: {
            enabled: false,
          },
          paddingInner: 0.2,
          paddingOuter: 0.1,
        } as ColumnSparklineOptions,
      },
      valueGetter: (params) => {
        // console.log(params); // Debug purposes

        // const filterModel = params.api.getFilterModel();
        // const stakeholderFilter = filterModel['Stakeholder']?.values?.[0];

        // console.log('Stakeholder filter:', stakeholderFilter);

        const values: any = [
          ['Efficiency', params.getValue('Efficiency').value],
          ['Smartness', params.getValue('Smartness').value],
          ['Greenness', params.getValue('Greenness').value],
          ['Resilience', params.getValue('Resilience').value],
        ];
        return values;
      },
    },
    {
      field: 'Efficiency',
      headerName: 'Efficiency',
      aggFunc: 'avg',
      hide: true,
    },
    { field: 'Smartness', headerName: 'Smartness', aggFunc: 'avg', hide: true },
    { field: 'Greenness', headerName: 'Greenness', aggFunc: 'avg', hide: true },
    {
      field: 'Resilience',
      headerName: 'Resilience',
      aggFunc: 'avg',
      hide: true,
    },
    // { field: 'Efficiency', colId: 'SumEfficiency', aggFunc: 'sum', hide: true },
    // { field: 'Smartness', colId: 'SumSmartness', aggFunc: 'sum', hide: true },
    // { field: 'Greenness', colId: 'SumGreenness', aggFunc: 'sum', hide: true },
    // { field: 'Resilience', colId: 'SumResilience', aggFunc: 'sum', hide: true },
    { field: 'Efficiency', colId: 'AvgEfficiency', aggFunc: 'avg', hide: true },
    { field: 'Smartness', colId: 'AvgSmartness', aggFunc: 'avg', hide: true },
    { field: 'Greenness', colId: 'AvgGreenness', aggFunc: 'avg', hide: true },
    { field: 'Resilience', colId: 'AvgResilience', aggFunc: 'avg', hide: true },
  ];

  rowData: any[] = [];
  gridApi: any;
  gridColumnApi: any;
  rowHeight = 100;
  headerHeight = 100;

  defaultColDef = {
    sortable: true,
    // filter: true
    // cellStyle: {
    //   'white-space': 'normal',
    //   'line-height': '100px',
    //   'text-align': 'left',
    //   'font-size': '32px',
    // },
    cellStyle: this.getCellStyle,
  };

  getCellStyle(params: any) {
    if (window.innerWidth <= 1200) {
      return {
        'white-space': 'normal',
        'line-height': '75px',
        'text-align': 'left',
        'font-size': '24px',
      };
    } else {
      return {
        'white-space': 'normal',
        'line-height': '100px',
        'text-align': 'left',
        'font-size': '32px',
      };
    }
  }

  // After the grid has been initialized...
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.moveColumns(['Rank'], 0);
    // Auto-size all columns
    this.gridApi.sizeColumnsToFit();
  }

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      window.addEventListener('resize', this.onWindowResize.bind(this));
    });
    this.updateDimensions();
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onWindowResize.bind(this));
  }

  onWindowResize() {
    this.zone.run(() => {
      this.updateDimensions();
      if (this.gridApi) {
        this.gridApi.resetRowHeights();
        this.gridApi.refreshCells({ force: true });
      }
    });
  }

  updateDimensions() {
    if (window.innerWidth <= 1200) {
      this.rowHeight = 75;
      this.headerHeight = 75;
    } else {
      this.rowHeight = 100;
      this.headerHeight = 100;
    }
  }

  openModal(id: string) {
    // Debugging purposes
    // console.log('id is ', id);

    switch (id) {
      case 'resilienceModal':
        this.modalTitle = 'Resilience Ranking';
        this.modalOpened.emit();
        // console.log('event emitting is working!')
        break;
      case 'efficiencyModal':
        this.modalTitle = 'Efficiency Ranking';
        this.modalOpened.emit();
        // console.log('event emitting is working!')
        break;
      case 'smartnessModal':
        this.modalTitle = 'Smartness Ranking';
        this.modalOpened.emit();
        // console.log('event emitting is working!')
        break;
      case 'greennessModal':
        this.modalTitle = 'Greenness Ranking';
        this.modalOpened.emit();
        // console.log('event emitting is working!')
        break;
      // add more cases as needed
    }
    // code to open the modal
  }

  clearIndicators() {
    this.fetchCSV();
    this.calculateEfficiencyOnly = false;
    this.calculateSmartnessOnly = false;
    this.calculateGreennessOnly = false;
    this.calculateResilienceOnly = false;
    this.selectedIndicator = 'Indicators';
    this.gridApi.refreshCells();
    this.gridApi.setColumnsVisible(['score'], true); // Unhide the score column
    this.gridApi.setColumnsVisible(['avg_score'], true);
    this.gridApi.applyColumnState({
      state: [{ colId: 'avg_score', sort: 'desc' }],
      // defaultState: { sort: null },
    });
    this.gridApi.onSortChanged();
    this.gridApi.refreshCells();
    this.gridApi.sizeColumnsToFit();
  }

  setEfficiency() {
    this.calculateEfficiencyOnly = true;
    this.calculateSmartnessOnly = false;
    this.calculateGreennessOnly = false;
    this.calculateResilienceOnly = false;
    this.selectedIndicator = 'Indicators: Efficiency';
    this.gridApi.setColumnsVisible(['score'], false); // Hide the score column
    // this.gridApi.setColumnsVisible(['avg_score'], false);
    // this.gridApi.setColumnsVisible(['Country'], true);
    this.gridApi.applyColumnState({
      state: [{ colId: 'avg_score', sort: 'desc' }],
      // defaultState: { sort: null },
    });
    this.gridApi.onSortChanged();
    this.gridApi.refreshCells();
    this.gridApi.sizeColumnsToFit();
  }

  setSmartness() {
    this.calculateEfficiencyOnly = false;
    this.calculateSmartnessOnly = true;
    this.calculateGreennessOnly = false;
    this.calculateResilienceOnly = false;
    this.selectedIndicator = 'Indicators: Smartness';
    this.gridApi.setColumnsVisible(['score'], false); // Hide the score column
    // this.gridApi.setColumnsVisible(['avg_score'], false);
    this.gridApi.applyColumnState({
      state: [{ colId: 'avg_score', sort: 'desc' }],
      // defaultState: { sort: null },
    });
    this.gridApi.setColumnsVisible(['Country'], true);
    this.gridApi.onSortChanged();
    this.gridApi.refreshCells();
    this.gridApi.sizeColumnsToFit();
  }

  setGreenness() {
    this.calculateEfficiencyOnly = false;
    this.calculateSmartnessOnly = false;
    this.calculateGreennessOnly = true;
    this.calculateResilienceOnly = false;
    this.selectedIndicator = 'Indicators: Greenness';
    this.gridApi.setColumnsVisible(['score'], false); // Hide the score column
    // this.gridApi.setColumnsVisible(['avg_score'], false);
    this.gridApi.applyColumnState({
      state: [{ colId: 'avg_score', sort: 'desc' }],
      defaultState: { sort: null },
    });
    this.gridApi.onSortChanged();
    this.gridApi.refreshCells();
    this.gridApi.sizeColumnsToFit();
  }

  setResilience() {
    this.calculateEfficiencyOnly = false;
    this.calculateSmartnessOnly = false;
    this.calculateGreennessOnly = false;
    this.calculateResilienceOnly = true;
    this.selectedIndicator = 'Indicators: Resilience';
    this.gridApi.setColumnsVisible(['score'], false); // Hide the score column
    this.gridApi.setColumnsVisible(['avg_score'], true);
    this.gridApi.applyColumnState({
      state: [{ colId: 'avg_score', sort: 'desc' }],
      defaultState: { sort: null },
    });
    this.gridApi.onSortChanged();
    this.gridApi.refreshCells();
    this.gridApi.sizeColumnsToFit();
  }

  setShipliner() {
    this.selectedStakeholder = 'Stakeholders: Shipliner';
    this.gridApi.setColumnsVisible(['score'], true); // Unhide the score column
    this.gridApi.setColumnsVisible(['avg_score'], true);
    this.gridApi.setFilterModel({
      Stakeholder: { type: 'set', values: ['Shipliner'] },
    });
    this.gridApi.onFilterChanged();
    setTimeout(() => {
      this.gridApi.refreshCells();
    }, 0);
    this.gridApi.onSortChanged();
    this.gridApi.refreshCells();
    this.gridApi.sizeColumnsToFit();
  }

  setSMC() {
    // this.clearIndicators();
    this.selectedStakeholder = 'Stakeholders: Ship Management Companies';
    if (this.gridApi) {
      // console.log('Setting columns visible');
      this.gridApi.setColumnsVisible(['score'], true); // Unhide the score column
      this.gridApi.setColumnsVisible(['avg_score'], true);
      // console.log('Columns visibility set');
      this.gridApi.onSortChanged();
      this.gridApi.refreshCells();
      this.gridApi.setFilterModel({
        Stakeholder: { type: 'set', values: ['Ship Management Companies'] },
      });
      this.gridApi.onFilterChanged();
      setTimeout(() => {
        this.gridApi.refreshCells();
      }, 0.01);
    } else {
      console.error('Grid API is not initialized.');
    }
  }

  setRegulator() {
    // this.clearIndicators();
    this.selectedStakeholder = 'Stakeholders: Regulators';
    this.gridApi.setColumnsVisible(['score'], true); // Unhide the score column
    this.gridApi.setColumnsVisible(['avg_score'], true);
    this.gridApi.setFilterModel({
      Stakeholder: { type: 'set', values: ['Regulator'] },
    });
    this.gridApi.onFilterChanged();
    setTimeout(() => {
      this.gridApi.refreshCells();
    }, 0);
  }

  setLogisticsPartners() {
    // this.clearIndicators();
    this.selectedStakeholder = 'Stakeholders: Logistics Partners';
    this.gridApi.setColumnsVisible(['score'], true); // Unhide the score column
    this.gridApi.setColumnsVisible(['avg_score'], true);
    this.gridApi.setFilterModel({
      Stakeholder: { type: 'set', values: ['Logistics Partners'] },
    });
    this.gridApi.onFilterChanged();
    setTimeout(() => {
      this.gridApi.refreshCells();
    }, 0);
  }

  setPortOperations() {
    // this.clearIndicators();
    this.selectedStakeholder = 'Stakeholders: Port Operators';
    this.gridApi.setColumnsVisible(['score'], true); // Unhide the score column
    this.gridApi.setColumnsVisible(['avg_score'], true);
    this.gridApi.setFilterModel({
      Stakeholder: { type: 'set', values: ['Port Operators'] },
    });
    this.gridApi.onFilterChanged();
    setTimeout(() => {
      this.gridApi.refreshCells();
    }, 0);
  }

  setShippers() {
    // this.clearIndicators();
    this.selectedStakeholder = 'Stakeholders: Shippers';
    this.gridApi.setColumnsVisible(['score'], true); // Unhide the score column
    this.gridApi.setColumnsVisible(['avg_score'], true);
    this.gridApi.setFilterModel({
      Stakeholder: { type: 'set', values: ['Shippers'] },
    });
    this.gridApi.onFilterChanged();
    setTimeout(() => {
      this.gridApi.refreshCells();
    }, 0);
  }

  clearStakeholders() {
    // this.clearIndicators();
    this.gridApi.refreshCells();
    this.selectedStakeholder = 'Stakeholders';
    this.gridApi.setColumnsVisible(['score'], true); // Unhide the score column
    this.gridApi.setColumnsVisible(['avg_score'], true);
    this.gridApi.setFilterModel({ Stakeholder: null });
    this.gridApi.onFilterChanged();
    setTimeout(() => {
      this.gridApi.refreshCells();
    }, 0);
  }

  fetchCSV() {
    if (this.csvBlob) {
      this.readCSVFromBlob();
    } else {
      console.log('Fetching CSV from assets folder...');
      this.http.get('assets/database.csv', { responseType: 'text' }).subscribe(
        (data) => {
          this.processCSV(data);
        },
        (err) => console.error(err)
      );
    }
  }

  processCSV(csvData: string) {
    let parsedData = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    }).data as DataRow[];

    // Convert 'Efficiency', 'Smartness', 'Greenness', and 'Resilience' values to numbers
    parsedData = parsedData.map((row: DataRow) => ({
      ...row,
      Efficiency: Number(row['Efficiency']),
      Smartness: Number(row['Smartness']),
      Greenness: Number(row['Greenness']),
      Resilience: Number(row['Resilience']),
    }));

    this.rowData = parsedData;

    // Log the result
    // console.log('Parsed data:', parsedData);
    // console.log('Row data:', this.rowData);
    // console.log('Column definitions:', this.columnDefs);
  }

  readCSVFromBlob() {
    if (this.csvBlob) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const csvData = e.target.result;
        this.processCSV(csvData);
      };
      reader.readAsText(this.csvBlob);
    } else {
      console.log('No CSV Blob available to read.');
    }
  }
}
