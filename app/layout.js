import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'বাজার দর (BazarDor) — নিত্যপ্রয়োজনীয় পণ্যের বাজারদর এক নজরে',
  description: 'চাল, ডাল, তেল, সবজি, মাছ, মাংস ও মসলার দৈনিক বাজার দর বিশ্লেষণ ও পরিবর্তন ট্র্যাক করুন।',
  keywords: ['বাজার দর', 'bazar dor', 'bangladesh market price', 'daily commodity prices bangladesh'],
  authors: [{ name: 'Bazar Dor Team' }]
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-[#f8faf9] text-[#14281d] antialiased">
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#ffffff',
                color: '#1e293b',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                borderRadius: '16px',
                padding: '12px 18px',
                fontSize: '14px',
                fontWeight: '500',
                border: '1px solid #e2e8f0'
              },
              success: {
                iconTheme: {
                  primary: '#059669',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#e11d48',
                  secondary: '#ffffff',
                },
              }
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
