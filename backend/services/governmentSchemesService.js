const { governmentSchemes, schemeCategories, priorityLevels } = require('../data/governmentSchemes');

class GovernmentSchemesService {
    // Get all government schemes
    getAllSchemes() {
        try {
            return {
                success: true,
                data: governmentSchemes,
                total: governmentSchemes.length,
                categories: schemeCategories,
                priorities: priorityLevels
            };
        } catch (error) {
            console.error('Error fetching government schemes:', error);
            return {
                success: false,
                error: 'Failed to fetch government schemes',
                data: []
            };
        }
    }

    // Get scheme by ID
    getSchemeById(schemeId) {
        try {
            const scheme = governmentSchemes.find(s => s.id === parseInt(schemeId));
            
            if (!scheme) {
                return {
                    success: false,
                    error: 'Scheme not found',
                    data: null
                };
            }

            return {
                success: true,
                data: scheme
            };
        } catch (error) {
            console.error('Error fetching scheme by ID:', error);
            return {
                success: false,
                error: 'Failed to fetch scheme details',
                data: null
            };
        }
    }

    // Search schemes by keyword
    searchSchemes(query) {
        try {
            if (!query || query.trim() === '') {
                return this.getAllSchemes();
            }

            const searchTerm = query.toLowerCase().trim();
            const filteredSchemes = governmentSchemes.filter(scheme => 
                scheme.title.toLowerCase().includes(searchTerm) ||
                scheme.category.toLowerCase().includes(searchTerm) ||
                scheme.description.toLowerCase().includes(searchTerm) ||
                scheme.benefits.some(benefit => benefit.toLowerCase().includes(searchTerm)) ||
                scheme.eligibility.toLowerCase().includes(searchTerm)
            );

            return {
                success: true,
                data: filteredSchemes,
                total: filteredSchemes.length,
                searchTerm: query
            };
        } catch (error) {
            console.error('Error searching schemes:', error);
            return {
                success: false,
                error: 'Failed to search schemes',
                data: []
            };
        }
    }

    // Filter schemes by category
    filterByCategory(category) {
        try {
            if (!category || category === 'all') {
                return this.getAllSchemes();
            }

            const filteredSchemes = governmentSchemes.filter(scheme => 
                scheme.category.toLowerCase().includes(category.toLowerCase())
            );

            return {
                success: true,
                data: filteredSchemes,
                total: filteredSchemes.length,
                category: category
            };
        } catch (error) {
            console.error('Error filtering schemes by category:', error);
            return {
                success: false,
                error: 'Failed to filter schemes',
                data: []
            };
        }
    }

    // Filter schemes by priority
    filterByPriority(priority) {
        try {
            if (!priority || priority === 'all') {
                return this.getAllSchemes();
            }

            const filteredSchemes = governmentSchemes.filter(scheme => 
                scheme.priority === priority
            );

            return {
                success: true,
                data: filteredSchemes,
                total: filteredSchemes.length,
                priority: priority
            };
        } catch (error) {
            console.error('Error filtering schemes by priority:', error);
            return {
                success: false,
                error: 'Failed to filter schemes',
                data: []
            };
        }
    }

    // Get schemes by eligibility (basic matching)
    getSchemesByEligibility(eligibilityKeywords) {
        try {
            if (!eligibilityKeywords || eligibilityKeywords.length === 0) {
                return this.getAllSchemes();
            }

            const keywords = Array.isArray(eligibilityKeywords) 
                ? eligibilityKeywords.map(k => k.toLowerCase())
                : [eligibilityKeywords.toLowerCase()];

            const matchingSchemes = governmentSchemes.filter(scheme => 
                keywords.some(keyword => 
                    scheme.eligibility.toLowerCase().includes(keyword)
                )
            );

            return {
                success: true,
                data: matchingSchemes,
                total: matchingSchemes.length,
                eligibilityCriteria: keywords
            };
        } catch (error) {
            console.error('Error filtering schemes by eligibility:', error);
            return {
                success: false,
                error: 'Failed to filter schemes by eligibility',
                data: []
            };
        }
    }

    // Get high priority schemes
    getHighPrioritySchemes() {
        try {
            const highPrioritySchemes = governmentSchemes
                .filter(scheme => scheme.priority === 'high')
                .sort((a, b) => a.title.localeCompare(b.title));

            return {
                success: true,
                data: highPrioritySchemes,
                total: highPrioritySchemes.length,
                priority: 'high'
            };
        } catch (error) {
            console.error('Error fetching high priority schemes:', error);
            return {
                success: false,
                error: 'Failed to fetch high priority schemes',
                data: []
            };
        }
    }

    // Get schemes with contact numbers (emergency/helpline schemes)
    getEmergencySchemes() {
        try {
            const emergencySchemes = governmentSchemes.filter(scheme => 
                scheme.contactNumber && scheme.contactNumber.trim() !== ''
            );

            return {
                success: true,
                data: emergencySchemes,
                total: emergencySchemes.length,
                type: 'emergency'
            };
        } catch (error) {
            console.error('Error fetching emergency schemes:', error);
            return {
                success: false,
                error: 'Failed to fetch emergency schemes',
                data: []
            };
        }
    }

    // Get statistics about schemes
    getSchemeStatistics() {
        try {
            const stats = {
                totalSchemes: governmentSchemes.length,
                byCategory: {},
                byPriority: {},
                withContactNumbers: governmentSchemes.filter(s => s.contactNumber).length,
                withWebsites: governmentSchemes.filter(s => s.website).length
            };

            // Count by category
            governmentSchemes.forEach(scheme => {
                const category = scheme.category;
                stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
            });

            // Count by priority
            governmentSchemes.forEach(scheme => {
                const priority = scheme.priority;
                stats.byPriority[priority] = (stats.byPriority[priority] || 0) + 1;
            });

            return {
                success: true,
                data: stats
            };
        } catch (error) {
            console.error('Error calculating scheme statistics:', error);
            return {
                success: false,
                error: 'Failed to calculate statistics',
                data: {}
            };
        }
    }
}

module.exports = new GovernmentSchemesService();
