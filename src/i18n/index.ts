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
  },
  te: {
    translation: {
      // App title
      appTitle: "AquaID",
      appSubtitle: "చేప గుర్తింపు వ్యవస్థ",
      appDescription: "సముద్ర పరిశ్రమ కోసం వృత్తిపరమైన చేప గుర్తింపు",
      
      // Camera
      startCamera: "కెమేరా ప్రారంభించు",
      stopCamera: "కెమేరా ఆపు",
      capture: "చేపను క్యాప్చర్ చేయి",
      processing: "ప్రాసెసింగ్...",
      cameraReady: "కెమేరా సిద్ధం - చేపల వైపు గురిపెట్టి క్యాప్చర్ చేయండి",
      cameraError: "కెమేరా యాక్సెస్ నిరాకరించబడింది లేదా అందుబాటులో లేదు",
      
      // Results
      fishDetected: "చేప గుర్తించబడింది",
      noFishDetected: "చేపలు గుర్తించబడలేదు",
      species: "జాతి",
      confidence: "విశ్వాసం",
      count: "సంఖ్య",
      weight: "బరువు",
      quality: "నాణ్యత",
      freshness: "తాజాతనం",
      
      // Actions
      save: "ఫలితాలను సేవ్ చేయి",
      newCapture: "కొత్త క్యాప్చర్",
      
      // Quality levels
      excellent: "అద్భుతమైన",
      good: "మంచి",
      fair: "సాధారణ",
      poor: "చెడు",
      
      // Navigation
      camera: "కెమేరా",
      results: "ఫలితాలు",
      history: "చరిత్र",
      
      // Messages
      captureSuccess: "చిత్రం విజయవంతంగా క్యాప్చర్ చేయబడింది",
      processingFish: "చేప గుర్తింపు ప్రాసెసింగ్...",
      analysisComplete: "విశ్లేషణ పూర్తయింది",
      saveSuccess: "ఫలితాలు స్థానికంగా సేవ్ చేయబడ్డాయి",
      saveFailed: "ఫలితాలను సేవ్ చేయలేకపోయింది"
    }
  },
  hi: {
    translation: {
      // App title
      appTitle: "AquaID",
      appSubtitle: "मछली पहचान प्रणाली",
      appDescription: "समुद्री उद्योग के लिए पेशेवर मछली पहचान",
      
      // Camera
      startCamera: "कैमरा शुरू करें",
      stopCamera: "कैमरा बंद करें",
      capture: "मछली कैप्चर करें",
      processing: "प्रोसेसिंग...",
      cameraReady: "कैमरा तैयार - मछली की ओर इशारा करें और कैप्चर करें",
      cameraError: "कैमरा एक्सेस नकारा गया या उपलब्ध नहीं है",
      
      // Results
      fishDetected: "मछली का पता लगाया गया",
      noFishDetected: "कोई मछली नहीं मिली",
      species: "प्रजाति",
      confidence: "विश्वास",
      count: "गिनती",
      weight: "वजन",
      quality: "गुणवत्ता",
      freshness: "ताजगी",
      
      // Actions
      save: "परिणाम सेव करें",
      newCapture: "नया कैप्चर",
      
      // Quality levels
      excellent: "उत्कृष्ट",
      good: "अच्छा",
      fair: "ठीक",
      poor: "खराब",
      
      // Navigation
      camera: "कैमरा",
      results: "परिणाम",
      history: "इतिहास",
      
      // Messages
      captureSuccess: "छवि सफलतापूर्वक कैप्चर की गई",
      processingFish: "मछली पहचान प्रोसेसिंग...",
      analysisComplete: "विश्लेषण पूरा",
      saveSuccess: "परिणाम स्थानीय रूप से सेव किए गए",
      saveFailed: "परिणाम सेव नहीं हो सके"
    }
  },
  ta: {
    translation: {
      // App title
      appTitle: "AquaID",
      appSubtitle: "மீன் அடையாள அமைப்பு",
      appDescription: "கடல் தொழிலுக்கான தொழில்முறை மீன் அடையாளம்",
      
      // Camera
      startCamera: "கேமராவை தொடங்கு",
      stopCamera: "கேமராவை நிறுத்து",
      capture: "மீனை படம் பிடி",
      processing: "செயலாக்கம்...",
      cameraReady: "கேமரா தயார் - மீனை நோக்கி படம் பிடிக்கவும்",
      cameraError: "கேமரா அணுகல் மறுக்கப்பட்டது அல்லது கிடைக்கவில்லை",
      
      // Results
      fishDetected: "மீன் கண்டறியப்பட்டது",
      noFishDetected: "மீன் கண்டறியப்படவில்லை",
      species: "இனம்",
      confidence: "நம்பிக்கை",
      count: "எண்ணிக்கை",
      weight: "எடை",
      quality: "தரம்",
      freshness: "புதுமை",
      
      // Actions
      save: "முடிவுகளை சேமி",
      newCapture: "புதிய படம்",
      
      // Quality levels
      excellent: "சிறந்த",
      good: "நல்ல",
      fair: "சரியான",
      poor: "மோசமான",
      
      // Navigation
      camera: "கேமரா",
      results: "முடிவுகள்",
      history: "வரலாறு",
      
      // Messages
      captureSuccess: "படம் வெற்றிகரமாக பிடிக்கப்பட்டது",
      processingFish: "மீன் அடையாள செயலாக்கம்...",
      analysisComplete: "பகுப்பாய்வு முடிந்தது",
      saveSuccess: "முடிவுகள் உள்ளூரில் சேமிக்கப்பட்டன",
      saveFailed: "முடிவுகளை சேமிக்க முடியவில்லை"
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