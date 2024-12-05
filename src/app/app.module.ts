import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CreateBoardModalComponent } from './components/create-board-modal/create-board-modal.component';
import { AdminComponent } from './components/admin/admin.component';
import { BoardComponent } from './components/board/board.component';
import { BoardService } from './services/board.service'; // Ensure service is imported for DI

@NgModule({
  declarations: [],
  imports: [
    AppComponent,
    CreateBoardModalComponent,
    AdminComponent,
    BrowserModule,
    RouterModule.forRoot(appRoutes), // Configure routing
    HttpClientModule, // Add HttpClientModule for API calls
    FormsModule, // Add FormsModule for ngModel
    BoardComponent,
  ],
  providers: [BoardService], // Register services for DI (Dependency Injection)
  //   bootstrap: [AppComponent], // Bootstraps the app by loading AppComponent
})
export class AppModule {}
