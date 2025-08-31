
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Settings, ExternalLink, Save } from 'lucide-react';

interface WebhookConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  webhookUrl: string;
  responseUrl: string;
  onSaveWebhook: (url: string, responseUrl: string) => void;
}

const WebhookConfigModal = ({ isOpen, onClose, webhookUrl, responseUrl, onSaveWebhook }: WebhookConfigModalProps) => {
  const [url, setUrl] = useState(webhookUrl);
  const [responseUrlInput, setResponseUrlInput] = useState(responseUrl);
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    if (!url.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma URL válida para o webhook.",
        variant: "destructive",
      });
      return;
    }

    try {
      new URL(url); // Valida se é uma URL válida
      if (responseUrlInput.trim()) {
        new URL(responseUrlInput); // Valida URL de resposta se fornecida
      }
      onSaveWebhook(url, responseUrlInput);
      onClose();
      toast({
        title: "Configuração Salva",
        description: "Webhook configurado com sucesso!",
      });
    } catch (error) {
      toast({
        title: "URL Inválida",
        description: "Por favor, insira URLs válidas",
        variant: "destructive",
      });
    }
  };

  const testWebhook = async () => {
    if (!url.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma URL antes de testar.",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);
    try {
      const params = new URLSearchParams({
        test: 'true',
        message: 'Teste de conexão',
        timestamp: new Date().toISOString()
      });
      
      const response = await fetch(`${url}?${params.toString()}`, {
        method: 'GET',
        mode: 'no-cors'
      });

      toast({
        title: "Teste Enviado",
        description: "Requisição de teste enviada. Verifique o histórico do N8N para confirmar o recebimento.",
      });
    } catch (error) {
      console.error('Erro ao testar webhook:', error);
      toast({
        title: "Teste Executado",
        description: "Requisição enviada. Verifique o N8N para confirmar o recebimento.",
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-primary" />
            <span>Configuração do Webhook N8N</span>
          </DialogTitle>
          <DialogDescription>
            Configure a URL do webhook para integração com o N8N.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">URL do Webhook (Envio)</Label>
            <Input
              id="webhook-url"
              placeholder="https://webhook.n8n.io/webhook/your-webhook-id"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              URL para enviar mensagens para o N8N
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="response-url">URL de Resposta (Recebimento)</Label>
            <Input
              id="response-url"
              placeholder="https://api.exemplo.com/messages/latest"
              value={responseUrlInput}
              onChange={(e) => setResponseUrlInput(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              URL para receber respostas do N8N (opcional)
            </p>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Como configurar no N8N:</strong>
            </p>
            <ol className="text-xs text-blue-700 space-y-1">
              <li>1. Crie um workflow no N8N com trigger "Webhook" (GET)</li>
              <li>2. Copie a URL do webhook para "Envio"</li>
              <li>3. Configure um endpoint para retornar respostas</li>
              <li>4. Cole a URL de resposta em "Recebimento" (opcional)</li>
            </ol>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={testWebhook}
            disabled={isValidating}
            className="flex items-center space-x-2"
          >
            <ExternalLink size={16} />
            <span>{isValidating ? 'Testando...' : 'Testar'}</span>
          </Button>
          <Button 
            onClick={handleSave}
            className="flex-1 flex items-center justify-center space-x-2"
          >
            <Save size={16} />
            <span>Salvar Configuração</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WebhookConfigModal;
