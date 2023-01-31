import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { TaskType } from '../shared/constants';

export const dataSource = [
  {
    id: 0,
    title: 'Починить поиск' ,
    description: 'В результатах поиска нет нужного ответа',
    expired: new Date().setHours(12, 0, 0, 0),
    type: TaskType.BUG,
  },
  {
    id: 1,
    title: 'Запилить кнопку оплаты' ,
    description: 'Сделать оплату и учесть промокоды',
    expired: new Date().setHours(15, 0, 0, 0),
    type: TaskType.FEATURE,
  },
  {
    id: 2,
    title: 'Ускорить сайт' ,
    description: 'Сайт тормозит, что то надо подкрутить',
    expired: new Date(new Date().setHours(18, 0, 0, 0)).setDate(new Date().getDate() + 1),
    type: TaskType.TECH_DOLG,
  },
];

@Injectable({
  providedIn: 'root'
})
export class DataEntitieService {
  tasks: BehaviorSubject<any> = new BehaviorSubject(dataSource);
}
