import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {MatTabsModule} from '@angular/material/tabs';
import { RoomReservationComponent } from "./room-reservation/room-reservation.component";
import { RoomComponent } from "./room/room.component";
import { ReservationComponent } from "./reservation/reservation.component";
import { GuestComponent } from "./guest/guest.component";
@Component({
  selector: 'app-root',
  standalone:true,
  imports: [CdkDrag, CdkDropList, MatTabsModule, RoomReservationComponent, RoomComponent, ReservationComponent, GuestComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation:ViewEncapsulation.None,
})
export class AppComponent {
  title = 'Room Reservation App';


  protected tabs = ['Room Reservation', 'Room', 'Reservation', 'Guest'];
  protected selectedTabIndex = 0;

  drop(event: CdkDragDrop<string[]>) {
    const prevActive = this.tabs[this.selectedTabIndex];
    moveItemInArray(this.tabs, event.previousIndex, event.currentIndex);
    this.selectedTabIndex = this.tabs.indexOf(prevActive);
  }
}
