import Image from 'next/image';

const NotesPage = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-12 pt-6">
      <Image src="/selection.svg" alt="" width={300} height={300} />
      <h2 className="text-2xl font-semibold">Please select a note</h2>
    </div>
  );
};

export default NotesPage;
