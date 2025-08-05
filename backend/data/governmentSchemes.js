// Government Schemes Data for Indian Agriculture
const governmentSchemes = [
    {
        id: 1,
        title: "Kisan Call Center (KCC)",
        category: "Helpline & Support",
        description: "24x7 toll-free helpline service providing immediate agricultural information and support to farmers in their local language.",
        benefits: [
            "Free agricultural advisory services",
            "Pest and disease management guidance", 
            "Weather-based farming advice",
            "Market price information",
            "Government scheme information"
        ],
        eligibility: "All farmers across India",
        contactNumber: "1551",
        website: "https://mkisan.gov.in/",
        icon: "phone",
        iconColor: "#10b981",
        priority: "high",
        applicationProcess: [
            "Dial toll-free number 1551",
            "Select preferred language",
            "Connect with agricultural expert",
            "Get instant support and guidance"
        ],
        documents: ["None required for phone consultation"]
    },
    {
        id: 2,
        title: "National Agriculture Market (eNAM)",
        category: "Market Platform",
        description: "Pan-India electronic trading portal connecting Agricultural Produce Market Committees (APMCs) to create a unified national market.",
        benefits: [
            "Better price discovery for crops",
            "Transparent auction process",
            "Direct access to buyers",
            "Reduced transportation costs",
            "Quality assurance through grading"
        ],
        eligibility: "Registered farmers with valid documents",
        website: "https://enam.gov.in/",
        icon: "store",
        iconColor: "#2563eb",
        priority: "high",
        applicationProcess: [
            "Visit nearest APMC office",
            "Submit required documents",
            "Get registered on eNAM portal",
            "Upload crop details for auction",
            "Participate in transparent bidding process"
        ],
        documents: [
            "Aadhaar Card",
            "Bank Account Details",
            "Land Records",
            "Crop Quality Certificate"
        ]
    },
    {
        id: 3,
        title: "Rashtriya Krishi Vikas Yojana (RKVY)",
        category: "Development Scheme",
        description: "Comprehensive scheme to boost agricultural development through increased investment in agriculture and allied sectors.",
        benefits: [
            "Infrastructure development support",
            "Technology adoption assistance",
            "Capacity building programs",
            "Value chain development",
            "Farmer producer organization support"
        ],
        eligibility: "State governments and farmer organizations",
        website: "https://rkvy.nic.in/",
        icon: "trending-up",
        iconColor: "#f59e0b",
        priority: "medium",
        applicationProcess: [
            "State government prepares district plans",
            "Submit proposals to central government",
            "Get approval from SLSC committee",
            "Implement approved projects",
            "Monitor and evaluate progress"
        ],
        documents: [
            "Project Proposal",
            "District Agricultural Plan",
            "Budget Allocation Details",
            "Implementation Timeline"
        ]
    },
    {
        id: 4,
        title: "Agriculture Infrastructure Fund (AIF)",
        category: "Infrastructure Finance",
        description: "Financing facility to support post-harvest management infrastructure and community farming assets creation.",
        benefits: [
            "Subsidized interest rates (3% subvention)",
            "Credit guarantee coverage",
            "Support for storage facilities",
            "Processing unit development",
            "Cold chain infrastructure"
        ],
        eligibility: "Farmers, FPOs, Agri-entrepreneurs, Start-ups",
        website: "https://agriinfra.dac.gov.in/",
        icon: "warehouse",
        iconColor: "#8b5cf6",
        priority: "high",
        applicationProcess: [
            "Prepare detailed project report",
            "Apply through designated banks",
            "Get technical approval",
            "Fulfill loan documentation",
            "Start infrastructure development"
        ],
        documents: [
            "Project Report",
            "Land Documents",
            "Technical Feasibility Study",
            "Financial Projections",
            "Environmental Clearance"
        ]
    },
    {
        id: 5,
        title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
        category: "Insurance Scheme", 
        description: "Crop insurance scheme providing financial support to farmers suffering crop loss/damage due to unforeseen events.",
        benefits: [
            "Low premium rates (2% for Kharif, 1.5% for Rabi)",
            "Coverage for all stages of crop cycle",
            "Use of technology for quick claim settlement",
            "Coverage for prevented sowing/planting risks",
            "Post-harvest losses coverage"
        ],
        eligibility: "All farmers (loanee and non-loanee)",
        website: "https://pmfby.gov.in/",
        icon: "shield",
        iconColor: "#ef4444",
        priority: "high",
        applicationProcess: [
            "Visit nearest bank or CSC center",
            "Fill insurance application form",
            "Submit required documents",
            "Pay premium amount",
            "Receive insurance policy"
        ],
        documents: [
            "Aadhaar Card",
            "Bank Account Details",
            "Land Records/Tenancy Certificate",
            "Sowing Certificate",
            "Previous Year's Insurance Policy (if any)"
        ]
    },
    {
        id: 6,
        title: "PM Kisan Samman Nidhi",
        category: "Direct Benefit Transfer",
        description: "Direct income support to eligible farmer families with cultivable land holding up to 2 hectares.",
        benefits: [
            "₹6,000 per year in three installments",
            "Direct bank transfer",
            "No intermediaries involved",
            "Quick and transparent process",
            "Support for small and marginal farmers"
        ],
        eligibility: "Small and marginal farmers with land holding up to 2 hectares",
        website: "https://pmkisan.gov.in/",
        icon: "currency-rupee",
        iconColor: "#059669",
        priority: "high",
        applicationProcess: [
            "Visit PM-Kisan portal or CSC center",
            "Register with required details",
            "Submit documents for verification",
            "Link Aadhaar with bank account",
            "Receive installments directly in bank"
        ],
        documents: [
            "Aadhaar Card",
            "Bank Account Details",
            "Land Ownership Documents",
            "Mobile Number",
            "Passport Size Photo"
        ]
    },
    {
        id: 7,
        title: "Soil Health Card Scheme",
        category: "Soil Management",
        description: "Government initiative to provide soil health cards to farmers containing crop-wise recommendations of nutrients and fertilizers.",
        benefits: [
            "Crop-wise nutrient recommendations",
            "Soil testing at subsidized rates",
            "Improved crop productivity",
            "Reduced input costs",
            "Sustainable farming practices"
        ],
        eligibility: "All farmers across India",
        website: "https://soilhealth.dac.gov.in/",
        icon: "leaf",
        iconColor: "#16a34a",
        priority: "medium",
        applicationProcess: [
            "Contact local agriculture office",
            "Collect soil sample as per guidelines",
            "Submit sample at testing center",
            "Receive soil health card",
            "Follow nutrient recommendations"
        ],
        documents: [
            "Land Records",
            "Farmer Registration Details",
            "Soil Sample",
            "Contact Information"
        ]
    },
    {
        id: 8,
        title: "Micro Irrigation Fund",
        category: "Water Management",
        description: "Dedicated fund to achieve 'per drop more crop' by promoting micro-irrigation in the country.",
        benefits: [
            "Subsidized micro-irrigation systems",
            "Water conservation support",
            "Increased crop productivity",
            "Reduced labor costs",
            "Climate-resilient farming"
        ],
        eligibility: "All categories of farmers",
        website: "https://pmksy.gov.in/",
        icon: "droplets",
        iconColor: "#0ea5e9",
        priority: "medium",
        applicationProcess: [
            "Apply through state agriculture department",
            "Get technical approval for system",
            "Install micro-irrigation equipment",
            "Submit installation certificate",
            "Receive subsidy amount"
        ],
        documents: [
            "Application Form",
            "Land Records",
            "Technical Feasibility Report",
            "Cost Estimates",
            "Bank Account Details"
        ]
    }
];

// Categories for filtering
const schemeCategories = [
    { id: "all", name: "All Categories" },
    { id: "helpline", name: "Helpline & Support" },
    { id: "market", name: "Market Platform" },
    { id: "development", name: "Development Scheme" },
    { id: "infrastructure", name: "Infrastructure Finance" },
    { id: "insurance", name: "Insurance Scheme" },
    { id: "dbt", name: "Direct Benefit Transfer" },
    { id: "soil", name: "Soil Management" },
    { id: "water", name: "Water Management" }
];

// Priority levels
const priorityLevels = {
    high: { name: "High Priority", color: "#ef4444", weight: 3 },
    medium: { name: "Medium Priority", color: "#f59e0b", weight: 2 },
    low: { name: "Low Priority", color: "#10b981", weight: 1 }
};

module.exports = {
    governmentSchemes,
    schemeCategories,
    priorityLevels
};
