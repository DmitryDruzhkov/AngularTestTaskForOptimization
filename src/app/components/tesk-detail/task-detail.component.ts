import { Component, ViewEncapsulation, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { getTaskTitleByExpired } from '../../shared/task-helper';
import { DataEntitieService, Task } from '../../services/data.service';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatInputModule],
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TaskDetailComponent implements OnInit {
  private dataEntitieService = inject(DataEntitieService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  
  task = signal<Task | undefined>(undefined);

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id') || '0';
    const foundTask = this.dataEntitieService.getTaskById(+id);
    
    this.task.set(foundTask);
  }

  getTaskTitle(task: Task) {
    return getTaskTitleByExpired(task);
  }

  onDeleteTask(taskId: number) {
    this.dataEntitieService.deleteTask(taskId);
    this.router.navigateByUrl('/');
  }
}
