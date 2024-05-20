import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validator, Validators } from '@angular/forms';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {


  contactForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern("^[a-zA-Z]+$")]),
    email: new FormControl('', [Validators.required, Validators.email]),
    message: new FormControl('', [Validators.required, Validators.maxLength(200), Validators.pattern("^[a-zA-Z]+$")]),
    sections: new FormControl('', [Validators.required]),

  })

  get name() {
    return this.contactForm.get('name')
  }

  get email() {
    return this.contactForm.get('email')
  }
  get message() {
    return this.contactForm.get('message')
  }
  get sections() {
    return this.contactForm.get('sections')
  }



  onSubmit() {
    console.log(this.contactForm.value);
    this.contactForm.reset()

  }

  isMobile!: boolean;
  dropdownOpen: boolean[] = [];

  footerLinks = [
    {
      title: 'Buyer',
      icon: 'https://assets.website-files.com/63a1773692843c14b3b68ca0/63a1773692843c2e9ab68d1b_S.svg',
      subLinks: [
        { title: 'Products', url: '#' },
        { title: 'Categories', url: '#' }
      ]
    },
    {
      title: 'Seller',
      icon: 'https://assets.website-files.com/63a1773692843c14b3b68ca0/63a1773692843c2e9ab68d1b_S.svg',
      subLinks: [
        { title: 'Products', url: '/product-listing' },
        { title: 'Categories', url: '/categories' }
      ]
    },

    {
      title: 'Social media',
      icon: 'https://assets.website-files.com/63a1773692843c14b3b68ca0/63a1773692843c2e9ab68d1b_S.svg',
      subLinks: [
        { title: 'LinkedIn', url: '#' },
        { title: 'Facebook', url: '#' },
        { title: 'Instagram', url: '#' },

      ]
    },
    // Add other footer links here
  ];



  ngOnInit() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile.bind(this));

  }

  checkMobile() {
    this.isMobile = window.innerWidth <= 768;
  }

  toggleDropdown(index: number) {
    this.dropdownOpen[index] = !this.dropdownOpen[index];
  }

  isDropdownOpen(index: number) {
    return this.dropdownOpen[index];

  }

}
