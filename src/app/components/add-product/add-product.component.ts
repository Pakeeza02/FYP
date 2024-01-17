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
import { ToastController } from '@ionic/angular';

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
  imageFiles: any[] = [];

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    public dataHelper: DataHelperService,
    public httpHelper: HttpHelperService,
    public toastr: ToastrService,
    public userAuth: UserAuthService,
    public utils: UtilsProviderService,
    public toast: ToastController
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
  }

  delteImage(i: number) {
    this.imageFiles.splice(i, 1);
  }

  onChangeFile(event: any) {
    let selectedFile: any = (<HTMLInputElement>event.target).files;
    if (selectedFile.length > 0) {
      if (selectedFile.length > 10) {
        this.showToast('Please select a maximum of 10 images.', 'danger');
      } else {
        for (let i = 0; i < selectedFile.length; i++) {
          const file = selectedFile[i];
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onloadend = () => {
            const base64String = reader.result as string;
            this.imageFiles.push({ img: base64String, file: file });
          };
        };
      }
    }
    event.target.value = '';
  }

  showToast(message: string, color = 'success', duration: number = 2000) {
    this.toast.create({
      message,
      duration,
      color
    }).then(toast => toast.present());
  }

  submitFormData(formData: any) {
    if (!this.imageFiles) {
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
    // Assign the first file from imageFiles to productFile
    this.productFile = this.imageFiles[0]?.file;
    this.imageFiles ? this.uploadFile() : this.saveProduct();
  }
  uploadFile() {
    const self = this;
    self.dataHelper.displayLoading = true;

    const uploadPromises: Promise<any>[] = []; 
    for (let i = 0; i < self.imageFiles.length; i++) {
      const file = self.imageFiles[i].file;
      const fileName = self.getFileName();

      const uploadTask = firebase.storage().ref(fileName).put(file);
      const uploadPromise = new Promise<any>((resolve, reject) => {
        uploadTask.on(
          firebase.storage.TaskEvent.STATE_CHANGED,
          (snapshot) => {
            // You can track the progress here if needed
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            // Handle errors during the upload
            reject(error);
          },
          () => {
            // The upload is complete, resolve with the download URL
            uploadTask.snapshot.ref.getDownloadURL().then((url) => {
              resolve(url);
            });
          }
        );
      });

      uploadPromises.push(uploadPromise);
    }

    Promise.all(uploadPromises)
      .then((urls) => {
        console.log('Download URLs:', urls);
        // Set the download URLs in the product object
        self.product.imageUrls = urls;
        // Call saveProduct here, inside the then block
        self.saveProduct();
      })
      .catch((err) => {
        self.toastr.error(err);
      });
  }


  saveProduct() {
    debugger
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

