import { Component, NgZone, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { ProductService } from '../../../shared/services/product.service';
import { OrderResponse } from '../../../shared/interfaces/order/order-response';
import { DetailTable } from '../../../shared/interfaces/order/detail-table';
import { UserResponse } from '../../../shared/interfaces/user/user-response';
import { OrderService } from '../../../shared/services/order.service';
import { UserService } from '../../../shared/services/user.service';
import { ProductResponse } from '../../../shared/interfaces/product/product-response';
import { OrderDTO } from '../../../shared/interfaces/order/order.dto';
import { DetailDTO } from '../../../shared/interfaces/detail/detail.dto';
import { StorageService } from '../../../shared/services/storage.service';
import { DetailResponse } from '../../../shared/interfaces/detail/detail-response';

@Component({
  selector: 'app-update-order',
  templateUrl: './update-order.component.html',
  styleUrls: ['./update-order.component.css']
})
export class UpdateOrderComponent implements OnInit {
  id: number;
  sequential: string = '';
  order: OrderResponse;
  people: Array<UserResponse>;
  productData: Array<ProductResponse> = [];
  public selectedProduct: string;
  details: DetailTable[] = [];
  public validate = false;
  public tooltipValidation = false;
  public createOrderForm: FormGroup;
  public detailOrderForm: FormGroup;
  createOrderObserver$: Observable<OrderResponse>;
  createOrderSubscription: Subscription;
  constructor(
    private storageService: StorageService,
    private orderService: OrderService,
    private userService: UserService,
    private productService: ProductService,
    private route: ActivatedRoute,
    public router: Router,
    public ngZone: NgZone,
    public toster: ToastrService,
    private fb: FormBuilder,
  ) {
    const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    this.createOrderForm = this.fb.group({
      date: ['', Validators.required],
      tipo: ['', Validators.required],
      personId: ['', [Validators.required]],
      payment: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.pattern(urlRegex)]],
      description: ['', [Validators.required, Validators.minLength(4)]],
      subtotal: [0, [Validators.required, Validators.min(1)]],
      discount: [0, [Validators.required]],
      tax: [0, [Validators.required]],
      total: [0, [Validators.required, Validators.min(1)]],
      details: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.userService.getUserByType('client').subscribe(
      (data) => {
        this.people = data;
      },
      (httpError: HttpErrorResponse) => {
        this.toster.error(httpError.error['message']);
      }
    );
    this.productService.getProductsSimple().subscribe(
      (data) => {
        this.productData = data;
      },
      (httpError: HttpErrorResponse) => {
        this.toster.error(httpError.error['message']);
      }
    );
    this.id = this.route.snapshot.params['id'];
    this.orderService.getOrderById(this.id).subscribe(
      (data) => {
        this.order = data;
        this.sequential = data.sequential;
        this.createOrderForm.get('date').patchValue(data.date, { emitEvent: false });
        this.createOrderForm.get('tipo').patchValue(data.type, { emitEvent: false });
        this.createOrderForm.get('personId').patchValue(data.person.id, { emitEvent: false });
        this.createOrderForm.get('payment').patchValue(data.payment, { emitEvent: false });
        this.createOrderForm.get('address').patchValue(data.address, { emitEvent: false });
        this.createOrderForm.get('description').patchValue(data.description, { emitEvent: false });
        this.createOrderForm.get('subtotal').patchValue(data.subtotal, { emitEvent: false });
        this.createOrderForm.get('discount').patchValue(data.discount, { emitEvent: false });
        this.createOrderForm.get('tax').patchValue(data.tax, { emitEvent: false });
        this.createOrderForm.get('total').patchValue(data.total, { emitEvent: false });
        data.details.forEach((detail) => {
          this.setItem(detail);
        });
        this.calculate();
      },
      (httpError: HttpErrorResponse) => {
        this.toster.error(httpError.error['message']);
      }
    );
  }

  onChangeType(event) {
    if (event.target['value'] != "") {

      const type = event.target['value'] === 'Venta' ? 'client' : 'supplier';
      this.people = [];
      this.userService.getUserByType(type).subscribe(
        (data) => {
          this.people = data;
        },
        (httpError: HttpErrorResponse) => {
          this.toster.error(httpError.error['message']);
        }
      );
    }
  }

  selectChange(value: number) {
    const product = this.productData.find(el => el.id === value);
    const alreadyExistsInDetails = this.details.find(el => el.id === product.id);
    if (!alreadyExistsInDetails) {
      this.onAddItem(product);
    } else {
      this.onSameItem(alreadyExistsInDetails);
    }
    this.calculate();
  }

  onSameItem(product: DetailTable) {
    const groupIndex = product.groupIndex;
    const myChangedGroup = <FormArray>this.createOrderForm.get('details')['controls'][groupIndex];
    const quantity = +myChangedGroup.get('quantity').value + 1;
    const price = +myChangedGroup.get('price').value;
    const discount = myChangedGroup.get('discount').value;

    const percentage = discount / 100;
    const subtotal = (quantity * price);
    const discountValue = subtotal * percentage;
    const total = subtotal - discountValue;

    myChangedGroup.get('quantity').patchValue(quantity, { emitEvent: false });
    myChangedGroup.get('discountvalue').patchValue(discountValue, { emitEvent: false });
    myChangedGroup.get('subtotal').patchValue(total, { emitEvent: false });

    this.details[groupIndex].quantity = quantity;
    this.details[groupIndex].discount = discount;
    this.details[groupIndex].discountvalue = discountValue;
    this.details[groupIndex].subtotal = total;


  }

  onAddItem(product: ProductResponse) {
    const detailsArray = <FormArray>this.createOrderForm.get('details');
    const item = this.fb.group({
      groupIndex: detailsArray.length,
      product: [product.description, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [product.price, [Validators.required, Validators.min(1)]],
      stock: [product.stock, [Validators.required, Validators.min(1)]],
      discount: [0, [Validators.required]],
      discountvalue: [0, [Validators.required]],
      subtotal: [product.price, [Validators.required, Validators.min(1)]],
    });

    item.valueChanges.subscribe(data => {
      this.onValueChanged(data);
      this.calculate();
    });
    this.details.push({
      id: product.id,
      groupIndex: detailsArray.length,
      discount: 0,
      discountvalue: 0,
      price: product.price,
      product: product.description,
      quantity: 1,
      stock: product.stock,
      subtotal: product.price * 1
    });
    detailsArray.push(item);
  }

  setItem(detail: DetailResponse) {
    const detailsArray = <FormArray>this.createOrderForm.get('details');
    const item = this.fb.group({
      groupIndex: detailsArray.length,
      product: [detail.product.description, Validators.required],
      quantity: [detail.quantity, [Validators.required, Validators.min(1)]],
      price: [detail.product.price, [Validators.required, Validators.min(1)]],
      stock: [detail.product.stock, [Validators.required, Validators.min(1)]],
      discount: [detail.discount, [Validators.required]],
      discountvalue: [detail.discountvalue, [Validators.required]],
      subtotal: [detail.subtotal, [Validators.required, Validators.min(1)]],
    });

    item.valueChanges.subscribe(data => {
      this.onValueChanged(data);
      this.calculate();
    });
    this.details.push({
      id: detail.product.id,
      groupIndex: detailsArray.length,
      discount: detail.discount,
      discountvalue: detail.discountvalue,
      price: detail.product.price,
      product: detail.product.description,
      quantity: detail.quantity,
      stock: detail.product.stock,
      subtotal: detail.subtotal
    });
    detailsArray.push(item);
  }

  onValueChanged(data?: any): void {
    const groupIndex = data["groupIndex"];
    const myChangedGroup = <FormArray>this.createOrderForm.get('details')['controls'][groupIndex];
    const quantity = +myChangedGroup.get('quantity').value;
    const price = +myChangedGroup.get('price').value;
    const discount = myChangedGroup.get('discount').value;

    const percentage = discount / 100;
    const subtotal = (quantity * price);
    const discountValue = subtotal * percentage;
    const total = subtotal - discountValue;

    myChangedGroup.get('discountvalue').patchValue(discountValue, { emitEvent: false });
    myChangedGroup.get('subtotal').patchValue(total, { emitEvent: false });

    this.details[groupIndex].quantity = quantity;
    this.details[groupIndex].discount = discount;
    this.details[groupIndex].discountvalue = discountValue;
    this.details[groupIndex].subtotal = total;
  }

  calculate() {
    const percentage = 0.12;
    let subtotal = 0;
    let discount = 0;
    this.details.forEach(el => {
      subtotal += el.subtotal;
      discount += el.discountvalue;
    });
    subtotal = subtotal - discount;
    const tax = subtotal * percentage;
    const total = subtotal + tax;
    this.createOrderForm.get('subtotal').patchValue(subtotal.toFixed(2), { emitEvent: false });
    this.createOrderForm.get('discount').patchValue(discount.toFixed(2), { emitEvent: false });
    this.createOrderForm.get('tax').patchValue(tax.toFixed(2), { emitEvent: false });
    this.createOrderForm.get('total').patchValue(total.toFixed(2), { emitEvent: false });
  }

  deleteItem(groupIndex: number) {
    const detailsArray = <FormArray>this.createOrderForm.get('details');
    detailsArray.removeAt(groupIndex);
    this.details.splice(groupIndex, 1);
    this.calculate();
  }

  private getLtdLng(url: string): string {
    const splited = url.split(',');
    const position = splited[0].indexOf('@');
    const latitude = splited[0].substr(position + 1);
    const longitude = splited[1];
    return `${latitude},${longitude}`;
  }

  private generateDetailsJson(orderId: number) {
    let json: Array<DetailDTO> = [];
    this.details.forEach(({ quantity, id, subtotal, discountvalue, discount, price }) => {
      json.push({
        quantity,
        subtotal,
        discountvalue,
        discount,
        price: +price,
        orderId,
        productId: id,
      });
    });
    return json;
  }

  submit() {
    this.validate = !this.validate;
    if (this.validate) {
      if (this.order.state === 'creado' || this.order.state === 'inventariado') {

        const url = this.createOrderForm.value['address'];
        const address = this.getLtdLng(url);
        const data = <OrderDTO>{
          address: this.createOrderForm.value['address'],
          date: this.createOrderForm.value['date'],
          description: this.createOrderForm.value['description'],
          discount: +this.createOrderForm.value['discount'],
          subtotal: +this.createOrderForm.value['subtotal'],
          payment: this.createOrderForm.value['payment'],
          personId: +this.createOrderForm.value['personId'],
          tax: +this.createOrderForm.value['tax'],
          type: this.createOrderForm.value['tipo'],
          total: +this.createOrderForm.value['total'],
          userId: this.storageService.id,
          state: this.order.state,
          sequential: this.order.sequential,
          origin: 'web'
        }
        this.createOrderObserver$ = this.orderService.updateOrder(this.id, data);

        this.createOrderSubscription = this.createOrderObserver$.subscribe(
          (data) => {
            this.toster.success('Transaccion editada exitosamente!');
            const details: DetailDTO[] = this.generateDetailsJson(data.id);
            this.orderService.createDetails(details).subscribe(
              (response) => {
                this.ngZone.run(() => {
                  this.router.navigate(['/orders/list-order']);
                });
              },
              (httpError: HttpErrorResponse) => {
                this.toster.error(httpError.error['message']);
              }
            );
          },
          (httpError: HttpErrorResponse) => {
            this.toster.error(httpError.error['message']);
          }
        );
      }
    }
  }
}
