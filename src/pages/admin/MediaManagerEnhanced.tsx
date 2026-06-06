import { useEffect, useState } from 'react';
import { Trash2, Copy, ExternalLink, Search, Filter, Grid, List, Image as ImageIcon, Download, CheckSquare, Square } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import DragDropUpload from '../../components/admin/DragDropUpload';
import LoadingSkeleton from '../../components/admin/LoadingSkeleton';
import Pagination from '../../components/admin/Pagination';
import { useToast } from '../../hooks/useToast';
import { supabase } from '../../lib/supabase';

interface Media {
  id: string;
  filename: string;
  url: string;
  mime_type: string;
  size: number;
  created_at: string;
}

export default function MediaManagerEnhanced() {
  const [media, setMedia] = useState<Media[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'pdf'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const toast = useToast();

  useEffect(() => {
    fetchMedia();
  }, []);

  useEffect(() => {
    let filtered = [...media];

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.filename.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(item => {
        if (filterType === 'image') return item.mime_type.startsWith('image/');
        if (filterType === 'video') return item.mime_type.startsWith('video/');
        if (filterType === 'pdf') return item.mime_type === 'application/pdf';
        return true;
      });
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortBy === 'name') {
        comparison = a.filename.localeCompare(b.filename);
      } else if (sortBy === 'size') {
        comparison = a.size - b.size;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredMedia(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterType, sortBy, sortOrder, media]);

  const paginatedMedia = filteredMedia.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredMedia.length / itemsPerPage);

  const fetchMedia = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setMedia(data);
      setFilteredMedia(data);
    }
    setLoading(false);
  };

  const uploadFiles = async (files: File[]) => {
    setUploading(true);
    let successCount = 0;
    let errorCount = 0;

    for (const file of files) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(fileName);

        await supabase.from('media').insert([{
          filename: file.name,
          url: publicUrl,
          mime_type: file.type,
          size: file.size,
        }]);

        successCount++;
      } catch (error) {
        console.error('Error uploading file:', error);
        errorCount++;
      }
    }

    setUploading(false);
    setShowUploadForm(false);

    if (successCount > 0) {
      toast.success(`${successCount} fichier(s) uploadé(s) avec succès`);
      fetchMedia();
    }

    if (errorCount > 0) {
      toast.error(`${errorCount} fichier(s) n'ont pas pu être uploadés`);
    }
  };

  const deleteMedia = async (id: string) => {
    if (!confirm('Supprimer ce fichier ?')) return;

    const { error } = await supabase.from('media').delete().eq('id', id);

    if (error) {
      toast.error('Erreur lors de la suppression');
    } else {
      toast.success('Fichier supprimé');
      fetchMedia();
    }
  };

  const deleteBulk = async () => {
    if (selectedMedia.size === 0) return;
    if (!confirm(`Supprimer ${selectedMedia.size} fichier(s) ?`)) return;

    const ids = Array.from(selectedMedia);
    const { error } = await supabase.from('media').delete().in('id', ids);

    if (error) {
      toast.error('Erreur lors de la suppression');
    } else {
      toast.success(`${selectedMedia.size} fichier(s) supprimé(s)`);
      setSelectedMedia(new Set());
      fetchMedia();
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedMedia);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedMedia(newSelected);
  };

  const selectAll = () => {
    if (selectedMedia.size === paginatedMedia.length) {
      setSelectedMedia(new Set());
    } else {
      setSelectedMedia(new Set(paginatedMedia.map(m => m.id)));
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copiée dans le presse-papier');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return 'N/A';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <AdminLayout>
      <toast.ToastContainer />
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestionnaire de médias</h1>
            <p className="text-gray-600 mt-2">
              {filteredMedia.length} fichier{filteredMedia.length > 1 ? 's' : ''}
              {selectedMedia.size > 0 && ` • ${selectedMedia.size} sélectionné${selectedMedia.size > 1 ? 's' : ''}`}
            </p>
          </div>
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <ImageIcon size={20} />
            Ajouter des fichiers
          </button>
        </div>

        {showUploadForm && (
          <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Uploader de nouveaux fichiers
            </h2>
            <DragDropUpload
              onFilesSelected={(files) => {
                if (!uploading) {
                  uploadFiles(files);
                }
              }}
            />
            {uploading && (
              <div className="mt-4 text-center text-gray-600">
                Upload en cours...
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par nom..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">Tous les types</option>
                <option value="image">Images</option>
                <option value="video">Vidéos</option>
                <option value="pdf">PDF</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="date">Date</option>
                <option value="name">Nom</option>
                <option value="size">Taille</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>

              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : 'text-gray-600'}`}
                  title="Vue grille"
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : 'text-gray-600'}`}
                  title="Vue liste"
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {selectedMedia.size > 0 && (
            <div className="mt-4 flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <button
                onClick={selectAll}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                {selectedMedia.size === paginatedMedia.length ? 'Tout désélectionner' : 'Tout sélectionner'}
              </button>
              <button
                onClick={deleteBulk}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
              >
                <Trash2 size={16} />
                Supprimer ({selectedMedia.size})
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-6">
              <LoadingSkeleton type={viewMode === 'grid' ? 'card' : 'list'} count={itemsPerPage} />
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <ImageIcon className="mx-auto mb-4 text-gray-400" size={48} />
              <p>{searchTerm ? 'Aucun résultat pour votre recherche.' : 'Aucun média. Ajoutez votre première image.'}</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
              {paginatedMedia.map((item) => (
                <div
                  key={item.id}
                  className={`border rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer ${
                    selectedMedia.has(item.id) ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => toggleSelect(item.id)}
                >
                  <div className="aspect-video bg-gray-100 relative group">
                    <img
                      src={item.url}
                      alt={item.filename}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+Error';
                      }}
                    />
                    <div className="absolute top-2 left-2">
                      {selectedMedia.has(item.id) ? (
                        <CheckSquare className="text-blue-600" size={24} fill="white" />
                      ) : (
                        <Square className="text-white opacity-70 hover:opacity-100" size={24} />
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-medium text-gray-800 truncate mb-2">{item.filename}</p>
                    <p className="text-xs text-gray-500 mb-3">
                      {formatFileSize(item.size)} • {new Date(item.created_at).toLocaleDateString('fr-FR')}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(item.url);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                      >
                        <Copy size={16} />
                        Copier
                      </button>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                      >
                        <ExternalLink size={16} />
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMedia(item.id);
                        }}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y">
              {paginatedMedia.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 hover:bg-gray-50 transition flex items-center gap-4 cursor-pointer ${
                    selectedMedia.has(item.id) ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => toggleSelect(item.id)}
                >
                  <div className="flex-shrink-0">
                    {selectedMedia.has(item.id) ? (
                      <CheckSquare className="text-blue-600" size={20} />
                    ) : (
                      <Square className="text-gray-400" size={20} />
                    )}
                  </div>
                  <img
                    src={item.url}
                    alt={item.filename}
                    className="w-24 h-24 object-cover rounded-lg border"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/100x100?text=Error';
                    }}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 mb-1">{item.filename}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(item.size)} • {new Date(item.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(item.url);
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                    >
                      <Copy size={16} />
                      Copier
                    </button>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                    >
                      <ExternalLink size={16} />
                    </a>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMedia(item.id);
                      }}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredMedia.length}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
