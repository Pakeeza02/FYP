import { Injectable } from '@angular/core';
import { DataHelperService } from './data-helper.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import firebase from 'firebase';
import { ToastrService } from 'ngx-toastr';
import { UtilsProviderService } from './utils-provider.service';

@Injectable({
  providedIn: 'root'
})
export class HttpHelperService {

  constructor(
    private modalService: NgbModal,
    public dataHelper: DataHelperService,
    public utils: UtilsProviderService,
    public toastr: ToastrService,
  ) { }

  async getFirebaseData(urlPath: string): Promise<any> {
    try {
      return firebase.database().ref(urlPath)
        .once('value', (snapshot) => {
          return snapshot;
        });
    } catch (err: any) {
      this.toastr.error(err.message);
    }
  }

  async saveFirebaseData(urlPath: string, data: any): Promise<any> {
    try {
      return firebase.database().ref(urlPath)
        .set(data).then((resp) => {
          return resp;
        });
    } catch (err: any) {
      this.toastr.error(err.message);
    }
  }

  async removeFirebaseData(urlPath: string): Promise<any> {
    try {
      return firebase.database().ref(urlPath)
        .remove().then((resp) => {
          return resp;
        });
    } catch (err: any) {
      this.toastr.error(err.message);
    }
  }

  openDeleteConfirmationModal(modalComponent: any, deletionItem: string, size?: string | undefined): Promise<any> {
    const modalRef = this.modalService.open(modalComponent, { size });
    modalRef.componentInstance.deletionItem = deletionItem;
    return this.openModal(modalRef);
  }

  openSharedModal(modalComponent: any, entity: string, dataObj: any, size?: string | undefined): Promise<any> {
    const modalRef = this.modalService.open(modalComponent, { size });
    modalRef.componentInstance[entity] = this.dataHelper.deepCloneData(dataObj);
    return this.openModal(modalRef);
  }

  openModal(modalRef: any): Promise<any> {
    return modalRef.result.then((result: any) => {
      return result;
    },
      ((reason: ModalDismissReasons) => {
        if (reason === ModalDismissReasons.BACKDROP_CLICK) {
          return null;
        } else {
          return '';
        }
      }
      ));
  }

}
