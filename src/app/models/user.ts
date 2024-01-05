import { iProduct } from 'src/app/models/product';

export class iUser {
    fullName: string = "";
    phone: number;
    email: string = "";
    profileUrl: string = "";
    dob: string | Date = "";
    gender: string = "";
    uid: string = "";
    createdOn: number = 1;
    company: string = "";
    isVerified: boolean = false;
    designation: string = "";
    userRole: string = '';
    userType: string;
    wishlist?: iProduct[];
    cart?: iProduct[];
}
