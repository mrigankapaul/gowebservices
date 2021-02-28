import { Component, OnInit } from '@angular/core';
import {FormGroup, Validators, FormBuilder, AbstractControl} from '@angular/forms';
import { Observable } from 'rxjs';
import {Router, ActivatedRoute} from '@angular/router';
import { IProduct } from 'src/app/shared/models/product.model';
import {Location} from '@angular/common'; 
import {MatSnackBar} from '@angular/material/snack-bar';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  pageTitle: string;
  isNew: boolean;
  productFg: FormGroup;
  productName: AbstractControl;
  manufacturer: AbstractControl;
  sku: AbstractControl;
  upc: AbstractControl;
  pricePerUnit: AbstractControl;
  quantityOnHand: AbstractControl;
  errorMessage: any;
  error = false;

  state$: Observable<object>;
  currentProduct: IProduct;

  constructor(public activatedRoute: ActivatedRoute, private productsService: ProductService, private router: Router, private fb: FormBuilder, private location: Location, public snackBar: MatSnackBar) {

    this.productFg = this.fb.group({
      productName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(40)])],
      manufacturer: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      sku: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(12)])],
      upc: ['', Validators.compose([Validators.required, Validators.minLength(12)])],
      pricePerUnit: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      quantityOnHand: ['', Validators.compose([Validators.required, Validators.minLength(1), Validators.min(1)])],
      
    });
    this.productName = this.productFg.controls['productName'];
    this.sku = this.productFg.controls['sku'];
    this.upc = this.productFg.controls['upc'];
    this.pricePerUnit = this.productFg.controls['pricePerUnit'];
    this.quantityOnHand = this.productFg.controls['quantityOnHand'];
    this.manufacturer = this.productFg.controls['manufacturer'];
  }

  ngOnInit(): void {
    this.currentProduct = window.history.state.product;
    if(!this.currentProduct){
      this.isNew = true;
      this.location.replaceState("/products/new");
      this.pageTitle = "Add New Product";
    }else{
      this.isNew = false;
      this.pageTitle = "Update Product";
      this.initializeForm();
    }
  }

  cancel(): void {
    this.returnToProductList();  
  }

  delete(): void{
    
    this.productsService.deleteProduct(this.currentProduct).subscribe({
      complete: () => this.openSnackBar('success', null),
      error: err => this.errorMessage = err
    });
    this.returnToProductList();  
  }

  returnToProductList(): void{
    this.router.navigate(['/products']);
  }

  initializeForm(): void {
    this.productName.setValue(this.currentProduct.productName);
    this.productName.disable();
    this.manufacturer.setValue(this.currentProduct.manufacturer);
    this.manufacturer.disable();
    this.sku.setValue(this.currentProduct.sku);
    this.sku.disable();
    this.upc.setValue(this.currentProduct.upc);
    this.upc.disable();
    this.pricePerUnit.setValue("$" + this.currentProduct.pricePerUnit);
    this.quantityOnHand.setValue(this.currentProduct.quantityOnHand);
  }

  generateProductFromForm(prodId = 0): IProduct {
    var p = {
      productId: prodId,
      productName: this.productName.value,
      manufacturer: this.manufacturer.value,
      sku: this.sku.value,
      upc: this.upc.value,
      pricePerUnit: this.pricePerUnit.value.replace("$", ""),
      quantityOnHand: this.quantityOnHand.value
    };
    
    return p;
  }

  onSubmit(): void {
    if(this.isNew){
      this.currentProduct = this.generateProductFromForm();
      this.productsService.postProduct(this.currentProduct).subscribe({
        complete: () => this.openSnackBar('success', null),
        error: err => this.errorMessage = err
      });
    }else{
      this.currentProduct = this.generateProductFromForm(this.currentProduct.productId);
      this.productsService.putProduct(this.currentProduct).subscribe({
        complete: () => this.openSnackBar('success', null),
        error: err => this.errorMessage = err
      });
    }
    this.returnToProductList();  
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }


  formatCurrency(event)
  {
    // format the input to be USD
    let input = event.target.value;
    input = input.replace("$", "");
    var uy = new Intl.NumberFormat('en-US',{style: 'currency', currency:'USD'}).format(input);
    this.pricePerUnit.setValue(uy);
  }

  focusFunction() {
    this.error = false;
  }

}
