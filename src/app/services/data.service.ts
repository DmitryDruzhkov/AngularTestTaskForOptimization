import { Injectable, signal, computed } from '@angular/core';
import { TaskType } from '../shared/constants';
import { ThemePalette } from '@angular/material/core';

export interface Task {
  id: number;
  title: string;
  description: string;
  expired: number;
  type: TaskType;
  color: ThemePalette;
}

export const dataSource: Task[] = [
  {
    id: 0,
    title: 'Починить поиск',
    description: 'В результатах поиска нет нужного ответа',
    expired: new Date().setHours(12, 0, 0, 0),
    type: TaskType.BUG,
    color: 'warn',
  },
  {
    id: 1,
    title: 'Запилить кнопку оплаты',
    description: 'Сделать оплату и учесть промокоды',
    expired: new Date().setHours(15, 0, 0, 0),
    type: TaskType.FEATURE,
    color: 'primary',
  },
  {
    id: 2,
    title: 'Ускорить сайт',
    description: 'Сайт тормозит, что то надо подкрутить',
    expired: new Date(new Date().setHours(18, 0, 0, 0)).setDate(new Date().getDate() + 1),
    type: TaskType.TECH_DOLG,
    color: 'accent',
  },
];

@Injectable({
  providedIn: 'root'
})
export class DataEntitieService {
  private tasksSignal = signal<Task[]>(dataSource);
  
  tasksCount = computed(() => this.tasksSignal().length);
  
  tasks = this.tasksSignal.asReadonly();
  
  addTask(task: Task) {
    this.tasksSignal.update(tasks => [task, ...tasks]);
  }
  
  deleteTask(id: number) {
    this.tasksSignal.update(tasks => tasks.filter(task => task.id !== id));
  }
  
  getTaskById(id: number): Task | undefined {
    return this.tasksSignal().find(task => task.id === id);
  }
  
  getAllTasks(): Task[] {
    return this.tasksSignal();
  }
}
