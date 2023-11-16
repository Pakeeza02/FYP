import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-reviews',
  templateUrl: './all-reviews.component.html',
  styleUrls: ['./all-reviews.component.scss'],
})
export class AllReviewsComponent implements OnInit {

  reviewList: any = [
    {
      image: "http://bootdey.com/img/Content/avatar/avatar1.png",
      name: "Singh Osahan",
      date: "Tue, 20 Oct 2022",
      rating: 4,
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus labore amet at ducimus sunt maiores natus voluptates nostrum voluptate! Quis tempora vero aliquam delectus repellendus, iusto exercitationem earum nam architecto reprehenderit maiores,  neque illo, dolores magnam accusantium? Voluptatibus, iste saepe!"
    },
    {
      image: "http://bootdey.com/img/Content/avatar/avatar6.png",
      name: "Roy Smith",
      date: "Fri, 18 Jul 2022",
      rating: 4,
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus labore amet at ducimus sunt maiores natus voluptates nostrum voluptate! Quis tempora vero aliquam delectus repellendus, iusto exercitationem earum nam architecto reprehenderit maiores,  neque illo, dolores magnam accusantium? Voluptatibus, iste saepe!"
    },
    {
      image: "http://bootdey.com/img/Content/avatar/avatar1.png",
      name: "David Millan",
      date: "Wed, 20 Mar 2022",
      rating: 4,
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus labore amet at ducimus sunt maiores natus voluptates nostrum voluptate! Quis tempora vero aliquam delectus repellendus, iusto exercitationem earum nam architecto reprehenderit maiores,  neque illo, dolores magnam accusantium? Voluptatibus, iste saepe!"
    },
  ]

  constructor() { }

  ngOnInit() { }

}
