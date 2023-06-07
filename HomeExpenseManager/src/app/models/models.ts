export class TableRow {
  id?: number;
  date: string = '';
  name: string = '';
  amount: string = '';
  isSaved: boolean = false;
}

export class Table {
  tableName: string = '';
  columns: string[] = [];
  rows: TableRow[] = [];
  isSaved: boolean = false;
}

export class MonthCalculation {
  name: string = '';
  value: string = '';
  isSaved: boolean = false;
}

export class Month {
  monthNumber: string = '';
  monthYear: string = '';
  tables: Table[] = [];
  calculations: MonthCalculation[] = [];
  isSaved: boolean = false;
}

export class MonthNavigation {
  monthNumber: string = '';
  monthYear: string = '';
}
