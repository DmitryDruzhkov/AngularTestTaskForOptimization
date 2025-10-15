import { Component, ViewEncapsulation, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TaskType } from '../../shared/constants';
import { DataEntitieService, Task } from '../../services/data.service';

@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatCardModule, 
    MatButtonModule, 
    MatInputModule, 
    MatSelectModule
  ],
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DataEntitieService],
})
export class NewTaskComponent {
  private dataEntitieService = inject(DataEntitieService);
  private router = inject(Router);
  
  taskTitleFormControl = new FormControl('');
  taskDescriptionFormControl = new FormControl('');
  taskTypeFormControl = new FormControl('');

  taskTypes = Object.values(TaskType);
  
  private taskIdCounter = 100;

  onCreateTask() {
    const newTask: Task = {
      id: this.taskIdCounter++,
      title: this.taskTitleFormControl.value || '',
      description: this.taskDescriptionFormControl.value || '',
      expired: new Date().setDate(new Date().getDate() + 1),
      type: this.taskTypeFormControl.value as TaskType || TaskType.FEATURE,
      color: 'primary',
    }

    this.dataEntitieService.addTask(newTask);
    
    this.router.navigateByUrl('/');
  }
}
