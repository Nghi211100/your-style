'use client';

import React, { useState, useEffect } from 'react';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  category: string;
  image: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string | null;
  readTime?: string | null;
  published: boolean;
  createdAt: string;
}

export default function AdminCms() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'LIST' | 'FORM'>('LIST');
  
  // Form State
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Style Guide');
  const [image, setImage] = useState('');
  const [authorName, setAuthorName] = useState('Maison Editorial Staff');
  const [authorRole, setAuthorRole] = useState('Creative Editor');
  const [readTime, setReadTime] = useState('5 min read');
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3001/posts?all=true');
      if (!res.ok) throw new Error('Failed to load editorial archive.');
      const data = await res.json();
      setPosts(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Auto-generate slug from title
  useEffect(() => {
    if (!editingPostId && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
    }
  }, [title, editingPostId]);

  const handleEditClick = (post: Post) => {
    setEditingPostId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setSummary(post.summary);
    setContent(post.content);
    setCategory(post.category);
    setImage(post.image);
    setAuthorName(post.authorName);
    setAuthorRole(post.authorRole);
    setReadTime(post.readTime || '5 min read');
    setPublished(post.published);
    setActiveTab('FORM');
  };

  const handleCreateClick = () => {
    setEditingPostId(null);
    setTitle('');
    setSlug('');
    setSummary('');
    setContent('');
    setCategory('Style Guide');
    setImage('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000');
    setAuthorName('Maison Editorial Staff');
    setAuthorRole('Creative Editor');
    setReadTime('5 min read');
    setPublished(true);
    setActiveTab('FORM');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !content || !summary || !image) {
      alert('Please fill out all required editorial fields.');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        title,
        slug,
        summary,
        content,
        category,
        image,
        authorName,
        authorRole,
        readTime,
        published,
      };

      const url = editingPostId 
        ? `http://localhost:3001/posts/${editingPostId}`
        : 'http://localhost:3001/posts';
      
      const method = editingPostId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to record editorial piece.');
      
      // Refresh list and swap back to tab list
      await fetchPosts();
      setActiveTab('LIST');
    } catch (err: any) {
      alert(err.message || 'Error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you certain you wish to discard this article? This cannot be undone.')) {
      return;
    }
    try {
      const res = await fetch(`http://localhost:3001/posts/${postId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete article.');
      setPosts(posts.filter(p => p.id !== postId));
    } catch (err: any) {
      alert(err.message || 'Error occurred during deletion.');
    }
  };

  return (
    <div className="font-sans max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#C4A265]/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1A1814] uppercase">Editorial CMS</h1>
          <p className="text-sm text-[#8C7E6A] mt-1">Curate brand storytelling, haute couture catalogs, lookbooks, and seasonal inspirations.</p>
        </div>
        <div className="flex items-center gap-3">
          {activeTab === 'LIST' ? (
            <button
              onClick={handleCreateClick}
              className="bg-[#1A1814] hover:bg-[#C4A265] text-white font-bold py-2.5 px-6 rounded-lg text-sm tracking-wider uppercase transition-colors duration-300 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              <span>Draft New Article</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('LIST')}
              className="border border-[#1A1814] hover:bg-[#1A1814] hover:text-white text-[#1A1814] font-bold py-2.5 px-6 rounded-lg text-sm tracking-wider uppercase transition-colors duration-300"
            >
              <span>Back to Library</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === 'LIST' ? (
        <div className="bg-white rounded-xl border border-[#C4A265]/15 overflow-hidden shadow-whisper">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 border-2 border-[#C4A265] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-[#8C7E6A]">Opening the archive books...</span>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-700 max-w-md mx-auto">
              <span className="material-symbols-outlined text-4xl mb-2">error</span>
              <p className="font-semibold">{error}</p>
              <button onClick={fetchPosts} className="mt-4 text-xs font-bold uppercase tracking-wider text-[#C4A265] hover:underline">
                Reload Library
              </button>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 text-[#8C7E6A]">
              <span className="material-symbols-outlined text-4xl mb-2">auto_stories</span>
              <p className="text-sm font-medium">Your fashion library is currently empty.</p>
              <button onClick={handleCreateClick} className="mt-4 text-xs font-bold uppercase tracking-wider text-[#C4A265] hover:underline">
                Compose your first story
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {posts.map((post) => (
                <div key={post.id} className="group bg-[#FDFBF7] rounded-xl border border-[#C4A265]/15 overflow-hidden flex flex-col hover:border-[#C4A265]/40 hover:shadow-whisper transition-all duration-300">
                  {/* Image Header */}
                  <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-4 left-4 bg-[#1A1814]/80 text-[#C4A265] text-[9px] uppercase tracking-widest px-2.5 py-1 rounded font-bold backdrop-blur-sm">
                      {post.category}
                    </div>
                    <div className={`absolute top-4 right-4 text-[9px] uppercase tracking-widest px-2.5 py-1 rounded font-bold backdrop-blur-sm ${
                      post.published 
                        ? 'bg-emerald-950/80 text-emerald-300' 
                        : 'bg-amber-950/80 text-amber-300'
                    }`}>
                      {post.published ? 'Published' : 'Draft'}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-[10px] text-[#8C7E6A] uppercase tracking-wider font-semibold font-mono">{post.readTime || '5 min read'} • {new Date(post.createdAt).toLocaleDateString()}</span>
                      <h3 className="font-bold text-lg text-[#1A1814] mt-1 group-hover:text-[#C4A265] transition-colors line-clamp-2">{post.title}</h3>
                      <p className="text-xs text-[#8C7E6A] mt-2 line-clamp-3 leading-relaxed">{post.summary}</p>
                    </div>

                    {/* Author + Actions footer */}
                    <div className="border-t border-[#C4A265]/10 pt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#C4A265]/20 flex items-center justify-center text-[#C4A265] font-bold text-xs uppercase">
                          {post.authorName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-[#1A1814]">{post.authorName}</div>
                          <div className="text-[9px] text-[#8C7E6A] uppercase tracking-wider">{post.authorRole}</div>
                        </div>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditClick(post)}
                          className="p-1.5 rounded border border-[#C4A265]/20 text-[#1A1814] hover:bg-[#C4A265]/10 transition-all"
                          title="Edit Editorial"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-1.5 rounded border border-red-200 text-red-500 hover:bg-red-50 transition-all"
                          title="Delete Article"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* EDIT / CREATE FORM */
        <form onSubmit={handleSave} className="bg-white rounded-xl border border-[#C4A265]/15 p-8 max-w-4xl mx-auto shadow-whisper space-y-6">
          <h2 className="text-xl font-bold uppercase tracking-wider text-[#1A1814] border-b border-[#C4A265]/10 pb-3">
            {editingPostId ? 'Refine Editorial Piece' : 'Compose Brand Narrative'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#C4A265] mb-2">Article Headline *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Quiet Luxury Revolution: Autumn Editorial"
                className="w-full bg-[#FDFBF7] border border-[#C4A265]/20 focus:border-[#C4A265] rounded-lg py-3 px-4 text-[#1A1814] placeholder-[#8C7E6A] text-sm outline-none transition-all"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#C4A265] mb-2">Editorial URL Slug *</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. quiet-luxury-autumn-editorial"
                className="w-full bg-[#FDFBF7] border border-[#C4A265]/20 focus:border-[#C4A265] rounded-lg py-3 px-4 text-[#1A1814] placeholder-[#8C7E6A] text-sm outline-none transition-all"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#C4A265] mb-2">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#FDFBF7] border border-[#C4A265]/20 focus:border-[#C4A265] rounded-lg py-3 px-4 text-[#1A1814] text-sm outline-none transition-all"
              >
                <option value="Style Guide">Style Guide</option>
                <option value="Trends">Trends</option>
                <option value="Behind the Scenes">Behind the Scenes</option>
                <option value="Lookbook">Lookbook</option>
              </select>
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#C4A265] mb-2">Featured Image URL *</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="e.g. https://images.unsplash.com/photo-..."
                className="w-full bg-[#FDFBF7] border border-[#C4A265]/20 focus:border-[#C4A265] rounded-lg py-3 px-4 text-[#1A1814] placeholder-[#8C7E6A] text-sm outline-none transition-all"
                required
              />
            </div>

            {/* Summary */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#C4A265] mb-2">Short Summary *</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Provide a glamorous 2-3 sentence overview that hooks the reader on lists..."
                rows={3}
                className="w-full bg-[#FDFBF7] border border-[#C4A265]/20 focus:border-[#C4A265] rounded-lg py-3 px-4 text-[#1A1814] placeholder-[#8C7E6A] text-sm outline-none transition-all resize-none"
                required
              />
            </div>

            {/* Content */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#C4A265] mb-2">Article Body (Markdown or Rich Text) *</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Begin composing your fashion essay..."
                rows={10}
                className="w-full bg-[#FDFBF7] border border-[#C4A265]/20 focus:border-[#C4A265] rounded-lg py-3 px-4 text-[#1A1814] placeholder-[#8C7E6A] text-sm outline-none transition-all font-mono"
                required
              />
            </div>

            {/* Author Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#C4A265] mb-2">Author Name *</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full bg-[#FDFBF7] border border-[#C4A265]/20 focus:border-[#C4A265] rounded-lg py-3 px-4 text-[#1A1814] text-sm outline-none transition-all"
                required
              />
            </div>

            {/* Author Role */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#C4A265] mb-2">Author Editorial Title *</label>
              <input
                type="text"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                className="w-full bg-[#FDFBF7] border border-[#C4A265]/20 focus:border-[#C4A265] rounded-lg py-3 px-4 text-[#1A1814] text-sm outline-none transition-all"
                required
              />
            </div>

            {/* Read Time */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#C4A265] mb-2">Estimated Read Time</label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="e.g. 5 min read"
                className="w-full bg-[#FDFBF7] border border-[#C4A265]/20 focus:border-[#C4A265] rounded-lg py-3 px-4 text-[#1A1814] text-sm outline-none transition-all"
              />
            </div>

            {/* Publish Toggle */}
            <div className="flex items-center gap-3 self-center mt-3">
              <input
                type="checkbox"
                id="publish-toggle"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-5 h-5 rounded border-[#C4A265]/30 accent-[#C4A265]"
              />
              <label htmlFor="publish-toggle" className="text-xs font-bold uppercase tracking-wider text-[#1A1814] cursor-pointer">
                Publish immediately to storefront
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 border-t border-[#C4A265]/10 pt-6">
            <button
              type="button"
              onClick={() => setActiveTab('LIST')}
              className="px-6 py-3 border border-[#C4A265]/35 hover:bg-gray-50 text-[#1A1814] font-semibold rounded-lg text-sm transition-colors duration-200"
            >
              Cancel Draft
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-[#C4A265] hover:bg-[#B39154] text-[#1A1814] font-bold py-3 px-8 rounded-lg text-sm tracking-wider uppercase transition-colors duration-300 flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#1A1814] border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">save</span>
                  <span>Commit Editorial</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
