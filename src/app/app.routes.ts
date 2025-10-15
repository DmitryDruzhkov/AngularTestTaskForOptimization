import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/task-list/task-list.component').then(m => m.TaskListComponent)
  },
  {
    path: 'item/:id',
    loadComponent: () => import('./components/tesk-detail/task-detail.component').then(m => m.TaskDetailComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./components/new-task/new-task.component').then(m => m.NewTaskComponent)
  },
  {
    path: 'search',
    loadComponent: () => import('./components/task-search/task-search.component').then(m => m.TaskSearchComponent)
  }
];

