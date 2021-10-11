export interface ActualMonth {
  total: string;
}

export interface PastMonth {
  total: string;
}

export interface DataReponseMonths {
  actualMonth: ActualMonth;
  pastMonth: PastMonth;
}

export interface TotalsByActualAndPastMonth {
  data: DataReponseMonths;
}

export interface ValuesByYear {
  total: string;
  month: number;
  count: string;
}

export interface DataReponseYears {
  actualYear: ValuesByYear[];
  pastYear: ValuesByYear[];
}

export interface TotalsByYears {
  data: DataReponseYears;
}

export interface DataResponseCounters {
  complete: string;
  inventoried: string;
  processing: string;
  returning: string;
}

export interface CountersByState {
  data: DataResponseCounters;
}

export interface TotalsByMonth {
  data: ValuesByYear[];
}