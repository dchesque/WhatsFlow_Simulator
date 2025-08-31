
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
      console.log('Enviando mensagem (POST) para webhook:', webhookUrl);

      const payload = {
        message: messageText,
        timestamp: new Date().toISOString(),
        sender: 'user',
        chat_id: 'whatsapp_chat'
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        // Atualiza status da mensagem enviada
        setMessages(prev => prev.map(msg =>
          msg.id === sentMessage.id ? { ...msg, status: 'delivered' } : msg
        ));

        // Lê resposta do N8N (Response to Webhook)
        const data = await response.json().catch(() => null);
        console.log('Resposta do N8N:', data);
        
        if (data) {
          // N8N pode retornar array ou objeto
          const responseData = Array.isArray(data) ? data[0] : data;
          
          if (responseData && (responseData.message || responseData.text)) {
            const text = responseData.message ?? responseData.text;
            const ts = responseData.timestamp ?? Date.now().toString();
            const newMessage: MessageType = {
              id: ts,
              text,
              sent: false,
              timestamp: new Date(),
              status: 'delivered'
            };
            setMessages(prev => [...prev, newMessage]);
          }
        }
      } else {
        // Marca como enviada, porém sem confirmação de entrega
        setMessages(prev => prev.map(msg =>
          msg.id === sentMessage.id ? { ...msg, status: 'sent' } : msg
        ));
        toast({
          title: 'Falha ao receber resposta',
          description: 'Webhook retornou status ' + response.status + '.',
          variant: 'destructive'
        });
      }

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setMessages(prev => prev.map(msg =>
        msg.id === sentMessage.id ? { ...msg, status: 'sent' } : msg
      ));
      toast({
        title: 'Erro ao enviar',
        description: 'Verifique a URL do webhook e as permissões de CORS no N8N.',
        variant: 'destructive',
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
        onSaveWebhook={handleSaveWebhook}
      />
    </div>
  );
};

export default Index;
