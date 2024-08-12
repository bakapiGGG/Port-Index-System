import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Papa from 'papaparse';

interface DataRow {
  [key: string]: any;
}

@Component({
  selector: 'app-excel-database',
  templateUrl: './excel-database.component.html',
  styleUrl: './excel-database.component.css'
})
export class ExcelDatabaseComponent {
  // Existing properties and methods

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const csvData = e.target.result;
        // this.processCSV(csvData);
      };

      reader.readAsText(file);
    }
  }

  // processCSV(csvData: string) {
  //   let parsedData = Papa.parse(csvData, {
  //     header: true,
  //     skipEmptyLines: true,
  //   }).data as DataRow[];

  //   // Convert 'Efficiency', 'Smartness', 'Greenness', and 'Resilience' values to numbers
  //   parsedData = parsedData.map((row: DataRow) => ({
  //     ...row,
  //     Efficiency: Number(row['Efficiency']),
  //     Smartness: Number(row['Smartness']),
  //     Greenness: Number(row['Greenness']),
  //     Resilience: Number(row['Resilience']),
  //   }));

  //   this.rowData = parsedData;

  //   // Log the result
  //   console.log('Parsed data:', parsedData);
  //   console.log('Row data:', this.rowData);
  //   console.log('Column definitions:', this.columnDefs);

  //   // Trigger fetchCSV to update the dashboard
  //   this.fetchCSV();
  // }

  fetchCSV() {
    this.http.get('assets/data_final.csv', { responseType: 'text' }).subscribe(
      (data) => {
        let parsedData = Papa.parse(data, {
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

        // this.rowData = parsedData;

        // // Log the result
        // console.log('Parsed data:', parsedData);
        // console.log('Row data:', this.rowData);
        // console.log('Column definitions:', this.columnDefs);
      },
      (err) => console.error(err)
    );
  }

}
