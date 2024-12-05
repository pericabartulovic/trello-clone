import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CreateBoardModalComponent } from '../create-board-modal/create-board-modal.component';
import { ModalService } from '../../services/modal.service';
import { BoardService } from '../../services/board.service';
import { EventService } from '../../services/event.service';
import { Board } from '../../models/board.model';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, CreateBoardModalComponent, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  constructor(
    public modalService: ModalService,
    private boardService: BoardService,
    private eventService: EventService
  ) {} // Inject the service

  boards: Board[] = [];

  ngOnInit(): void {
    this.loadBoards(); // Call method to load boards on component initialization
    this.eventService.boardCreated$.subscribe(() => {
      this.loadBoards(); // Refresh boards when a new board is created
    });
  }

  // Method to fetch boards
  loadBoards(): void {
    this.boardService.getBoards().subscribe(
      (boards) => {
        this.boards = boards; // Update boards array with fetched data
      },
      (error) => {
        console.error('Error fetching boards', error); // Handle error case
      }
    );
  }

  onBoardCreated(): void {
    this.loadBoards(); // Refresh the boards when a new board is created
  }
}
