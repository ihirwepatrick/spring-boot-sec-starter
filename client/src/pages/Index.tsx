import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, FileText, Notebook } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

const Index = () => {
    const { token } = useAuth()
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            navigate("/dashboard")
        }
    }, [token])

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center max-w-4xl mx-auto">
                    <div className="flex justify-center mb-8">
                        <div className="bg-foreground p-4 rounded-full">
                            <Notebook className="w-12 h-12 text-white" />
                        </div>
                    </div>

                    <h1 className="text-5xl text-gray-800 mb-6">
                        Notebook
                    </h1>

                    <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                        Keep your thoughts and ideas safe with our encrypted note-taking app.
                        Simple, secure, and accessible from anywhere.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                        <Link to="/login">
                            <Button size="lg" className='rounded-full'>
                                Sign In
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button size="lg" variant="outline" className='rounded-full'>
                                Get Started
                            </Button>
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                            <Lock className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                            <h3 className="text-gray-800 mb-2">Secure</h3>
                            <p className="text-gray-600 text-sm">Your notes are encrypted and protected</p>
                        </div>

                        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                            <FileText className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                            <h3 className="text-gray-800 mb-2">Simple</h3>
                            <p className="text-gray-600 text-sm">Clean interface for distraction-free writing</p>
                        </div>

                        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                            <Shield className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                            <h3 className="text-gray-800 mb-2">Private</h3>
                            <p className="text-gray-600 text-sm">Only you have access to your notes</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;
