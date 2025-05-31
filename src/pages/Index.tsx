import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const sampleImages = [
  { id: 'rectangle', name: 'Rectangle', url: '/samples/rectangle.png' },
  { id: 'hexagon', name: 'Hexagon', url: '/samples/hexagon.png' },
  { id: 'circle', name: 'Circle', url: '/samples/circle.png' },
];

const methods = [
  { id: 'harris', name: 'Harris Corner Detection', description: 'Classic corner detection algorithm' },
  { id: 'hitormiss', name: 'Hit and Miss', description: 'Morphological corner detection' },
  { id: 'shitomasi', name: 'Shi-Tomasi', description: 'Improved Harris corner detector' },
  { id: 'contour', name: 'Contour Detection', description: 'Edge-based corner detection' },
];

const Index = () => {
  const [showMainInterface, setShowMainInterface] = useState(false);

  if (showMainInterface) {
    return <MainInterface onBack={() => setShowMainInterface(false)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-200/30 to-indigo-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      <div className="text-center z-10 max-w-4xl mx-auto px-6 animate-fade-in">
        <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 leading-tight">
          Explore Image
          <br />
          <span className="text-5xl md:text-6xl">Corner Detection</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Discover the power of computer vision with comparing corner detection algorithms. 
          Test, compare, and visualize different techniques in real-time.
        </p>
        <Button 
          onClick={() => setShowMainInterface(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-12 py-6 text-xl rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group"
        >
          Try it now
          <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
        </Button>
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-3xl font-bold text-indigo-600">4</div>
            <div className="text-gray-600">Detection Methods</div>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-3xl font-bold text-purple-600">Real-time</div>
            <div className="text-gray-600">Processing</div>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="text-3xl font-bold text-pink-600">Interactive</div>
            <div className="text-gray-600">Interface</div>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <div className="text-3xl font-bold text-indigo-600">Easy</div>
            <div className="text-gray-600">Steps</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MainInterface = ({ onBack }: { onBack: () => void }) => {
  // State utama
  const [selectedInput, setSelectedInput] = useState<'upload' | 'sample' | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedSample, setSelectedSample] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handler untuk proses
  const handleProceed = async () => {
    setIsProcessing(true);
    let fileToSend: File | null = uploadedFile;

    // Jika sample, fetch gambarnya dulu
    if (selectedInput === "sample" && selectedSample) {
      const sample = sampleImages.find(img => img.id === selectedSample);
      if (sample) {
        const response = await fetch(sample.url);
        const blob = await response.blob();
        fileToSend = new File([blob], "sample.jpg", { type: blob.type });
      }
    }

    if (!fileToSend || !selectedMethod) {
      setIsProcessing(false);
      return;
    }

    const formData = new FormData();
    formData.append("method", selectedMethod);
    formData.append("image", fileToSend);

    try {
      const res = await fetch("http://localhost:5000/process", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Processing failed");
      const blob = await res.blob();
      const imageUrl = URL.createObjectURL(blob);
      setOutputImage(imageUrl);
    } catch (err) {
      alert("Failed to process image");
    }
    setIsProcessing(false);
  };

  const handleReset = () => {
    setSelectedInput(null);
    setUploadedFile(null);
    setSelectedSample(null);
    setSelectedMethod(null);
    setOutputImage(null);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8 bg-white/80 backdrop-blur rounded-2xl shadow p-4">
          <Button 
            onClick={onBack}
            variant="outline"
            className="hover:bg-indigo-50 border-indigo-200"
          >
            ← Back to Home
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Corner Detection Lab
          </h1>
          <div></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)]">
          <InputSection
            selectedInput={selectedInput}
            setSelectedInput={setSelectedInput}
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            selectedSample={selectedSample}
            setSelectedSample={setSelectedSample}
          />
          <MethodSection
            selectedMethod={selectedMethod}
            setSelectedMethod={setSelectedMethod}
            isProcessing={isProcessing}
            handleProceed={handleProceed}
            canProceed={(!!uploadedFile || !!selectedSample) && !!selectedMethod}
          />
          <OutputSection
            outputImage={outputImage}
            isProcessing={isProcessing}
            handleReset={handleReset}
          />
        </div>
      </div>
    </div>
  );
};

type InputSectionProps = {
  selectedInput: 'upload' | 'sample' | null;
  setSelectedInput: (v: 'upload' | 'sample' | null) => void;
  uploadedFile: File | null;
  setUploadedFile: (f: File | null) => void;
  selectedSample: string | null;
  setSelectedSample: (s: string | null) => void;
};

const InputSection = ({
  selectedInput,
  setSelectedInput,
  uploadedFile,
  setUploadedFile,
  selectedSample,
  setSelectedSample,
}: InputSectionProps) => (
  <div className="bg-white/80 backdrop-blur rounded-3xl shadow-xl p-8 animate-fade-in">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
      <div className="w-3 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full mr-3"></div>
      Input Selection
    </h2>
    <div className="space-y-6">
      <div className="border-2 border-dashed border-indigo-200 rounded-2xl p-8 text-center hover:border-indigo-400 transition-colors duration-300">
        <input 
          type="file" 
          accept="image/*" 
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) {
              setUploadedFile(file);
              setSelectedInput('upload');
              setSelectedSample(null);
            }
          }}
          className="hidden" 
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="text-4xl mb-4">📤</div>
          <div className="text-lg font-medium text-gray-700 mb-2">Upload Your Image</div>
          <div className="text-gray-500">Click to select an image file</div>
        </label>
        {uploadedFile && (
          <div className="mt-4 text-sm text-indigo-600 font-medium">
            ✓ {uploadedFile.name}
          </div>
        )}
      </div>
      <div className="text-center text-gray-400 font-medium">OR</div>
      <div>
        <div className="text-lg font-medium text-gray-700 mb-4">Choose Sample Image</div>
        <div className="grid grid-cols-1 gap-4">
          {sampleImages.map((image) => (
            <div 
              key={image.id}
              onClick={() => {
                setSelectedSample(image.id);
                setSelectedInput('sample');
                setUploadedFile(null);
              }}
              className={`relative rounded-xl overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 ${
                selectedSample === image.id ? 'ring-4 ring-indigo-500 shadow-xl' : 'hover:shadow-lg'
              }`}
            >
              <img 
                src={image.url} 
                alt={image.name}
                className="w-full h-24 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                <div className="text-white font-medium p-3">{image.name}</div>
              </div>
              {selectedSample === image.id && (
                <div className="absolute top-2 right-2 bg-indigo-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  ✓
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

type MethodSectionProps = {
  selectedMethod: string | null;
  setSelectedMethod: (m: string) => void;
  isProcessing: boolean;
  handleProceed: () => void;
  canProceed: boolean;
};

const MethodSection = ({
  selectedMethod,
  setSelectedMethod,
  isProcessing,
  handleProceed,
  canProceed,
}: MethodSectionProps) => {
  const [showMethods, setShowMethods] = useState(false);

  return (
    <div className="bg-white/80 backdrop-blur rounded-3xl shadow-xl p-8 animate-fade-in flex flex-col justify-center" style={{ animationDelay: '0.2s' }}>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <div className="w-3 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3"></div>
        Method Selection
      </h2>
      <div className="text-center space-y-6">
        <Button 
          onClick={() => setShowMethods(!showMethods)}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          {selectedMethod ? methods.find(m => m.id === selectedMethod)?.name : 'Select Method'}
        </Button>
        {showMethods && (
          <div className="space-y-3 animate-fade-in">
            {methods.map((method) => (
              <div 
                key={method.id}
                onClick={() => {
                  setSelectedMethod(method.id);
                  setShowMethods(false);
                }}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                  selectedMethod === method.id 
                    ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300' 
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <div className="font-medium text-gray-800">{method.name}</div>
                <div className="text-sm text-gray-600">{method.description}</div>
              </div>
            ))}
          </div>
        )}
        <Button 
          onClick={handleProceed}
          disabled={!canProceed || isProcessing}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            'Proceed'
          )}
        </Button>
      </div>
    </div>
  );
};

type OutputSectionProps = {
  outputImage: string | null;
  isProcessing: boolean;
  handleReset: () => void;
};

const OutputSection = ({
  outputImage,
  isProcessing,
  handleReset,
}: OutputSectionProps) => (
  <div className="bg-white/80 backdrop-blur rounded-3xl shadow-xl p-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
      <div className="w-3 h-8 bg-gradient-to-b from-pink-500 to-indigo-500 rounded-full mr-3"></div>
      Output Display
    </h2>
    <div className="border-2 border-dashed border-gray-200 rounded-2xl h-96 flex items-center justify-center">
      {isProcessing ? (
        <div className="text-center text-lg text-gray-500">Processing...</div>
      ) : outputImage ? (
        <img src={outputImage} alt="Processed" className="max-h-80 max-w-full rounded-xl" />
      ) : (
        <div className="text-center">
          <div className="text-6xl mb-4">🖼️</div>
          <div className="text-lg font-medium text-gray-600 mb-2">Processed Image</div>
          <div className="text-gray-400">Results will appear here after processing</div>
        </div>
      )}
    </div>
    <div className="mt-6 flex gap-4">
      <Button 
        variant="outline" 
        className="flex-1 hover:bg-indigo-50 border-indigo-200"
        disabled={!outputImage}
        onClick={() => {
          if (outputImage) {
            const link = document.createElement('a');
            link.href = outputImage;
            link.download = 'result.png';
            link.click();
          }
        }}
      >
        Download Result
      </Button>
      <Button 
        variant="outline" 
        className="flex-1 hover:bg-red-50 border-red-200"
        onClick={handleReset}
        disabled={!outputImage}
      >
        Reset
      </Button>
    </div>
  </div>
);

export default Index;
