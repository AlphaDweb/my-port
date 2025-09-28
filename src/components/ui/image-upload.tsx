import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Upload, X, Image as ImageIcon, Crop, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ReactCrop, { Crop as CropType, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  aspectRatio?: number; // For cropping (e.g., 1 for square, 16/9 for landscape)
  enableCrop?: boolean; // Enable/disable cropping
  cropShape?: 'rect' | 'round'; // Crop shape - rectangle or round
}

export function ImageUpload({
  value,
  onChange,
  label = "Upload Image",
  placeholder = "Click to upload or drag and drop",
  accept = "image/*",
  maxSize = 5,
  className = "",
  aspectRatio = 1,
  enableCrop = true,
  cropShape = 'rect'
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<CropType>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();

  // Utility function to create a crop centered in the image
  const centerAspectCrop = useCallback(
    (mediaWidth: number, mediaHeight: number, aspect: number) => {
      return centerCrop(
        makeAspectCrop(
          {
            unit: '%',
            width: 90,
          },
          aspect,
          mediaWidth,
          mediaHeight
        ),
        mediaWidth,
        mediaHeight
      );
    },
    []
  );

  // Function to convert canvas to blob
  const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> => {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, 'image/jpeg', 0.9);
    });
  };

  // Function to crop and convert image
  const getCroppedImg = async (image: HTMLImageElement, crop: PixelCrop): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const pixelRatio = window.devicePixelRatio;

    // Set canvas size based on crop shape
    if (cropShape === 'round') {
      // For round crop, create a square canvas
      const size = Math.min(crop.width, crop.height);
      canvas.width = size * pixelRatio * scaleX;
      canvas.height = size * pixelRatio * scaleY;
    } else {
      // For rectangular crop, use the full crop dimensions
      canvas.width = crop.width * pixelRatio * scaleX;
      canvas.height = crop.height * pixelRatio * scaleY;
    }

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    // Calculate the source position to center the crop
    const sourceX = crop.x * scaleX;
    const sourceY = crop.y * scaleY;
    const sourceWidth = crop.width * scaleX;
    const sourceHeight = crop.height * scaleY;

    // For round crop, create a square image (easier to crop) but it will be displayed as round
    if (cropShape === 'round') {
      const sourceSize = Math.min(crop.width, crop.height) * scaleX;
      // Create a square image that will be displayed as round on the main page
      ctx.drawImage(
        image,
        sourceX,
        sourceY,
        sourceSize,
        sourceSize,
        0,
        0,
        canvas.width / pixelRatio,
        canvas.height / pixelRatio
      );
    } else {
      // For rectangular crop, use the full crop dimensions
      ctx.drawImage(
        image,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        canvas.width / pixelRatio,
        canvas.height / pixelRatio
      );
    }

    return canvasToBlob(canvas);
  };

  const handleFileSelect = async (file: File) => {
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `File size must be less than ${maxSize}MB`,
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Store the original file and show crop modal
    setOriginalFile(file);
    const imageUrl = URL.createObjectURL(file);
    setCropImage(imageUrl);
    setShowCropModal(true);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleCropComplete = async () => {
    if (!completedCrop || !imgRef.current) {
      toast({
        title: "Error",
        description: "Please select a crop area",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Get the cropped image as blob
      const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);
      
      // Create a file from the cropped blob
      const fileExt = originalFile?.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // Upload cropped file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, croppedBlob);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(filePath);

      const imageUrl = data.publicUrl;
      
      setPreview(imageUrl);
      onChange(imageUrl);
      setShowCropModal(false);

      // Clean up
      if (cropImage) {
        URL.revokeObjectURL(cropImage);
      }
      setCropImage(null);
      setOriginalFile(null);
      setCrop(undefined);
      setCompletedCrop(undefined);

      toast({
        title: "Success",
        description: "Image cropped and uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload cropped image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    if (cropImage) {
      URL.revokeObjectURL(cropImage);
    }
    setCropImage(null);
    setOriginalFile(null);
    setCrop(undefined);
    setCompletedCrop(undefined);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label>{label}</Label>}
      
      <Card 
        className={`border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors cursor-pointer ${
          uploading ? 'opacity-50 pointer-events-none' : ''
        }`}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <CardContent className="p-6">
          {preview ? (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                  }}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Change Image'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                {uploading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                ) : (
                  <Upload className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {uploading ? 'Uploading...' : 'Click to upload'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {placeholder}
                </p>
                <p className="text-xs text-muted-foreground">
                  Max size: {maxSize}MB
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Crop Modal */}
      <Dialog open={showCropModal} onOpenChange={setShowCropModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crop className="h-5 w-5" />
              Crop Your Image
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {cropImage && (
              <div className="flex justify-center">
                <div className="relative">
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspectRatio}
                    className="max-w-full max-h-[400px]"
                  >
                    <img
                      ref={imgRef}
                      alt="Crop me"
                      src={cropImage}
                      className="max-w-full max-h-[400px] object-contain"
                      onLoad={(e) => {
                        const { width, height } = e.currentTarget;
                        setCrop(centerAspectCrop(width, height, aspectRatio));
                      }}
                    />
                  </ReactCrop>
                  
                  {/* Square crop preview overlay for round crop */}
                  {cropShape === 'round' && crop && (
                    <div 
                      className="absolute pointer-events-none border-2 border-white shadow-lg"
                      style={{
                        left: `${crop.x}%`,
                        top: `${crop.y}%`,
                        width: `${crop.width}%`,
                        height: `${crop.height}%`,
                        border: '3px solid #3b82f6',
                        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
                      }}
                    />
                  )}
                </div>
              </div>
            )}
            
            <div className="text-sm text-muted-foreground text-center">
              Drag the corners to adjust the crop area. The image will be cropped to a {cropShape === 'round' ? 'square' : aspectRatio === 1 ? 'square' : `${aspectRatio}:1`} shape.
              {cropShape === 'round' && (
                <div className="mt-2 text-xs text-blue-600">
                  💡 Crop as a square - it will be displayed as a perfect circle on your portfolio
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCropCancel}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCropComplete}
              disabled={uploading || !completedCrop}
              className="flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Crop & Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
