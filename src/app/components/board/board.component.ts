import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

import { BoardService } from '../../services/board.service';

import { Board } from '../../models/board.model';
import { TrelloList } from '../../models/trello-list.model';

import { ListComponent } from '../../components/list/list.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, FormsModule, ListComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent implements OnInit, OnDestroy {
  board!: Board;
  boardId!: string;
  boardName: string = 'Untitled Board';
  lists: TrelloList[] = [];
  newListName: string = '';
  showAddListForm: boolean = false; // Toggle the visibility of the form
  private routeSubscription!: Subscription;
  boardBackgroundColors: string[] = [
    '#AE2E24', // Red subtler-pressed
    '#216E4E', // Green subtler-pressed
    '#0055CC', // Blue subtler-pressed
    '#5E4DB2', // Purple subtler-pressed
    '#943D73', // Magenta subtler-pressed
  ];

  headerBackgroundColors: string[] = [
    '#5D1F1A', // Red subtlest-hovered
    '#164B35', // Green subtlest-hovered
    '#09326C', // Blue subtlest-hovered
    '#352C63', // Purple subtlest-hovered
    '#50253F', // Magenta subtlest-hovered
  ];

  constructor(
    private route: ActivatedRoute,
    private boardService: BoardService
  ) {}

  getBoardBackgroundColor(boardId: string): string {
    // Cycle through colors if there are more boards than colors
    return this.boardBackgroundColors[
      +boardId % this.boardBackgroundColors.length
    ];
  }

  getBoardHeaderColor(boardId: string): string {
    return this.headerBackgroundColors[
      +boardId % this.headerBackgroundColors.length
    ];
  }

  ngOnInit() {
    // Subscribe to paramMap to detect changes in the route parameters
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      const boardId = params.get('id');
      if (boardId) {
        this.boardId = boardId;
        this.loadBoard(boardId);
        this.loadLists(boardId);
      }
    });
  }

  ngOnDestroy() {
    // Clean up the subscription when the component is destroyed
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  loadBoard(boardId: string): void {
    this.boardService.getBoardById(boardId).subscribe(
      (board) => {
        this.board = board;
        this.boardName = board.name;
      },
      (error) => {
        console.error('Error loading board:', error);
      }
    );
  }

  loadLists(boardId: string): void {
    this.boardService.getListsByBoardId(boardId).subscribe(
      (lists) => {
        this.lists = lists; // Assign fetched lists to the component property
      },
      (error) => {
        console.error('Error loading lists:', error);
      }
    );
  }

  addList() {
    if (this.newListName.trim()) {
      this.boardService.createList(this.boardId, this.newListName).subscribe(
        (newList) => {
          this.lists.push(newList); // Push the whole object
          this.newListName = ''; // Reset input field
          this.showAddListForm = false; // Hide form
        },
        (error) => {
          console.error('Error adding list:', error);
        }
      );
    }
  }

  confirmAddList() {
    if (!this.newListName || this.newListName.trim() === '') {
      alert('List name is required.');
      return;
    }
    
    if (this.newListName.trim()) {
      this.addList();
    }
  }

  cancelAddList() {
    this.newListName = ''; // Reset input
    this.showAddListForm = false; // Hide the form
  }

  // Handle the deletion of a list from the parent component
  onListDeleted() {
    this.loadLists(this.boardId); // Reload the lists after one has been deleted
  }
}
