import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskType } from '../../shared/constants';
import { DataEntitieService } from '../../services/data.service';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DataEntitieService],
})
export class NewTaskComponent {
  taskTitleFormControl = new FormControl('');
  taskDescriptionFormControl = new FormControl('');
  taskTypeFormControl = new FormControl('');

  taskTypes = Object.values(TaskType);

  constructor(private dataEntitieService: DataEntitieService, private router: Router) {}

  onCreateTask() {
    const newTask = {
      title: this.taskTitleFormControl.value,
      description: this.taskDescriptionFormControl.value,
      expired: new Date().setDate(new Date().getDate() + 1),
      type: this.taskTypeFormControl.value,
    }

    this.dataEntitieService.tasks.next([newTask, ...this.dataEntitieService.tasks.getValue()])

    this.router.navigateByUrl('/');
  }
}
