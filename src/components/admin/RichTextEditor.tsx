import { useState, useRef } from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  Undo,
  Redo
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageClick?: () => void;
  minHeight?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  onImageClick,
  minHeight = '300px'
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const insertText = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || placeholder;
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);

    onChange(newText);
    addToHistory(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const addToHistory = (newValue: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newValue);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      onChange(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      onChange(history[newIndex]);
    }
  };

  const insertLink = () => {
    const url = prompt('Entrez l\'URL :');
    if (url) {
      insertText('<a href="' + url + '" target="_blank" rel="noopener noreferrer">', '</a>', 'Texte du lien');
    }
  };

  const tools = [
    { icon: Undo, action: undo, title: 'Annuler (Ctrl+Z)', disabled: historyIndex === 0 },
    { icon: Redo, action: redo, title: 'Refaire (Ctrl+Y)', disabled: historyIndex === history.length - 1 },
    { divider: true },
    { icon: Heading2, action: () => insertText('<h2>', '</h2>', 'Titre 2'), title: 'Titre H2' },
    { icon: Heading3, action: () => insertText('<h3>', '</h3>', 'Titre 3'), title: 'Titre H3' },
    { divider: true },
    { icon: Bold, action: () => insertText('<strong>', '</strong>', 'Texte en gras'), title: 'Gras (Ctrl+B)' },
    { icon: Italic, action: () => insertText('<em>', '</em>', 'Texte en italique'), title: 'Italique (Ctrl+I)' },
    { icon: Underline, action: () => insertText('<u>', '</u>', 'Texte souligné'), title: 'Souligné' },
    { divider: true },
    { icon: List, action: () => insertText('<ul>\n  <li>', '</li>\n</ul>\n', 'Élément'), title: 'Liste non ordonnée' },
    { icon: ListOrdered, action: () => insertText('<ol>\n  <li>', '</li>\n</ol>\n', 'Élément'), title: 'Liste ordonnée' },
    { icon: Quote, action: () => insertText('<blockquote>', '</blockquote>', 'Citation'), title: 'Citation' },
    { divider: true },
    { icon: AlignLeft, action: () => insertText('<p style="text-align: left;">', '</p>', 'Texte aligné à gauche'), title: 'Aligner à gauche' },
    { icon: AlignCenter, action: () => insertText('<p style="text-align: center;">', '</p>', 'Texte centré'), title: 'Centrer' },
    { icon: AlignRight, action: () => insertText('<p style="text-align: right;">', '</p>', 'Texte aligné à droite'), title: 'Aligner à droite' },
    { divider: true },
    { icon: Link, action: insertLink, title: 'Insérer un lien' },
    { icon: Code, action: () => insertText('<code>', '</code>', 'code'), title: 'Code inline' },
  ];

  if (onImageClick) {
    tools.push({
      icon: Image,
      action: onImageClick,
      title: 'Insérer une image depuis la médiathèque'
    } as any);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          insertText('<strong>', '</strong>', 'Texte en gras');
          break;
        case 'i':
          e.preventDefault();
          insertText('<em>', '</em>', 'Texte en italique');
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
          break;
        case 'y':
          e.preventDefault();
          redo();
          break;
      }
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="bg-gray-50 border-b px-3 py-2 flex flex-wrap gap-1">
        {tools.map((tool, index) => {
          if (tool.divider) {
            return <div key={`divider-${index}`} className="w-px bg-gray-300 mx-1"></div>;
          }

          const Icon = tool.icon;
          return (
            <button
              key={index}
              type="button"
              onClick={tool.action}
              disabled={tool.disabled}
              title={tool.title}
              className="p-2 hover:bg-gray-200 rounded transition disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-gray-50"
            >
              <Icon size={18} className="text-gray-700" />
            </button>
          );
        })}
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          if (e.target.value !== history[historyIndex]) {
            addToHistory(e.target.value);
          }
        }}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        style={{ minHeight, resize: 'vertical' }}
        placeholder="Saisissez votre contenu ici..."
      />
      <div className="bg-gray-50 border-t px-4 py-2 text-xs text-gray-600">
        HTML supporté • Ctrl+B pour gras • Ctrl+I pour italique • Ctrl+Z pour annuler
      </div>
    </div>
  );
}
