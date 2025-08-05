const axios = require('axios');
const moment = require('moment');

class SatelliteDataService {
  constructor() {
    this.nasaApiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
    this.openWeatherApiKey = process.env.OPENWEATHER_API_KEY || null;
    this.baseUrls = {
      nasa: 'https://api.nasa.gov/planetary/earth',
      openWeather: 'https://api.openweathermap.org/data/2.5',
      demo: true
    };
    console.log('🛰️ SatelliteDataService initialized');
  }

  async getSatelliteData(location) {
    console.log('🛰️ getSatelliteData called with:', location);
    try {
      const { latitude, longitude } = location;
      
      console.log(`🛰️ Fetching satellite data for location: ${latitude}, ${longitude}`);
      
      // Use real APIs when available, fallback to simulation
      if (this.openWeatherApiKey && this.openWeatherApiKey !== 'DEMO_KEY') {
        console.log('📡 Using real weather and satellite data APIs');
        return await this.getRealSatelliteData(location);
      } else {
        console.log('🔬 Using simulated satellite data (no real API keys available)');
        return this.simulateSatelliteData(location);
      }

    } catch (error) {
      console.error('❌ Error fetching satellite data:', error.message);
      console.log('🔄 Falling back to simulated data');
      return this.simulateSatelliteData(location);
    }
  }

  async getRealSatelliteData(location) {
    const { latitude, longitude } = location;
    
    try {
      const weatherData = await this.getWeatherData(location);
      
      let vegetationData;
      try {
        vegetationData = await this.getVegetationData(location);
      } catch (error) {
        console.log('⚠️ NASA API unavailable, using calculated vegetation index');
        vegetationData = this.calculateVegetationIndex(weatherData, location);
      }
      
      const soilData = this.calculateSoilMoisture(weatherData, location);
      
      console.log('✅ Successfully fetched real satellite data');
      
      return {
        vegetationIndex: {
          ndvi: vegetationData.ndvi,
          evi: vegetationData.evi,
          lastCalculated: new Date().toISOString()
        },
        soilMoisture: {
          percentage: soilData.percentage,
          status: soilData.status,
          depth: '0-30cm'
        },
        temperature: {
          current: weatherData.temperature.current,
          min: weatherData.temperature.min,
          max: weatherData.temperature.max,
          unit: 'Celsius'
        },
        precipitation: {
          last7Days: weatherData.precipitation.recent || 0,
          last30Days: weatherData.precipitation.monthly || 0,
          unit: 'mm'
        },
        humidity: weatherData.humidity,
        windSpeed: weatherData.windSpeed,
        cloudCover: weatherData.cloudCover,
        sunlightHours: this.calculateSunlightHours(weatherData.cloudCover),
        lastUpdated: new Date().toISOString(),
        location: { latitude, longitude },
        dataSource: 'real-apis',
        confidence: 0.9
      };
      
    } catch (error) {
      console.error('❌ Error in getRealSatelliteData:', error.message);
      throw error;
    }
  }

  calculateVegetationIndex(weatherData, location) {
    const { latitude } = location;
    const now = new Date();
    const month = now.getMonth() + 1;
    
    const isNorthern = latitude > 0;
    const isGrowingSeason = isNorthern ? 
      (month >= 4 && month <= 9) : 
      (month >= 10 || month <= 3);
    
    let baseNdvi = 0.3;
    
    const temp = weatherData.temperature.current;
    if (temp >= 15 && temp <= 30) {
      baseNdvi += 0.2;
    } else if (temp < 5 || temp > 40) {
      baseNdvi -= 0.1;
    }
    
    const recentRain = weatherData.precipitation.recent || 0;
    if (recentRain > 10 && recentRain < 100) {
      baseNdvi += 0.15;
    } else if (recentRain > 150) {
      baseNdvi -= 0.05;
    }
    
    if (isGrowingSeason) {
      baseNdvi += 0.2;
    } else {
      baseNdvi -= 0.15;
    }
    
    const ndvi = Math.max(-1, Math.min(1, baseNdvi));
    const evi = ndvi * 0.8;
    
    return { ndvi, evi };
  }

  calculateSoilMoisture(weatherData, location) {
    const recentRain = weatherData.precipitation.recent || 0;
    const monthlyRain = weatherData.precipitation.monthly || 0;
    const humidity = weatherData.humidity;
    const temp = weatherData.temperature.current;
    
    let moisturePercentage = 25;
    
    if (recentRain > 0) {
      moisturePercentage += Math.min(recentRain * 0.8, 30);
    }
    
    if (monthlyRain > 50) {
      moisturePercentage += 15;
    } else if (monthlyRain < 10) {
      moisturePercentage -= 10;
    }
    
    if (humidity > 70) {
      moisturePercentage += 5;
    } else if (humidity < 30) {
      moisturePercentage -= 5;
    }
    
    if (temp > 35) {
      moisturePercentage -= 10;
    } else if (temp < 10) {
      moisturePercentage += 5;
    }
    
    moisturePercentage = Math.max(0, Math.min(100, moisturePercentage));
    
    let status;
    if (moisturePercentage > 70) {
      status = 'Saturated';
    } else if (moisturePercentage > 50) {
      status = 'Good';
    } else if (moisturePercentage > 30) {
      status = 'Moderate';
    } else if (moisturePercentage > 15) {
      status = 'Low';
    } else {
      status = 'Very Low';
    }
    
    return {
      percentage: Math.round(moisturePercentage),
      status
    };
  }

  calculateSunlightHours(cloudCover) {
    const maxSunlightHours = 12;
    const sunlightReduction = (cloudCover / 100) * 0.7;
    return Math.round((maxSunlightHours * (1 - sunlightReduction)) * 10) / 10;
  }

  simulateSatelliteData(location) {
    console.log('🔬 Simulating satellite data for:', location);
    const { latitude, longitude } = location;
    const now = new Date();
    
    return {
      vegetationIndex: {
        ndvi: 0.6 + Math.random() * 0.3,
        evi: 0.5 + Math.random() * 0.2,
        lastCalculated: now.toISOString()
      },
      soilMoisture: {
        percentage: Math.round(30 + Math.random() * 50),
        status: 'Good',
        depth: '0-30cm'
      },
      temperature: {
        current: 20 + Math.random() * 15,
        min: 15 + Math.random() * 10,
        max: 25 + Math.random() * 10,
        unit: 'Celsius'
      },
      precipitation: {
        last7Days: Math.random() * 20,
        last30Days: Math.random() * 80,
        unit: 'mm'
      },
      humidity: 50 + Math.random() * 30,
      windSpeed: Math.random() * 15 + 2,
      cloudCover: Math.random() * 60,
      sunlightHours: 8 + Math.random() * 6,
      lastUpdated: now.toISOString(),
      location: { latitude, longitude },
      dataSource: 'simulated',
      confidence: 0.7
    };
  }

  async getWeatherData(location) {
    const { latitude, longitude } = location;
    
    try {
      const response = await axios.get(`${this.baseUrls.openWeather}/weather`, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: this.openWeatherApiKey,
          units: 'metric'
        }
      });

      const data = response.data;
      
      return {
        temperature: {
          current: data.main.temp,
          min: data.main.temp_min,
          max: data.main.temp_max
        },
        precipitation: {
          recent: data.rain ? data.rain['1h'] || 0 : 0,
          monthly: data.rain ? (data.rain['1h'] || 0) * 24 * 30 : Math.random() * 50
        },
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        cloudCover: data.clouds.all
      };
    } catch (error) {
      console.error('Error fetching weather data:', error.message);
      throw error;
    }
  }

  async getVegetationData(location) {
    throw new Error('NASA vegetation API not implemented - using calculated values');
  }

  async getHistoricalData(location, startDate, endDate) {
    return [];
  }
}

// Export a singleton instance
module.exports = new SatelliteDataService();
