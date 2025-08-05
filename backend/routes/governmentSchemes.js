const express = require('express');
const router = express.Router();
const governmentSchemesService = require('../services/governmentSchemesService');

// Get all government schemes
router.get('/', async (req, res) => {
    try {
        console.log('📋 Fetching all government schemes...');
        
        const result = governmentSchemesService.getAllSchemes();
        
        if (result.success) {
            console.log(`✅ Successfully fetched ${result.total} government schemes`);
            res.json(result);
        } else {
            console.error('❌ Failed to fetch government schemes:', result.error);
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('❌ Error in government schemes endpoint:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Get scheme by ID
router.get('/:id', async (req, res) => {
    try {
        const schemeId = req.params.id;
        console.log(`📋 Fetching government scheme with ID: ${schemeId}`);
        
        const result = governmentSchemesService.getSchemeById(schemeId);
        
        if (result.success) {
            console.log(`✅ Successfully fetched scheme: ${result.data.title}`);
            res.json(result);
        } else {
            console.error('❌ Scheme not found:', result.error);
            res.status(404).json(result);
        }
    } catch (error) {
        console.error('❌ Error in government scheme by ID endpoint:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Search schemes by keyword
router.get('/search/:query', async (req, res) => {
    try {
        const query = req.params.query;
        console.log(`🔍 Searching government schemes with query: "${query}"`);
        
        const result = governmentSchemesService.searchSchemes(query);
        
        if (result.success) {
            console.log(`✅ Found ${result.total} schemes matching "${query}"`);
            res.json(result);
        } else {
            console.error('❌ Failed to search schemes:', result.error);
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('❌ Error in government schemes search endpoint:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Filter schemes by category
router.get('/category/:category', async (req, res) => {
    try {
        const category = req.params.category;
        console.log(`📂 Filtering government schemes by category: "${category}"`);
        
        const result = governmentSchemesService.filterByCategory(category);
        
        if (result.success) {
            console.log(`✅ Found ${result.total} schemes in category "${category}"`);
            res.json(result);
        } else {
            console.error('❌ Failed to filter schemes by category:', result.error);
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('❌ Error in government schemes category filter endpoint:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Filter schemes by priority
router.get('/priority/:priority', async (req, res) => {
    try {
        const priority = req.params.priority;
        console.log(`⭐ Filtering government schemes by priority: "${priority}"`);
        
        const result = governmentSchemesService.filterByPriority(priority);
        
        if (result.success) {
            console.log(`✅ Found ${result.total} schemes with priority "${priority}"`);
            res.json(result);
        } else {
            console.error('❌ Failed to filter schemes by priority:', result.error);
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('❌ Error in government schemes priority filter endpoint:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Get high priority schemes
router.get('/filters/high-priority', async (req, res) => {
    try {
        console.log('⭐ Fetching high priority government schemes...');
        
        const result = governmentSchemesService.getHighPrioritySchemes();
        
        if (result.success) {
            console.log(`✅ Found ${result.total} high priority schemes`);
            res.json(result);
        } else {
            console.error('❌ Failed to fetch high priority schemes:', result.error);
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('❌ Error in high priority schemes endpoint:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Get emergency/helpline schemes
router.get('/filters/emergency', async (req, res) => {
    try {
        console.log('🚨 Fetching emergency/helpline government schemes...');
        
        const result = governmentSchemesService.getEmergencySchemes();
        
        if (result.success) {
            console.log(`✅ Found ${result.total} emergency schemes`);
            res.json(result);
        } else {
            console.error('❌ Failed to fetch emergency schemes:', result.error);
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('❌ Error in emergency schemes endpoint:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Get scheme statistics
router.get('/analytics/statistics', async (req, res) => {
    try {
        console.log('📊 Fetching government schemes statistics...');
        
        const result = governmentSchemesService.getSchemeStatistics();
        
        if (result.success) {
            console.log('✅ Successfully calculated scheme statistics');
            res.json(result);
        } else {
            console.error('❌ Failed to calculate scheme statistics:', result.error);
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('❌ Error in scheme statistics endpoint:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Filter schemes by eligibility (POST for complex filtering)
router.post('/filters/eligibility', async (req, res) => {
    try {
        const { eligibilityKeywords } = req.body;
        console.log('🎯 Filtering government schemes by eligibility criteria:', eligibilityKeywords);
        
        const result = governmentSchemesService.getSchemesByEligibility(eligibilityKeywords);
        
        if (result.success) {
            console.log(`✅ Found ${result.total} schemes matching eligibility criteria`);
            res.json(result);
        } else {
            console.error('❌ Failed to filter schemes by eligibility:', result.error);
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('❌ Error in eligibility filter endpoint:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
});

module.exports = router;
