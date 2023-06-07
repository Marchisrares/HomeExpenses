import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MonthNavigation } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class TableDatasourceService {
  monthNavigationObservable = new Subject<MonthNavigation[]>();
  monthNavigationSelectedObservable = new Subject<MonthNavigation>();

  previousSavingsObservable = new Subject<{
    monthYear: string;
    monthNumber: string;
    sum: string;
  }>();
  currentSavingsRequestObservable = new Subject<{
    monthYear: string;
    monthNumber: string;
  }>();
  
  constructor(private http: HttpClient) {}

  // --------------------- BACK END REQUESTS
  getMonthList() {
    return this.http.get<any>(
      'https://localhost:44371/api/MonthsData/GetListOfMonths'
    );
  }

  getTableRows(monthYear: string, monthNumber: string, tableName: string) {
    let parameters = new HttpParams();
    parameters = parameters.append('monthYear', monthYear);
    parameters = parameters.append('monthNumber', monthNumber);
    parameters = parameters.append('tableName', tableName);
    return this.http.get<any>(
      'https://localhost:44371/api/MonthsData/GetTableData',
      {
        params: parameters,
      }
    );
  }

  postTableRow(monthDataForBackEnd: any) {
    return this.http.post(
      'https://localhost:44371/api/MonthsData/InsertTableRow',
      monthDataForBackEnd,
      { responseType: 'text' }
    );
  }

  deleteTableRow(rowId: number) {
    return this.http.delete(
      'https://localhost:44371/api/MonthsData/DeleteTableRow/' + rowId,
      {
        responseType: 'text',
      }
    );
  }
}
