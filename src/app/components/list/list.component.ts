import { Component, Input, OnInit, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoardService } from '../../services/board.service';
import { Card } from '../../models/card.model';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  @Input() list: any;
  @Input() card: any;
  @Input() boardId!: string;
  @Output() listDeleted: EventEmitter<void> = new EventEmitter<void>(); // Emit event when list is deleted
  cards: Card[] = [];

  private apiUrlRoot = environment.apiUrl; // Backend API root URL

  isAddingCard: boolean = false; // Controls the mini form visibility.
  newCardTitle: string = '';
  newCardDueDate: string = '';

  constructor(private boardService: BoardService, private http: HttpClient) {}

  ngOnInit() {
    if (this.list && this.list.id) {
      this.loadCards();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Detect if the list.id is updated (e.g., after a new list is created)
    if (changes['list'] && changes['list'].currentValue.id) {
      this.loadCards(); // Reload cards after the list ID is assigned
    }
  }

  /**
   * Trigger the deletion of the list and its cards.
   */
  confirmDeleteList() {
    const confirmDelete = confirm(
      'Are you sure you want to delete this list and all its cards? This action cannot be undone.'
    );
    if (confirmDelete) {
      const boardIdAsNumber = +this.boardId;
      this.boardService.deleteList(boardIdAsNumber, this.list.id).subscribe(
        () => {
          alert('List and its cards were deleted successfully!');
          this.listDeleted.emit(); // Emit event to notify parent component
        },
        (error) => {
          console.error('Error deleting list:', error);
        }
      );
    }
  }

  loadCards() {
    this.boardService.getCardsByListId(this.list.id).subscribe(
      (cards) => {
        this.cards = cards;
      },
      (error) => {
        console.error('Error loading cards:', error);
      }
    );
  }

  // Method to handle adding a new card
  addCard() {
    if (!this.newCardTitle || this.newCardTitle.trim() === '') {
      alert('Card name is required.');
      return;
    }
    
    if (this.newCardTitle.trim()) {
      let dueDate = this.newCardDueDate;
      // Format the dueDate as "YYYY-MM-DD HH:mm:ss.sss"
      let formattedDueDate = null;
      if (dueDate) {
        // Format the due date similarly and ensure it's 6 decimals as well
        const formattedDueDateRaw = new Date(dueDate)
          .toISOString()
          .replace('T', ' ')
          .substring(0, 23);
        const formattedDueDateWithMillis = formattedDueDateRaw + '000';
        formattedDueDate = formattedDueDateWithMillis;
      }

      const newCard: Card = {
        title: this.newCardTitle,
        listId: this.list.id,
        dueDate: formattedDueDate || null,
      };

      this.boardService.createCard(newCard).subscribe(
        (card) => {
          this.cards.push(card);
          this.newCardTitle = '';
          this.newCardDueDate = '';
          this.isAddingCard = false; // Hide the mini form
        },
        (error) => {
          console.error('Error adding card:', error);
        }
      );
    }
  }

  // Method to cancel adding a card
  cancelAddCard() {
    this.newCardTitle = '';
    this.isAddingCard = false; // Close the form
  }

  deleteCard(cardId: number | undefined): void {
    const confirmDelete = confirm('Are you sure you want to delete this card?');
    if (confirmDelete) {
      this.http.delete(`${this.apiUrlRoot}/cards/${cardId}`).subscribe(
        () => {
          this.cards = this.cards.filter((card) => card.id !== cardId);
        },
        (error) => {
          // Handle error
          console.error('Error deleting card', error);
        }
      );
    }
  }
}
