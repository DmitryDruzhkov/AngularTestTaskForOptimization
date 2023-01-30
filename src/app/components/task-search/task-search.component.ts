import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DataEntitieService } from '../../services/data.service';

@Component({
  selector: 'app-task-search',
  templateUrl: './task-search.component.html',
  styleUrls: ['./task-search.component.scss']
})
export class TaskSearchComponent {
  taskSearchFormControl = new FormControl('');
  tasks: any[] = [];

  constructor(private dataEntitieService: DataEntitieService, private router: Router) {
    this.taskSearchFormControl.valueChanges.subscribe((inputValue) => {
      if (!inputValue) {
        this.tasks = [];
        return;
      }

      this.tasks = this.dataEntitieService.tasks.getValue().filter((task: any) => {
        return task.title.toLowerCase().includes((inputValue as string).toLowerCase()) || 
        task.description.toLowerCase().includes((inputValue as string).toLowerCase());
      });
    })
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
