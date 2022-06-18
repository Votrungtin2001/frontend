import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  titles = [
    { id: 1, name: "Team Lead", expand: false},
    { id: 2, name: "Architecture", expand: false},
    { id: 3, name: "Web Dev", expand: false },
    { id: 4, name: "Tester", expand: false },
    { id: 5, name: "UI/Ux", expand: false },
    { id: 6, name: "DBA", expand: false }
  ]

  constructor() { }

  ngOnInit(): void {
  }

  onClickExpand(id: number) {
    return this.titles.map((t) => {
     if(t.id == id) t.expand = !t.expand;
    });
   }

   isCollapseOrExpand(id: number) {
     const title = this.titles.find((t) => t.id == id);
     if(title!.expand == true) return "keyboard_arrow_down";
     else return "keyboard_arrow_right";
   }

}
