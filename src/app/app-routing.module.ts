import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewTaskComponent } from './components/new-task/new-task.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskSearchComponent } from './components/task-search/task-search.component';
import { TaskDetailComponent } from './components/tesk-detail/task-detail.component';

const routes: Routes = [
  {
    path: '',
    component: TaskListComponent
  },
  {
    path: 'item/:id',
    component: TaskDetailComponent
  },
  {
    path: 'new',
    component: NewTaskComponent
  },
  {
    path: 'search',
    component: TaskSearchComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
