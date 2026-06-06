import { useState, useEffect } from 'react';
import { X, Search, Upload, Image as ImageIcon, Check, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { resizeImage, getImageInfo } from '../../utils/imageResize';

interface Media {
  id: string;
  filename: string;
  url: string;
  mime_type: string;
  size: number;
  created_at: string;
}

interface MediaPickerProps {
  onSelect: (url: string) => void;
  onClose: () => void;
  logoMode?: boolean;
}

export default function MediaPicker({ onSelect, onClose, logoMode = false }: MediaPickerProps) {
  const [media, setMedia] = useState<Media[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUrl, setSelectedUrl] = useState<string>('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageInfo, setImageInfo] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredMedia(
        media.filter(item =>
          item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.url.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredMedia(media);
    }
  }, [searchTerm, media]);

  const fetchMedia = async () => {
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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      if (logoMode && file.type.startsWith('image/')) {
        try {
          const info = await getImageInfo(file);
          setImageInfo(info);
        } catch (error) {
          console.error('Error getting image info:', error);
          setImageInfo(null);
        }
      }
    }
  };

  const uploadFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);

    try {
      let fileToUpload = selectedFile;
      let finalSize = selectedFile.size;

      if (logoMode && selectedFile.type.startsWith('image/')) {
        const resized = await resizeImage(selectedFile, {
          maxHeight: 100,
          maxWidth: 500,
          quality: 0.9,
          maintainAspectRatio: true,
        });

        console.log(`Image redimensionnée: ${resized.width}x${resized.height}px`);
        console.log(`Taille originale: ${(resized.originalSize / 1024).toFixed(2)}KB → Nouvelle taille: ${(resized.newSize / 1024).toFixed(2)}KB`);

        const ext = selectedFile.type === 'image/png' ? 'png' : 'jpg';
        fileToUpload = new File([resized.blob], `${selectedFile.name.split('.')[0]}.${ext}`, {
          type: resized.blob.type,
        });
        finalSize = resized.blob.size;
      }

      const fileExt = fileToUpload.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log('Début upload du fichier:', fileName, 'Taille:', finalSize);

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('media')
        .upload(filePath, fileToUpload, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Erreur upload Storage:', uploadError);
        throw new Error(`Erreur upload: ${uploadError.message}`);
      }

      console.log('Upload réussi:', uploadData);

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      console.log('Public URL:', publicUrl);

      const { data: insertData, error: insertError } = await supabase.from('media').insert([{
        filename: selectedFile.name,
        url: publicUrl,
        mime_type: fileToUpload.type,
        size: finalSize,
      }]).select();

      if (insertError) {
        console.error('Erreur insertion media:', insertError);
        throw insertError;
      }

      console.log('Media inséré:', insertData);

      setSelectedFile(null);
      setImageInfo(null);
      setShowUpload(false);
      setSelectedUrl(publicUrl);
      await fetchMedia();
      alert(logoMode
        ? `Image optimisée et uploadée avec succès!\n\nURL: ${publicUrl}\n\nCliquez sur l'image dans la galerie puis sur "Insérer le média".`
        : `Fichier uploadé avec succès!\n\nURL: ${publicUrl}\n\nCliquez sur l'image dans la galerie puis sur "Insérer le média".`);
    } catch (error) {
      console.error('Error uploading file:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      alert(`Erreur lors de l'upload du fichier:\n\n${errorMessage}\n\nVérifiez la console (F12) pour plus de détails.`);
    } finally {
      setUploading(false);
    }
  };

  const handleUploadUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaUrl.trim()) return;

    try {
      const filename = newMediaUrl.split('/').pop() || 'image';
      await supabase.from('media').insert([{
        filename,
        url: newMediaUrl,
        mime_type: 'image',
        size: 0,
      }]);

      setSelectedUrl(newMediaUrl);
      setNewMediaUrl('');
      setShowUpload(false);
      await fetchMedia();
      alert('Média ajouté avec succès! Cliquez sur "Insérer le média" pour l\'ajouter.');
    } catch (error) {
      console.error('Error adding media:', error);
      alert('Erreur lors de l\'ajout du média');
    }
  };

  const handleSelect = () => {
    if (selectedUrl) {
      onSelect(selectedUrl);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <ImageIcon size={28} />
              Sélectionner un média
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {filteredMedia.length} fichier{filteredMedia.length > 1 ? 's' : ''} disponible{filteredMedia.length > 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 border-b bg-gray-50">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un média..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
            >
              <Upload size={18} />
              Ajouter
            </button>
          </div>

          {showUpload && (
            <div className="mt-4 p-4 bg-white border rounded-lg space-y-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setUploadMode('file')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                    uploadMode === 'file'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📁 Upload fichier
                </button>
                <button
                  onClick={() => setUploadMode('url')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                    uploadMode === 'url'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🔗 URL externe
                </button>
              </div>

              {uploadMode === 'file' ? (
                <form onSubmit={uploadFile}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sélectionner un fichier
                  </label>
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept="image/*,video/*,application/pdf"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-3"
                    required
                  />
                  {selectedFile && (
                    <div className="mb-3 space-y-2">
                      <div className="p-2 bg-green-50 border border-green-200 rounded text-sm text-gray-700">
                        <strong>Fichier:</strong> {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                      </div>
                      {logoMode && imageInfo && (
                        <div className={`p-2 border rounded text-sm ${
                          imageInfo.height <= 100
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                        }`}>
                          <div className="flex items-start gap-2">
                            {imageInfo.height <= 100 ? (
                              <Check size={16} className="mt-0.5 flex-shrink-0" />
                            ) : (
                              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                            )}
                            <div>
                              <p><strong>Dimensions:</strong> {imageInfo.width}x{imageInfo.height}px</p>
                              {imageInfo.height > 100 && (
                                <p className="text-xs mt-1">
                                  ⚠️ L'image sera automatiquement redimensionnée à 100px de hauteur lors de l'upload
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={!selectedFile || uploading}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {uploading ? 'Upload...' : 'Uploader'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowUpload(false);
                        setSelectedFile(null);
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleUploadUrl}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL du média
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={newMediaUrl}
                      onChange={(e) => setNewMediaUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Ajouter
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Chargement...</div>
          ) : filteredMedia.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ImageIcon className="mx-auto mb-4 text-gray-400" size={48} />
              <p>{searchTerm ? 'Aucun résultat pour votre recherche.' : 'Aucun média disponible.'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedUrl(item.url)}
                  className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                    selectedUrl === item.url
                      ? 'border-blue-600 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-blue-400 hover:shadow-md'
                  }`}
                >
                  <div className="aspect-square bg-gray-100 relative">
                    <img
                      src={item.url}
                      alt={item.filename}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/200x200?text=Error';
                      }}
                    />
                    {selectedUrl === item.url && (
                      <div className="absolute inset-0 bg-blue-600 bg-opacity-30 flex items-center justify-center">
                        <div className="bg-white rounded-full p-2">
                          <Check className="text-blue-600" size={24} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-2 bg-white">
                    <p className="text-xs text-gray-600 truncate">{item.filename}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
          <div>
            {selectedUrl && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Sélectionné:</span> {selectedUrl.substring(0, 50)}...
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Annuler
            </button>
            <button
              onClick={handleSelect}
              disabled={!selectedUrl}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Insérer le média
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
