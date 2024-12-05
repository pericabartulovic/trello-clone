import { Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { CreateBoardModalComponent } from './components/create-board-modal/create-board-modal.component';
import { AdminComponent } from './components/admin/admin.component';

import { BoardService } from './services/board.service';
import { Board } from './models/board.model';
import { ModalService } from './services/modal.service';
import { EventService } from './services/event.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    HttpClientModule,
    CreateBoardModalComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent {
  @ViewChild(AdminComponent) adminComponent!: AdminComponent;
  title = 'trello-clone';
  constructor(
    public modalService: ModalService,
    private boardService: BoardService,
    private eventService: EventService
  ) {} // Inject the service

  boards: Board[] = []; // Array to store fetched boards

  ngOnInit(): void {
    this.loadBoards(); // Call method to load boards on component initialization
    this.eventService.boardCreated$.subscribe(() => {
      this.loadBoards(); // Refresh the boards list
    });
  }

  // Method to fetch boards
  loadBoards(): void {
    this.boardService.getBoards().subscribe(
      (boards) => {
        this.boards = boards; // Update boards array with fetched data
      },
      (error) => {
        console.error('Error fetching boards', error);
      }
    );
  }

  // Fetch the boards from the server
  fetchBoards() {
    this.boardService.getBoards().subscribe((boards) => {
      this.boards = boards;
    });
  }

  // Forward the event to AdminComponent
  onBoardCreated(): void {
    this.loadBoards();
  }
}
