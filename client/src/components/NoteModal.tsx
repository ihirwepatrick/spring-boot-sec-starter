import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

interface NoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (title: string, body: string) => void;
    note: Note | null;
}

const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose, onSave, note }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setContent(note.content);
        } else {
            setTitle('');
            setContent('');
        }
    }, [note]);

    const handleSave = async () => {
        if (!title.trim()) return;

        setIsSaving(true);
        await onSave(title.trim(), content.trim());
        setIsSaving(false);
    };

    const handleClose = () => {
        setTitle('');
        setContent('');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle className='font-normal'>
                        {note ? 'Edit Note' : 'Create New Note'}
                    </DialogTitle>
                    <DialogDescription>
                        {note ? 'Make changes to your note below.' : 'Add a new note to your collection.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter note title..."
                            className="col-span-3"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="body">Content</Label>
                        <Textarea
                            id="body"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your note content here..."
                            className="min-h-[200px] resize-none"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!title.trim() || isSaving}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {isSaving ? 'Saving...' : (note ? 'Update Note' : 'Create Note')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default NoteModal;
