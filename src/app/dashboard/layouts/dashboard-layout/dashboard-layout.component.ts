import { Component, OnInit, computed, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/authService.service';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css',
})
export class DashboardLayoutComponent  {
  private authService = inject(AuthService);
  public user = computed( () => this.authService.currentUser())

  test(){
    console.log(this.user)
  }

}

