import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Makes it available across the app
})
export class ModalService {
  private isModalOpenSubject = new BehaviorSubject<boolean>(false);

  // Observable for modal state
  get isModalOpen$(): Observable<boolean> {
    return this.isModalOpenSubject.asObservable();
  }

  openModal() {
    this.isModalOpenSubject.next(true);
  }

  closeModal() {
    this.isModalOpenSubject.next(false);
  }

  toggleModal() {
    this.isModalOpenSubject.next(!this.isModalOpenSubject.value);
  }
}
