import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataEntitieService } from 'src/app/services/data.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TaskDetailComponent {
  task!: any;

  constructor(private dataEntitieService: DataEntitieService, private activatedRoute: ActivatedRoute) {
    const id = this.activatedRoute.snapshot.paramMap.get('id') || 0;
    this.task = this.dataEntitieService.tasks.getValue().find((item: any) => item.id == +id);
  }

  getTaskTitle(task: any) {
    return new Date().setHours(0,0,0,0) == new Date(task.expired).setHours(0,0,0,0) ? `Твоя задача на сегодня: ${task.title}` : task.title;
  }

  onDeleteTask(taskId: any) {
    this.dataEntitieService.tasks.next(this.dataEntitieService.tasks.getValue().filter((item: any) => item.id !== taskId))
  }
}
