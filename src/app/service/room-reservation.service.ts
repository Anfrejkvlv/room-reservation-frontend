import { inject, Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { RoomReservation } from '../model/room-reservation';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Room } from '../model/room';
import { Reservation } from '../model/reservation';
import { Guest } from '../model/guest';

@Injectable({
  providedIn: 'root'
})
export class RoomReservationService {

private readonly apiUrl='http://localhost:8081/roomReservations';
private http=inject(HttpClient);
constructor() { }

roomsreseved$=()=><Observable<RoomReservation[]>>this.http.get<RoomReservation[]>(`${this.apiUrl}`).pipe(
  tap(),
  catchError(this.handleError)
);

getrooms$=()=><Observable<Room[]>>this.http.get<Room[]>(`${this.apiUrl}/rooms`).pipe(
  tap(),
  catchError(this.handleError)
);

reservations$=(data:Reservation)=><Observable<Reservation>>this.http.post<Reservation>(`${this.apiUrl}/reservations`,data).pipe(
  tap(),
  catchError(this.handleError)
);

getreservations$=()=><Observable<Reservation[]>>this.http.get<Reservation[]>(`${this.apiUrl}/reservations`).pipe(
  tap(),
  catchError(this.handleError)
);

guests$=()=><Observable<Guest[]>>this.http.get<Guest[]>(`${this.apiUrl}/guests`).pipe(
  tap(),
  catchError(this.handleError)
);

addRoom$=(data:Room)=><Observable<Room>>this.http.post<Room>(`${this.apiUrl}/rooms`,data).pipe(
  tap(),
  catchError(this.handleError)
);

addGuest$=(data:Guest)=><Observable<Guest>>this.http.post<Guest>(`${this.apiUrl}/guests`,data).pipe(
  tap(),
  catchError(this.handleError)
);

updateReservation$=(reservationId:number,data:Reservation)=><Observable<Reservation>>this.http.put<Reservation>(`${this.apiUrl}/reservations/${reservationId}`,data).pipe(
  tap(),
  catchError(this.handleError)
);

updateRoom$=(roomId:number,data:Room)=><Observable<Room>>this.http.put<Room>(`${this.apiUrl}/rooms/${roomId}`,data).pipe(
  tap(),
  catchError(this.handleError)
);

updateGuest$=(guestId:number,data:Guest)=><Observable<Guest>>this.http.put<Guest>(`${this.apiUrl}/guests/${guestId}`,data).pipe(
  tap(),
  catchError(this.handleError)
);

deleteReservation$=(reservationId:number)=><Observable<string>>this.http.delete<string>(`${this.apiUrl}/reservations/${reservationId}`).pipe(
  tap(),
  catchError(this.handleError)
);

deleteRoom$=(roomId:number)=><Observable<string>>this.http.delete<string>(`${this.apiUrl}/rooms/${roomId}`).pipe(
  tap(),
  catchError(this.handleError)
);

deleteGuest$=(guestId:number)=><Observable<string>>this.http.delete<string>(`${this.apiUrl}/guests/${guestId}`).pipe(
  tap(),
  catchError(this.handleError)
);



private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(`An error occurred - Error code: ${error.status}`);
  }
}
