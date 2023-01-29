import { Component } from '@angular/core';
import { DataEntitieService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public tasks: any[] = [];

  constructor(private dataEntitieService: DataEntitieService) {
    this.dataEntitieService.tasks.subscribe((items) => {
      this.tasks = [...items];
    });
  }
}
