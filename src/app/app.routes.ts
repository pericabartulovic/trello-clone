import { Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { BoardComponent } from './components/board/board.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/admin', pathMatch: 'full' },
  { path: 'admin', component: AdminComponent },
  { path: 'board/:id', component: BoardComponent },
];
