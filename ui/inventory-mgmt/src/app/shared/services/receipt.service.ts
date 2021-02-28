import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { IReceipt } from '../models/receipt.model';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {
  
  API_URL: string = "http://localhost:5000";
  
  private receiptsUri = '/api/receipts';
  constructor(private http: HttpClient) { }

 
  getReceipts(): Observable<IReceipt[]> {
    var url = this.API_URL + this.receiptsUri;
    return this.http.get<IReceipt[]>(url)
  }

  generateUrl(name): string {
    return this.API_URL + this.receiptsUri + '/' + name;
  }

  upload(data) {
    var url = this.API_URL + this.receiptsUri;
    return this.http.post<any>(url, data, {  
        reportProgress: true,
        observe: 'events'  
      });
  }

}
