import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserLogin } from '../models/user-login';
import { AdminUsersService } from '../service/admin-users.service';
import { User, UserRequestDto } from '../models/user.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss'
})
export class AdminUsersComponent {

  users: User[] = [];
  roleType: string = '';
  userName: string = '';
  password: string = '';
  userReqDto: UserRequestDto = {} as UserRequestDto;
  createdUser: UserRequestDto | null = null;

  constructor(private service: AdminUsersService) { }

  usersList: UserLogin[] = [];

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.service.getAllUsers().subscribe((data) => {
      console.log('Users: ', data);
      this.users = data;
    })
  }

  createUser(): void {
    this.userReqDto = {
      userName: this.userName,
      password: this.password,
      roleType: this.roleType
    };
    this.service.createUser(this.userReqDto).subscribe((createdUser) => {
      this.users.push(createdUser);
    })
  }

  deleteUser(userName: string): void {
    this.service.deleteUser(userName).subscribe(() => {
      this.loadUsers();
    })
  }


}
