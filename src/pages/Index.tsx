
import React, { useState, useEffect } from 'react';
import ChatHeader from '@/components/ChatHeader';
import ChatArea from '@/components/ChatArea';
import ChatInput from '@/components/ChatInput';
import WebhookConfigModal from '@/components/WebhookConfigModal';
import { MessageType } from '@/components/Message';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [responseUrl, setResponseUrl] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  // Carregar configurações salvas
  useEffect(() => {
    const savedWebhookUrl = localStorage.getItem('webhookUrl');
    const savedResponseUrl = localStorage.getItem('responseUrl');
    if (savedWebhookUrl) {
      setWebhookUrl(savedWebhookUrl);
    }
    if (savedResponseUrl) {
      setResponseUrl(savedResponseUrl);
    }
    
    if (!savedWebhookUrl) {
      // Se não há webhook configurado, abrir modal automaticamente
      setIsConfigModalOpen(true);
    }

    // Mensagem de boas-vindas
    const welcomeMessage: MessageType = {
      id: 'welcome',
      text: 'Olá! Eu sou o bot N8N. Configure o webhook para começarmos a conversar!',
      sent: false,
      timestamp: new Date(),
      status: 'delivered'
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSaveWebhook = (url: string, responseUrl: string) => {
    setWebhookUrl(url);
    setResponseUrl(responseUrl);
    localStorage.setItem('webhookUrl', url);
    localStorage.setItem('responseUrl', responseUrl);
  };

  // Polling para verificar novas mensagens
  useEffect(() => {
    if (!responseUrl) return;

    const pollForMessages = async () => {
      try {
        const response = await fetch(responseUrl, {
          method: 'GET',
          mode: 'cors'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.message && data.timestamp) {
            const newMessage: MessageType = {
              id: data.timestamp,
              text: data.message,
              sent: false,
              timestamp: new Date(data.timestamp),
              status: 'delivered'
            };
            
            setMessages(prev => {
              // Evitar mensagens duplicadas
              if (prev.find(msg => msg.id === newMessage.id)) return prev;
              return [...prev, newMessage];
            });
          }
        }
      } catch (error) {
        console.log('Erro ao verificar mensagens:', error);
      }
    };

    const interval = setInterval(pollForMessages, 2000); // Verifica a cada 2 segundos
    return () => clearInterval(interval);
  }, [responseUrl]);

  const sendMessage = async (messageText: string) => {
    if (!webhookUrl) {
      toast({
        title: "Configuração Necessária",
        description: "Configure o webhook antes de enviar mensagens.",
        variant: "destructive",
      });
      setIsConfigModalOpen(true);
      return;
    }

    // Adicionar mensagem enviada
    const sentMessage: MessageType = {
      id: Date.now().toString(),
      text: messageText,
      sent: true,
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, sentMessage]);
    setIsSending(true);

    try {
      console.log('Enviando mensagem para webhook:', webhookUrl);
      
      const params = new URLSearchParams({
        message: messageText,
        timestamp: new Date().toISOString(),
        sender: 'user',
        chat_id: 'whatsapp_chat'
      });
      
      const response = await fetch(`${webhookUrl}?${params.toString()}`, {
        method: 'GET',
        mode: 'no-cors'
      });

      // Atualizar status da mensagem para enviada
      setMessages(prev => prev.map(msg => 
        msg.id === sentMessage.id 
          ? { ...msg, status: 'delivered' }
          : msg
      ));

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      
      // Atualizar status para erro
      setMessages(prev => prev.map(msg => 
        msg.id === sentMessage.id 
          ? { ...msg, status: 'sent' }
          : msg
      ));

      toast({
        title: "Mensagem Enviada",
        description: "A mensagem foi enviada para o N8N. Aguarde a resposta.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background max-w-md mx-auto border-l border-r border-gray-200 shadow-xl">
      <ChatHeader 
        onSettingsClick={() => setIsConfigModalOpen(true)}
        isOnline={!!webhookUrl}
      />
      
      <ChatArea messages={messages} />
      
      <ChatInput 
        onSendMessage={sendMessage}
        disabled={isSending}
      />

      <WebhookConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        webhookUrl={webhookUrl}
        responseUrl={responseUrl}
        onSaveWebhook={handleSaveWebhook}
      />
    </div>
  );
};

export default Index;
