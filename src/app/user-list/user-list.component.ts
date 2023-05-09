import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { FormControl, FormGroup, NgControl, NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users:User[] = [];
  editUser:boolean = false;
  userForm = new FormGroup(
    {
      name : new FormControl(""),
      email : new FormControl(""),
    }
  )
  editId = 0 

  constructor(private http:HttpClient) {

  }

  ngOnInit() {
    this.getUsers().subscribe((response) => {
        this.users = response
    })
  }

  getUsers() {
      return this.http.get<User[]>('https://jsonplaceholder.typicode.com/users');
  }

  onSubmit() {
    this.addUser().subscribe((response) => {
        this.users.push(response)
    })
  }
  onUpdate() {
      const request = this.http.put<User>('https://jsonplaceholder.typicode.com/users/'+this.editId, {
          name : this.userForm.controls.name.value ,
          email : this.userForm.controls.email.value
      })
      request.subscribe((response) => {
        this.users = this.users.map(user => {
            if(user.id == response.id) {
              user.name = response.name;
              user.email = response.email
            }
            return user;
         })
      })

  }

  addUser() {
      return this.http.post<User>('https://jsonplaceholder.typicode.com/users', {
        name : this.userForm.controls.name.value,
        email : this.userForm.controls.email.value
      })
  }

  edit(id: number) {
    this.editUser = true;
    const user = this.users.find(user => {
      return user.id == id
    })
    if (user!==undefined) {
      this.userForm.controls.name.setValue(user.name);
      this.userForm.controls.email.setValue(user.email);
      this.editId = id;
    }
  } 

  delete(id:number) {
      const request = this.http.delete('https://jsonplaceholder.typicode.com/users/'+id)
      request.subscribe(() => {
          this.users = this.users.filter(user => {
             return user.id !== id
          })
      })
  }
 
 
}
class User { 
   name!:string;
   email!: string;
   id!:number
}
