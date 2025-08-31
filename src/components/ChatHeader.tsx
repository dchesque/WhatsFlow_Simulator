
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
    <div className="bg-chat-header text-white px-4 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30">
            <span className="text-primary-foreground font-semibold">N8</span>
          </div>
          {isOnline && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-background"></div>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-base text-foreground">{contactName}</h3>
          <p className="text-xs text-muted-foreground">{isOnline ? 'online' : 'offline'}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="sm"
          className="text-muted-foreground hover:text-foreground hover:bg-muted/50 p-2"
        >
          <Video size={20} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-muted-foreground hover:text-foreground hover:bg-muted/50 p-2"
        >
          <Phone size={20} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-muted-foreground hover:text-foreground hover:bg-muted/50 p-2"
          onClick={onSettingsClick}
        >
          <Settings size={20} />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
