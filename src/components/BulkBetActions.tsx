
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckSquare, Upload, Loader, Camera } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const BulkBetActions = () => {
  const [isCheckingAll, setIsCheckingAll] = useState(false);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);

  const handleCheckAllBets = async () => {
    setIsCheckingAll(true);
    console.log('Starting automatic bet checking...');
    
    try {
      // Simulate API call to check all bets
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Controllo completato!",
        description: "Tutte le scommesse sono state verificate automaticamente",
      });
      
      console.log('All bets checked successfully');
    } catch (error) {
      console.error('Error checking bets:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il controllo",
        variant: "destructive",
      });
    } finally {
      setIsCheckingAll(false);
    }
  };

  const handleBulkPhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingPhotos(true);
    console.log(`Starting upload of ${files.length} photos...`);

    try {
      // Simulate photo processing
      for (let i = 0; i < files.length; i++) {
        console.log(`Processing photo ${i + 1}/${files.length}: ${files[i].name}`);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      toast({
        title: "Upload completato!",
        description: `${files.length} foto caricate con successo`,
      });

      console.log('All photos uploaded successfully');
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'upload",
        variant: "destructive",
      });
    } finally {
      setIsUploadingPhotos(false);
      // Reset input
      event.target.value = '';
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CheckSquare className="w-5 h-5 text-blue-600" />
          <span>Azioni di Massa</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Check All Bets */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Controllo Automatico</Label>
            <p className="text-xs text-slate-600 mb-3">
              Controlla automaticamente lo stato di tutte le scommesse in corso
            </p>
            <Button 
              onClick={handleCheckAllBets}
              disabled={isCheckingAll}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {isCheckingAll ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Controllando...
                </>
              ) : (
                <>
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Controlla Tutte
                </>
              )}
            </Button>
          </div>

          {/* Bulk Photo Upload */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Upload Foto Massivo</Label>
            <p className="text-xs text-slate-600 mb-3">
              Carica più foto delle scommesse contemporaneamente
            </p>
            <div className="relative">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleBulkPhotoUpload}
                disabled={isUploadingPhotos}
                className="hidden"
                id="bulk-photo-upload"
              />
              <Label 
                htmlFor="bulk-photo-upload" 
                className={`flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors ${
                  isUploadingPhotos 
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white'
                }`}
              >
                {isUploadingPhotos ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Caricando...
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4 mr-2" />
                    Carica Foto
                  </>
                )}
              </Label>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-700">
            <strong>Nota:</strong> Il controllo automatico verificherà lo stato delle scommesse tramite API dei bookmaker. 
            L'upload delle foto consentirà di associare immagini alle scommesse per una migliore documentazione.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BulkBetActions;
