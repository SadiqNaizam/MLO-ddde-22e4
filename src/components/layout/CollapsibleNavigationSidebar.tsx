import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  Wallet,
  ArrowRightLeft,
  CreditCard,
  PanelLeftClose,
  PanelLeftOpen,
  Banknote,
  Settings,
} from 'lucide-react';
import clsx from 'clsx';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isCollapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, isCollapsed }) => {
  const linkContent = (
    <>
      <Icon className={clsx("h-5 w-5", !isCollapsed && "mr-3")} />
      {!isCollapsed && <span className="truncate">{label}</span>}
    </>
  );

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    clsx(
      "flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
      "hover:bg-accent hover:text-accent-foreground",
      isActive ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : "text-muted-foreground",
      isCollapsed && "justify-center"
    );

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <NavLink to={to} className={navLinkClasses} end={to === '/'}>
            {linkContent}
          </NavLink>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right" sideOffset={5}>
            {label}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

const CollapsibleNavigationSidebar: React.FC = () => {
  console.log('CollapsibleNavigationSidebar loaded');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard Overview' },
    { to: '/accounts', icon: Wallet, label: 'Accounts' },
    { to: '/transfers-and-bill-pay', icon: ArrowRightLeft, label: 'Transfers & Bill Pay' },
    { to: '/cards-management', icon: CreditCard, label: 'Cards Management' },
  ];
  
  // Settings link is now in header, but if needed in sidebar, it would go here
  // { to: '/settings', icon: Settings, label: 'Settings' }

  return (
    <aside
      className={clsx(
        "fixed inset-y-0 left-0 z-30 flex h-full flex-col border-r bg-background transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 shrink-0">
         <Link to="/" className={clsx("flex items-center gap-2", isCollapsed && "justify-center w-full")}>
            <Banknote className="h-7 w-7 text-primary" />
            {!isCollapsed && <span className="font-bold text-xl">FinDash</span>}
        </Link>
        {/* Removed toggle button from here to place it at the bottom */}
      </div>
      <Separator />
      <nav className="flex-grow space-y-1 p-4">
        {navItems.map((item) => (
          <NavItem key={item.label} {...item} isCollapsed={isCollapsed} />
        ))}
      </nav>
      <Separator />
      <div className="p-4 mt-auto shrink-0">
        <Button
          variant="outline"
          size="icon"
          className="w-full"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </Button>
      </div>
    </aside>
  );
};

export default CollapsibleNavigationSidebar;