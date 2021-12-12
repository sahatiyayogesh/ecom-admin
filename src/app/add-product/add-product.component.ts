import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IProduct } from '../shared/models/product';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-add-product',
	templateUrl: './add-product.component.html',
	styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

	public productForm: FormGroup;
	public submitted: boolean = false;
	public selectedProduct: IProduct;
	public isEditMode: boolean = false;

	constructor(private formBuilder: FormBuilder, public activatedRoute: ActivatedRoute, public router: Router) { }

	ngOnInit(): void {
		this.activatedRoute.params.subscribe(params => {
			if (params.id !== undefined) {
				const id = parseInt(params.id);
				const products = JSON.parse(localStorage.getItem('products'));
				const index = products.findIndex(product => product.product_id === id);
				if (index > -1) {
					this.selectedProduct = products[index];
					this.isEditMode = true;
					this.productForm = this.formBuilder.group({
						product_name: [this.selectedProduct.product_name, [Validators.required, Validators.maxLength(50)]],
						product_description: [this.selectedProduct.product_description, [Validators.required, Validators.minLength(250)]],
						product_image: [this.selectedProduct.product_image, [Validators.required, Validators.pattern('(https?:\/\/.*\.(?:png|jpg))')]],
						product_price: [this.selectedProduct.product_price, [Validators.required, Validators.pattern('^([0-9]*|\d)(\.[0-9]{1,2})?$')]],
						product_category: [this.selectedProduct.product_category, [Validators.required, Validators.required]],
						product_discount_percentage: [this.selectedProduct.product_discount_percentage, Validators.pattern('^([0-9]*|\d)(\.[0-9]{1,2})?$')],
						product_gender: [this.selectedProduct.product_gender, Validators.required]
					});
				}
			} else {
				this.isEditMode = false;
				this.productForm = this.formBuilder.group({
					product_name: ['', [Validators.required, Validators.maxLength(50)]],
					product_description: ['', [Validators.required, Validators.minLength(250)]],
					product_image: ['', [Validators.required, Validators.pattern('(https?:\/\/.*\.(?:png|jpg))')]],
					product_price: ['', [Validators.required, Validators.pattern('^([0-9]*|\d)(\.[0-9]{1,2})?$')]],
					product_category: ['', [Validators.required, Validators.required]],
					product_discount_percentage: ['', Validators.pattern('^([0-9]*|\d)(\.[0-9]{1,2})?$')],
					product_gender: ['', Validators.required]
				});
			}
		});
	}

	// convenience getter for easy access to form fields
	get f() { return this.productForm.controls; }

	onSubmit() {
		this.submitted = true;

		// stop here if form is invalid
		if (this.productForm.invalid) {
			return;
		}

		if (this.isEditMode) {
			const products = JSON.parse(localStorage.getItem('products'));
			const index = products.findIndex(product => product.product_id === this.selectedProduct.product_id);
			if (index > -1) {
				const newItem = this.productForm.value;
				newItem.product_id = parseInt(this.selectedProduct.product_id);
				newItem.product_discount_percentage = newItem.product_discount_percentage ? parseInt(newItem.product_discount_percentage) : 0;
				newItem.product_price = parseInt(newItem.product_price);
				products[index] = Object.assign(products[index], newItem);
				localStorage.setItem('products', JSON.stringify(products));
				Swal.fire({
					icon: 'success',
					title: 'Item edited successfully',
					showConfirmButton: false
				})
			}
		} else {
			const newItem = this.productForm.value;
			newItem.product_discount_percentage = newItem.product_discount_percentage ? parseInt(newItem.product_discount_percentage) : 0;
			newItem.product_price = parseInt(newItem.product_price);
			newItem.product_soft_deleted = 'false';
			newItem.product_hard_deleted = 'false';
			if (localStorage.getItem('products')) {
				const products = JSON.parse(localStorage.getItem('products'));
				newItem.product_id = products.length;
				products.push(newItem);
				localStorage.setItem('products', JSON.stringify(products));
				Swal.fire({
					icon: 'success',
					title: 'Item added successfully',
					showConfirmButton: false
				})
			} else {
				newItem.product_id = 0;
				localStorage.setItem('products', JSON.stringify([newItem]));
				Swal.fire({
					icon: 'success',
					title: 'Item added successfully',
					showConfirmButton: false
				})

			}
		}
		this.router.navigate(['/dashboard']);
	}

}
