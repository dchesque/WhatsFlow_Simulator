
import React from 'react';
import { Settings, Phone, Video, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatHeaderProps {
  onSettingsClick: () => void;
  contactName?: string;
  isOnline?: boolean;
}

const ChatHeader = ({ onSettingsClick, contactName = "N8N Bot", isOnline = true }: ChatHeaderProps) => {
  return (
    <div className="bg-chat-header border-b border-border px-4 py-3 flex items-center justify-between backdrop-blur-sm">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
            <span className="text-primary-foreground font-bold text-sm">N8</span>
          </div>
          {isOnline && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-background shadow-sm"></div>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-base text-foreground">{contactName}</h3>
          <p className="text-xs text-muted-foreground">{isOnline ? 'online' : 'offline'}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-1">
        <Button 
          variant="ghost" 
          size="sm"
          className="text-muted-foreground hover:text-foreground hover:bg-muted/50 p-2 rounded-full transition-all duration-200"
        >
          <Video size={18} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-muted-foreground hover:text-foreground hover:bg-muted/50 p-2 rounded-full transition-all duration-200"
        >
          <Phone size={18} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-muted-foreground hover:text-foreground hover:bg-muted/50 p-2 rounded-full transition-all duration-200"
          onClick={onSettingsClick}
        >
          <Settings size={18} />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
