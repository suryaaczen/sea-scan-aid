import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // App title
      appTitle: "AquaID",
      appSubtitle: "Fish Identification System",
      appDescription: "Professional fish identification for maritime industry",
      
      // Camera
      startCamera: "Start Camera",
      stopCamera: "Stop Camera",
      capture: "Capture Fish",
      processing: "Processing...",
      cameraReady: "Camera Ready - Point at fish and capture",
      cameraError: "Camera access denied or unavailable",
      
      // Results
      fishDetected: "Fish Detected",
      noFishDetected: "No fish detected",
      species: "Species",
      confidence: "Confidence",
      count: "Count",
      weight: "Weight",
      quality: "Quality",
      freshness: "Freshness",
      
      // Actions
      save: "Save Results",
      newCapture: "New Capture",
      
      // Quality levels
      excellent: "Excellent",
      good: "Good",
      fair: "Fair", 
      poor: "Poor",
      
      // Navigation
      camera: "Camera",
      results: "Results",
      history: "History",
      
      // Messages
      captureSuccess: "Image captured successfully",
      processingFish: "Processing fish identification...",
      analysisComplete: "Analysis complete",
      saveSuccess: "Results saved locally",
      saveFailed: "Could not save results"
    }
  },
  es: {
    translation: {
      // App title
      appTitle: "AquaID",
      appSubtitle: "Sistema de Identificación de Peces",
      appDescription: "Identificación profesional de peces para la industria marítima",
      
      // Camera
      startCamera: "Iniciar Cámara",
      stopCamera: "Detener Cámara",
      capture: "Capturar Pez",
      processing: "Procesando...",
      cameraReady: "Cámara Lista - Apunta a los peces y captura",
      cameraError: "Acceso a cámara denegado o no disponible",
      
      // Results
      fishDetected: "Pez Detectado",
      noFishDetected: "No se detectaron peces",
      species: "Especie",
      confidence: "Confianza",
      count: "Cantidad",
      weight: "Peso",
      quality: "Calidad",
      freshness: "Frescura",
      
      // Actions
      save: "Guardar Resultados",
      newCapture: "Nueva Captura",
      
      // Quality levels
      excellent: "Excelente",
      good: "Bueno",
      fair: "Regular",
      poor: "Malo",
      
      // Navigation
      camera: "Cámara",
      results: "Resultados",
      history: "Historial",
      
      // Messages
      captureSuccess: "Imagen capturada exitosamente",
      processingFish: "Procesando identificación de peces...",
      analysisComplete: "Análisis completo",
      saveSuccess: "Resultados guardados localmente",
      saveFailed: "No se pudieron guardar los resultados"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;