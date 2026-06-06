import { useEffect, useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle, Phone, Mail } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { supabase } from '../lib/supabase';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  display_order: number;
}

interface FAQByCategory {
  [category: string]: FAQItem[];
}

export default function FAQ() {
  const [faqItems, setFaqItems] = useState<FAQByCategory>({});
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFAQ();
  }, []);

  const fetchFAQ = async () => {
    try {
      const { data, error } = await supabase
        .from('faq')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true });

      if (error) throw error;

      const groupedFAQ: FAQByCategory = {};
      data?.forEach((item) => {
        const category = item.category || 'Général';
        if (!groupedFAQ[category]) {
          groupedFAQ[category] = [];
        }
        groupedFAQ[category].push(item);
      });

      setFaqItems(groupedFAQ);
    } catch (error) {
      console.error('Erreur lors du chargement de la FAQ:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": Object.values(faqItems).flat().map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-slate-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Questions Fréquentes - Taxi Conventionné Paris"
        description="Retrouvez toutes les réponses à vos questions sur nos services de taxi conventionné et VSL en Île-de-France. Transport médical, tarifs, réservation et plus."
        keywords="faq taxi conventionné, questions taxi, transport médical paris, remboursement sécurité sociale"
        canonical="https://www.taxisparis-conventionnes.fr/faq"
        jsonLD={schemaData}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)'
          }}></div>

          <div className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h1 className="text-5xl font-bold mb-6 tracking-tight">
                Questions Fréquentes
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                Trouvez rapidement toutes les réponses à vos questions sur nos services de taxi conventionné et VSL en Île-de-France
              </p>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          {Object.keys(faqItems).length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-6">
                <HelpCircle className="w-10 h-10 text-slate-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Aucune question disponible
              </h2>
              <p className="text-slate-600">
                Les questions fréquentes seront bientôt disponibles.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(faqItems).map(([category, items], categoryIndex) => (
                <div
                  key={category}
                  className="animate-fade-in"
                  style={{ animationDelay: `${categoryIndex * 100}ms` }}
                >
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-slate-900 flex items-center">
                      <span className="w-1.5 h-8 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-full mr-4"></span>
                      {category}
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div
                        key={item.id}
                        className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200 overflow-hidden"
                        style={{ animationDelay: `${(categoryIndex * 100) + (index * 50)}ms` }}
                      >
                        <button
                          onClick={() => toggleItem(item.id)}
                          className="w-full px-6 py-5 text-left flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors duration-200"
                          aria-expanded={openItems[item.id]}
                        >
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-900 leading-relaxed group-hover:text-blue-600 transition-colors duration-200">
                              {item.question}
                            </h3>
                          </div>
                          <div className={`flex-shrink-0 mt-1 transform transition-transform duration-300 ${openItems[item.id] ? 'rotate-180' : ''}`}>
                            <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
                          </div>
                        </button>

                        <div
                          className={`transition-all duration-300 ease-in-out ${
                            openItems[item.id] ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <div className="px-6 pb-6 pt-2">
                            <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full mb-4"></div>
                            <div
                              className="prose prose-slate max-w-none text-slate-700 leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: item.answer }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-xl overflow-hidden">
            <div className="relative px-8 py-12 sm:px-12 sm:py-16">
              <div className="absolute inset-0 bg-black opacity-5"></div>
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)'
              }}></div>

              <div className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>

                <h2 className="text-3xl font-bold text-white mb-4">
                  Vous ne trouvez pas votre réponse ?
                </h2>
                <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Notre équipe est disponible 24/7 pour répondre à toutes vos questions et vous accompagner dans vos démarches
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a
                    href="/contact/"
                    className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Mail className="w-5 h-5" />
                    Contactez-nous
                  </a>

                  <a
                    href="tel:+33123456789"
                    className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-200 border-2 border-white/30"
                  >
                    <Phone className="w-5 h-5" />
                    Appelez-nous
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }

        .prose a {
          color: #2563eb;
          text-decoration: underline;
        }

        .prose a:hover {
          color: #1d4ed8;
        }

        .prose p {
          margin-bottom: 1em;
        }

        .prose ul, .prose ol {
          margin-left: 1.5em;
          margin-bottom: 1em;
        }

        .prose li {
          margin-bottom: 0.5em;
        }

        .prose strong {
          font-weight: 600;
          color: #1e293b;
        }
      `}</style>
    </>
  );
}
