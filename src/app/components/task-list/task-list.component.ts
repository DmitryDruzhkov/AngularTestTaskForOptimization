import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { DataEntitieService } from 'src/app/services/data.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TaskListComponent {
  tasks: any[] = [];

  constructor(private dataEntitieService: DataEntitieService, private router: Router) {
    this.dataEntitieService.tasks.subscribe((items) => {
      this.tasks = [...items];
    });
  }

  getTaskTitle(task: any) {
    return new Date().setHours(0,0,0,0) == new Date(task.expired).setHours(0,0,0,0) ? `Твоя задача на сегодня: ${task.title}` : task.title;
  }

  onDeleteTask(taskId: any) {
    this.dataEntitieService.tasks.next(this.dataEntitieService.tasks.getValue().filter((item: any) => item.id !== taskId))
  }

  onOpenTask(taskId: any) {
    this.router.navigateByUrl(`/item/${taskId}`);
  }
}
