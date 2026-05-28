import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '../contexts/AuthContext';
import { Plus, Edit, Delete, LogOut } from 'lucide-react';
import NoteModal from '../components/NoteModal';
import { toast } from "@/hooks/use-toast";

interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

const Dashboard = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const { user, token, logout } = useAuth();

    const fetchNotes = async () => {
        try {
            const response = await fetch('/api/notes', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setNotes(data.data);
            } else {
                console.error('Failed to fetch notes');
            }
        } catch (error) {
            console.log('Error fetching notes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, [token]);

    const handleCreateNote = () => {
        setEditingNote(null);
        setIsModalOpen(true);
    };

    const handleEditNote = (note: Note) => {
        setEditingNote(note);
        setIsModalOpen(true);
    };

    const handleDeleteNote = async (noteId: string) => {
        if (!confirm('Are you sure you want to delete this note?')) return;

        try {
            const response = await fetch(`/api/notes/${noteId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setNotes(notes.filter(note => note.id !== noteId));
                toast({
                    title: "Note deleted",
                    description: "Your note has been successfully deleted.",
                });
            } else {
                toast({
                    title: "Error",
                    description: "Failed to delete note. Please try again.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.log('Error deleting note:', error);
            toast({
                title: "Error",
                description: "Network error. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleSaveNote = async (title: string, content: string) => {
        try {
            const url = editingNote ? `/api/notes/${editingNote.id}` : '/api/notes';
            const method = editingNote ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ title, content }),
            });

            if (response.ok) {
                const savedNote = await response.json();

                if (editingNote) {
                    setNotes(notes.map(note =>
                        note.id === editingNote.id ? { ...savedNote.data, content: savedNote.data.content } : note
                    ));
                    toast({
                        title: "Note updated",
                        description: "Your note has been successfully updated.",
                    });
                } else {
                    setNotes([savedNote.data, ...notes]);
                    toast({
                        title: "Note created",
                        description: "Your new note has been saved.",
                    });
                }

                setIsModalOpen(false);
                setEditingNote(null);
            } else {
                toast({
                    title: "Error",
                    description: "Failed to save note. Please try again.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.log('Error saving note:', error);
            toast({
                title: "Error",
                description: "Network error. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleLogout = () => {
        logout();
        toast({
            title: "Signed out",
            description: "You have been successfully signed out.",
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <nav>
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-end items-center">
                        <div className="flex items-center gap-4">
                            <span className="text-gray-600">Welcome, {user?.username}</span>
                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                size="sm"
                                className="text-gray-600 hover:text-gray-800"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">

                    <Button
                        onClick={handleCreateNote}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Note
                    </Button>
                </div>

                {/* Notes Grid */}
                {notes.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <Plus className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl text-gray-800 mb-2">No notes yet</h3>
                        <p className="text-gray-600 mb-6">Create your first note to get started</p>
                        <Button
                            onClick={handleCreateNote}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Create Note
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {notes.map((note) => (
                            <Card key={note.id} className="hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <CardTitle className="text-lg line-clamp-1 font-normal">{note.title}</CardTitle>
                                    <CardDescription className="text-sm text-gray-500">
                                        {new Date(note.updatedAt).toLocaleDateString()}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 line-clamp-3 mb-4">{note.content}</p>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => handleEditNote(note)}
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                        >
                                            <Edit className="w-4 h-4 mr-1" />
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() => handleDeleteNote(note.id)}
                                            variant="outline"
                                            size="sm"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Delete className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Note Modal */}
            <NoteModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingNote(null);
                }}
                onSave={handleSaveNote}
                note={editingNote}
            />
        </div>
    );
};

export default Dashboard;
