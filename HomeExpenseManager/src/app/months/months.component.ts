import { Component, OnInit } from '@angular/core';
import { Month, MonthCalculation, MonthNavigation, Table } from '../models/models';
import { MonthToNumberPipe } from '../Pipes/month-to-number.pipe';
import { TableDatasourceService } from '../services/table-datasource.service';

@Component({
  selector: 'app-months',
  templateUrl: './months.component.html',
  styleUrls: ['./months.component.css'],
})
export class MonthsComponent implements OnInit {
  months: Month[] = [];
  monthsToDisplay: Month[] = [];
  monthsNavigationList: MonthNavigation[] = [];

  constructor(public datasource: TableDatasourceService) {}

  ngOnInit(): void {
    this.datasource.getMonthList().subscribe((res) => {
      for (let item of res) {
        this.addMonthByNumber(item.monthYear, item.monthNumber);
      }
      console.log(this.monthsNavigationList);
      this.monthsToDisplay = this.months;
    });

    // Will Execute whenever a Navigation is selected from Side-Nav
    this.datasource.monthNavigationSelectedObservable.subscribe((res) => {
      this.monthsToDisplay = this.filterMonths(res.monthYear, res.monthNumber);
    });
  }

  addNextMonth() {
    let nextYear: string = '';
    let nextMonth: string = '';

    if (this.months[0].monthNumber === '12') {
      nextMonth = '1';
      nextYear = (parseInt(this.months[0].monthYear) + 1).toString();
    } else {
      nextMonth = (parseInt(this.months[0].monthNumber) + 1).toString();
      nextYear = this.months[0].monthYear;
    }

    return this.addMonthByNumber(nextYear, nextMonth);
  }

  addMonthByName(monthYear: string, monthName: string) {
    let monthNumber = new MonthToNumberPipe().transform(monthName);
    return this.addMonthByNumber(monthYear, monthNumber);
  }

  addMonthByNumber(monthYear: string, monthNumber: string) {
    if (monthNumber != '0') {
      let earningsTable: Table = {
        tableName: 'earnings',
        columns: ['date', 'name', 'amount'],
        rows: [],
        isSaved: false,
      };

      let expTable: Table = {
        tableName: 'expenditure',
        columns: ['date', 'name', 'amount'],
        rows: [],
        isSaved: false,
      };
      let calcs: MonthCalculation[] = [
        {
          name: 'current-savings',
          value: '0',
          isSaved: false,
        },
        {
          name: 'current-expenditure',
          value: '0',
          isSaved: false,
        },
        {
          name: 'current-earnings',
          value: '0',
          isSaved: false,
        },
        {
          name: 'previous-savings',
          value: '0',
          isSaved: false,
        },
      ];
      let month: Month = {
        monthNumber: monthNumber,
        monthYear: monthYear,
        tables: [earningsTable, expTable],
        calculations: calcs,
        isSaved: false,
      };
      this.months.unshift(month);
      this.addMonthNavigation(monthYear, monthNumber);
      return true;
    }
    return false;
  }

  deleteMonth(monthYear: string, monthName: string) {
    let monthNumber = new MonthToNumberPipe().transform(monthName);
    let response = confirm('Are you sure?');
    if (response) {
      this.months.forEach((month, index) => {
        if (
          month.monthNumber === monthNumber &&
          month.monthYear === monthYear
        ) {
          this.months.splice(index, 1);
          this.removeMonthNavigation(monthYear, monthNumber);
        }
      });
    }
  }

  addMonthNavigation(monthYear: string, monthNumber: string) {
    if (this.monthsNavigationList.length === 0) {
      let firstMonthNavigation: MonthNavigation = {
        monthNumber: 'all',
        monthYear: 'all',
      };
      this.monthsNavigationList.unshift(firstMonthNavigation);
    }

    let monthNavigation: MonthNavigation = {
      monthNumber: monthNumber,
      monthYear: monthYear,
    };
    this.monthsNavigationList.splice(1, 0, monthNavigation);
    this.datasource.monthNavigationObservable.next(this.monthsNavigationList);
  }

  removeMonthNavigation(monthYear: string, monthNumber: string) {
    this.monthsNavigationList.forEach((value, index) => {
      if (value.monthNumber === monthNumber && value.monthYear === monthYear) {
        this.monthsNavigationList.splice(index, 1);
      }
    });
    this.datasource.monthNavigationObservable.next(this.monthsNavigationList);
  }

  filterMonths(monthYear: string, monthNumber: string): Month[] {
    let filteredData: Month[] = [];

    if (monthYear === 'all') {
      if (monthNumber === 'all') {
        filteredData = this.months;
      } else {
        // Future
      }
    } else {
      if (monthNumber === 'all') {
        // Future
      } else {
        for (let month of this.months) {
          if (
            month.monthYear === monthYear &&
            month.monthNumber === monthNumber
          ) {
            filteredData.push(month);
          }
        }
      }
    }

    return filteredData;
  }
}
