import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Upload, Camera, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const BetEntry = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [extractedData, setExtractedData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleImageUpload = async (file: File) => {
    if (!user) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('bet-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('bet-images')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
      setImageFile(file);
      
      // Process image with AI
      await processImageWithAI(publicUrl);
      
      toast({
        title: "Immagine caricata",
        description: "L'immagine è stata caricata e processata con successo",
      });
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const processImageWithAI = async (imageUrl: string) => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('parse-bet-image', {
        body: { imageUrl }
      });

      if (error) throw error;

      setExtractedData(data);
      toast({
        title: "Dati estratti",
        description: "I dati della scommessa sono stati estratti automaticamente",
      });
    } catch (error: any) {
      toast({
        title: "Errore AI",
        description: "Errore nell'estrazione dei dati. Inserisci manualmente.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const saveBet = async () => {
    if (!user || !imageUrl) return;

    try {
      const { error } = await supabase.from('bets').insert({
        user_id: user.id,
        bankroll_id: extractedData?.bankroll_id || null,
        image_url: imageUrl,
        sport: extractedData?.sport || '',
        event: extractedData?.event || '',
        bookmaker: extractedData?.bookmaker || '',
        odds: extractedData?.odds || null,
        stake: extractedData?.stake || null,
        adm_ref: extractedData?.adm_ref || '',
        confidence_score: extractedData?.confidence_score || 50,
        status: 'PENDING'
      });

      if (error) throw error;

      toast({
        title: "Scommessa salvata",
        description: "La scommessa è stata aggiunta al database",
      });

      // Reset form
      setImageFile(null);
      setImageUrl('');
      setExtractedData(null);
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Nuova Scommessa</h1>
        <p className="text-blue-200">Carica la foto della tua scommessa per l'analisi automatica</p>
      </div>

      {/* Image Upload */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="h-5 w-5 text-blue-600" />
            <span>Carica Immagine</span>
          </CardTitle>
          <CardDescription>
            Trascina l'immagine qui o clicca per selezionare
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
            onDrop={handleFileDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            {isUploading ? (
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                <p className="text-blue-600">Caricamento in corso...</p>
              </div>
            ) : imageUrl ? (
              <div className="flex flex-col items-center space-y-2">
                <img 
                  src={imageUrl} 
                  alt="Bet" 
                  className="max-h-48 rounded-lg shadow-md"
                />
                <p className="text-green-600">Immagine caricata con successo</p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <Upload className="h-8 w-8 text-blue-600" />
                <p className="text-blue-600">Clicca o trascina l'immagine qui</p>
                <p className="text-sm text-muted-foreground">PNG, JPG, GIF fino a 10MB</p>
              </div>
            )}
          </div>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </CardContent>
      </Card>

      {/* AI Processing */}
      {isProcessing && (
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="py-6">
            <div className="flex items-center justify-center space-x-3">
              <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
              <span className="text-blue-600">Analisi AI in corso...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Extracted Data */}
      {extractedData && (
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Dati Estratti</CardTitle>
            <CardDescription>
              Verifica e modifica se necessario
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sport">Sport</Label>
                <Input
                  id="sport"
                  value={extractedData.sport || ''}
                  onChange={(e) => setExtractedData({...extractedData, sport: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bookmaker">Bookmaker</Label>
                <Input
                  id="bookmaker"
                  value={extractedData.bookmaker || ''}
                  onChange={(e) => setExtractedData({...extractedData, bookmaker: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="odds">Quote</Label>
                <Input
                  id="odds"
                  type="number"
                  step="0.01"
                  value={extractedData.odds || ''}
                  onChange={(e) => setExtractedData({...extractedData, odds: parseFloat(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stake">Puntata (€)</Label>
                <Input
                  id="stake"
                  type="number"
                  step="0.01"
                  value={extractedData.stake || ''}
                  onChange={(e) => setExtractedData({...extractedData, stake: parseFloat(e.target.value)})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="event">Evento</Label>
              <Textarea
                id="event"
                value={extractedData.event || ''}
                onChange={(e) => setExtractedData({...extractedData, event: e.target.value})}
                rows={3}
              />
            </div>
            <Button onClick={saveBet} className="w-full" size="lg">
              Salva Scommessa
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BetEntry;