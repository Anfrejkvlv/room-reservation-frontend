import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path:'',
    loadComponent: ()=>import('./room-reservation/room-reservation.component').then(e=>e.RoomReservationComponent)
  }
];
