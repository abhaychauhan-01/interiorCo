import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { generate3DView } from "../../lib/ai.action";
import { Box, Divide, Download, RefreshCcw, Share2, X } from "lucide-react";
import Button from "../../components/ui/Button";

const VisualizerId = () => {
  const location = useLocation();
  const Navigate = useNavigate();
  const { initialImage, initialRender, name } = location.state || {};
  const hasInitialGenerated = useRef(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentImage, SetCurrentImage] = useState<string | null>(
    initialRender || null,
  );
  const handleBack = () => Navigate("/");
  const runGeneration = async () => {
    if (!initialImage) return;
    try {
      setIsProcessing(true);
      const result = await generate3DView({ sourceImage: initialImage });
      if (result.renderedImage) {
        SetCurrentImage(result.renderedImage);
        //update proj with rendered image
      }
    } catch (e) {
      console.error("Generation Failed:", e);
    } finally {
      setIsProcessing(false);
    }
  };
  useEffect(() => {
    if (!initialImage || hasInitialGenerated.current) return;
    if (!initialRender) {
      SetCurrentImage(initialRender);
      hasInitialGenerated.current = true;
      return;
    }
    hasInitialGenerated.current = true;
    runGeneration();
  }, [initialImage, initialRender]);

  return (
    <div className="visualizer">
      <nav className="topbar">
        <div className="brand">
          <Box className="logo" />
          <span className="name">interiorCo</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleBack} className="exit">
          <X className="icon" />
          Exit Editor
        </Button>
      </nav>
      <section className="content">
        <div className="panel">
          <div className="panel-header">
            <div className="panel-meta">
              <p>Project</p>
              <h2>{`Untitled Project`}</h2>
              <p className="note">Created by You</p>
            </div>
            <div className="panel-actions">
              <Button size="sm" onClick={() => {}} disabled={!currentImage}>
                <Download className="w-4 h - 4 mr-2" />
                Export
              </Button>
              <Button size="sm" onClick={()=>{}} className="share">
                <Share2 className="w-4 h-4 mr-2"/>
                Share
              </Button>
            </div>
          </div>
          <div className={`render-area ${isProcessing?'is-processing':''}`}>
            {currentImage?(
              <img src={currentImage} alt="AI Render" className="render-img"/>
            ):(
              <div className="render-placeholder">
                {initialImage&&(
                  <img src={initialImage} alt="Original" className="render-fallback"/>
                )}
              </div>
            )}
            {isProcessing&&(
              <div className="render-overlay">
                <div className="rendering-card">
                  <RefreshCcw className="spinner"/>
                  <span  className="title">Rendering...</span>
                  <span className="subtitle">Generating your 3D visualization</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default VisualizerId;
