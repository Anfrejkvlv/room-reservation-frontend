import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path:'room-reservations',
    loadComponent: ()=>import('./room-reservation/room-reservation.component').then(c=>c.RoomReservationComponent),
    title:'Room Reservations'
  },
  {
    path:'rooms',
    loadComponent:()=>import('./room/room.component').then(c=>c.RoomComponent),
    title:'Rooms'
  },
  {
    path:'reservations',
    loadComponent:()=>import('./reservation/reservation.component').then(c=>c.ReservationComponent),
    title:'Reservations'
  },
  {
    path:'guests',
    loadComponent:()=>import('./guest/guest.component').then(c=>c.GuestComponent),
    title:'Guests'
  }
];
