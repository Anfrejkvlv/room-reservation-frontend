import { MatIcon } from '@angular/material/icon';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { RoomReservationService } from '../service/room-reservation.service';
import { CommonModule } from '@angular/common';

import { ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef, MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import { Guest } from '../model/guest';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';

import {MatTabsModule} from '@angular/material/tabs';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';

@Component({
  standalone:true,
  providers:[provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation:ViewEncapsulation.None,
  imports: [
    MatSelectModule,MatDatepickerModule,MatIcon,
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
    MatHeaderCellDef, CommonModule,ReactiveFormsModule,MatTabsModule,MatSnackBarModule,MatProgressBarModule
],
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.css']
})
export class GuestComponent implements OnInit,AfterViewInit {

  private roomreservedService=inject(RoomReservationService);
  public guestList=signal<Guest[]>([]);
  private snackbar=inject(MatSnackBar);
  guestId=signal<number>(0);

  isLoading=signal<boolean>(false);
  guestdisplayedColumns: string[] = ['guestId', 'firstName','lastName','emailAddress','address','country','state','phoneNumber','actions'];

  public guestDataSource: MatTableDataSource<Guest>=new MatTableDataSource<Guest>([]);

  @ViewChild(MatPaginator)
  paginator: MatPaginator = new MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;


  constructor() {

    this.guestForm;

  }

  ngOnInit() {
   this.loadData();
  }

  guestForm=new FormGroup({
      guestId:new FormControl(),
      firstName:new FormControl('', Validators.required),
      lastName:new FormControl('', Validators.required),
      emailAddress:new FormControl('', Validators.email),
      address:new FormControl('', Validators.required),
      country:new FormControl('', Validators.required),
      state:new FormControl('', Validators.required),
      phoneNumber:new FormControl('', Validators.required),
  });

  guestUpdateForm=new FormGroup({
      guestId:new FormControl(),
      firstName:new FormControl('', Validators.required),
      lastName:new FormControl('', Validators.required),
      emailAddress:new FormControl('', Validators.email),
      address:new FormControl('', Validators.required),
      country:new FormControl('', Validators.required),
      state:new FormControl('', Validators.required),
      phoneNumber:new FormControl('', Validators.required),
  });


  loadData():void{
      this.roomreservedService.guests$().subscribe({
      next:(response)=>{
        this.guestList.set(response);
        this.guestDataSource.data=response;
      },
      error(err) {
        console.log(err);
      },
    });
  }

  saveGuest():void{
    if( this.guestForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading.set(true);
    const formData: Guest={
      guestId: 0,
      firstName:this.guestForm.value.firstName as string,
      lastName:this.guestForm.value.lastName as string,
      emailAddress:this.guestForm.value.emailAddress as string,
      address:this.guestForm.value.address as string,
      country:this.guestForm.value.country as string,
      state:this.guestForm.value.state as string,
      phoneNumber:this.guestForm.value.phoneNumber as string,
    }
    this.roomreservedService.addGuest$(formData).subscribe({
        next:(response)=>{
          this.isLoading.set(false);
          this.loadData();
          this.guestForm.reset();
          this.snackbar.open("Guest successfuly added","Fermer",{duration:3000,verticalPosition:'bottom'});
          console.log(response);
        },
        error(err) {
          console.log("ERROR_OCCURED",err);
        },
    });
  }

  updateGuest():void{
    if(this.guestUpdateForm.invalid || this.guestId()<=0){
      this.markFormGroupTouched();
      return;
    }

    this.isLoading.set(true);

    const guest:Guest={
      guestId:this.guestUpdateForm.getRawValue().guestId,
      firstName:this.guestUpdateForm.getRawValue().firstName as string,
      lastName:this.guestUpdateForm.getRawValue().lastName as string,
      emailAddress:this.guestUpdateForm.getRawValue().emailAddress as string,
      address:this.guestUpdateForm.getRawValue().address as string,
      country:this.guestUpdateForm.getRawValue().country as string,
      phoneNumber:this.guestUpdateForm.getRawValue().phoneNumber as string,
      state:this.guestUpdateForm.getRawValue().state as string
    }
    this.roomreservedService.updateGuest$(this.guestId(),guest).subscribe({
      next:(response)=>{
        this.isLoading.set(false);
        this.loadData();
        this.guestId.set(0);
        this.guestUpdateForm.reset();
        this.snackbar.open(response,'Fermer',{duration:3000,verticalPosition:'bottom'});
      },
      error:(err)=>{
        this.isLoading.set(false);
        this.guestId.set(0);
        this.snackbar.open(err.error,'Fermer',{duration:3000,verticalPosition:'bottom'});
      }
    })
  }

  getGuestId(id:number):void{
    this.guestId.set(id);
    const guests=this.guestList();
    const guest=guests.find(g=>g.guestId);
    this.guestUpdateForm.patchValue({
      guestId:guest?.guestId,
      firstName:guest?.firstName,
      lastName:guest?.lastName,
      address:guest?.address,
      emailAddress:guest?.emailAddress,
      phoneNumber:guest?.phoneNumber,
      country:guest?.country,
      state:guest?.state
    })
  }

  onDelete(id:number):void{

    if(window.confirm("Are you sure?")){
    this.roomreservedService.deleteGuest$(id).subscribe({
      next:(response)=>{
        this.loadData();
        this.guestId.set(0);
        this.snackbar.open(response,'Fermer',{duration:3000,verticalPosition:'bottom'});
      },
      error:(err)=>{
        this.guestId.set(0);
        this.snackbar.open(err,'Fermer',{duration:3000,verticalPosition:'bottom'});
      }
    });
  }

  this.loadData();
  }

  onCancel():void{
    this.guestId.set(0);
    this.loadData();
  }


  ngAfterViewInit() {
    this.guestDataSource.paginator=this.paginator;
    this.guestDataSource.sort=this.sort;
  }

  applyGuestFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.guestDataSource.filter=filterValue.trim().toLowerCase();

    if (this.guestDataSource.paginator) {
      this.guestDataSource.paginator.firstPage();
    }
  }


  private markFormGroupTouched(): void {
    Object.keys(this.guestForm.controls).forEach(key => {
      const control = this.guestForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }
}
