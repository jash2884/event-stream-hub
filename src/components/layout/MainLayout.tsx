import { ReactNode, useState } from 'react';
import { Header } from './Header';
import { NotificationPanel } from '../notifications/NotificationPanel';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount] = useState(5);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        unreadCount={unreadCount} 
        onNotificationClick={() => setShowNotifications(!showNotifications)}
      />
      
      <main className="container py-6">
        {children}
      </main>

      <NotificationPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </div>
  );
}
