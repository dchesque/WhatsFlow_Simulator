
import React, { useEffect, useRef } from 'react';
import Message, { MessageType } from './Message';

interface ChatAreaProps {
  messages: MessageType[];
}

const ChatArea = ({ messages }: ChatAreaProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 bg-chat-bg overflow-y-auto">
      {/* Modern gradient background */}
      <div className="min-h-full bg-gradient-to-b from-chat-bg via-muted/5 to-chat-bg px-4 py-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <div className="text-6xl mb-4 opacity-60">💬</div>
              <p className="text-lg font-medium text-foreground mb-2">Bem-vindo ao Chat N8N</p>
              <p className="text-sm">Envie sua primeira mensagem!</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <Message key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatArea;
