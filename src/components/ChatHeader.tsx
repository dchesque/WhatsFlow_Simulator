
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
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">N8</span>
          </div>
          {isOnline && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-base">{contactName}</h3>
          <p className="text-xs text-white/80">{isOnline ? 'online' : 'offline'}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="sm"
          className="text-white hover:bg-white/10 p-2"
        >
          <Video size={20} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-white hover:bg-white/10 p-2"
        >
          <Phone size={20} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-white hover:bg-white/10 p-2"
          onClick={onSettingsClick}
        >
          <Settings size={20} />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
