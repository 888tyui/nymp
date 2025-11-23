'use client';

import { useStore } from '@/store/useStore';
import { useEffect, useRef, useState } from 'react';
import { Eye, RefreshCw, Sparkles } from 'lucide-react';

export default function LivePreview() {
  const { files } = useStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    // Small delay to ensure files are loaded
    const timer = setTimeout(() => {
      updatePreview();
    }, 100);
    
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  const updatePreview = () => {
    if (!iframeRef.current) return;

    const htmlFile = files.find((f) => f.path.endsWith('.html') || f.path === 'index.html');
    const cssFiles = files.filter((f) => f.path.endsWith('.css'));
    const jsFiles = files.filter((f) => f.path.endsWith('.js') || f.path.endsWith('.jsx'));

    let html = htmlFile?.content || '';

    if (!html) {
      return;
    }

    // Remove external file references and replace with inline content
    // Remove link tags for CSS files
    cssFiles.forEach(cssFile => {
      const linkPattern = new RegExp(`<link[^>]*href=["']${cssFile.path}["'][^>]*>`, 'gi');
      html = html.replace(linkPattern, '');
    });

    // Remove script tags for JS/JSX files
    jsFiles.forEach(jsFile => {
      const scriptPattern = new RegExp(`<script[^>]*src=["']${jsFile.path}["'][^>]*></script>`, 'gi');
      html = html.replace(scriptPattern, '');
    });

    // Inject all CSS inline
    if (cssFiles.length > 0) {
      const combinedCSS = cssFiles.map(f => f.content).join('\n\n');
      const cssTag = `<style>${combinedCSS}</style>`;
      
      if (html.includes('</head>')) {
        html = html.replace('</head>', `${cssTag}</head>`);
      } else if (html.includes('<body>')) {
        html = html.replace('<body>', `<head>${cssTag}</head><body>`);
      } else {
        html = `<head>${cssTag}</head>${html}`;
      }
    }

    // Inject all JavaScript/JSX inline
    if (jsFiles.length > 0) {
      const jsxFiles = jsFiles.filter(f => f.path.endsWith('.jsx'));
      const regularJsFiles = jsFiles.filter(f => f.path.endsWith('.js'));

      let scriptTags = '';

      // Regular JS files
      regularJsFiles.forEach(jsFile => {
        scriptTags += `<script>\n${jsFile.content}\n</script>\n`;
      });

      // JSX files (need Babel)
      jsxFiles.forEach(jsxFile => {
        scriptTags += `<script type="text/babel">\n${jsxFile.content}\n</script>\n`;
      });

      if (html.includes('</body>')) {
        html = html.replace('</body>', `${scriptTags}</body>`);
      } else {
        html = `${html}${scriptTags}`;
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
  const showWelcome = files.length === 0 || (files.length <= 3 && files.every(f => 
    (f.content.includes('Hello, World!') || f.content.includes('Building on Monad') || f.content.length < 200)
  ));

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

