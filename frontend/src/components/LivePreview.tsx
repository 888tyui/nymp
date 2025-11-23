'use client';

import { useStore } from '@/store/useStore';
import { useEffect, useRef, useState } from 'react';
import { Eye, RefreshCw, Sparkles } from 'lucide-react';

export default function LivePreview() {
  const { files } = useStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    updatePreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  const updatePreview = () => {
    if (!iframeRef.current) return;

    const htmlFile = files.find((f) => f.path.endsWith('.html'));
    const cssFile = files.find((f) => f.path.endsWith('.css'));
    const jsFile = files.find((f) => f.path.endsWith('.js'));

    // Check if files have meaningful content (not just default templates)
    const hasContent = htmlFile && htmlFile.content.length > 200;

    let html = htmlFile?.content || '';

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

  // Check if we should show the welcome screen
  const showWelcome = files.length <= 3 && files.every(f => 
    (f.content.includes('Hello, World!') || f.content.length < 200)
  );

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

      <div className="flex-1 overflow-hidden relative">
        {showWelcome ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0E091C] via-[#1a0f2e] to-[#0E091C]">
            <div className="text-center px-8 max-w-2xl">
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <Sparkles size={64} className="text-primary animate-pulse" />
                  <div className="absolute inset-0 blur-xl bg-primary opacity-30"></div>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Build on Monad?
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                Start building your Web3 app by chatting with the Builder Agent!
              </p>
              <div className="bg-black/50 border border-gray-800 rounded-lg p-6 backdrop-blur-sm">
                <p className="text-sm text-gray-400 mb-4">Try asking:</p>
                <div className="space-y-2 text-left">
                  <div className="flex items-start space-x-2">
                    <span className="text-primary">▸</span>
                    <span className="text-gray-300">&ldquo;Create a wallet dashboard with MON balance display&rdquo;</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-primary">▸</span>
                    <span className="text-gray-300">&ldquo;Build a token swap interface for Monad&rdquo;</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-primary">▸</span>
                    <span className="text-gray-300">&ldquo;Design an NFT gallery with filtering and search&rdquo;</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-6">
                Your live Web3 preview will appear here once you start building
              </p>
            </div>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
            title="Live Preview"
          />
        )}
      </div>
    </div>
  );
}

