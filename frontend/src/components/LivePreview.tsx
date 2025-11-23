'use client';

import { useStore } from '@/store/useStore';
import { useEffect, useRef, useState } from 'react';
import { Eye, RefreshCw } from 'lucide-react';

export default function LivePreview() {
  const { files } = useStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    updatePreview();
  }, [files]);

  const updatePreview = () => {
    if (!iframeRef.current) return;

    const htmlFile = files.find((f) => f.path.endsWith('.html'));
    const cssFile = files.find((f) => f.path.endsWith('.css'));
    const jsFile = files.find((f) => f.path.endsWith('.js'));

    let html = htmlFile?.content || '<h1>No HTML file found</h1>';

    // Inject CSS
    if (cssFile) {
      const cssTag = `<style>${cssFile.content}</style>`;
      if (html.includes('</head>')) {
        html = html.replace('</head>', `${cssTag}</head>`);
      } else if (html.includes('<body>')) {
        html = html.replace('<body>', `<head>${cssTag}</head><body>`);
      } else {
        html = `<head>${cssTag}</head>${html}`;
      }
    }

    // Inject JavaScript
    if (jsFile) {
      const jsTag = `<script>${jsFile.content}</script>`;
      if (html.includes('</body>')) {
        html = html.replace('</body>', `${jsTag}</body>`);
      } else {
        html = `${html}${jsTag}`;
      }
    }

    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(html);
      iframeDoc.close();
    }

    setLastUpdate(Date.now());
  };

  const handleRefresh = () => {
    updatePreview();
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="h-12 bg-black border-b border-gray-800 flex items-center justify-between px-4">
        <div className="flex items-center space-x-2 text-gray-300">
          <Eye size={18} />
          <span className="text-sm">Live Preview</span>
        </div>
        <button
          onClick={handleRefresh}
          className="text-primary hover:text-purple-400 transition-colors"
          title="Refresh Preview"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <iframe
          ref={iframeRef}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin"
          title="Live Preview"
        />
      </div>
    </div>
  );
}

