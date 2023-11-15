export class iVehicle {
    hostUid: string;
    vehicleName: string;
    vehicleDescription: string;
    vehicleCharactristics: string;
    carDocument: string;
    vehicleModel: string;
    vehicleCompany: string;
    vehicleRegYear: number;
    registrationNumber: string;
    carburant: string;
    mileage: number;
    transmission: string;
    location: string;
    createdOn: number;
    status: iVehicleStatus;
    imageUrls: string[] = [];
    coverImageUrl: string;
    vehicleId: string;
    carPrice: number;
}

export enum iVehicleStatus {
    PENDING = 'Pending',
    APPROVED = 'Approved',
    REJECTED = 'Rejected',
}