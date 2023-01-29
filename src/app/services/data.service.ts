import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { dataSource } from './shared/constants';

@Injectable({
  providedIn: 'root'
})
export class DataEntitieService {
  public tasks: BehaviorSubject<any> = new BehaviorSubject(dataSource);
}
