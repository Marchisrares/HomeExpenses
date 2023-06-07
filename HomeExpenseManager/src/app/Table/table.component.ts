import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Table, TableRow } from '../models/models';
import { TableDatasourceService } from '../services/table-datasource.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  @Input() table: Table;
  @Input() monthNummber: string;
  @Input() monthYear: string;
  @Output() sumUpdated = new EventEmitter<number>();

  addRowForm: FormGroup;

  constructor(public datasource: TableDatasourceService) {
    this.table = {
      tableName: '',
      columns: [],
      rows: [],
      isSaved: false,
    };
    this.addRowForm = new FormGroup({});
    this.monthNummber = '';
    this.monthYear = '';
  }

  ngOnInit(): void {
    // Getting all the Rows of this table when this table is Initialized.
    this.datasource
      .getTableRows(this.monthYear, this.monthNummber, this.table.tableName)
      .subscribe((res) => {
        this.table.rows = [];
        for (let row of res) {
          this.addRowToArray(row.id, row.date, row.name, row.amount, true);
        }
      });

    this.addRowForm = new FormGroup({
      date: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]*'),
        daysInMonthValidator(this.monthYear, this.monthNummber),
      ]),
      name: new FormControl('', [Validators.required]),
      amount: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]*'),
      ]),
    });
  }

  addNewRow() {
    let date = this.dateControl.value;
    let name = this.nameControl.value;
    let amount = this.amountControl.value;

    let monthDataForBackEnd = {
      monthYear: this.monthYear,
      monthNumber: this.monthNummber,
      tableName: this.table.tableName,
      date: date,
      name: name,
      amount: amount,
    };

    this.datasource.postTableRow(monthDataForBackEnd).subscribe((res) => {
      this.addRowToArray(parseInt(res), date, name, amount, true);
    });
  }

  addRowToArray(
    id: number,
    date: string,
    name: string,
    amount: string,
    isSaved: boolean
  ) {
    let row: TableRow = {
      id: id,
      date: date,
      name: name,
      amount: amount,
      isSaved: isSaved,
    };
    this.table.rows.push(row);
    this.updateTheSum();
    this.clearForm();
  }

  editRow(rowId: number | undefined) {
    if (
      this.dateControl.value === '' &&
      this.nameControl.value === '' &&
      this.amountControl.value === ''
    ) {
      this.table.rows.forEach((row, index) => {
        if (rowId && row.id === rowId) {
          this.dateControl.setValue(row.date);
          this.nameControl.setValue(row.name);
          this.amountControl.setValue(row.amount);
          this.deleteRow(row.id);
        }
      });
    } else {
      alert('First Add pending Row Data');
    }
  }

  deleteRow(id: number | undefined) {
    this.table.rows.forEach((row, index) => {
      if (id && row.id === id) {
        this.datasource.deleteTableRow(row.id).subscribe((res) => {
          this.table.rows.splice(index, 1);
        });
      }
    });
  }

  clearForm() {
    this.dateControl.setValue('');
    this.nameControl.setValue('');
    this.amountControl.setValue('');
  }

  updateTheSum() {
    let sum = 0;
    this.table.rows.forEach((row, index) => {
      sum += parseInt(row.amount);
    });
    this.sumUpdated.emit(sum);
  }

  // GETTERS TO ACCESS FORM ELEMENTS AND FORM ITSELF------------
  public get dateControl(): FormControl {
    return this.addRowForm.controls['date'] as FormControl;
  }

  public get nameControl(): FormControl {
    return this.addRowForm.controls['name'] as FormControl;
  }

  public get amountControl(): FormControl {
    return this.addRowForm.controls['amount'] as FormControl;
  }

  public get RowForm() {
    return this.addRowForm as FormGroup;
  }
  // ------------------------------------------------------------
}

// Validator Function to Check Number of Days in given month

function daysInMonthValidator(
  monthYear: string,
  monthNumber: string
): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (
      parseInt(control.value) < 1 ||
      parseInt(control.value) > getDaysInMonth(monthYear, monthNumber)
    ) {
      return { daysInvalid: true };
    }
    return null;
  };
}

function getDaysInMonth(monthYear: string, monthNumber: string): number {
  return new Date(parseInt(monthYear), parseInt(monthNumber), 0).getDate();
}
