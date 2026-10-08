export interface Note {
  id: string;
  title: string;
  body: string;
  updatedAt: number;
}

const KEY = 'notepad.notes';

export function loadNotes(): Note[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as Note[];
  } catch {
    return [];
  }
}

export function saveNotes(notes: Note[]): void {
  localStorage.setItem(KEY, JSON.stringify(notes));
}

export function newNote(): Note {
  return { id: crypto.randomUUID(), title: 'Untitled', body: '', updatedAt: Date.now() };
}
