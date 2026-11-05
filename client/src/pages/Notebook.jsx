import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Save, Edit2, Search, Tag, Calendar, Download, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Alert from '../components/Alert';

const Notebook = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteTags, setNoteTags] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('studyfusion_notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('studyfusion_notes', JSON.stringify(notes));
    }
  }, [notes]);

  const createNewNote = () => {
    setCurrentNote(null);
    setNoteTitle('');
    setNoteContent('');
    setNoteTags('');
    setIsEditing(true);
  };

  const saveNote = () => {
    if (!noteTitle.trim()) {
      alert('Please add a title to your note');
      return;
    }

    const note = {
      id: currentNote ? currentNote.id : Date.now(),
      title: noteTitle,
      content: noteContent,
      tags: noteTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdAt: currentNote ? currentNote.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (currentNote) {
      // Update existing note
      setNotes(notes.map(n => n.id === currentNote.id ? note : n));
    } else {
      // Add new note
      setNotes([note, ...notes]);
    }

    setCurrentNote(note);
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const deleteNote = (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(n => n.id !== id));
      if (currentNote && currentNote.id === id) {
        setCurrentNote(null);
        setNoteTitle('');
        setNoteContent('');
        setNoteTags('');
      }
    }
  };

  const openNote = (note) => {
    setCurrentNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteTags(note.tags.join(', '));
    setIsEditing(false);
  };

  const editNote = () => {
    setIsEditing(true);
  };

  const cancelEdit = () => {
    if (currentNote) {
      setNoteTitle(currentNote.title);
      setNoteContent(currentNote.content);
      setNoteTags(currentNote.tags.join(', '));
      setIsEditing(false);
    } else {
      setNoteTitle('');
      setNoteContent('');
      setNoteTags('');
      setIsEditing(false);
    }
  };

  const exportNote = (note) => {
    const text = `${note.title}\n\n${note.content}\n\nTags: ${note.tags.join(', ')}\nCreated: ${new Date(note.createdAt).toLocaleString()}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.replace(/[^a-z0-9]/gi, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getAllTags = () => {
    const tagSet = new Set();
    notes.forEach(note => {
      note.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !filterTag || note.tags.includes(filterTag);
    return matchesSearch && matchesTag;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900/10 to-slate-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-slate-400 hover:text-slate-200 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <BookOpen className="w-8 h-8 text-indigo-400" />
            <h1 className="text-4xl font-bold">Study Notebook</h1>
          </div>
          <p className="text-slate-400">
            Create, organize, and manage your study notes with tags and search.
          </p>
        </div>

        {showSuccess && (
          <div className="mb-4">
            <Alert type="success" message="Note saved successfully!" />
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar - Notes List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">My Notes</h3>
                <button
                  onClick={createNewNote}
                  className="flex items-center space-x-1 px-3 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-sm transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>New</span>
                </button>
              </div>

              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search notes..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Tag Filter */}
              {getAllTags().length > 0 && (
                <div className="mb-4">
                  <label className="block text-xs text-slate-400 mb-2">Filter by tag:</label>
                  <select
                    value={filterTag}
                    onChange={(e) => setFilterTag(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">All tags</option>
                    {getAllTags().map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Notes List */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {filteredNotes.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    {notes.length === 0 ? (
                      <p className="text-sm">No notes yet.<br />Create your first note!</p>
                    ) : (
                      <p className="text-sm">No notes match your search.</p>
                    )}
                  </div>
                ) : (
                  filteredNotes.map(note => (
                    <div
                      key={note.id}
                      onClick={() => openNote(note)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        currentNote && currentNote.id === note.id
                          ? 'bg-indigo-900/30 border-indigo-500'
                          : 'bg-slate-900/30 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">{note.title}</h4>
                          <p className="text-xs text-slate-400 mt-1">
                            {formatDate(note.updatedAt)}
                          </p>
                          {note.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {note.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="text-xs px-2 py-1 bg-indigo-900/30 text-indigo-300 rounded">
                                  {tag}
                                </span>
                              ))}
                              {note.tags.length > 2 && (
                                <span className="text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded">
                                  +{note.tags.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNote(note.id);
                          }}
                          className="ml-2 p-1 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-3 text-slate-400">Statistics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Notes:</span>
                  <span className="font-semibold">{notes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Tags:</span>
                  <span className="font-semibold">{getAllTags().length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main - Note Editor/Viewer */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
              {isEditing || currentNote === null ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-indigo-400">
                      {currentNote ? 'Edit Note' : 'New Note'}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {currentNote && (
                        <button
                          onClick={cancelEdit}
                          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={saveNote}
                        className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-sm transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input
                      type="text"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      placeholder="Enter note title..."
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Content</label>
                    <textarea
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="Write your notes here..."
                      rows={16}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    />
                    <p className="text-xs text-slate-500 mt-1">{noteContent.length} characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center space-x-2">
                      <Tag className="w-4 h-4" />
                      <span>Tags (comma-separated)</span>
                    </label>
                    <input
                      type="text"
                      value={noteTags}
                      onChange={(e) => setNoteTags(e.target.value)}
                      placeholder="e.g., mathematics, algebra, exam-prep"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ) : currentNote ? (
                // View Mode
                <div className="space-y-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2">{currentNote.title}</h2>
                      <div className="flex items-center space-x-4 text-xs text-slate-400">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>Created: {formatDate(currentNote.createdAt)}</span>
                        </span>
                        <span>Updated: {formatDate(currentNote.updatedAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => exportNote(currentNote)}
                        className="p-2 text-slate-400 hover:text-slate-200 transition-colors"
                        title="Export note"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        onClick={editNote}
                        className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-sm transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>

                  {currentNote.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {currentNote.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-indigo-900/30 text-indigo-300 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="prose prose-invert max-w-none">
                    <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                      <pre className="whitespace-pre-wrap font-sans text-slate-200">{currentNote.content}</pre>
                    </div>
                  </div>
                </div>
              ) : (
                // Empty State
                <div className="text-center py-20">
                  <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No note selected</h3>
                  <p className="text-slate-400 mb-6">Select a note from the list or create a new one</p>
                  <button
                    onClick={createNewNote}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Create New Note</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notebook;
