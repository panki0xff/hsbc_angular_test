import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, timer } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface SEC_DATA {
  account_executive: number;
  daily_turnover: number;
  accumulated_turnover: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription;
  fiveSecondTimer: Observable<number> = timer(0, 5000);
  title = 'hsbc-angular-test';
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  sort = '';
  sortDirection = 'ASC';
  secData: SEC_DATA[] = [];

  constructor(private http: HttpClient) {
    this.http = http;
    this.firstLodd();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  ngOnInit(): void {
    this.subscription = this.fiveSecondTimer.subscribe(() => {
      this.refreshData();
    })
  }

  firstLodd() {
    console.debug("firstload");
    this.http.get<SEC_DATA[]>("http://rtq.chicheongweng.com:3000/securities").subscribe(r => {
      this.collectionSize = r.length;
    })
  }

  onSort(event: any) {
    console.debug(event)
  }
  clickSort(name: string) {
    console.debug(name)
    if (name != this.sort) {
      this.sort = name;
      this.sortDirection = 'ASC';
    } else {
      if (this.sortDirection == 'DESC') {
        this.sortDirection = 'ASC'
      } else {
        this.sortDirection = 'DESC'
      }
    }
    this.refreshData()
  }

  refreshData() {
    let url = "http://rtq.chicheongweng.com:3000/securities?";
    url = url + "_start=" + ((this.page - 1) * this.pageSize);
    url = url + "&_limit=" + (this.pageSize);
    if (this.sort != '') {
      url = url + "&_sort=" + this.sort + "&_order=" + this.sortDirection + ""
    }
    console.debug("refresh " + url);
    this.http.get<SEC_DATA[]>(url).subscribe(r => {
      this.secData = r;
      console.debug(r);
    })
  }
}
