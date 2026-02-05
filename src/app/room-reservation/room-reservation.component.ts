import { MatIcon } from '@angular/material/icon';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { RoomReservationService } from '../service/room-reservation.service';
import { RoomReservation } from '../model/room-reservation';
import { CommonModule } from '@angular/common';

import { ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatNoDataRow, MatRow, MatRowDef, MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';


@Component({
  standalone:true,
  providers:[provideNativeDateAdapter()],
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
    MatHeaderCellDef, CommonModule,ReactiveFormsModule,
],
  selector: 'app-room-reservation',
  templateUrl: './room-reservation.component.html',
  styleUrls: ['./room-reservation.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation:ViewEncapsulation.None,

})
export class RoomReservationComponent implements OnInit,AfterViewInit {

  private roomreservedService=inject(RoomReservationService);

  public roomsreserved=signal<RoomReservation []|null>([]);

  public rooms: RoomReservation[]=[];

  displayedColumns: string[] = ['guestId', 'roomId', 'reservationId', 'firstName','lastName','name','roomNumber','bedInfo','date','actions'];

  public dataSource: MatTableDataSource<RoomReservation>=new MatTableDataSource<RoomReservation>([]);


  @ViewChild(MatPaginator)
  paginator: MatPaginator = new MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;


  constructor() {}

  ngOnInit() {
    this.loadData();
  }

  loadData():void{
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
  }

  saveGuest():void{

  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}




