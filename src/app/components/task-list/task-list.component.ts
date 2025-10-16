import {
  Component,
  ViewEncapsulation,
  inject,
  effect,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatBadgeModule } from '@angular/material/badge';
import { getTaskTitleByExpired } from '../../shared/task-helper';
import { DataEntitieService, Task } from '../../services/data.service';
import { TaskType } from '../../shared/constants';
import { IS_B2B, IS_B2C } from '../../shared/client-tokens';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatBadgeModule,
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TaskListComponent {
  private dataEntitieService = inject(DataEntitieService);
  private router = inject(Router);
  
  private isB2B = inject(IS_B2B, { optional: true }) ?? false;
  private isB2C = inject(IS_B2C, { optional: true }) ?? true;

  tasks = signal<Task[]>([]);

  constructor() {
    effect(() => {
      const allTasks = this.dataEntitieService.tasks();
      this.tasks.set(
        allTasks.map((task) => ({
          ...task,
          color: this.getTaskColor(task),
        }))
      );
    });
  }

  getTaskTitle(task: Task) {
    const baseTitle = getTaskTitleByExpired(task);
    
    if (this.isB2B) {
      const priority = this.getTaskPriority(task);
      return `[${priority}] ${baseTitle}`;
    } else if (this.isB2C) {
      return `⭐ ${baseTitle}`;
    }
    
    return baseTitle;
  }
  
  getTaskPriority(task: Task): string {
    if (this.isB2B) {
      const hoursLeft = (task.expired - Date.now()) / (1000 * 60 * 60);
      if (task.type === TaskType.BUG && hoursLeft < 4) return 'CRITICAL';
      if (task.type === TaskType.BUG) return 'HIGH';
      if (task.type === TaskType.FEATURE) return 'MEDIUM';
      return 'LOW';
    }
    return 'NORMAL';
  }

  getTaskColor(task: Task): 'primary' | 'accent' | 'warn' {
    if (task.type === TaskType.BUG) {
      return 'warn';
    } else if (task.type === TaskType.FEATURE) {
      return 'primary';
    } else if (task.type === TaskType.TECH_DOLG) {
      return 'accent';
    }
    return 'primary';
  }

  onDeleteTask(taskId: number) {
    this.dataEntitieService.deleteTask(taskId);
  }

  onOpenTask(taskId: number) {
    this.router.navigateByUrl(`/item/${taskId}`);
  }
}
