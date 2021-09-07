import { Component, OnInit } from '@angular/core';
import { AuthLocalService } from '../../../../services/local/auth-local.service';
import { UserService } from '../../../../services/user.service';


@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {

  public name: string;
  public rol: string;
  public image: string;

  constructor(
    public authService: AuthLocalService,
    public userService: UserService
  ) { }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    if (this.authService.isLoggedIn) {
      this.userService.getLoggedUser().subscribe((data) => {
        if (!data["code"]) {

          this.name = data["name"];
          this.rol = data["rol"];
          this.image = data["image"];
        }
      });

    }
  }

  logOut() {
    this.authService.SignOut();
  }

}
