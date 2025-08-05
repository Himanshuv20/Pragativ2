# Copernicus Satellite Data Setup Guide

This guide explains how to get real satellite data from Copernicus/Sentinel satellites for the Crop Calendar application.

## 🛰️ What is Copernicus?

Copernicus is the European Union's Earth observation program that provides free access to satellite data from Sentinel missions. It offers:

- **Sentinel-2**: High-resolution optical imagery for vegetation monitoring (NDVI, EVI)
- **Sentinel-1**: Radar data for soil moisture and crop monitoring
- **Sentinel-3**: Ocean and land monitoring data

## 📋 Getting Started with Copernicus

### Option 1: Copernicus Data Space Ecosystem (Recommended)
1. Visit: https://dataspace.copernicus.eu/
2. Click "Register" and create a free account
3. Verify your email address
4. Your credentials will work with our API integration

### Option 2: Sentinel Hub
1. Visit: https://www.sentinel-hub.com/
2. Sign up for a free trial account
3. Create an OAuth application in your dashboard
4. Get your Client ID and Client Secret

### Option 3: Copernicus Climate Data Store
1. Visit: https://cds.climate.copernicus.eu/
2. Create a free account
3. Get your API key from your user profile

## 🔧 Configuration

Once you have your credentials, update your `.env` file:

```env
# For Copernicus Data Space Ecosystem
COPERNICUS_USERNAME=your_username
COPERNICUS_PASSWORD=your_password

# Alternative: For Sentinel Hub
SENTINEL_HUB_CLIENT_ID=your_client_id
SENTINEL_HUB_CLIENT_SECRET=your_client_secret

# Alternative: For Climate Data Store
COPERNICUS_CDS_API_KEY=your_api_key
```

## 🌱 What Data You'll Get

With real Copernicus integration, you'll receive:

### Vegetation Indices
- **NDVI** (Normalized Difference Vegetation Index): -1 to 1
- **EVI** (Enhanced Vegetation Index): -1 to 1
- **Acquisition Date**: When the satellite image was taken
- **Cloud Coverage**: Quality indicator

### Soil Moisture
- **Volumetric Percentage**: 0-100%
- **Status**: Categorical assessment (Low, Good, High, etc.)
- **Depth**: Soil layer measured (typically 0-30cm)
- **Source**: Copernicus service used

### Additional Benefits
- **Higher Accuracy**: Real satellite measurements vs. simulated data
- **Historical Trends**: Access to years of satellite archives
- **Quality Indicators**: Cloud coverage, acquisition dates, processing levels
- **Regular Updates**: New data every 5 days (Sentinel-2 revisit time)

## 🚀 Testing Your Setup

After configuring credentials, restart your backend and test:

```bash
# Test satellite data endpoint
curl -X POST http://localhost:5001/api/satellite-data/current \
  -H "Content-Type: application/json" \
  -d '{"location": {"latitude": 40.7128, "longitude": -74.0060}}'
```

Look for these indicators of successful Copernicus integration:
- `"source": "sentinel-2"` or `"source": "copernicus-data-space"`
- Real acquisition dates
- Confidence scores > 0.85
- Log messages: "✅ Successfully retrieved Copernicus vegetation data"

## 🆓 Free Usage Limits

### Copernicus Data Space
- **Free**: Up to 2,000 requests/month
- **No credit card required**
- **Full archive access**

### Sentinel Hub
- **Free trial**: 10,000 processing units
- **Educational accounts**: Extended free usage
- **Commercial**: Paid plans available

## 🔄 Fallback Behavior

If Copernicus APIs are unavailable, the system automatically falls back to:
1. Weather-based vegetation index calculations
2. Enhanced simulation using agricultural patterns
3. Clear logging of data sources used

## 📊 Data Quality Indicators

The system reports confidence levels:
- **0.85-0.95**: Real Copernicus satellite data
- **0.70-0.84**: Mixed real weather + calculated vegetation
- **0.60-0.69**: Enhanced simulation with realistic patterns
- **Below 0.60**: Basic simulation

## 🛠️ Troubleshooting

### Common Issues:
1. **Authentication errors**: Check username/password
2. **Rate limits**: Reduce request frequency
3. **No recent data**: Increase cloud coverage tolerance
4. **Timeout errors**: Check internet connection

### Debug Logs:
Enable debug logging to see detailed API interactions:
```env
LOG_LEVEL=debug
```

## 🌍 Global Coverage

Copernicus provides global coverage with these characteristics:
- **Sentinel-2**: 5-day revisit time, 10-60m resolution
- **Coverage**: Global land surfaces
- **Latency**: 1-2 days from acquisition to availability
- **Archive**: Data since 2015

## 📈 Agricultural Benefits

Real Copernicus data provides:
- **Accurate crop health monitoring**
- **Early stress detection**
- **Yield prediction improvements**
- **Historical trend analysis**
- **Precise irrigation timing**
- **Fertilization optimization**

This integration transforms your Crop Calendar from a simulation tool into a precision agriculture platform! 🌾✨
