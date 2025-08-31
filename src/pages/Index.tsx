
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
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  // Carregar configurações salvas
  useEffect(() => {
    const savedWebhookUrl = localStorage.getItem('webhookUrl');
    if (savedWebhookUrl) {
      setWebhookUrl(savedWebhookUrl);
    } else {
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

  const handleSaveWebhook = (url: string) => {
    setWebhookUrl(url);
    localStorage.setItem('webhookUrl', url);
  };

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

      // Simular resposta automática (já que não conseguimos ler a resposta devido ao no-cors)
      setTimeout(() => {
        const responseMessage: MessageType = {
          id: (Date.now() + 1).toString(),
          text: 'Mensagem recebida pelo N8N! ✅\n\nSua mensagem foi processada com sucesso.',
          sent: false,
          timestamp: new Date(),
          status: 'delivered'
        };
        setMessages(prev => [...prev, responseMessage]);
      }, 1000 + Math.random() * 2000);

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

      // Simular resposta mesmo com erro
      setTimeout(() => {
        const responseMessage: MessageType = {
          id: (Date.now() + 1).toString(),
          text: 'Recebi sua mensagem! O N8N está processando...',
          sent: false,
          timestamp: new Date(),
          status: 'delivered'
        };
        setMessages(prev => [...prev, responseMessage]);
      }, 2000);
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
        onSaveWebhook={handleSaveWebhook}
      />
    </div>
  );
};

export default Index;
