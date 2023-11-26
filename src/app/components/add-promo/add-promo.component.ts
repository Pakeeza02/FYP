import { Component, OnInit,Input } from '@angular/core';
import { FormBuilder, FormGroup ,Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { iPromo } from 'src/app/models/promo';
import { DataHelperService } from 'src/app/services/data-helper.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { UtilsProviderService } from 'src/app/services/utils-provider.service';
import firebase from 'firebase';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-promo',
  templateUrl: './add-promo.component.html',
  styleUrls: ['./add-promo.component.scss'],
})
export class AddPromoComponent  implements OnInit {

  @Input() promo: iPromo = new iPromo();

  promoFile: any;
  newFile: boolean;
  promoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    public dataHelper: DataHelperService, 
    public toastr: ToastrService,
    public userAuth: UserAuthService,
    public utils: UtilsProviderService,
  ) {
  }

  ngOnInit(): void {
    this.promoForm = this.fb.group({
      promoTitle: [this.promo.promoTitle, Validators.compose([Validators.required])],
      price: [this.promo.price, Validators.compose([Validators.required])],
      discountType: [this.promo.discountType, Validators.compose([Validators.required])],
      value: [this.promo.value, Validators.compose([Validators.required])],
      promoDescription: [this.promo.promoDescription, Validators.compose([Validators.required])],
    });

    if (this.promo.fileUrl) {
      this.promoFile = {
        name: 'File Selected',
      }
    }
  }

  onChangeFile(event: any) {
    let selectedFile: any = (<HTMLInputElement>event.target).files;
    this.promoFile = selectedFile[0];
    this.newFile = true;
    event.target.value = '';
  }

  submitFormData(formData: any) {
    if (!this.promoFile) {
      this.toastr.error('Choose Image!');
      return;
    }
    if (!this.promo.promoId) {
      this.promo.createdOn = Number(new Date());
      this.promo.promoId = firebase.database().ref().child('promotions').push().key;
    }
    this.promo.promoTitle = formData.promoTitle;
    this.promo.price = formData.price;
    this.promo.value = formData.value;
    this.promo.promoDescription = formData.promoDescription;
    this.promo.discountType = formData.discountType;
    this.newFile ? this.uploadFile() : this.savepromo();
  }

  uploadFile() {
    const self = this;
    self.dataHelper.displayLoading = true;
    let fileName = self.getFileName();
    firebase.storage().ref(fileName)
      .put(self.promoFile).then((result) => {
        result.ref.getDownloadURL().then((url) => {
          self.dataHelper.displayLoading = false;
          this.promo.fileUrl = url;
          self.savepromo();
        }).catch((err) => {
        console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
  }

  savepromo() {
    this.activeModal.close({ promo: this.promo });
  }

  getFileName() {
    let fileName = this.promoFile.name;
    let fileType = fileName.split('.')[1];
    fileName = fileName.split('.')[0];
    fileName = fileName.split(' ').join('_');
    return `${fileName}_${Math.floor(Date.now() / 1000)}.${fileType}`;
  }

  // updateTotal() {
  //   if (selectedServices.length) {
  //     let sum = 0;
  //     selectedServices.forEach(x => {
  //       sum += x.price;
  //     });
  //     this.promoForm.controls['price'].setValue(sum);
  //   } else {
  //     this.promoForm.controls['price'].setValue(0);
  //   }
  // }

}
