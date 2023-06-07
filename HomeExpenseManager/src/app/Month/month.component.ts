import { Component, Input, OnInit } from '@angular/core';
import { Month } from '../models/models';
import { TableDatasourceService } from '../services/table-datasource.service';

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.css'],
})
export class MonthComponent implements OnInit {
  @Input() month: Month;

  constructor(private datasource: TableDatasourceService) {
    this.month = {
      monthYear: '',
      monthNumber: '',
      tables: [],
      calculations: [],
      isSaved: false,
    };
  }

  ngOnInit(): void {
    // Subscribed to get the value of Previous Savings of this month, 
    // whenever value of Current Savings of Previous Month is Updated, it will send into this.
    // Once got, this will update Previous Savings value
    this.datasource.previousSavingsObservable.subscribe((res) => {
      if (
        this.month.monthYear === res.monthYear &&
        this.month.monthNumber === res.monthNumber
      ) {
        this.setCalculation('previous-savings', res.sum);
      }
    });

    // Subscribed to get the request from next month, whenever it is initialized
    // Once got, this will send the Current Savings data
    // into Previous Savings Observable so that next month can catch it
    this.datasource.currentSavingsRequestObservable.subscribe((res) => {
      if (
        this.month.monthYear === res.monthYear &&
        this.month.monthNumber === res.monthNumber
      ) {
        this.currentSavingsUpdated();
      }
    });

    // This Month will send the request, to get the Current Savings value of Previous Month
    let pd = this.getPreviousDate(this.month.monthYear, this.month.monthNumber);
    this.datasource.currentSavingsRequestObservable.next({
      monthYear: pd.monthYear,
      monthNumber: pd.monthNumber,
    });
  }

  sumUpdated(tableName: string, sum: number) {
    if (tableName === 'earnings') {
      this.setCalculation('current-earnings', sum.toString());
    } else {
      this.setCalculation('current-expenditure', sum.toString());
    }
  }

  // -------------------------------CALCULATIONS

  setCalculation(name: string, sum: string) {
    this.month.calculations.forEach((value, index) => {
      if (value.name === name) {
        value.value = sum;
      }
    });
    this.setCurrentSavings();
  }

  getCalculation(name: string): number {
    let sum = '0';
    this.month.calculations.forEach((value, index) => {
      if (value.name === name) {
        sum = value.value;
      }
    });
    return parseInt(sum);
  }

  setCurrentSavings() {
    let ps = this.getCalculation('previous-savings');
    let ce = this.getCalculation('current-earnings');
    let cx = this.getCalculation('current-expenditure');

    let cs = ps + ce - cx;

    this.month.calculations.forEach((value, index) => {
      if (value.name === 'current-savings') {
        value.value = cs.toString();
      }
    });
    this.currentSavingsUpdated();
  }

  // This will send the value of Current Savings into Previous Savings Observable
  // so that next month can take it as its Previous Savings.
  currentSavingsUpdated() {
    let nd = this.getNextDate(this.month.monthYear, this.month.monthNumber);
    this.datasource.previousSavingsObservable.next({
      monthYear: nd.monthYear,
      monthNumber: nd.monthNumber,
      sum: this.getCalculation('current-savings').toString(),
    });
  }

  // ----------------------------------

  getPreviousDate(
    monthYear: string,
    monthNumber: string
  ): { monthYear: string; monthNumber: string } {
    let temp = parseInt(monthNumber);
    let pm = temp == 1 ? '12' : (temp - 1).toString();

    let py = pm === '12' ? (parseInt(monthYear) - 1).toString() : monthYear;
    return { monthYear: py, monthNumber: pm };
  }

  getNextDate(
    monthYear: string,
    monthNumber: string
  ): { monthYear: string; monthNumber: string } {
    let temp = parseInt(monthNumber);
    let nm = temp == 12 ? '1' : (temp + 1).toString();

    let ny = nm === '1' ? (parseInt(monthYear) + 1).toString() : monthYear;
    return { monthYear: ny, monthNumber: nm };
  }
}
