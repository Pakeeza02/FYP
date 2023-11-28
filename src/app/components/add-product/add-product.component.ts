import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataHelperService } from 'src/app/services/data-helper.service';
import { HttpHelperService } from 'src/app/services/http-helper.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilsProviderService } from 'src/app/services/utils-provider.service';
import firebase from 'firebase';
import { iProduct } from 'src/app/models/product';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {


  @Input() product: iProduct = new iProduct();
  productForm: FormGroup;
  productFile: any;
  newFile: boolean;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    public dataHelper: DataHelperService,
    public httpHelper: HttpHelperService,
    public toastr: ToastrService,
    public userAuth: UserAuthService,
    public utils: UtilsProviderService,
  ) {
  }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      productName: [this.product.productName, Validators.compose([Validators.required])],
      productDescription: [this.product.productDescription, Validators.compose([Validators.required])],
      discountType: [this.product.discountType, Validators.compose([Validators.required])],
      price: [this.product.price, Validators.compose([Validators.required])],
      mku: [this.product.mku, Validators.compose([Validators.required])],
      productCategory: [this.product.productCategory, Validators.compose([Validators.required])],
    });

    if (this.product.coverImageUrl) {
      this.productFile = {
        name: 'File Selected',
      }
    }
  }

  onChangeFile(event: any) {
    let selectedFile: any = (<HTMLInputElement>event.target).files;
    this.productFile = selectedFile[0];
    this.newFile = true;
    event.target.value = '';
  }

  submitFormData(formData: any) {
    if (!this.productFile) {
      this.toastr.error("Choose Image!");
      return;
    }
    if (!this.product.productId) {
      this.product.createdOn = Number(new Date());
      this.product.productId = firebase.database().ref().child('products').push().key;
    }
    this.product.productName = formData.productName;
    this.product.productCategory = formData.productCategory;
    this.product.productDescription = formData.productDescription;
    this.product.discountType = formData.discountType;
    this.product.price = formData.price;
    this.product.mku = formData.mku;
    this.product.sellerUid = this.userAuth.currentUser.uid;
    this.newFile ? this.uploadFile() : this.saveProduct();
  }

  uploadFile() {
    const self = this;
    self.dataHelper.displayLoading = true;
    let fileName = self.getFileName();
    firebase.storage().ref(fileName)
      .put(self.productFile).then((result) => {
        result.ref.getDownloadURL().then((url) => {
          self.dataHelper.displayLoading = false;
          this.product.coverImageUrl = url;
          self.saveProduct();
        }).catch((err) => {
          self.toastr.error(err);
        });
      }).catch((err) => {
        self.toastr.error(err);
      });
  }

  saveProduct() {
    this.activeModal.close({ product: this.product });
  }

  getFileName() {
    let fileName = this.productFile.name;
    let fileType = fileName.split('.')[1];
    fileName = fileName.split('.')[0];
    fileName = fileName.split(' ').join('_');
    return `${fileName}_${Math.floor(Date.now() / 1000)}.${fileType}`;
  }

}

