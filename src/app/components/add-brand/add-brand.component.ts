import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { iBrand } from 'src/app/models/brand';
import { DataHelperService } from 'src/app/services/data-helper.service';
import { HttpHelperService } from 'src/app/services/http-helper.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilsProviderService } from 'src/app/services/utils-provider.service';
import firebase from 'firebase';

@Component({
  selector: 'app-add-brand',
  templateUrl: './add-brand.component.html',
  styleUrls: ['./add-brand.component.scss'],
})
export class AddBrandComponent implements OnInit {

  @Input() brand: iBrand = new iBrand();

  brandForm: FormGroup;
  brandFile: any;
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
    this.brandForm = this.fb.group({
      brandTitle: [this.brand.brandTitle, Validators.compose([Validators.required])],
    });

    if (this.brand.fileUrl) {
      this.brandFile = {
        name: 'File Selected',
      }
    }
  }

  onChangeFile(event: any) {
    let selectedFile: any = (<HTMLInputElement>event.target).files;
    this.brandFile = selectedFile[0];
    this.newFile = true;
    event.target.value = '';
  }

  submitFormData(formData: any) {
    if (!this.brandFile) {
      this.toastr.error("Choose Image!");
      return;
    }
    if (!this.brand.brandId) {
      this.brand.createdOn = Number(new Date());
      this.brand.brandId = firebase.database().ref().child('brands').push().key;
    }
    this.brand.brandTitle = formData.brandTitle;
    this.newFile ? this.uploadFile() : this.savebrand();
  }

  uploadFile() {
    const self = this;
    self.dataHelper.displayLoading = true;
    let fileName = self.getFileName();
    firebase.storage().ref(fileName)
      .put(self.brandFile).then((result) => {
        result.ref.getDownloadURL().then((url) => {
          self.dataHelper.displayLoading = false;
          this.brand.fileUrl = url;
          self.savebrand();
        }).catch((err) => {
          self.toastr.error(err);
        });
      }).catch((err) => {
        self.toastr.error(err);
      });
  }

  savebrand() {
    this.activeModal.close({ brand: this.brand });
  }

  getFileName() {
    let fileName = this.brandFile.name;
    let fileType = fileName.split('.')[1];
    fileName = fileName.split('.')[0];
    fileName = fileName.split(' ').join('_');
    return `${fileName}_${Math.floor(Date.now() / 1000)}.${fileType}`;
  }

}
