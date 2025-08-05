const { v4: uuidv4 } = require('uuid');

// In-memory storage for demo purposes
// In production, this should use a proper database
let emergencyRequests = [];
let emergencyCounter = 1;

// Emergency response templates
const emergencyResponses = {
  pest_disease: {
    immediate: [
      'Isolate affected plants immediately to prevent spread',
      'Take clear photos of affected areas for expert identification',
      'Stop all irrigation to affected areas if fungal infection suspected',
      'Contact your local agricultural extension office'
    ],
    resources: ['agricultural_extension', 'pesticide_supplier', 'plant_pathologist'],
    contacts: [
      { type: 'Plant Disease Helpline', phone: '1-800-PLANT-HELP', available: '24/7' },
      { type: 'Agricultural Extension Office', phone: 'Contact local office', available: 'Business hours' }
    ]
  },
  weather_damage: {
    immediate: [
      'Assess crop damage and document with photos',
      'Check for standing water and drainage issues',
      'Protect remaining healthy plants from further exposure',
      'Contact insurance provider if applicable'
    ],
    resources: ['emergency_services', 'agricultural_insurance', 'weather_service'],
    contacts: [
      { type: 'Weather Emergency Hotline', phone: '1-800-WEATHER', available: '24/7' },
      { type: 'Agricultural Insurance Claims', phone: 'Contact your provider', available: 'Business hours' }
    ]
  },
  equipment_failure: {
    immediate: [
      'Shut down all electrical equipment safely',
      'Document equipment condition with photos',
      'Check warranty and service agreements',
      'Arrange temporary alternatives if critical operation'
    ],
    resources: ['equipment_rental', 'repair_services', 'agricultural_supply'],
    contacts: [
      { type: 'Equipment Emergency Repair', phone: '1-800-FIX-FARM', available: '24/7' },
      { type: 'Equipment Rental Services', phone: 'Contact local providers', available: 'Extended hours' }
    ]
  },
  soil_issues: {
    immediate: [
      'Stop all farming activities in affected area',
      'Collect soil samples for testing',
      'Document the extent of affected area',
      'Prevent contamination spread to other areas'
    ],
    resources: ['soil_testing_lab', 'agricultural_extension', 'environmental_services'],
    contacts: [
      { type: 'Soil Testing Emergency', phone: '1-800-SOIL-TEST', available: 'Business hours' },
      { type: 'Environmental Services', phone: 'Contact local EPA office', available: 'Business hours' }
    ]
  },
  irrigation_problems: {
    immediate: [
      'Turn off water supply to prevent flooding or waste',
      'Assess water pressure and flow rates',
      'Check for leaks or blockages in the system',
      'Arrange alternative water sources if critical'
    ],
    resources: ['irrigation_specialists', 'water_management', 'pump_services'],
    contacts: [
      { type: 'Irrigation Emergency Services', phone: '1-800-WATER-FIX', available: '24/7' },
      { type: 'Water Management Authority', phone: 'Contact local office', available: 'Business hours' }
    ]
  },
  livestock_emergency: {
    immediate: [
      'Separate affected animals from healthy ones',
      'Ensure animals have access to clean water',
      'Document symptoms and behavior changes',
      'Contact veterinarian immediately'
    ],
    resources: ['veterinary_services', 'animal_emergency', 'livestock_specialist'],
    contacts: [
      { type: 'Veterinary Emergency', phone: '1-800-VET-HELP', available: '24/7' },
      { type: 'Livestock Disease Reporting', phone: 'Contact state veterinarian', available: '24/7' }
    ]
  },
  other: {
    immediate: [
      'Ensure safety of all personnel first',
      'Document the situation with photos/videos',
      'Contact appropriate emergency services if needed',
      'Seek professional agricultural advice'
    ],
    resources: ['emergency_services', 'agricultural_extension', 'professional_consultants'],
    contacts: [
      { type: 'General Agricultural Helpline', phone: '1-800-FARM-HELP', available: 'Business hours' },
      { type: 'Emergency Services', phone: '911', available: '24/7' }
    ]
  }
};

// Mock resource database
const mockResources = {
  veterinary: [
    { name: 'Farm Veterinary Services', phone: '555-0101', distance: 5.2, address: 'Local Area', rating: 4.8, available: true },
    { name: 'Livestock Health Center', phone: '555-0102', distance: 12.1, address: 'Nearby Town', rating: 4.6, available: true }
  ],
  extension_office: [
    { name: 'County Agricultural Extension', phone: '555-0201', distance: 8.7, address: 'County Seat', rating: 4.9, available: true },
    { name: 'State University Extension', phone: '555-0202', distance: 15.3, address: 'University Campus', rating: 4.7, available: true }
  ],
  equipment_rental: [
    { name: 'Farm Equipment Rentals', phone: '555-0301', distance: 6.8, address: 'Industrial District', rating: 4.5, available: true },
    { name: 'Agricultural Machinery Co.', phone: '555-0302', distance: 11.2, address: 'Highway 50', rating: 4.4, available: true }
  ],
  emergency_services: [
    { name: 'Local Fire Department', phone: '911', distance: 3.1, address: 'Main Street', rating: 5.0, available: true },
    { name: 'Emergency Medical Services', phone: '911', distance: 4.5, address: 'Hospital Campus', rating: 5.0, available: true }
  ],
  agricultural_supply: [
    { name: 'Farm Supply Store', phone: '555-0401', distance: 7.3, address: 'Farm Road', rating: 4.6, available: true },
    { name: 'Agricultural Solutions Inc.', phone: '555-0402', distance: 13.8, address: 'Business Park', rating: 4.3, available: true }
  ]
};

const sosEmergencyService = {
  // Submit emergency request
  async submitEmergency(emergencyData) {
    const emergencyId = `SOS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const emergency = {
      id: emergencyId,
      ...emergencyData,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responseTime: this.calculateEstimatedResponseTime(emergencyData.severity),
      ticketNumber: `FARM-${emergencyCounter.toString().padStart(6, '0')}`
    };

    emergencyRequests.push(emergency);
    emergencyCounter++;

    // Simulate immediate response generation
    const immediateResponse = await this.generateImmediateResponse(emergency);
    
    return {
      emergencyId,
      ticketNumber: emergency.ticketNumber,
      status: emergency.status,
      estimatedResponseTime: emergency.responseTime,
      immediateActions: immediateResponse.actions,
      emergencyContacts: immediateResponse.contacts,
      submittedAt: emergency.submittedAt
    };
  },

  // Generate immediate response based on emergency type
  async generateImmediateResponse(emergency) {
    const responseTemplate = emergencyResponses[emergency.emergencyType] || emergencyResponses.other;
    
    return {
      actions: responseTemplate.immediate,
      contacts: responseTemplate.contacts,
      resources: responseTemplate.resources
    };
  },

  // Get detailed emergency recommendations
  async getEmergencyRecommendations(params) {
    const { emergencyType, severity, location, cropType, description } = params;
    const responseTemplate = emergencyResponses[emergencyType] || emergencyResponses.other;
    
    // Simulate AI-powered recommendations based on parameters
    const recommendations = {
      immediate: responseTemplate.immediate,
      shortTerm: this.generateShortTermRecommendations(emergencyType, severity, cropType),
      longTerm: this.generateLongTermRecommendations(emergencyType, cropType),
      prevention: this.generatePreventionTips(emergencyType),
      estimatedCosts: this.estimateEmergencyCosts(emergencyType, severity),
      timeframe: this.estimateRecoveryTime(emergencyType, severity),
      riskLevel: this.assessRiskLevel(emergencyType, severity, description)
    };

    return recommendations;
  },

  // Get nearby agricultural resources
  async getNearbyResources(location, resourceType, radius = 50) {
    // In production, this would query a real database with geospatial data
    const allResources = resourceType ? 
      (mockResources[resourceType] || []) : 
      Object.values(mockResources).flat();

    // Simulate distance-based filtering and sorting
    const nearbyResources = allResources
      .map(resource => ({
        ...resource,
        estimatedArrival: this.calculateEstimatedArrival(resource.distance),
        coordinates: this.generateMockCoordinates(location, resource.distance)
      }))
      .filter(resource => resource.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    return {
      resources: nearbyResources,
      totalFound: nearbyResources.length,
      searchRadius: radius,
      searchLocation: location
    };
  },

  // Get emergency status
  async getEmergencyStatus(emergencyId) {
    const emergency = emergencyRequests.find(req => req.id === emergencyId);
    
    if (!emergency) {
      return null;
    }

    // Simulate status updates over time
    const timeSinceSubmission = Date.now() - new Date(emergency.submittedAt).getTime();
    const statusUpdates = this.generateStatusUpdates(timeSinceSubmission, emergency.severity);

    return {
      ...emergency,
      statusHistory: statusUpdates,
      currentStatus: statusUpdates[statusUpdates.length - 1]
    };
  },

  // Helper methods
  calculateEstimatedResponseTime(severity) {
    const times = {
      critical: '15-30 minutes',
      high: '1-2 hours',
      medium: '2-4 hours',
      low: '4-24 hours'
    };
    return times[severity] || times.medium;
  },

  generateShortTermRecommendations(emergencyType, severity, cropType) {
    const baseRecommendations = {
      pest_disease: ['Apply targeted treatment', 'Monitor spread daily', 'Implement quarantine measures'],
      weather_damage: ['Assess and repair infrastructure', 'Replant if necessary', 'Improve drainage systems'],
      equipment_failure: ['Arrange repairs or replacement', 'Implement backup procedures', 'Review maintenance schedule'],
      soil_issues: ['Conduct comprehensive soil testing', 'Apply remediation measures', 'Monitor soil health'],
      irrigation_problems: ['Repair irrigation system', 'Implement water conservation', 'Check water quality'],
      livestock_emergency: ['Follow veterinary treatment plan', 'Monitor animal health closely', 'Implement biosecurity measures']
    };

    return baseRecommendations[emergencyType] || ['Seek professional consultation', 'Monitor situation closely', 'Document all changes'];
  },

  generateLongTermRecommendations(emergencyType, cropType) {
    return [
      'Implement preventive monitoring systems',
      'Review and update emergency response plans',
      'Consider insurance coverage options',
      'Invest in early warning systems',
      'Build relationships with agricultural professionals'
    ];
  },

  generatePreventionTips(emergencyType) {
    const tips = {
      pest_disease: ['Regular crop monitoring', 'Integrated pest management', 'Proper sanitation practices'],
      weather_damage: ['Weather monitoring systems', 'Crop protection structures', 'Disaster preparedness planning'],
      equipment_failure: ['Regular maintenance schedules', 'Backup equipment planning', 'Operator training programs'],
      soil_issues: ['Regular soil testing', 'Proper fertilization practices', 'Sustainable farming methods'],
      irrigation_problems: ['System maintenance', 'Water quality monitoring', 'Efficient irrigation technology'],
      livestock_emergency: ['Health monitoring programs', 'Vaccination schedules', 'Biosecurity measures']
    };

    return tips[emergencyType] || ['Regular monitoring', 'Professional consultations', 'Emergency preparedness'];
  },

  estimateEmergencyCosts(emergencyType, severity) {
    const baseCosts = {
      pest_disease: { low: 200, medium: 800, high: 2000, critical: 5000 },
      weather_damage: { low: 500, medium: 2000, high: 8000, critical: 20000 },
      equipment_failure: { low: 300, medium: 1500, high: 5000, critical: 15000 },
      soil_issues: { low: 400, medium: 1200, high: 4000, critical: 10000 },
      irrigation_problems: { low: 250, medium: 1000, high: 3500, critical: 8000 },
      livestock_emergency: { low: 150, medium: 600, high: 2500, critical: 6000 }
    };

    const costs = baseCosts[emergencyType] || baseCosts.pest_disease;
    return {
      estimated: costs[severity] || costs.medium,
      range: `$${costs[severity] * 0.7} - $${costs[severity] * 1.5}`,
      currency: 'INR'
    };
  },

  estimateRecoveryTime(emergencyType, severity) {
    const times = {
      pest_disease: { low: '1-2 weeks', medium: '2-4 weeks', high: '1-2 months', critical: '2-6 months' },
      weather_damage: { low: '1-3 weeks', medium: '1-2 months', high: '2-4 months', critical: '6-12 months' },
      equipment_failure: { low: '1-3 days', medium: '1-2 weeks', high: '2-4 weeks', critical: '1-3 months' },
      soil_issues: { low: '2-4 weeks', medium: '1-3 months', high: '3-6 months', critical: '6-18 months' },
      irrigation_problems: { low: '1-2 weeks', medium: '2-4 weeks', high: '1-2 months', critical: '2-4 months' },
      livestock_emergency: { low: '1-2 weeks', medium: '2-6 weeks', high: '1-3 months', critical: '3-6 months' }
    };

    const timeframes = times[emergencyType] || times.pest_disease;
    return timeframes[severity] || timeframes.medium;
  },

  assessRiskLevel(emergencyType, severity, description) {
    const riskFactors = {
      pest_disease: description.toLowerCase().includes('spread') ? 'high' : 'medium',
      weather_damage: severity === 'critical' ? 'high' : 'medium',
      equipment_failure: severity === 'critical' ? 'high' : 'low',
      soil_issues: description.toLowerCase().includes('contamination') ? 'high' : 'medium',
      irrigation_problems: severity === 'critical' ? 'medium' : 'low',
      livestock_emergency: severity === 'critical' ? 'high' : 'medium'
    };

    return riskFactors[emergencyType] || 'medium';
  },

  calculateEstimatedArrival(distance) {
    const averageSpeed = 45; // km/h
    const travelTime = (distance / averageSpeed) * 60; // minutes
    return `${Math.round(travelTime)} minutes`;
  },

  generateMockCoordinates(centerLocation, distance) {
    // Generate coordinates within the specified distance
    const earthRadius = 6371; // km
    const bearing = Math.random() * 2 * Math.PI;
    
    const lat1 = centerLocation.latitude * Math.PI / 180;
    const lon1 = centerLocation.longitude * Math.PI / 180;
    
    const lat2 = Math.asin(Math.sin(lat1) * Math.cos(distance / earthRadius) +
                          Math.cos(lat1) * Math.sin(distance / earthRadius) * Math.cos(bearing));
    
    const lon2 = lon1 + Math.atan2(Math.sin(bearing) * Math.sin(distance / earthRadius) * Math.cos(lat1),
                                   Math.cos(distance / earthRadius) - Math.sin(lat1) * Math.sin(lat2));
    
    return {
      latitude: lat2 * 180 / Math.PI,
      longitude: lon2 * 180 / Math.PI
    };
  },

  generateStatusUpdates(timeSinceSubmission, severity) {
    const updates = [
      {
        status: 'submitted',
        timestamp: new Date(Date.now() - timeSinceSubmission).toISOString(),
        message: 'Emergency request submitted and received'
      }
    ];

    const responseTime = severity === 'critical' ? 30 * 60 * 1000 : 
                        severity === 'high' ? 2 * 60 * 60 * 1000 : 
                        4 * 60 * 60 * 1000;

    if (timeSinceSubmission > 5 * 60 * 1000) { // 5 minutes
      updates.push({
        status: 'acknowledged',
        timestamp: new Date(Date.now() - timeSinceSubmission + 5 * 60 * 1000).toISOString(),
        message: 'Request acknowledged by emergency response team'
      });
    }

    if (timeSinceSubmission > responseTime) {
      updates.push({
        status: 'in_progress',
        timestamp: new Date(Date.now() - timeSinceSubmission + responseTime).toISOString(),
        message: 'Response team dispatched or remote assistance initiated'
      });
    }

    return updates;
  }
};

module.exports = sosEmergencyService;
