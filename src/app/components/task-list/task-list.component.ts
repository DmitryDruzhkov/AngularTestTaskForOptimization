import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { getTaskTitleByExpired } from '../../shared/task-helper';
import { DataEntitieService } from '../../services/data.service';
import { TaskType } from '../../shared/constants';
import { from, map, of, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TaskListComponent {
  tasks: any[] = [];
  onDestroy$: Subject<null> = new Subject();

  constructor(private dataEntitieService: DataEntitieService, private router: Router) {
    this.dataEntitieService.tasks.pipe(
      takeUntil(this.onDestroy$),
      switchMap((tasks) => of(tasks).pipe(
        map((tasks) => this.getTasksColor(tasks))
      ))
    ).subscribe((items) => {
      this.tasks = [...items];
    });
  }

  getTaskTitle(task: any) {
    return getTaskTitleByExpired(task);
  }

  getTasksColor(tasks: any) {
    return tasks.map((task: any) => ({
      ...task,
      color: this.getTaskColor(task)
    }))
  }

  getTaskColor(task: any) {
    if (task.type === TaskType.BUG) {
      return "warn";
    } else if (task.type === TaskType.FEATURE) {
      return "primary";
    } else if (task.type === TaskType.TECH_DOLG) {
      return "accent";
    }
    return "primary";
  }

  onDeleteTask(taskId: any) {
    this.dataEntitieService.tasks.next(this.dataEntitieService.tasks.getValue().filter((item: any) => item.id !== taskId));
  }

  onOpenTask(taskId: any) {
    this.router.navigateByUrl(`/item/${taskId}`);
  }

  ngOnDestroy() {
    this.onDestroy$.next(null);
    this.onDestroy$.complete();
  }
}
