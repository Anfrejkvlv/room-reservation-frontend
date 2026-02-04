import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Room } from '../model/room';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

private readonly apiUrl='http://localhost:9083';
private http=inject(HttpClient);

constructor() {}

getrooms$=()=><Observable<Room>>this.http.get<Room>(`${this.apiUrl}/rooms`)

}
