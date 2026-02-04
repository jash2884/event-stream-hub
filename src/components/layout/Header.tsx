import { Bell, Activity, BarChart3, FileText, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  unreadCount?: number;
  onNotificationClick?: () => void;
}

const navItems = [
  { path: '/', label: 'Feed', icon: Activity },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/docs', label: 'Design Doc', icon: FileText },
];

export function Header({ unreadCount = 0, onNotificationClick }: HeaderProps) {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <motion.div
              className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Activity className="h-5 w-5 text-primary-foreground" />
              <motion.div
                className="absolute inset-0 rounded-lg bg-primary"
                animate={{ opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight">EventFlow</span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Activity System
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    className={cn(
                      'gap-2 transition-all',
                      isActive && 'bg-secondary text-foreground'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      />
                    )}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={onNotificationClick}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1 -top-1"
                >
                  <Badge 
                    variant="destructive" 
                    className="h-5 min-w-5 rounded-full px-1.5 text-xs font-semibold"
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                </motion.div>
              )}
            </Button>
          </motion.div>

          {/* Settings */}
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>

          {/* User Avatar */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-accent p-0.5"
          >
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser"
              alt="User avatar"
              className="h-full w-full rounded-full bg-background"
            />
          </motion.div>
        </div>
      </div>
    </header>
  );
}
