export class iProduct {
    hostUid: string;
    productName: string;
    productDescription: string;
    productCharactristics: string;
    carDocument: string;
    productModel: string;
    productCompany: string;
    productRegYear: number;
    registrationNumber: string;
    carburant: string;
    mileage: number;
    transmission: string;
    location: string;
    createdOn: number;
    status: iProductStatus;
    imageUrls: string[] = [];
    coverImageUrl: string;
    productId: string;
    carPrice: number;
}

export enum iProductStatus {
    PENDING = 'Pending',
    APPROVED = 'Approved',
    REJECTED = 'Rejected',
}