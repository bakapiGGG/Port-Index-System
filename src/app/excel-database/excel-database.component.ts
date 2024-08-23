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

  rowData: any[] = [];
  csvBlob: Blob | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const csvData = e.target.result;
        this.processCSV(csvData);
        this.storeCSVInBlob(csvData);
        this.fetchCSV();
        // console.log(csvData); 
      };

      reader.readAsText(file);
    }
  }

  fetchCSV() {
    if (this.csvBlob) {
      console.log('Fetching CSV from Blob...');
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
    console.log('Parsed data:', parsedData);
    console.log('Row data:', this.rowData);
  }

  storeCSVInBlob(csvData: string) {
    this.csvBlob = new Blob([csvData], { type: 'text/csv' });
    console.log('CSV data stored in Blob:', this.csvBlob);
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
