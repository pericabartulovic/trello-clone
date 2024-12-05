import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root', // Make the service globally available
})
export class EventService {
  private boardCreatedSource = new Subject<void>(); // Subject to emit events

  // Observable stream that can be subscribed to
  boardCreated$ = this.boardCreatedSource.asObservable();

  // Method to emit the event
  emitBoardCreated() {
    this.boardCreatedSource.next(); // Emit the event
  }
}
