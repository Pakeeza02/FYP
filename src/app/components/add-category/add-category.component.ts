import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataHelperService } from 'src/app/services/data-helper.service';
import { HttpHelperService } from 'src/app/services/http-helper.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilsProviderService } from 'src/app/services/utils-provider.service';
import firebase from 'firebase';
import { iCategory } from 'src/app/models/category';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss'],
})
export class AddCategoryComponent implements OnInit {

  @Input() category: iCategory = new iCategory();
  categoryForm: FormGroup;
  categoryFile: any;
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
    this.categoryForm = this.fb.group({
      categoryTitle: [this.category.categoryTitle, Validators.compose([Validators.required])],
    });

    if (this.category.fileUrl) {
      this.categoryFile = {
        name: 'File Selected',
      }
    }
  }

  onChangeFile(event: any) {
    let selectedFile: any = (<HTMLInputElement>event.target).files;
    this.categoryFile = selectedFile[0];
    this.newFile = true;
    event.target.value = '';
  }

  submitFormData(formData: any) {
    if (!this.categoryFile) {
      this.toastr.error("Choose Image!");
      return;
    }
    if (!this.category.categoryId) {
      this.category.createdOn = Number(new Date());
      this.category.categoryId = firebase.database().ref().child('categories').push().key;
    }
    this.category.categoryTitle = formData.categoryTitle;
    this.newFile ? this.uploadFile() : this.savecategory();
  }

  uploadFile() {
    const self = this;
    self.dataHelper.displayLoading = true;
    let fileName = self.getFileName();
    firebase.storage().ref(fileName)
      .put(self.categoryFile).then((result) => {
        result.ref.getDownloadURL().then((url) => {
          self.dataHelper.displayLoading = false;
          this.category.fileUrl = url;
          self.savecategory();
        }).catch((err) => {
          self.toastr.error(err);
        });
      }).catch((err) => {
        self.toastr.error(err);
      });
  }

  savecategory() {
    this.activeModal.close({ category: this.category });
  }

  getFileName() {
    let fileName = this.categoryFile.name;
    let fileType = fileName.split('.')[1];
    fileName = fileName.split('.')[0];
    fileName = fileName.split(' ').join('_');
    return `${fileName}_${Math.floor(Date.now() / 1000)}.${fileType}`;
  }

}
