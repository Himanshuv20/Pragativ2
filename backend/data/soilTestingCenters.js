const soilTestingCenters = [
  // Andhra Pradesh
  {
    id: 'AP001',
    name: 'ANGRAU Soil Testing Laboratory',
    address: 'Acharya NG Ranga Agricultural University, Rajendranagar',
    city: 'Hyderabad',
    state: 'Andhra Pradesh',
    pincode: '500030',
    phone: '+91-40-24015000',
    email: 'soillab@angrau.ac.in',
    latitude: 17.3238,
    longitude: 78.4016,
    type: 'Government',
    facilities: ['Basic Soil Analysis', 'Nutrient Analysis', 'pH Testing', 'Organic Matter Assessment'],
    timings: '9:00 AM - 5:00 PM (Mon-Fri)',
    cost: {
      basic: 100,
      comprehensive: 300,
      nutrient: 150,
      ph: 50
    },
    rating: 4.2,
    accreditation: 'NABL Accredited'
  },
  {
    id: 'AP002',
    name: 'Department of Agriculture Soil Lab',
    address: 'Agricultural Research Station, Guntur',
    city: 'Guntur',
    state: 'Andhra Pradesh',
    pincode: '522034',
    phone: '+91-863-2234567',
    email: 'soiltest.guntur@ap.gov.in',
    latitude: 16.3067,
    longitude: 80.4365,
    type: 'Government',
    facilities: ['Basic Soil Analysis', 'Heavy Metal Screening', 'Micronutrient Analysis'],
    timings: '9:00 AM - 4:00 PM (Mon-Sat)',
    cost: {
      basic: 80,
      comprehensive: 250,
      heavyMetal: 400
    },
    rating: 4.0,
    accreditation: 'State Certified'
  },

  // Karnataka
  {
    id: 'KA001',
    name: 'UAS Bangalore Soil Testing Centre',
    address: 'University of Agricultural Sciences, GKVK Campus',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560065',
    phone: '+91-80-23330153',
    email: 'soilhealth@uasbangalore.edu.in',
    latitude: 13.0827,
    longitude: 77.5946,
    type: 'University',
    facilities: ['Comprehensive Soil Test', 'Nutrient Analysis', 'pH Testing', 'Salinity Testing'],
    timings: '9:00 AM - 5:00 PM (Mon-Fri)',
    cost: {
      basic: 120,
      comprehensive: 350,
      nutrient: 180,
      salinity: 100
    },
    rating: 4.5,
    accreditation: 'NABL Accredited'
  },
  {
    id: 'KA002',
    name: 'AgriTech Soil Lab',
    address: 'Electronics City Phase 1',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560100',
    phone: '+91-80-41234567',
    email: 'info@agritechsoil.com',
    latitude: 12.8456,
    longitude: 77.6603,
    type: 'Private',
    facilities: ['Basic Soil Analysis', 'Advanced Spectral Analysis', 'Precision Agriculture Consulting'],
    timings: '8:00 AM - 6:00 PM (Mon-Sat)',
    cost: {
      basic: 150,
      comprehensive: 450,
      spectral: 800
    },
    rating: 4.7,
    accreditation: 'ISO 17025 Certified'
  },
  {
    id: 'KA003',
    name: 'Mysore Soil Analysis Center',
    address: 'KRS Road, Near Agricultural College',
    city: 'Mysore',
    state: 'Karnataka',
    pincode: '570008',
    phone: '+91-821-2421567',
    email: 'soiltest@mysoreagri.gov.in',
    latitude: 12.2958,
    longitude: 76.6394,
    type: 'Government',
    facilities: ['Basic Soil Analysis', 'Nutrient Analysis', 'Water Quality Testing'],
    timings: '9:30 AM - 4:30 PM (Mon-Fri)',
    cost: {
      basic: 90,
      comprehensive: 280,
      water: 200
    },
    rating: 4.1,
    accreditation: 'State Certified'
  },

  // Maharashtra
  {
    id: 'MH001',
    name: 'MPKV Soil Testing Laboratory',
    address: 'Mahatma Phule Krishi Vidyapeeth, Rahuri',
    city: 'Ahmednagar',
    state: 'Maharashtra',
    pincode: '413722',
    phone: '+91-2426-243001',
    email: 'soillab@mpkv.ac.in',
    latitude: 19.3919,
    longitude: 74.6473,
    type: 'University',
    facilities: ['Comprehensive Soil Test', 'Nutrient Analysis', 'pH Testing', 'Organic Carbon'],
    timings: '9:00 AM - 5:00 PM (Mon-Fri)',
    cost: {
      basic: 110,
      comprehensive: 320,
      nutrient: 160,
      organic: 80
    },
    rating: 4.3,
    accreditation: 'NABL Accredited'
  },
  {
    id: 'MH002',
    name: 'Pune Agricultural Soil Lab',
    address: 'Shivajinagar, Near Agriculture College',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411005',
    phone: '+91-20-25537891',
    email: 'soiltest.pune@mah.gov.in',
    latitude: 18.5204,
    longitude: 73.8567,
    type: 'Government',
    facilities: ['Basic Soil Analysis', 'Heavy Metal Testing', 'Pesticide Residue Analysis'],
    timings: '9:00 AM - 4:00 PM (Mon-Sat)',
    cost: {
      basic: 95,
      comprehensive: 300,
      heavyMetal: 450,
      pesticide: 600
    },
    rating: 4.0,
    accreditation: 'State Certified'
  },
  {
    id: 'MH003',
    name: 'Mumbai Soil & Water Testing Centre',
    address: 'Andheri East, Near SEEPZ',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400093',
    phone: '+91-22-28206789',
    email: 'mumbaisoil@testlab.co.in',
    latitude: 19.0760,
    longitude: 72.8777,
    type: 'Private',
    facilities: ['Advanced Soil Analysis', 'Water Quality Testing', 'Environmental Assessment'],
    timings: '8:30 AM - 6:30 PM (Mon-Sat)',
    cost: {
      basic: 180,
      comprehensive: 500,
      water: 250,
      environmental: 800
    },
    rating: 4.6,
    accreditation: 'NABL Accredited'
  },

  // Gujarat
  {
    id: 'GJ001',
    name: 'AAU Anand Soil Testing Lab',
    address: 'Anand Agricultural University, Anand',
    city: 'Anand',
    state: 'Gujarat',
    pincode: '388110',
    phone: '+91-2692-261081',
    email: 'soilhealth@aau.in',
    latitude: 22.5645,
    longitude: 72.9289,
    type: 'University',
    facilities: ['Comprehensive Soil Test', 'Salinity Analysis', 'Micronutrient Testing'],
    timings: '9:00 AM - 5:00 PM (Mon-Fri)',
    cost: {
      basic: 100,
      comprehensive: 290,
      salinity: 120,
      micronutrient: 200
    },
    rating: 4.4,
    accreditation: 'NABL Accredited'
  },
  {
    id: 'GJ002',
    name: 'Ahmedabad Soil Analysis Center',
    address: 'Naranpura, Near Agriculture University',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380013',
    phone: '+91-79-27912345',
    email: 'soiltest.ahd@gujarat.gov.in',
    latitude: 23.0225,
    longitude: 72.5714,
    type: 'Government',
    facilities: ['Basic Soil Analysis', 'pH Testing', 'Nutrient Analysis'],
    timings: '9:30 AM - 4:30 PM (Mon-Fri)',
    cost: {
      basic: 85,
      comprehensive: 270,
      nutrient: 140
    },
    rating: 3.9,
    accreditation: 'State Certified'
  },

  // Tamil Nadu
  {
    id: 'TN001',
    name: 'TNAU Coimbatore Soil Lab',
    address: 'Tamil Nadu Agricultural University, Lawley Road',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    pincode: '641003',
    phone: '+91-422-6611200',
    email: 'soiltest@tnau.ac.in',
    latitude: 11.0168,
    longitude: 76.9558,
    type: 'University',
    facilities: ['Comprehensive Soil Test', 'Nutrient Analysis', 'Biological Activity Assessment'],
    timings: '9:00 AM - 5:00 PM (Mon-Fri)',
    cost: {
      basic: 115,
      comprehensive: 340,
      nutrient: 170,
      biological: 250
    },
    rating: 4.5,
    accreditation: 'NABL Accredited'
  },
  {
    id: 'TN002',
    name: 'Chennai Agricultural Testing Centre',
    address: 'Guindy, Near Agriculture College',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600025',
    phone: '+91-44-22201234',
    email: 'soillab.chennai@tn.gov.in',
    latitude: 13.0827,
    longitude: 80.2707,
    type: 'Government',
    facilities: ['Basic Soil Analysis', 'Heavy Metal Screening', 'Coastal Soil Analysis'],
    timings: '9:00 AM - 4:00 PM (Mon-Sat)',
    cost: {
      basic: 105,
      comprehensive: 310,
      heavyMetal: 420,
      coastal: 180
    },
    rating: 4.2,
    accreditation: 'State Certified'
  },

  // Punjab
  {
    id: 'PB001',
    name: 'PAU Ludhiana Soil Testing Centre',
    address: 'Punjab Agricultural University, Ludhiana',
    city: 'Ludhiana',
    state: 'Punjab',
    pincode: '141004',
    phone: '+91-161-2401960',
    email: 'soilhealth@pau.edu',
    latitude: 30.9010,
    longitude: 75.8573,
    type: 'University',
    facilities: ['Comprehensive Soil Test', 'Nutrient Analysis', 'Pesticide Residue Testing'],
    timings: '9:00 AM - 5:00 PM (Mon-Fri)',
    cost: {
      basic: 90,
      comprehensive: 280,
      nutrient: 150,
      pesticide: 550
    },
    rating: 4.6,
    accreditation: 'NABL Accredited'
  },

  // Uttar Pradesh
  {
    id: 'UP001',
    name: 'GBPUAT Pantnagar Soil Lab',
    address: 'Govind Ballabh Pant University, Pantnagar',
    city: 'Udham Singh Nagar',
    state: 'Uttar Pradesh',
    pincode: '263145',
    phone: '+91-5944-233001',
    email: 'soillab@gbpuat.ac.in',
    latitude: 29.0333,
    longitude: 79.4833,
    type: 'University',
    facilities: ['Comprehensive Soil Test', 'Nutrient Analysis', 'Soil Biology Assessment'],
    timings: '9:00 AM - 5:00 PM (Mon-Fri)',
    cost: {
      basic: 95,
      comprehensive: 285,
      nutrient: 155,
      biology: 220
    },
    rating: 4.3,
    accreditation: 'NABL Accredited'
  },
  {
    id: 'UP002',
    name: 'Lucknow Soil Analysis Center',
    address: 'Gomti Nagar, Near Agriculture Directorate',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    pincode: '226010',
    phone: '+91-522-2308765',
    email: 'soiltest.lucknow@up.gov.in',
    latitude: 26.8467,
    longitude: 80.9462,
    type: 'Government',
    facilities: ['Basic Soil Analysis', 'pH Testing', 'Salinity Analysis'],
    timings: '9:30 AM - 4:30 PM (Mon-Fri)',
    cost: {
      basic: 80,
      comprehensive: 260,
      salinity: 110
    },
    rating: 3.8,
    accreditation: 'State Certified'
  },

  // West Bengal
  {
    id: 'WB001',
    name: 'BCKV Mohanpur Soil Lab',
    address: 'Bidhan Chandra Krishi Viswavidyalaya, Mohanpur',
    city: 'Nadia',
    state: 'West Bengal',
    pincode: '741252',
    phone: '+91-33-25820380',
    email: 'soiltest@bckv.edu.in',
    latitude: 23.0833,
    longitude: 88.5333,
    type: 'University',
    facilities: ['Comprehensive Soil Test', 'Nutrient Analysis', 'Wetland Soil Analysis'],
    timings: '9:00 AM - 5:00 PM (Mon-Fri)',
    cost: {
      basic: 85,
      comprehensive: 275,
      nutrient: 145,
      wetland: 200
    },
    rating: 4.1,
    accreditation: 'NABL Accredited'
  },

  // Rajasthan
  {
    id: 'RJ001',
    name: 'RAU Bikaner Soil Testing Lab',
    address: 'Rajasthan Agricultural University, Bikaner',
    city: 'Bikaner',
    state: 'Rajasthan',
    pincode: '334006',
    phone: '+91-151-2252701',
    email: 'soillab@raubikaner.org',
    latitude: 28.0229,
    longitude: 73.3119,
    type: 'University',
    facilities: ['Comprehensive Soil Test', 'Salinity Analysis', 'Desert Soil Specialization'],
    timings: '9:00 AM - 5:00 PM (Mon-Fri)',
    cost: {
      basic: 90,
      comprehensive: 285,
      salinity: 130,
      desert: 180
    },
    rating: 4.2,
    accreditation: 'State Certified'
  },

  // Haryana
  {
    id: 'HR001',
    name: 'HAU Hisar Soil Testing Centre',
    address: 'Haryana Agricultural University, Hisar',
    city: 'Hisar',
    state: 'Haryana',
    pincode: '125004',
    phone: '+91-1662-289300',
    email: 'soilhealth@hau.ac.in',
    latitude: 29.1492,
    longitude: 75.7217,
    type: 'University',
    facilities: ['Comprehensive Soil Test', 'Nutrient Analysis', 'Water Quality Testing'],
    timings: '9:00 AM - 5:00 PM (Mon-Fri)',
    cost: {
      basic: 85,
      comprehensive: 270,
      nutrient: 140,
      water: 190
    },
    rating: 4.4,
    accreditation: 'NABL Accredited'
  }
];

// Helper function to get centers by state
const getCentersByState = (state) => {
  return soilTestingCenters.filter(center => 
    center.state.toLowerCase() === state.toLowerCase()
  );
};

// Helper function to get centers by city
const getCentersByCity = (city, state = null) => {
  return soilTestingCenters.filter(center => {
    const cityMatch = center.city.toLowerCase() === city.toLowerCase();
    const stateMatch = state ? center.state.toLowerCase() === state.toLowerCase() : true;
    return cityMatch && stateMatch;
  });
};

// Helper function to get centers by coordinates (within radius)
const getCentersByLocation = (latitude, longitude, radiusKm = 50) => {
  return soilTestingCenters.filter(center => {
    const distance = calculateDistance(latitude, longitude, center.latitude, center.longitude);
    return distance <= radiusKm;
  }).sort((a, b) => {
    const distanceA = calculateDistance(latitude, longitude, a.latitude, a.longitude);
    const distanceB = calculateDistance(latitude, longitude, b.latitude, b.longitude);
    return distanceA - distanceB;
  });
};

// Calculate distance between two points using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

module.exports = {
  soilTestingCenters,
  getCentersByState,
  getCentersByCity,
  getCentersByLocation,
  calculateDistance
};
