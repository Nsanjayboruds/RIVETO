import Footer from './Footer';

export default function PageShell({ children, className = '', withFooter = false }) {
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-100 via-white to-cyan-50 dark:from-gray-900 dark:via-[#0f172a] dark:to-[#0c4a6e] pt-24 pb-16 ${className}`}
    >
      {children}
      {withFooter && <Footer />}
    </div>
  );
}
