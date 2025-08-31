
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
  onSaveWebhook: (url: string) => void;
}

const WebhookConfigModal = ({ isOpen, onClose, webhookUrl, onSaveWebhook }: WebhookConfigModalProps) => {
  const [url, setUrl] = useState(webhookUrl);
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    if (!url.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, insira uma URL válida para o webhook.',
        variant: 'destructive',
      });
      return;
    }

    try {
      new URL(url); // Valida se é uma URL válida
      onSaveWebhook(url);
      onClose();
      toast({
        title: 'Configuração Salva',
        description: 'Webhook configurado com sucesso (POST + Response to Webhook)!',
      });
    } catch (error) {
      toast({
        title: 'URL Inválida',
        description: 'Por favor, insira uma URL válida',
        variant: 'destructive',
      });
    }
  };

  const testWebhook = async () => {
    if (!url.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, insira uma URL antes de testar.',
        variant: 'destructive',
      });
      return;
    }

    setIsValidating(true);
    try {
      const payload = {
        test: true,
        message: 'Teste de conexão',
        timestamp: new Date().toISOString()
      };
      
      const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast({
          title: 'Teste OK',
          description: 'Webhook respondeu com sucesso. Veja o retorno no N8N.',
        });
      } else {
        toast({
          title: 'Teste enviado',
          description: 'Status ' + response.status + '. Verifique o N8N/CORS.',
        });
      }
    } catch (error) {
      console.error('Erro ao testar webhook:', error);
      toast({
        title: 'Falha no teste',
        description: 'Verifique a URL e as permissões de CORS no N8N.',
        variant: 'destructive',
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
            Use método POST e finalize com o nó Response to Webhook no N8N.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">URL do Webhook (POST)</Label>
            <Input
              id="webhook-url"
              placeholder="https://webhook.n8n.io/webhook/your-webhook-id"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Enviaremos as mensagens via POST e leremos a resposta do próprio webhook.
            </p>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Como configurar no N8N:</strong>
            </p>
            <ol className="text-xs text-blue-700 space-y-1">
              <li>1. Inicie com um nó Webhook (método POST).</li>
              <li>2. Processe a mensagem conforme necessário.</li>
              <li>3. Finalize com o nó "Response to Webhook" retornando JSON: {`{ message, timestamp }`}.</li>
              <li>4. Habilite CORS no webhook (Access-Control-Allow-Origin).</li>
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
