import React from 'react';
import { Link } from 'react-router-dom';
import { Banknote } from 'lucide-react';

const AppFooter: React.FC = () => {
  console.log('AppFooter loaded');
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: 'Terms of Service', to: '/terms' },
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Security Information', to: '/security' },
    { label: 'Help/Support', to: '/help' },
  ];

  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <Banknote className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">FinDash</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="text-center text-sm text-muted-foreground md:text-right">
            &copy; {currentYear} FinDash. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;