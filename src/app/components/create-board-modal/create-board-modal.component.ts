import { Component, EventEmitter, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';
import { BoardService } from '../../services/board.service';
import { ModalService } from '../../services/modal.service';
import { Board } from '../../models/board.model';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-create-board-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-board-modal.component.html',
  styleUrls: ['./create-board-modal.component.scss'],
})
export class CreateBoardModalComponent implements AfterViewInit {
  @Output() close = new EventEmitter<void>();
  @ViewChild('boardInput') boardInput!: ElementRef;
  //   @Output() boardCreated = new EventEmitter<void>();

  boardName: string = '';

  constructor(
    private boardService: BoardService,
    public modalService: ModalService,
    private eventService: EventService
  ) {}

  ngAfterViewInit(): void {
    this.modalService.isModalOpen$.subscribe((isOpen) => {
      if (isOpen) {
        setTimeout(() => this.boardInput.nativeElement.focus(), 0);
      }
    });
  }

  onClose() {
    this.close.emit();
  }

  onCreateBoard() {
    if (!this.boardName || this.boardName.trim() === '') {
      alert('Board name is required.');
      return;
    }
    
    if (this.boardName.trim()) {
      const newBoard: Board = { name: this.boardName };

      this.boardService.createBoard(newBoard).subscribe(
        (response) => {
          console.log(response);
          this.modalService.closeModal();
          this.eventService.emitBoardCreated();
        },
        (error) => {
          console.error('Error creating board', error);
        }
      );
    } else {
      console.log('Board name is required!');
    }
  }
}
