-- DropForeignKey
ALTER TABLE "NoteCollaborator" DROP CONSTRAINT "NoteCollaborator_noteId_fkey";

-- AddForeignKey
ALTER TABLE "NoteCollaborator" ADD CONSTRAINT "NoteCollaborator_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;
