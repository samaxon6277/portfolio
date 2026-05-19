import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { X, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedFile: File) => void;
  onCancel: () => void;
  aspectRatio?: number; // Optional enforced aspect ratio
}

const defaultRatios = [
  { label: 'Free', value: 0 },
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4/3 },
  { label: '16:9', value: 16/9 },
  { label: '9:16', value: 9/16 },
  { label: '3:4', value: 3/4 },
  { label: '21:9', value: 21/9 },
];

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

export default function ImageCropper({ imageSrc, onCropComplete, onCancel, aspectRatio }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [selectedRatio, setSelectedRatio] = useState<number>(aspectRatio !== undefined ? aspectRatio : defaultRatios[0].value);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropCompleteHandler = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    setIsProcessing(true);
    try {
      const image = await createImage(imageSrc);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("No 2d context");
      }

      const maxSize = Math.max(image.width, image.height);
      const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

      // set each dimensions to double largest dimension to allow for a safe area for the
      // image to rotate in without being clipped by canvas context
      canvas.width = safeArea;
      canvas.height = safeArea;

      // translate canvas context to a central location on image to allow rotating around the center.
      ctx.translate(safeArea / 2, safeArea / 2);
      ctx.rotate(getRadianAngle(rotation));
      ctx.translate(-safeArea / 2, -safeArea / 2);

      // draw rotated image and store data.
      ctx.drawImage(
        image,
        safeArea / 2 - image.width * 0.5,
        safeArea / 2 - image.height * 0.5
      );
      const data = ctx.getImageData(0, 0, safeArea, safeArea);

      // set canvas width to final desired crop size - this will clear existing context
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      // paste generated rotate image with correct offsets for x,y crop values.
      ctx.putImageData(
        data,
        Math.round(0 - safeArea / 2 + image.width * 0.5 - croppedAreaPixels.x),
        Math.round(0 - safeArea / 2 + image.height * 0.5 - croppedAreaPixels.y)
      );

      // As Promise
      canvas.toBlob((file) => {
        if (file) {
            const croppedFile = new File([file], "cropped-image.jpg", {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            onCropComplete(croppedFile);
        }
      }, "image/jpeg", 0.9);
      
    } catch (e) {
      console.error(e);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#1B1B1B] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col"
      >
        <div className="flex justify-between items-center p-4 border-b border-white/5">
          <h3 className="font-semibold text-white">Crop Image</h3>
          <button onClick={onCancel} className="p-1 text-[#A8AFBD] hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative w-full h-[50vh] min-h-[300px] bg-[#101010]">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={selectedRatio === 0 ? undefined : selectedRatio}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onRotationChange={setRotation}
            onCropComplete={onCropCompleteHandler}
          />
        </div>

        <div className="p-6 space-y-6">
          {!aspectRatio && (
            <div className="flex flex-wrap gap-2 mb-4">
              {defaultRatios.map((ratio) => (
                <button
                  key={ratio.label}
                  onClick={() => setSelectedRatio(ratio.value)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                    selectedRatio === ratio.value
                      ? "bg-[#2984FF] text-white"
                      : "bg-[#101010] text-[#A8AFBD] hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <ZoomOut className="w-5 h-5 text-[#A8AFBD]" />
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-label="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#2984FF] [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
              />
              <ZoomIn className="w-5 h-5 text-[#A8AFBD]" />
            </div>

            <div className="flex items-center gap-4">
              <RotateCw className="w-5 h-5 text-[#A8AFBD]" />
              <input
                type="range"
                value={rotation}
                min={0}
                max={360}
                step={1}
                aria-label="Rotation"
                onChange={(e) => setRotation(Number(e.target.value))}
                className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#2984FF] [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
              />
              <span className="text-xs font-mono text-[#A8AFBD] w-8 text-right">{rotation}°</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button 
              onClick={onCancel}
              className="px-6 py-2 rounded-xl text-sm font-medium text-white hover:bg-white/5 transition-colors"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isProcessing}
              className="px-6 py-2 rounded-xl text-sm font-medium bg-[#2984FF] hover:bg-[#2984FF]/90 text-white transition-colors flex items-center justify-center min-w-[120px]"
            >
              {isProcessing ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                "Save & Upload"
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
