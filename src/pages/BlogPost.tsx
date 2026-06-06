import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Share2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SEOHead from '../components/SEOHead';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string;
  published_at: string;
  meta_description: string;
  meta_keywords: string;
}

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();

    if (data) {
      setPost(data);
    }
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Chargement de l'article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Article introuvable</h1>
          <p className="text-gray-600 mb-8">Cet article n'existe pas ou n'est plus disponible.</p>
          <button
            onClick={() => navigate('/blog/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Retour au blog
          </button>
        </div>
      </div>
    );
  }

  const keywords = post.meta_keywords ? post.meta_keywords.split(',').map(k => k.trim()) : [];

  return (
    <>
      <SEOHead
        title={post.title}
        description={post.meta_description || post.excerpt}
        keywords={keywords}
      />
      <article className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <button
            onClick={() => navigate('/blog/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-8 transition"
          >
            <ArrowLeft size={20} />
            Retour au blog
          </button>

          {post.featured_image_url && (
            <div className="w-full h-96 rounded-2xl overflow-hidden mb-8 shadow-xl">
              <img
                src={post.featured_image_url}
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{formatDate(post.published_at)}</span>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 hover:text-blue-600 transition"
              >
                <Share2 size={16} />
                <span>Partager</span>
              </button>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl text-gray-600 mb-8 leading-relaxed border-l-4 border-blue-600 pl-6 italic">
                {post.excerpt}
              </p>
            )}

            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
              style={{
                lineHeight: '1.8',
                fontSize: '1.125rem',
              }}
            />
          </div>

          <div className="mt-12 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Besoin d'un transport ?
            </h2>
            <p className="text-blue-100 mb-6">
              Réservez votre taxi ou VSL conventionné en quelques clics
            </p>
            <button
              onClick={() => navigate('/reservation-taxi-vsl/')}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Réserver maintenant
            </button>
          </div>
        </div>
      </article>
    </>
  );
}
