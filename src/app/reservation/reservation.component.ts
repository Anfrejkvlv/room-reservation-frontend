import { MatIcon } from '@angular/material/icon';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { RoomReservationService } from '../service/room-reservation.service';
import { CommonModule } from '@angular/common';

import { ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef, MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import { Room } from '../model/room';
import { Reservation } from '../model/reservation';
import { Guest } from '../model/guest';
import { forkJoin } from 'rxjs';
import {MatSelect,MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';

import {MatTabsModule} from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RoomReservation } from '../model/room-reservation';

@Component({
  standalone:true,
  providers:[provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation:ViewEncapsulation.None,
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
    MatHeaderCellDef, CommonModule,ReactiveFormsModule, MatTabsModule,MatSnackBarModule,MatProgressBarModule
],
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit,AfterViewInit {

  public roomList=signal<Room[]>([]);
  public reservationList=signal<Reservation[]>([]);
  public guestList=signal<Guest[]>([]);
  private roomreservedService=inject(RoomReservationService);
  private snackbar=inject(MatSnackBar);
  isLoading=signal<boolean>(false);
  reservId=signal<number>(0);

  reservationdisplayedColumns: string[] = ['reservationId','roomId','guestId','date','actions'];

  public reservationDataSource: MatTableDataSource<Reservation>=new MatTableDataSource<Reservation>([]);

  @ViewChild(MatPaginator)
  paginator: MatPaginator = new MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;


  constructor() {

    this.form;

  }

  ngOnInit() {
    this.loadData();
  }

  form=new FormGroup({
    selectedGuestId:new FormControl(0,Validators.required),
    selectedRoomId:new FormControl(0, Validators.required),
    newdate:new FormControl('', Validators.required),
    reservationId: new FormControl(0)
  });

  updateForm=new FormGroup({
    selectedGuestId:new FormControl(0,Validators.required),
    selectedRoomId:new FormControl(0, Validators.required),
    newdate:new FormControl('', Validators.required),
    reservationId: new FormControl(0)
  });

  loadData():void{
      const reservedS=this.roomreservedService.getreservations$();
      const roomS=this.roomreservedService.getrooms$();
      const guestS=this.roomreservedService.guests$();

      forkJoin([reservedS,roomS,guestS]).subscribe({
      next:(response)=>{
        this.reservationDataSource.data=response[0];
        this.reservationList.set(response[0]);

        this.roomList.set(response[1]);

        this.guestList.set(response[2]);

      },
      error(err) {
        console.log(err);
      },
    });
  }

  onSubmit():void{
    if(this.form.invalid){
      this.markFormGroupTouched();
      return;
    }

    this.isLoading.set(true);
    const formData: Reservation={
      reservationId: 0,
      guestId:this.form.value.selectedGuestId as number,
      roomId:this.form.value.selectedRoomId as number,
      date:this.form.value.newdate as string
    }
    this.roomreservedService.reservations$(formData).subscribe({
        next:(response)=>{
          this.isLoading.set(false);
          this.loadData();
          this.snackbar.open("Reservation successfuly added","Fermer",{duration:3000,verticalPosition:'bottom'});
          this.form.reset();

          console.log(response);
        },
        error(err) {
          console.log("ERROR_OCCURED",err);
        },
    })
  }

  onUpdate():void{
    if(this.updateForm.invalid || this.reservId()<=0){
      this.markFormGroupTouched();
      return;
    }

    this.isLoading.set(true);
    const data:Reservation={
      reservationId:this.updateForm.getRawValue().reservationId as number,
      guestId:this.updateForm.getRawValue().selectedGuestId as number,
      roomId:this.updateForm.getRawValue().selectedRoomId as number,
      date:this.updateForm.getRawValue().newdate as string
    };
    this.roomreservedService.updateReservation$(data.reservationId,data).subscribe({
      next:(response)=>{
        this.isLoading.set(false);
        this.reservId.set(0);
        this.updateForm.reset();
        this.snackbar.open(response,'Fermer',{duration:3000,verticalPosition:'bottom'});
      },
      error:(err)=>{
        this.isLoading.set(false);
        this.reservId.set(0);
        this.snackbar.open(err,'Fermer',{duration:3000,verticalPosition:'bottom'});
      }
    })
  }

  onEditReserv(id:number):void{
    this.reservId.set(id);

    const reserved=this.reservationList();
    const reserve:Reservation=reserved.find(res=>res.reservationId===id) as Reservation;
    this.updateForm.patchValue({
      reservationId:reserve.reservationId,
      newdate:reserve.date,
      selectedGuestId:reserve.guestId,
      selectedRoomId:reserve.roomId
    });
  }

  onDelete(id:number):void{

    if(window.confirm("Are you sure ?")){
    this.roomreservedService.deleteReservation$(id).subscribe({
      next:(response)=>{
        this.loadData();
        this.reservId.set(0);
        this.snackbar.open(response,'Fermer',{duration:3000,verticalPosition:'bottom'});
      },
      error:(err)=>{
        this.reservId.set(0);
        this.snackbar.open(err,'Fermer',{duration:3000,verticalPosition:'bottom'});
      }
    });
  }
  this.loadData();
  }

  onCancel():void{
    this.reservId.set(0);
    this.loadData();
  }

  ngAfterViewInit() {
    this.reservationDataSource.paginator=this.paginator;
    this.reservationDataSource.sort=this.sort;
  }


  applyReservFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.reservationDataSource.filter=filterValue.trim().toLowerCase();

    if (this.reservationDataSource.paginator) {
      this.reservationDataSource.paginator.firstPage();
    }
  }


  private markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

}
