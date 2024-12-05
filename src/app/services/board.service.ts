import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Board } from '../models/board.model';
import { TrelloList } from '../models/trello-list.model';
import { Card } from '../models/card.model';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private apiUrlRoot = environment.apiUrl; // Backend API root URL
  private apiUrlBoards = `${environment.apiUrl}/boards`; // Boards endpoint

  constructor(private http: HttpClient) {}

  createBoard(board: Board): Observable<Board> {
    return this.http.post<Board>(this.apiUrlBoards, board);
  }

  createList(boardId: string, listName: string): Observable<any> {
    return this.http.post(`${this.apiUrlBoards}/${boardId}/lists`, {
      name: listName,
    });
  }

  getListsByBoardId(boardId: string): Observable<TrelloList[]> {
    return this.http.get<TrelloList[]>(`${this.apiUrlBoards}/${boardId}/lists`);
  }

  /**
   * Delete a list and all its cards
   * @param boardId - The ID of the board containing the list
   * @param listId - The ID of the list to delete
   * @returns Observable<void>
   */
  deleteList(boardId: number, listId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrlBoards}/${boardId}/lists/${listId}`
    );
  }

  getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(this.apiUrlBoards);
  }

  getBoardById(boardId: string): Observable<Board> {
    const url = `${this.apiUrlBoards}/${boardId}`;
    return this.http.get<Board>(url);
  }

  createCard(card: Card): Observable<Card> {
    return this.http.post<Card>(`${this.apiUrlRoot}/cards`, card);
  }

  getCardsByListId(listId: number): Observable<Card[]> {
    return this.http.get<Card[]>(`${this.apiUrlRoot}/cards/${listId}`);
  }
}
