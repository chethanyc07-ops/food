import Document, { Html, Head, Main, NextScript } from 'next/document';

const themeScript = `
  (function() {
    try {
      var savedTheme = localStorage.getItem('foodpack_theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  })();
`;

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link
            href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
            rel="stylesheet"
          />

          {/* Compiled static stylesheet */}
          <link rel="stylesheet" href="/index.css" />

          {/* Tailwind CSS CDN fallback */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.tailwind = {
                  darkMode: 'class',
                  theme: {
                    extend: {
                      colors: {
                        mofpi: {
                          50: '#ecfdf5',
                          100: '#d1fae5',
                          200: '#a7f3d0',
                          300: '#6ee7b7',
                          400: '#34d399',
                          500: '#10b981',
                          600: '#059669',
                          700: '#047857',
                          800: '#065f46',
                          900: '#064e3b',
                          950: '#022c22',
                        }
                      },
                      fontFamily: {
                        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
                        mono: ['"JetBrains Mono"', 'monospace'],
                      }
                    }
                  }
                };
              `,
            }}
          />
          <script src="https://cdn.tailwindcss.com"></script>

          <script dangerouslySetInnerHTML={{ __html: themeScript }} />
          <style dangerouslySetInnerHTML={{ __html: 'body { display: block !important; }' }} />
        </Head>
        <body className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased transition-colors duration-200">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
