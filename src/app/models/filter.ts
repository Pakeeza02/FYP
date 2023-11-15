export class iFilter {
    minPrice: number = 0;
    maxPrice: number = 5000;
    minYear: number = 1990;
    maxYear: number = new Date().getFullYear();
    minMileage: number = 0;
    maxMileage: number = 100000;
    company: string = 'all';
    model: string = 'all';
    location: string = 'all';
    carburant: string = 'all';
    transmission: string = 'all';
}