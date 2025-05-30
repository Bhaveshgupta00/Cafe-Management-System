import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { error } from 'console';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})

export class ProductComponent implements OnInit {
  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter();
  productForm:any = FormGroup;
  dialogAction:any = "Add";
  action:any = "Add";
  responseMessage:any;
  categories:any = [];

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any,
  private formBuilder:FormBuilder,
  private productService:ProductService,
  public dialogRef:MatDialogRef<ProductComponent>,
  private categoryService:CategoryService,
  private snackbarService:SnackbarService) {  }
  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name: [null,[Validators.required,Validators.pattern(GlobalConstants.nameRegex)]],
      categoryId: [null,Validators.required],
      description: [null,Validators.required],
      price: [null,Validators.required]
    })

    if(this.dialogData.action === 'Edit'){
      this.dialogAction = "Edit";
      this.action = "Edit";
      this.productForm.patchValue(this.dialogData.data);
    }
    this.getCategories();
  }

  getCategories(){
    this.categoryService.getCategory().subscribe((response:any)=>{ 
      this.categories = response;
    },(error:any)=>{
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{ 
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

  handleSubmit(){
    if(this.dialogAction === 'Edit'){
      this.edit();
    }else{
      this.add();  
    }
  }

  edit(){
    var formData = this.productForm.value;
    var data = {
      id: this.dialogData.data.id,
      name: formData.name,
      categoryId: formData.categoryId,
      description: formData.description,
      price: formData.price
    }
    this.productService.update(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onEditProduct.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage,"success");
    },(error:any)=>{
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

  add(){
    var formData = this.productForm.value;
    var data = {
      name: formData.name,
      categoryId: formData.categoryId,
      description: formData.description,
      price: formData.price 
    }
    this.productService.add(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onAddProduct.emit();
      this.responseMessage = response.message;
      this.snackbarService.openSnackBar(this.responseMessage,"success");
    },(error:any)=>{
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }
}