export interface Card {
  id?: number; // Optional for new cards
  title: string;
  listId: number; // Foreign key
  dueDate?: string | null | undefined;
}
