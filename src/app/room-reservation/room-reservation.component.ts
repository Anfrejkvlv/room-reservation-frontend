import { MatIcon } from '@angular/material/icon';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, NgModule, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { RoomReservationService } from '../service/room-reservation.service';
import { RoomReservation } from '../model/room-reservation';
import { CommonModule, NgFor } from '@angular/common';

import { ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef, MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import { Room } from '../model/room';
import { Reservation } from '../model/reservation';
import { Guest } from '../model/guest';
import { forkJoin, from } from 'rxjs';
import {MatSelect,MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';

import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
  standalone:true,
  providers:[provideNativeDateAdapter()],
  imports: [
    MatSelect,MatSelectModule,MatDatepickerModule,MatIcon,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatFormField,
    MatFormFieldModule,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatInput,
    MatLabel,
    MatPaginatorModule,
    MatRow,
    MatRowDef,
    MatSortModule,
    MatTableModule,
    MatNoDataRow,
    MatHeaderCellDef, CommonModule,ReactiveFormsModule,CdkDrag, CdkDropList, MatTabsModule
],
  selector: 'app-room-reservation',
  templateUrl: './room-reservation.component.html',
  styleUrls: ['./room-reservation.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation:ViewEncapsulation.None,

})
export class RoomReservationComponent implements OnInit,AfterViewInit {

  private roomreservedService=inject(RoomReservationService);
  roomList=signal<Room[]>([]);
  reservationList=signal<Reservation[]>([]);
  guestList=signal<Guest[]>([]);






  roomsreserved=signal<RoomReservation []|null>([]);

  rooms: RoomReservation[]=[];

  displayedColumns: string[] = ['guestId', 'roomId', 'reservationId', 'firstName','lastName','name','roomNumber','bedInfo','date','actions'];

  reservationdisplayedColumns: string[] = ['reservationId','roomId','guestId','date','actions'];

  roomdisplayedColumns: string[] = ['roomId','name', 'roomNumber','bedInfo','actions'];

  guestdisplayedColumns: string[] = ['guestId', 'firstName','lastName','emailAddress','address','country','state','phoneNumber','actions'];

  dataSource: MatTableDataSource<RoomReservation>=new MatTableDataSource<RoomReservation>([]);
  roomDataSource: MatTableDataSource<Room>=new MatTableDataSource<Room>([]);
  guestDataSource: MatTableDataSource<Guest>=new MatTableDataSource<Guest>([]);
  reservationDataSource: MatTableDataSource<Reservation>=new MatTableDataSource<Reservation>([]);

  @ViewChild(MatPaginator)
  paginator: MatPaginator = new MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;


  constructor() {

    this.form;

    this.roomreservedService.roomsreseved$().subscribe({
      next:(response: RoomReservation[])=>{
        this.roomsreserved.set(response);
        this.rooms=response;
        this.dataSource.data = response;
      },
      error(err) {
        console.log(err);
      },
    });

      const roomRS=this.roomreservedService.getreservations$();
      const roomS=this.roomreservedService.getrooms$();
      const guestS=this.roomreservedService.guests$();

      forkJoin([roomRS,roomS,guestS]).subscribe({
      next:(response)=>{
        this.reservationList.set(response[0]);
        this.reservationDataSource.data=response[0];
        this.roomList.set(response[1]);
        this.roomDataSource.data=response[1];
        this.guestList.set(response[2]);
        this.guestDataSource.data=response[2];
      },
      error(err) {
        console.log(err);
      },
    });

  }

    ngOnInit() {
   // this.loadData();
  }

  form=new FormGroup({
    selectedGuestId:new FormControl(0,Validators.required),
    selectedRoomId:new FormControl(0, Validators.required),
    newdate:new FormControl('', Validators.required),
    reservationId: new FormControl()
  });

  roomForm=new FormGroup({
    roomName:new FormControl(0,Validators.required),
    roomNumber:new FormControl(0, Validators.required),
    bedInfo:new FormControl('', Validators.required),
    roomId: new FormControl()
  });

  guestForm=new FormGroup({
      guestId:new FormControl(),
      firstName:new FormControl('', Validators.required),
      lastName:new FormControl('', Validators.required),
      emailAddress:new FormControl('', Validators.required),
      address:new FormControl('', Validators.required),
      country:new FormControl('', Validators.required),
      state:new FormControl('', Validators.required),
      phoneNumber:new FormControl('', Validators.required),
  })

  /*
  loadData():void{
      const roomRS=this.roomreservedService.getreservations$();
      const roomS=this.roomreservedService.getrooms$();
      const guestS=this.roomreservedService.guests$();

      forkJoin([roomRS,roomS,guestS]).subscribe({
      next:(response)=>{
        this.reservationList.set(response[0]);
        this.reservationDataSource.data=response[0];
        this.roomList.set(response[1]);
        this.roomDataSource.data=response[1];
        this.guestList.set(response[2]);
        this.guestDataSource.data=response[2];
      },
      error(err) {
        console.log(err);
      },
    });
  }*/

  onSubmit():void{
    if(this.form.invalid) return;

    const formData: Reservation={
      reservationId: 0,
      guestId:this.form.value.selectedGuestId as number,
      roomId:this.form.value.selectedRoomId as number,
      date:this.form.value.newdate as string
    }
    this.roomreservedService.reservations$(formData).subscribe({
        next:(response)=>{
          //this.loadData();
          console.log(response);
        },
        error(err) {
          console.log("ERROR_OCCURED",err);
        },
    })
  }

  saveRoom():void{
    if(this.roomForm.invalid) return;

  }

  saveGuest():void{

  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.roomDataSource.paginator=this.paginator;
    this.reservationDataSource.paginator=this.paginator;
    this.guestDataSource.paginator=this.paginator;
    this.dataSource.sort = this.sort;
    this.roomDataSource.sort=this.sort;
    this.reservationDataSource.sort=this.sort;
    this.guestDataSource.sort=this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.roomDataSource.filter=filterValue.trim().toLowerCase();
    this.reservationDataSource.filter=filterValue.trim().toLowerCase();
    this.guestDataSource.filter=filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    if (this.roomDataSource.paginator) {
      this.roomDataSource.paginator.firstPage();
    }

    if (this.reservationDataSource.paginator) {
      this.reservationDataSource.paginator.firstPage();
    }

    if (this.guestDataSource.paginator) {
      this.guestDataSource.paginator.firstPage();
    }
  }

  protected tabs = ['Room Reservation', 'Room', 'Reservation', 'Guest'];
  protected selectedTabIndex = 0;

  drop(event: CdkDragDrop<string[]>) {
    const prevActive = this.tabs[this.selectedTabIndex];
    moveItemInArray(this.tabs, event.previousIndex, event.currentIndex);
    this.selectedTabIndex = this.tabs.indexOf(prevActive);
  }
}




