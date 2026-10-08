import './style.css';
import { loadNotes, newNote, saveNotes, type Note } from './notes';
import { runAssist } from './rocketride';

let notes = loadNotes();
let selectedId: string | null = notes[0]?.id ?? null;

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
  <aside>
    <button id="new">+ New note</button>
    <ul id="list"></ul>
  </aside>
  <main id="editor"></main>
`;
const list = app.querySelector<HTMLUListElement>('#list')!;
const editor = app.querySelector<HTMLElement>('#editor')!;

function selected(): Note | undefined {
  return notes.find((n) => n.id === selectedId);
}

function update(changes: Partial<Note>): void {
  notes = notes.map((n) => (n.id === selectedId ? { ...n, ...changes, updatedAt: Date.now() } : n));
  saveNotes(notes);
  renderList();
}

function renderList(): void {
  list.replaceChildren(
    ...[...notes]
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .map((n) => {
        const li = document.createElement('li');
        li.textContent = n.title || 'Untitled';
        li.className = n.id === selectedId ? 'on' : '';
        li.onclick = () => {
          selectedId = n.id;
          render();
        };
        return li;
      }),
  );
}

function renderEditor(): void {
  const note = selected();
  if (!note) {
    editor.innerHTML = '<p class="empty">No note selected. Create one to get started.</p>';
    return;
  }
  editor.innerHTML = `
    <input id="title" />
    <textarea id="body" placeholder="Write something..."></textarea>
    <div class="actions"><button id="assist">✨ Assist</button><button id="delete">Delete</button></div>
    <pre id="assist-out" hidden></pre>
  `;
  const title = editor.querySelector<HTMLInputElement>('#title')!;
  const body = editor.querySelector<HTMLTextAreaElement>('#body')!;
  title.value = note.title;
  body.value = note.body;
  title.oninput = () => update({ title: title.value });
  body.oninput = () => update({ body: body.value });
  const out = editor.querySelector<HTMLPreElement>('#assist-out')!;
  editor.querySelector<HTMLButtonElement>('#assist')!.onclick = async () => {
    out.hidden = false;
    out.textContent = 'Thinking...';
    try {
      out.textContent = await runAssist(selected()!);
    } catch (err) {
      out.textContent = `RocketRide error: ${err instanceof Error ? err.message : String(err)}`;
    }
  };
  editor.querySelector<HTMLButtonElement>('#delete')!.onclick = () => {
    notes = notes.filter((n) => n.id !== note.id);
    saveNotes(notes);
    selectedId = notes[0]?.id ?? null;
    render();
  };
}

function render(): void {
  renderList();
  renderEditor();
}

app.querySelector<HTMLButtonElement>('#new')!.onclick = () => {
  const note = newNote();
  notes = [note, ...notes];
  saveNotes(notes);
  selectedId = note.id;
  render();
};

render();
