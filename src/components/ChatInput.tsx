
import React, { useState } from 'react';
import { Send, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSendMessage, disabled = false }: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-input-bg border-t border-border px-4 py-3 flex items-center space-x-3">
      <Button 
        variant="ghost" 
        size="sm"
        className="text-muted-foreground hover:text-foreground hover:bg-muted/50 p-2"
      >
        <Smile size={20} />
      </Button>
      
      <div className="flex-1 relative">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Digite uma mensagem..."
          className="rounded-full border-input focus:border-primary pr-12 bg-background"
          disabled={disabled}
        />
      </div>
      
      <Button 
        onClick={handleSend}
        disabled={!message.trim() || disabled}
        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-2 h-10 w-10"
      >
        <Send size={18} />
      </Button>
    </div>
  );
};

export default ChatInput;
