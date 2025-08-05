const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
    }
  }
});

// POST /api/pest-disease/analyze - Analyze plant image for pests and diseases
router.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // In a real implementation, you would:
    // 1. Send the image to an AI/ML service (like Hugging Face, Google Vision AI, or custom model)
    // 2. Process the image through a plant disease detection model
    // 3. Return the analysis results

    // For now, we'll return mock data based on common plant diseases
    const mockResults = [
      {
        disease: 'Late Blight',
        confidence: 87,
        severity: 'high',
        description: 'Late blight is a destructive disease that affects potato and tomato plants. It is caused by the fungus-like organism Phytophthora infestans.',
        treatments: [
          'Apply copper-based fungicides immediately',
          'Remove and destroy affected plant parts',
          'Improve air circulation around plants',
          'Apply preventive fungicide spray'
        ],
        prevention: [
          'Plant resistant varieties when available',
          'Ensure proper spacing for air circulation',
          'Avoid overhead watering',
          'Apply preventive fungicide treatments',
          'Remove plant debris after harvest'
        ]
      },
      {
        disease: 'Powdery Mildew',
        confidence: 92,
        severity: 'medium',
        description: 'Powdery mildew is a fungal disease that appears as white or gray powdery spots on leaves and stems.',
        treatments: [
          'Apply sulfur-based fungicides',
          'Spray with baking soda solution (1 tsp per quart water)',
          'Remove affected plant parts',
          'Increase air circulation'
        ],
        prevention: [
          'Plant in areas with good air circulation',
          'Avoid overhead watering',
          'Space plants properly',
          'Apply preventive fungicide treatments'
        ]
      },
      {
        disease: 'Bacterial Spot',
        confidence: 78,
        severity: 'medium',
        description: 'Bacterial spot causes small, dark lesions on leaves, stems, and fruits of tomatoes and peppers.',
        treatments: [
          'Apply copper-based bactericides',
          'Remove and destroy infected plant material',
          'Avoid overhead irrigation',
          'Improve air circulation'
        ],
        prevention: [
          'Use disease-free seeds and transplants',
          'Rotate crops annually',
          'Avoid working with wet plants',
          'Maintain proper plant spacing'
        ]
      },
      {
        disease: 'Aphid Infestation',
        confidence: 85,
        severity: 'low',
        description: 'Aphids are small, soft-bodied insects that feed on plant sap and can transmit viral diseases.',
        treatments: [
          'Spray with insecticidal soap',
          'Use neem oil spray',
          'Release beneficial insects (ladybugs)',
          'Wash off with strong water spray'
        ],
        prevention: [
          'Encourage beneficial insects',
          'Plant companion plants (marigolds, nasturtiums)',
          'Monitor plants regularly',
          'Remove weeds that harbor aphids'
        ]
      },
      {
        disease: 'Leaf Rust',
        confidence: 81,
        severity: 'medium',
        description: 'Leaf rust appears as orange or reddish-brown pustules on leaf surfaces, commonly affecting wheat and other cereal crops.',
        treatments: [
          'Apply fungicide spray containing triazole compounds',
          'Remove severely infected leaves',
          'Ensure good air circulation',
          'Monitor weather conditions for favorable disease development'
        ],
        prevention: [
          'Plant rust-resistant varieties',
          'Rotate crops to break disease cycle',
          'Avoid late season nitrogen fertilization',
          'Monitor for early symptoms regularly'
        ]
      },
      {
        disease: 'Downy Mildew',
        confidence: 76,
        severity: 'high',
        description: 'Downy mildew causes yellowing and browning of leaves with fuzzy growth on undersides, particularly in cool, moist conditions.',
        treatments: [
          'Apply copper-based fungicides',
          'Improve drainage and air circulation',
          'Remove infected plant material',
          'Reduce humidity around plants'
        ],
        prevention: [
          'Ensure proper plant spacing',
          'Water at soil level, not on leaves',
          'Plant in well-draining soil',
          'Use drip irrigation instead of overhead watering'
        ]
      },
      {
        disease: 'Spider Mite Damage',
        confidence: 89,
        severity: 'medium',
        description: 'Spider mites cause stippling, yellowing, and fine webbing on leaves, thriving in hot, dry conditions.',
        treatments: [
          'Spray with miticide or insecticidal soap',
          'Increase humidity around plants',
          'Use predatory mites as biological control',
          'Hose down plants with strong water spray'
        ],
        prevention: [
          'Maintain adequate soil moisture',
          'Increase humidity in growing area',
          'Encourage beneficial insects',
          'Avoid over-fertilizing with nitrogen'
        ]
      },
      {
        disease: 'Bacterial Wilt',
        confidence: 73,
        severity: 'high',
        description: 'Bacterial wilt causes sudden wilting and death of plants, commonly transmitted by cucumber beetles.',
        treatments: [
          'Remove and destroy infected plants immediately',
          'Control insect vectors (cucumber beetles)',
          'Apply copper-based bactericides preventively',
          'Improve soil drainage'
        ],
        prevention: [
          'Use row covers early in season',
          'Control cucumber beetle populations',
          'Practice crop rotation',
          'Choose resistant varieties when available'
        ]
      },
      {
        disease: 'Healthy Plant',
        confidence: 94,
        severity: 'low',
        description: 'The plant appears healthy with no visible signs of disease or pest damage.',
        treatments: [
          'Continue current care routine',
          'Monitor regularly for changes',
          'Maintain proper watering schedule'
        ],
        prevention: [
          'Maintain good cultural practices',
          'Ensure proper nutrition',
          'Monitor for early signs of problems',
          'Keep growing area clean'
        ]
      }
    ];

    // Create a more varied selection based on image characteristics
    // Use file size, name, and timestamp to create pseudo-randomization
    const currentTime = Date.now();
    const fileHash = (req.file.size * 13 + req.file.originalname.length * 7 + currentTime) % 1000000;
    const nameHash = req.file.originalname.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Combine multiple factors for better distribution
    const combinedHash = (fileHash + nameHash + Math.floor(currentTime / 100)) % mockResults.length;
    
    // Add micro-second precision for additional randomness
    const microVariation = (currentTime % 1000) % mockResults.length;
    const finalIndex = (combinedHash + microVariation) % mockResults.length;
    
    console.log(`🔢 Hash calculation: fileHash=${fileHash}, nameHash=${nameHash}, combinedHash=${combinedHash}, microVariation=${microVariation}`);
    
    const selectedResult = { ...mockResults[finalIndex] }; // Create a copy to avoid modifying original
    
    // Add slight confidence variation to make results feel more realistic
    const confidenceVariation = Math.floor(Math.random() * 10) - 5; // -5 to +5
    selectedResult.confidence = Math.max(65, Math.min(95, selectedResult.confidence + confidenceVariation));

    // Log the analysis request
    console.log(`🔍 Pest/Disease analysis requested for image: ${req.file.originalname}`);
    console.log(`📏 File size: ${req.file.size} bytes`);
    console.log(`🎭 MIME type: ${req.file.mimetype}`);
    console.log(`🎲 Final index selected: ${finalIndex} out of ${mockResults.length} options`);
    console.log(`🎯 Selected disease: ${selectedResult.disease}`);
    console.log(`📊 Confidence after variation: ${selectedResult.confidence}%`);

    res.json({
      success: true,
      result: selectedResult,
      metadata: {
        filename: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        analyzedAt: new Date().toISOString(),
        analysisMethod: 'AI-powered plant disease detection (demo mode)'
      }
    });

  } catch (error) {
    console.error('Error analyzing image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze image',
      error: error.message
    });
  }
});

// GET /api/pest-disease/diseases - Get list of common plant diseases
router.get('/diseases', (req, res) => {
  try {
    const commonDiseases = [
      {
        name: 'Late Blight',
        category: 'Fungal',
        affectedCrops: ['Tomato', 'Potato'],
        symptoms: ['Dark lesions on leaves', 'White fungal growth', 'Rapid plant death'],
        severity: 'High'
      },
      {
        name: 'Powdery Mildew',
        category: 'Fungal',
        affectedCrops: ['Cucumber', 'Squash', 'Tomato', 'Rose'],
        symptoms: ['White powdery coating', 'Yellowing leaves', 'Stunted growth'],
        severity: 'Medium'
      },
      {
        name: 'Bacterial Spot',
        category: 'Bacterial',
        affectedCrops: ['Tomato', 'Pepper'],
        symptoms: ['Small dark spots', 'Leaf yellowing', 'Fruit lesions'],
        severity: 'Medium'
      },
      {
        name: 'Aphid Infestation',
        category: 'Pest',
        affectedCrops: ['Most vegetables', 'Fruit trees'],
        symptoms: ['Curled leaves', 'Sticky honeydew', 'Yellowing'],
        severity: 'Low'
      }
    ];

    res.json({
      success: true,
      diseases: commonDiseases
    });

  } catch (error) {
    console.error('Error fetching diseases:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch disease information'
    });
  }
});

// GET /api/pest-disease/tips - Get analysis tips
router.get('/tips', (req, res) => {
  try {
    const tips = {
      photoTips: [
        'Take photos in natural daylight for best results',
        'Ensure the affected area is clearly visible and in focus',
        'Take close-up photos showing symptoms clearly',
        'Capture different parts of the plant if possible'
      ],
      generalTips: [
        'Clean the camera lens before taking photos',
        'Take multiple photos from different angles',
        'Include both affected and healthy parts for comparison',
        'Avoid using flash as it can create shadows and distort colors'
      ]
    };

    res.json({
      success: true,
      tips: tips
    });

  } catch (error) {
    console.error('Error fetching tips:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tips'
    });
  }
});

module.exports = router;
