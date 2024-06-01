import { CreateNoteButton } from './create-note-button';

const NotesPage = () => {
  const notes = [''];
  return (
    <>
      <div className="flex justify-between items-center pb-12">
        <h1 className="text-4xl font-bold">My Notes</h1>
        {notes && notes.length > 0 && <CreateNoteButton />}
      </div>
    </>
  );
};

export default NotesPage;
