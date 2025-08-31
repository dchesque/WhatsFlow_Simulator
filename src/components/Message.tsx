
import React from 'react';
import { Check, CheckCheck } from 'lucide-react';

export interface MessageType {
  id: string;
  text: string;
  sent: boolean;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

interface MessageProps {
  message: MessageType;
}

const Message = ({ message }: MessageProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusIcon = () => {
    switch (message.status) {
      case 'sending':
        return <div className="w-3 h-3 border border-muted-foreground border-t-transparent rounded-full animate-spin" />;
      case 'sent':
        return <Check size={16} className="text-muted-foreground" />;
      case 'delivered':
        return <CheckCheck size={16} className="text-muted-foreground" />;
      case 'read':
        return <CheckCheck size={16} className="text-blue-400" />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex mb-4 ${message.sent ? 'justify-end' : 'justify-start'} ${message.sent ? 'animate-slide-in-right' : 'animate-slide-in-left'}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
        message.sent 
          ? 'bg-message-sent text-white rounded-br-md' 
          : 'bg-message-received text-foreground rounded-bl-md border border-border'
      }`}>
        <p className="text-sm leading-relaxed">{message.text}</p>
        <div className={`flex items-center justify-end mt-1 space-x-1 ${
          message.sent ? 'text-white/70' : 'text-message-timestamp'
        }`}>
          <span className="text-xs">{formatTime(message.timestamp)}</span>
          {message.sent && getStatusIcon()}
        </div>
      </div>
    </div>
  );
};

export default Message;
