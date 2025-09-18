# AquaID - AI Model Integration Guide

## Overview
This guide explains how to integrate real AI models for fish identification, health assessment, and weight estimation in the AquaID mobile app.

## Current Implementation
The app currently uses mock AI services (`src/services/fishAI.ts`) that simulate real model responses. To deploy with actual AI capabilities, follow this guide.

## Model Integration Steps

### 1. Model Preparation

#### Required Models:
- **Fish Detection Model** (YOLOv8-Tiny/MobileNet-SSD)
- **Species Classification Model** (EfficientNet-Lite/MobileNetV3)  
- **Health Assessment Model** (Custom CNN)
- **Volume/Weight Estimation Model** (Depth estimation + regression)

#### Model Formats:
Convert your trained models to web-compatible formats:
- **ONNX** (recommended for performance)
- **TensorFlow.js** (good browser support)

### 2. File Structure

Place your model files in the public directory:

```
public/
├── models/
│   ├── fish-detection.onnx          # Object detection
│   ├── fish-classification.onnx     # Species classification
│   ├── health-assessment.onnx       # Quality/freshness
│   ├── weight-estimation.onnx       # Volume/weight prediction
│   └── metadata/
│       ├── species-labels.json      # Class labels
│       └── model-config.json       # Model configurations
```

### 3. Model Loading Implementation

Replace the mock service with real AI inference:

```typescript
// src/services/fishAI.ts
import { pipeline } from '@huggingface/transformers';

class FishAIService {
  private detector: any = null;
  private classifier: any = null;
  private healthAssessor: any = null;
  
  async loadModels() {
    // Load detection model (YOLO/SSD)
    this.detector = await pipeline(
      'object-detection',
      '/models/fish-detection.onnx',
      { device: 'webgpu' }
    );
    
    // Load classification model (EfficientNet)
    this.classifier = await pipeline(
      'image-classification',
      '/models/fish-classification.onnx',
      { device: 'webgpu' }
    );
    
    // Load health assessment model
    this.healthAssessor = await pipeline(
      'image-classification',
      '/models/health-assessment.onnx',
      { device: 'webgpu' }
    );
  }
  
  async identifyFish(imageData: string, location: any): Promise<FishIdentification[]> {
    // 1. Detect fish in image
    const detections = await this.detector(imageData);
    
    // 2. Classify each detected fish
    const results = [];
    for (const detection of detections) {
      const species = await this.classifier(detection.box);
      const health = await this.healthAssessor(detection.box);
      
      results.push({
        id: `fish_${Date.now()}_${Math.random()}`,
        species: species.label,
        confidence: species.score * 100,
        count: 1,
        estimatedWeight: this.estimateWeight(detection.box),
        healthScore: health.score * 100,
        freshness: this.determineFreshness(health.score),
        image: imageData,
        timestamp: new Date(),
        location
      });
    }
    
    return results;
  }
  
  private estimateWeight(boundingBox: any): number {
    // Implement weight estimation based on bounding box dimensions
    // Consider using reference objects for scale
    const area = boundingBox.width * boundingBox.height;
    return area * 0.001; // Simplified calculation
  }
}
```

### 4. Training Data Requirements

#### Dataset Structure:
```
training-data/
├── detection/
│   ├── images/          # Raw fish images
│   └── annotations/     # YOLO/COCO format annotations
├── classification/
│   ├── salmon/         # Images per species
│   ├── tuna/
│   ├── cod/
│   └── ...
└── health/
    ├── excellent/      # High quality fish images
    ├── good/
    ├── fair/
    └── poor/
```

#### Minimum Dataset Size:
- **Detection**: 5,000+ annotated images
- **Classification**: 1,000+ images per species (10+ species)
- **Health Assessment**: 2,000+ images per quality level

### 5. Model Training Pipeline

#### Using YOLOv8 for Detection:
```python
from ultralytics import YOLO

# Train detection model
model = YOLO('yolov8n.pt')
model.train(
    data='fish-detection-dataset.yaml',
    epochs=100,
    device='gpu',
    batch=16
)

# Export to ONNX
model.export(format='onnx', optimize=True)
```

#### Using TensorFlow for Classification:
```python
import tensorflow as tf

# Create EfficientNet model
base_model = tf.keras.applications.EfficientNetB0(
    input_shape=(224, 224, 3),
    include_top=False,
    weights='imagenet'
)

model = tf.keras.Sequential([
    base_model,
    tf.keras.layers.GlobalAveragePooling2D(),
    tf.keras.layers.Dense(len(species_classes), activation='softmax')
])

# Train and export
model.compile(optimizer='adam', loss='categorical_crossentropy')
model.fit(train_data, epochs=50)

# Convert to TensorFlow.js
tf.saved_model.save(model, 'saved_model')
!tensorflowjs_converter --input_format=tf_saved_model saved_model models/
```

### 6. Performance Optimization

#### Model Size Optimization:
- Use quantization to reduce model size
- Implement model pruning for faster inference
- Consider using WebAssembly for performance-critical operations

```javascript
// Enable WebGPU for better performance
const detector = await pipeline('object-detection', model_path, {
  device: 'webgpu',
  dtype: 'fp16'  // Use half precision for faster inference
});
```

#### Caching Strategy:
```typescript
// Cache models in browser storage
const modelCache = await caches.open('aquaid-models');
await modelCache.addAll([
  '/models/fish-detection.onnx',
  '/models/fish-classification.onnx',
  '/models/health-assessment.onnx'
]);
```

### 7. Volume/Weight Estimation

#### Depth Sensing Implementation:
```typescript
// Use ARCore/ARKit for depth sensing
import { CapacitorARCore } from '@capacitor-community/arcore';

async estimateVolume(imageData: string, boundingBoxes: any[]) {
  try {
    // Get depth data
    const depthData = await CapacitorARCore.getDepthMap();
    
    // Calculate volume using depth + bounding box
    const volumes = boundingBoxes.map(box => {
      const depth = this.getAverageDepth(depthData, box);
      return box.width * box.height * depth * SCALE_FACTOR;
    });
    
    return volumes;
  } catch (error) {
    // Fallback to 2D estimation
    return this.estimate2DVolume(boundingBoxes);
  }
}
```

### 8. Testing and Validation

#### Model Accuracy Testing:
```typescript
// Test model accuracy with validation dataset
const testAccuracy = async () => {
  const testImages = await loadTestDataset();
  let correct = 0;
  
  for (const image of testImages) {
    const prediction = await fishAI.identifyFish(image.data);
    if (prediction[0]?.species === image.label) correct++;
  }
  
  return correct / testImages.length;
};
```

### 9. Deployment Checklist

- [ ] Models converted to web-compatible formats
- [ ] Model files placed in public/models/ directory
- [ ] Species labels and metadata configured
- [ ] WebGPU/WebAssembly support tested
- [ ] Offline functionality verified
- [ ] Performance benchmarked on target devices
- [ ] Accuracy validated with test dataset

### 10. Model Updates

#### Over-the-Air Updates:
```typescript
// Check for model updates
const checkModelUpdates = async () => {
  const response = await fetch('/api/model-versions');
  const latest = await response.json();
  
  if (latest.version > currentModelVersion) {
    await downloadModelUpdate(latest.downloadUrl);
  }
};
```

## Hardware Requirements

### Minimum Device Specs:
- **RAM**: 4GB+ (for model loading)
- **Storage**: 200MB+ (for model files)
- **CPU**: ARM64 or equivalent
- **GPU**: WebGPU compatible (recommended)

### Recommended Specs:
- **RAM**: 8GB+
- **Storage**: 500MB+
- **GPU**: Dedicated graphics with WebGPU support

## Support and Troubleshooting

### Common Issues:
1. **Model loading errors**: Check file paths and formats
2. **Performance issues**: Enable WebGPU, reduce model size
3. **Accuracy problems**: Review training data quality
4. **Memory issues**: Implement model unloading after use

### Debug Mode:
Enable detailed logging in development:
```typescript
env.debug = true;
env.logging = 'verbose';
```

This guide provides the foundation for integrating real AI models into AquaID. For production deployment, ensure thorough testing with your specific fish species and operating conditions.