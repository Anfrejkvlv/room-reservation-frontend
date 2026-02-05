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
    MatHeaderCellDef, CommonModule,ReactiveFormsModule, MatTabsModule,MatSnackBarModule,MatProgressBarModule
],
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit,AfterViewInit {

  public roomList=signal<Room[]>([]);

  public rooms: Room[]=[];
  isLoading=signal<boolean>(false);

  roomdisplayedColumns: string[] = ['roomId','name', 'roomNumber','bedInfo','actions'];

  private roomreservedService=inject(RoomReservationService);
  private snackbar=inject(MatSnackBar);

  public roomDataSource: MatTableDataSource<Room>=new MatTableDataSource<Room>([]);

  @ViewChild(MatPaginator)
  paginator: MatPaginator = new MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;

  editData=signal<number>(0);


  constructor() {
    this.roomForm;
  }

  ngOnInit() {
      this.loadData();
  }


  roomForm=new FormGroup({
    roomName:new FormControl('',Validators.required),
    roomNumber:new FormControl('', Validators.required),
    bedInfo:new FormControl('', Validators.required),
    roomId: new FormControl(0)
  });

  roomUpdateForm=new FormGroup({
    roomName:new FormControl('',Validators.required),
    roomNumber:new FormControl('', Validators.required),
    bedInfo:new FormControl('', Validators.required),
    roomId: new FormControl(0)
  });

  loadData():void{
    this.roomreservedService.roomsreseved$().subscribe({
      next:(response: Room[])=>{
        this.roomList.set(response);
        this.rooms=response;
        this.roomDataSource.data = response;
      },
      error(err) {
        console.log(err);
      },
    });
  }

  saveRoom():void{
    if(this.roomForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading.set(true);
    const formData: Room={
      name: this.roomForm.value.roomName as string,
      roomNumber:this.roomForm.value.roomNumber as string,
      roomId:this.roomForm.value.roomId as number,
      bedInfo:this.roomForm.value.bedInfo as string
    }
    this.roomreservedService.addRoom$(formData).subscribe({
        next:(response)=>{
          this.roomForm.reset();
          this.isLoading.set(false);
          this.loadData();
          this.snackbar.open("Room successfuly added","Fermer",{duration:3000,verticalPosition:'bottom'});
          console.log(response);
        },
      error:(err)=>{
        this.snackbar.open(err.text,'Fermer',{duration:3000,verticalPosition:'bottom'});
      }
    });
  }

  updateRoom():void{
    if(this.roomUpdateForm.invalid){
      this.markFormGroupTouched();
      return;
    }
    this.isLoading.set(true);
    const room:Room={
      roomId:this.roomUpdateForm.getRawValue().roomId as number,
      name:this.roomUpdateForm.getRawValue().roomName as string,
      roomNumber:this.roomUpdateForm.getRawValue().roomNumber as string,
      bedInfo:this.roomUpdateForm.getRawValue().bedInfo as string
    };
    this.roomreservedService.updateRoom$(this.editData(),room).subscribe({
      next:(response)=> {
        this.isLoading.set(false);
        this.editData.set(0);
        this.loadData();
        this.roomUpdateForm.reset();
        this.snackbar.open(response,'Fermer',{duration:3000,verticalPosition:'bottom'});
      },
      error:(err)=>{
        this.isLoading.set(false);
        this.snackbar.open(err.error,'Fermer',{duration:3000,verticalPosition:'bottom'});
      }
    })
  }

  onEdit(id:number):void{
      this.editData.set(id);
      const rooms=this.roomList();
      const room: Room=rooms.find(room=>room.roomId===id) as Room;
      this.roomUpdateForm.patchValue({
        roomId:room.roomId,
        roomName:room.name,
        roomNumber:room.roomNumber,
        bedInfo:room.bedInfo
      })
  }

  deleteRoom(id:number):void{

    if(window.confirm("Are you sure ?")){
      this.roomreservedService.deleteRoom$(id).subscribe({
      next:(response)=>{
        this.loadData();
        this.editData.set(0);
        this.snackbar.open(response,"Fermer",{duration: 3000,verticalPosition:'bottom'});
      },
      error:(err)=>{
        this.editData.set(0);
        this.snackbar.open(err,'Fermer',{duration:3000,verticalPosition:'bottom'});
      }
    });
    }
    this.loadData();
  }

  onCancel(){
    this.loadData();
    this.editData.set(0);
  }

  ngAfterViewInit() {
    this.roomDataSource.paginator=this.paginator;
    this.roomDataSource.sort=this.sort;
  }


  applyRoomFilter(event2: Event) {
    const filterValue = (event2.target as HTMLInputElement).value;
    this.roomDataSource.filter=filterValue.trim().toLowerCase();

    if (this.roomDataSource.paginator) {
      this.roomDataSource.paginator.firstPage();
    }

  }


  private markFormGroupTouched(): void {
    Object.keys(this.roomForm.controls).forEach(key => {
      const control = this.roomForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }
}
