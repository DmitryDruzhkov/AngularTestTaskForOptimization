import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { getTaskTitleByExpired } from '../../shared/task-helper';
import { DataEntitieService, Task } from '../../services/data.service';

@Component({
  selector: 'app-task-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './task-search.component.html',
  styleUrls: ['./task-search.component.scss']
})
export class TaskSearchComponent {
  private dataEntitieService = inject(DataEntitieService);
  private router = inject(Router);
  
  taskSearchFormControl = new FormControl('');
  tasks = signal<Task[]>([]);

  constructor() {
    this.taskSearchFormControl.valueChanges.subscribe((inputValue) => {
      if (!inputValue) {
        this.tasks.set([]);
        return;
      }

      const searchTerm = inputValue.toLowerCase();
      const allTasks = this.dataEntitieService.getAllTasks();
      
      this.tasks.set(allTasks.filter((task: Task) => {
        return task.title.toLowerCase().includes(searchTerm) || 
               task.description.toLowerCase().includes(searchTerm);
      }));
    })
  }

  getTaskTitle(task: Task) {
    return getTaskTitleByExpired(task);
  }

  onDeleteTask(taskId: number) {
    this.dataEntitieService.deleteTask(taskId);
  }

  onOpenTask(taskId: number) {
    this.router.navigateByUrl(`/item/${taskId}`);
  }
}
