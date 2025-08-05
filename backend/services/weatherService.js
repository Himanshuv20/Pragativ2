const axios = require('axios');

class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    this.oneCallUrl = 'https://api.openweathermap.org/data/3.0/onecall';
    
    if (!this.apiKey) {
      console.warn('⚠️ OpenWeather API key not found. Weather data will be simulated.');
    }
  }

  /**
   * Get current weather conditions for a specific location
   */
  async getCurrentWeather(latitude, longitude) {
    try {
      console.log(`🌤️ Fetching current weather for coordinates: ${latitude}, ${longitude}`);
      
      if (!this.apiKey) {
        console.error('❌ OpenWeather API key not found! Real-time weather data unavailable.');
        throw new Error('OpenWeather API key not configured. Please add OPENWEATHER_API_KEY to environment variables.');
      }

      console.log(`🔑 Using OpenWeather API key: ${this.apiKey.substring(0, 8)}...`);
      
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: this.apiKey,
          units: 'metric' // Celsius temperature
        },
        timeout: 15000 // Increased timeout
      });

      const data = response.data;
      
      return {
        location: {
          name: data.name,
          country: data.sys.country,
          latitude: latitude,
          longitude: longitude
        },
        current: {
          temperature: Math.round(data.main.temp),
          feelsLike: Math.round(data.main.feels_like),
          minTemp: Math.round(data.main.temp_min),
          maxTemp: Math.round(data.main.temp_max),
          pressure: data.main.pressure,
          humidity: data.main.humidity,
          visibility: data.visibility ? Math.round(data.visibility / 1000) : null, // Convert to km
          uvIndex: null // Not available in current weather API
        },
        weather: {
          main: data.weather[0].main,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          cloudiness: data.clouds.all
        },
        wind: {
          speed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
          direction: data.wind.deg,
          directionText: this.getWindDirection(data.wind.deg)
        },
        sun: {
          sunrise: new Date(data.sys.sunrise * 1000).toISOString(),
          sunset: new Date(data.sys.sunset * 1000).toISOString()
        },
        lastUpdated: new Date().toISOString(),
        source: 'OpenWeatherMap'
      };

    } catch (error) {
      console.error('❌ Error fetching current weather from OpenWeatherMap:', error.message);
      console.error('📍 Coordinates:', latitude, longitude);
      console.error('🔑 API Key present:', !!this.apiKey);
      
      if (error.response) {
        console.error('🌐 API Response Status:', error.response.status);
        console.error('📄 API Response Data:', error.response.data);
        
        if (error.response.status === 401) {
          throw new Error('Invalid OpenWeather API key. Please check your API key configuration.');
        } else if (error.response.status === 404) {
          throw new Error('Location not found. Please check the coordinates.');
        }
      }
      
      // Only throw error - no fallback to mock data for current weather
      throw new Error(`Failed to fetch real-time weather data: ${error.message}`);
    }
  }

  /**
   * Get weather forecast for multiple days
   */
  async getWeatherForecast(latitude, longitude, days = 7) {
    try {
      console.log(`🌦️ Fetching ${days}-day weather forecast for coordinates: ${latitude}, ${longitude}`);
      
      if (!this.apiKey) {
        console.warn('⚠️ OpenWeather API key not found. Using simulated forecast data.');
        return this.generateMockForecast(latitude, longitude, days);
      }

      // For 5-day forecast (free tier) - USE REAL DATA
      if (days <= 5) {
        console.log(`📊 Using OpenWeatherMap for ${days}-day forecast (real data)`);
        const response = await axios.get(`${this.baseUrl}/forecast`, {
          params: {
            lat: latitude,
            lon: longitude,
            appid: this.apiKey,
            units: 'metric'
          },
          timeout: 15000
        });

        const data = response.data;
        const dailyForecasts = this.processForecastData(data.list);
        
        return {
          location: {
            name: data.city.name,
            country: data.city.country,
            latitude: latitude,
            longitude: longitude
          },
          forecast: dailyForecasts.slice(0, days),
          lastUpdated: new Date().toISOString(),
          source: 'OpenWeatherMap'
        };
      } else {
        // For extended forecasts (6+ days), use simulation with clear labeling
        console.log(`⚠️ Extended forecast (${days} days) not available in free tier. Using simulated data for days 6+.`);
        return this.generateMockForecast(latitude, longitude, days);
      }

    } catch (error) {
      console.error('❌ Error fetching weather forecast from OpenWeatherMap:', error.message);
      
      if (error.response) {
        console.error('🌐 API Response Status:', error.response.status);
        console.error('📄 API Response Data:', error.response.data);
      }
      
      // For forecast, we can fallback to simulation but label it clearly
      console.warn('⚠️ Falling back to simulated forecast data due to API error');
      return this.generateMockForecast(latitude, longitude, days);
    }
  }

  /**
   * Process 5-day forecast data from OpenWeather API
   */
  processForecastData(forecastList) {
    const dailyData = {};
    
    forecastList.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      
      if (!dailyData[date]) {
        dailyData[date] = {
          date: new Date(item.dt * 1000).toISOString().split('T')[0],
          temperatures: [],
          conditions: [],
          humidity: [],
          wind: [],
          precipitation: 0
        };
      }
      
      dailyData[date].temperatures.push(item.main.temp);
      dailyData[date].conditions.push({
        main: item.weather[0].main,
        description: item.weather[0].description,
        icon: item.weather[0].icon
      });
      dailyData[date].humidity.push(item.main.humidity);
      dailyData[date].wind.push(item.wind.speed * 3.6); // Convert to km/h
      
      if (item.rain && item.rain['3h']) {
        dailyData[date].precipitation += item.rain['3h'];
      }
    });

    return Object.values(dailyData).map(day => {
      const temps = day.temperatures;
      const winds = day.wind;
      const humidities = day.humidity;
      
      // Get the most frequent weather condition
      const conditionCounts = {};
      day.conditions.forEach(condition => {
        const key = condition.main;
        conditionCounts[key] = (conditionCounts[key] || 0) + 1;
      });
      const mostFrequentCondition = Object.keys(conditionCounts).reduce((a, b) => 
        conditionCounts[a] > conditionCounts[b] ? a : b
      );
      
      const representativeCondition = day.conditions.find(c => c.main === mostFrequentCondition);

      return {
        date: day.date,
        temperature: {
          min: Math.round(Math.min(...temps)),
          max: Math.round(Math.max(...temps)),
          avg: Math.round(temps.reduce((sum, temp) => sum + temp, 0) / temps.length)
        },
        weather: {
          main: representativeCondition.main,
          description: representativeCondition.description,
          icon: representativeCondition.icon
        },
        humidity: Math.round(humidities.reduce((sum, h) => sum + h, 0) / humidities.length),
        windSpeed: Math.round(winds.reduce((sum, w) => sum + w, 0) / winds.length),
        precipitation: Math.round(day.precipitation * 10) / 10 // Round to 1 decimal
      };
    });
  }

  /**
   * Generate mock current weather data for demonstration
   */
  generateMockCurrentWeather(latitude, longitude) {
    console.log('⚠️ Using simulated weather data - real API data unavailable');
    
    // More realistic weather conditions based on season and location
    const currentMonth = new Date().getMonth(); // 0-11
    const isMonosoonSeason = (currentMonth >= 5 && currentMonth <= 9); // June to October
    const isIndianSubcontinent = (latitude >= 6 && latitude <= 37 && longitude >= 68 && longitude <= 97);
    
    let weatherConditions;
    
    if (isIndianSubcontinent && isMonosoonSeason) {
      // Monsoon season in Indian subcontinent - higher chance of rain/clouds
      weatherConditions = [
        { main: 'Rain', description: 'light rain', icon: '10d' },
        { main: 'Rain', description: 'moderate rain', icon: '10d' },
        { main: 'Rain', description: 'heavy rain', icon: '10d' },
        { main: 'Clouds', description: 'overcast clouds', icon: '04d' },
        { main: 'Clouds', description: 'broken clouds', icon: '04d' },
        { main: 'Thunderstorm', description: 'thunderstorm', icon: '11d' }
      ];
    } else {
      // Regular weather patterns
      weatherConditions = [
        { main: 'Clear', description: 'clear sky', icon: '01d' },
        { main: 'Clouds', description: 'partly cloudy', icon: '02d' },
        { main: 'Clouds', description: 'overcast clouds', icon: '04d' },
        { main: 'Rain', description: 'light rain', icon: '10d' }
      ];
    }
    
    const selectedWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    const baseTemp = this.getBaseTemperatureForLocation(latitude);
    const temp = baseTemp + (Math.random() - 0.5) * 10; // ±5°C variation
    
    // Higher humidity for rain/monsoon conditions
    const baseHumidity = selectedWeather.main === 'Rain' ? 70 : 40;
    const humidity = baseHumidity + Math.random() * 30;
    
    return {
      location: {
        name: this.getCityNameForLocation(latitude, longitude),
        country: this.getCountryForLocation(latitude, longitude),
        latitude: latitude,
        longitude: longitude
      },
      current: {
        temperature: Math.round(temp),
        feelsLike: Math.round(temp + (Math.random() - 0.5) * 4),
        minTemp: Math.round(temp - 3 - Math.random() * 3),
        maxTemp: Math.round(temp + 3 + Math.random() * 3),
        pressure: Math.round(1013 + (Math.random() - 0.5) * 30),
        humidity: Math.round(humidity),
        visibility: Math.round(8 + Math.random() * 7),
        uvIndex: Math.round(Math.random() * 10)
      },
      weather: selectedWeather,
      wind: {
        speed: Math.round(5 + Math.random() * 20),
        direction: Math.round(Math.random() * 360),
        directionText: this.getWindDirection(Math.round(Math.random() * 360))
      },
      sun: {
        sunrise: this.calculateSunrise(latitude),
        sunset: this.calculateSunset(latitude)
      },
      lastUpdated: new Date().toISOString(),
      source: 'Simulated Data - Real API Unavailable'
    };
  }

  /**
   * Generate mock forecast data
   */
  generateMockForecast(latitude, longitude, days) {
    const forecast = [];
    const baseTemp = this.getBaseTemperatureForLocation(latitude);
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      const weatherConditions = [
        { main: 'Clear', description: 'clear sky', icon: '01d' },
        { main: 'Clouds', description: 'partly cloudy', icon: '02d' },
        { main: 'Clouds', description: 'overcast clouds', icon: '04d' },
        { main: 'Rain', description: 'light rain', icon: '10d' },
        { main: 'Rain', description: 'moderate rain', icon: '10d' }
      ];
      
      const selectedWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
      const tempVariation = (Math.random() - 0.5) * 15; // ±7.5°C daily variation
      const dayTemp = baseTemp + tempVariation;
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        temperature: {
          min: Math.round(dayTemp - 3 - Math.random() * 3),
          max: Math.round(dayTemp + 3 + Math.random() * 3),
          avg: Math.round(dayTemp)
        },
        weather: selectedWeather,
        humidity: Math.round(40 + Math.random() * 40),
        windSpeed: Math.round(5 + Math.random() * 20),
        precipitation: selectedWeather.main === 'Rain' ? Math.round(Math.random() * 10 * 10) / 10 : 0
      });
    }
    
    return {
      location: {
        name: this.getCityNameForLocation(latitude, longitude),
        country: this.getCountryForLocation(latitude, longitude),
        latitude: latitude,
        longitude: longitude
      },
      forecast: forecast,
      lastUpdated: new Date().toISOString(),
      source: 'Simulated Data'
    };
  }

  /**
   * Helper methods
   */
  getWindDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  }

  getBaseTemperatureForLocation(latitude) {
    // Simple temperature estimation based on latitude
    const absLat = Math.abs(latitude);
    if (absLat < 23.5) return 28; // Tropical
    if (absLat < 35) return 22; // Subtropical
    if (absLat < 50) return 15; // Temperate
    return 5; // Cold regions
  }

  getCityNameForLocation(latitude, longitude) {
    // Simple city name mapping for demo
    if (latitude >= 28 && latitude <= 29 && longitude >= 76 && longitude <= 78) return 'New Delhi';
    if (latitude >= 18 && latitude <= 20 && longitude >= 72 && longitude <= 73) return 'Mumbai';
    if (latitude >= 12 && latitude <= 13 && longitude >= 77 && longitude <= 78) return 'Bangalore';
    if (latitude >= 40 && latitude <= 41 && longitude >= -75 && longitude <= -73) return 'New York';
    if (latitude >= 51 && latitude <= 52 && longitude >= -1 && longitude <= 1) return 'London';
    return 'Unknown Location';
  }

  getCountryForLocation(latitude, longitude) {
    // Simple country mapping for demo
    if (latitude >= 6 && latitude <= 37 && longitude >= 68 && longitude <= 97) return 'IN';
    if (latitude >= 25 && latitude <= 49 && longitude >= -125 && longitude <= -66) return 'US';
    if (latitude >= 50 && latitude <= 60 && longitude >= -8 && longitude <= 2) return 'GB';
    return 'XX';
  }

  calculateSunrise(latitude) {
    // Simplified sunrise calculation
    const now = new Date();
    const sunrise = new Date(now);
    const baseHour = 6; // 6 AM base
    const latitudeOffset = Math.abs(latitude) * 0.03; // Rough adjustment
    sunrise.setHours(baseHour + latitudeOffset, Math.random() * 30, 0, 0);
    return sunrise.toISOString();
  }

  calculateSunset(latitude) {
    // Simplified sunset calculation
    const now = new Date();
    const sunset = new Date(now);
    const baseHour = 18; // 6 PM base
    const latitudeOffset = Math.abs(latitude) * 0.03; // Rough adjustment
    sunset.setHours(baseHour + latitudeOffset, Math.random() * 30, 0, 0);
    return sunset.toISOString();
  }

  /**
   * Get comprehensive weather data (current + forecast)
   */
  async getComprehensiveWeatherData(latitude, longitude, forecastDays = 7) {
    try {
      console.log(`🌍 Fetching comprehensive weather data for coordinates: ${latitude}, ${longitude}`);
      
      const [currentWeather, forecast] = await Promise.all([
        this.getCurrentWeather(latitude, longitude),
        this.getWeatherForecast(latitude, longitude, forecastDays)
      ]);

      return {
        current: currentWeather,
        forecast: forecast,
        metadata: {
          requestTime: new Date().toISOString(),
          coordinates: { latitude, longitude },
          forecastDays: forecastDays
        }
      };

    } catch (error) {
      console.error('❌ Error fetching comprehensive weather data:', error);
      throw new Error('Failed to fetch weather data');
    }
  }
}

module.exports = new WeatherService();
