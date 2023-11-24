import { Component, OnInit } from '@angular/core';
import { DataHelperService } from 'src/app/services/data-helper.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { UtilsProviderService } from 'src/app/services/utils-provider.service';
import { NavController } from '@ionic/angular';

export enum fileTypes {
  COVER_IMAGE = 'coverImage',
  CAR_DOCUMENT = 'carDocument'
};

@Component({
  selector: 'app-upload-car',
  templateUrl: './upload-car.page.html',
  styleUrls: ['./upload-car.page.scss'],
})
export class UploadCarPage implements OnInit {

  constructor(
    public dataHelper: DataHelperService,
    public navCtrl: NavController,
    public utils: UtilsProviderService,
    public userAuth: UserAuthService
  ) {
    // Initialize the imageUrls array in productDetails if not already initialized
    if (!this.dataHelper.productDetails.imageUrls) {
      this.dataHelper.productDetails.imageUrls = [];
    }
  }

  ngOnInit() { }

  // Opens the camera options and sets the selected image based on the fileType
  async openCameraOptions(fileType?: string) {
    try {
      const res = await this.utils.openCameraOptions();
      if (res) {
        switch (fileType) {
          case fileTypes.CAR_DOCUMENT: {
            this.dataHelper.productDetails.carDocument = res;
            return;
          }
          case fileTypes.COVER_IMAGE: {
            this.dataHelper.productDetails.coverImageUrl = res;
            break;
          }
          default: {
            this.dataHelper.productDetails.imageUrls.push(res);
          }
        }
      }
    } catch (error) {
      console.error('Error opening camera options:', error);
    }
  }

  // Saves product documents, validates and uploads the images and documents
  saveDocuments() {
    if (!this.dataHelper.productDetails.carDocument) {
      this.utils.createToast('Please attach car document');
    } else if (!this.dataHelper.productDetails.coverImageUrl) {
      this.utils.createToast('Add car image');
    } else {
      if (
        this.dataHelper.isAnyNewproductImagePicked() ||
        this.dataHelper.isNewCoverImagePicked() ||
        this.dataHelper.isAnyDocumentChanged()
      ) {
        this.utils.presentLoading('Saving Files...!');
      }
      this.dataHelper.uploadproductFiles();
    }
  }

  // Removes an image from the imageUrls array based on its index
  removeImg(index: number) {
    this.dataHelper.productDetails.imageUrls.splice(index, 1);
  }

}