import { useRef } from 'react';

// Import model-viewer as a web component
import '@google/model-viewer';

export default function ARViewer({ modelUrl, productName }) {
  const modelRef = useRef(null);

  if (!modelUrl) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <p className="text-gray-500">3D preview not available for this product.</p>
      </div>
    );
  }

  const captureScreenshot = async () => {
    const viewer = modelRef.current;
    if (!viewer) return;

    try {
      const blob = await viewer.toBlob({ mimeType: 'image/png', idealAspect: true });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${productName || 'furniture'}-screenshot.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Screenshot capture failed', err);
    }
  };

  return (
    <div className="w-full relative">
      <model-viewer
        ref={modelRef}
        src={modelUrl}
        alt={`3D model of ${productName}`}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        shadow-intensity="1"
        style={{ width: '100%', height: '500px', borderRadius: '12px' }}
      >
        {/* Custom AR button */}
        <button
          slot="ar-button"
          className="absolute bottom-4 right-4 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          📱 View in Your Room
        </button>

        {/* Loading state */}
        <div slot="progress-bar" className="hidden" />
      </model-viewer>

      {/* Screenshot + info bar */}
      <div className="flex items-center justify-between mt-3">
        <p className="text-sm text-gray-500">
          📱 Open on mobile for full AR experience · 🖥️ Use mouse to rotate on desktop
        </p>
        <button
          onClick={captureScreenshot}
          className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition"
          title="Capture screenshot"
        >
          📸 Screenshot
        </button>
      </div>
    </div>
  );
}
