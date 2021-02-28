import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {IProduct} from '../../shared/models/product.model'


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  API_URL: string = "http://localhost:5000";
  private productUri = '/api/products';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.API_URL + this.productUri)
  }

  postProduct(product) {
    return this.http.post<any>(this.API_URL + this.productUri, product, {  
        reportProgress: true,
        observe: 'events'  
      });
  }

  putProduct(product: IProduct) {
    var url = this.API_URL + this.productUri + '/' + product.productId;
    return this.http.put(url, product, {
        reportProgress: true,
        observe: 'events'
      });
  }

  deleteProduct(product) {
    return this.http.delete<any>(this.API_URL + this.productUri + '/' + product.productId, {  
        reportProgress: true,
        observe: 'events'  
      });
  }

  retrieveProductReport(productFilter) {
    const headers = new HttpHeaders();
    return this.http.post<any>(this.API_URL + this.productUri + '/reports', 
    productFilter,
    {headers,  responseType: 'blob' as 'json'}).subscribe(
      (response: any) =>{
          let dataType = "text/html";
          let binaryData = [];
          binaryData.push(response);
          let downloadLink = document.createElement('a');
          downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
          downloadLink.setAttribute('download', "product-report.html");
          document.body.appendChild(downloadLink);
          downloadLink.click();
      });
  }
}
