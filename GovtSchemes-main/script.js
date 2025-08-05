// Government Schemes Data
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
        icon: "fas fa-phone",
        iconColor: "#10b981",
        priority: "high"
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
        icon: "fas fa-store",
        iconColor: "#2563eb",
        priority: "high"
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
        icon: "fas fa-chart-line",
        iconColor: "#f59e0b",
        priority: "medium"
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
        icon: "fas fa-warehouse",
        iconColor: "#8b5cf6",
        priority: "high"
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
        icon: "fas fa-shield-alt",
        iconColor: "#ef4444",
        priority: "high"
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
        icon: "fas fa-rupee-sign",
        iconColor: "#059669",
        priority: "high"
    }
];

// Crop Calendar Data
const cropCalendarData = [
    {
        id: 1,
        name: "Rice",
        season: "kharif",
        sowingStart: "June",
        sowingEnd: "July",
        harvestStart: "October",
        harvestEnd: "November",
        duration: "120-150 days",
        waterRequirement: "High",
        soilType: "Clay, Clay loam",
        description: "Rice is the staple food crop grown during monsoon season.",
        tips: [
            "Maintain proper water level in fields",
            "Use disease-resistant varieties",
            "Apply fertilizers as per soil test"
        ],
        diseases: ["Blast", "Brown spot", "Bacterial blight"],
        fertilizers: ["Urea", "DAP", "Potash"]
    },
    {
        id: 2,
        name: "Wheat",
        season: "rabi",
        sowingStart: "November",
        sowingEnd: "December",
        harvestStart: "March",
        harvestEnd: "April",
        duration: "110-130 days",
        waterRequirement: "Medium",
        soilType: "Loam, Sandy loam",
        description: "Wheat is a major cereal crop grown in winter season.",
        tips: [
            "Ensure proper seed bed preparation",
            "Timely sowing is crucial",
            "Monitor for pest attacks"
        ],
        diseases: ["Rust", "Smut", "Bunt"],
        fertilizers: ["Urea", "DAP", "Zinc sulfate"]
    },
    {
        id: 3,
        name: "Cotton",
        season: "kharif",
        sowingStart: "April",
        sowingEnd: "June",
        harvestStart: "October",
        harvestEnd: "January",
        duration: "160-200 days",
        waterRequirement: "Medium",
        soilType: "Black cotton soil",
        description: "Cotton is an important cash crop requiring warm climate.",
        tips: [
            "Use certified seeds",
            "Practice integrated pest management",
            "Ensure proper spacing"
        ],
        diseases: ["Bollworm", "Whitefly", "Aphids"],
        fertilizers: ["NPK", "Boron", "Sulfur"]
    },
    {
        id: 4,
        name: "Sugarcane",
        season: "all",
        sowingStart: "February",
        sowingEnd: "April",
        harvestStart: "December",
        harvestEnd: "March",
        duration: "10-12 months",
        waterRequirement: "High",
        soilType: "Deep fertile soil",
        description: "Sugarcane is a long duration cash crop.",
        tips: [
            "Ensure adequate irrigation",
            "Apply organic matter",
            "Timely earthing up"
        ],
        diseases: ["Red rot", "Smut", "Wilt"],
        fertilizers: ["Urea", "SSP", "MOP"]
    },
    {
        id: 5,
        name: "Maize",
        season: "kharif",
        sowingStart: "June",
        sowingEnd: "July",
        harvestStart: "September",
        harvestEnd: "October",
        duration: "90-110 days",
        waterRequirement: "Medium",
        soilType: "Well-drained loam",
        description: "Maize is a versatile crop used for food, feed, and industrial purposes.",
        tips: [
            "Maintain proper plant population",
            "Side dress with nitrogen",
            "Control weeds early"
        ],
        diseases: ["Downy mildew", "Leaf blight", "Stalk rot"],
        fertilizers: ["Urea", "DAP", "Potash"]
    }
];

// DOM Elements
const schemesGrid = document.getElementById('schemesGrid');
const searchInput = document.getElementById('searchInput');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const cropModal = document.getElementById('cropModal');
const cropModalTitle = document.getElementById('cropModalTitle');
const cropModalBody = document.getElementById('cropModalBody');
const calendarGrid = document.getElementById('calendarGrid');
const cropSelect = document.getElementById('cropSelect');
const seasonSelect = document.getElementById('seasonSelect');
const loading = document.getElementById('loading');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeSearch();
    initializeModals();
    initializeCropCalendar();
    renderSchemes(governmentSchemes);
    renderCropCalendar(cropCalendarData);
    
    // Show home section by default
    showSection('home');
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionName = link.getAttribute('data-section');
            if (sectionName) {
                showSection(sectionName);
                
                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Close mobile menu
                if (navMenu) navMenu.classList.remove('active');
                if (hamburger) hamburger.classList.remove('active');
            }
        });
    });

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

// Section management
function showSection(sectionName) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// Initialize search functionality
function initializeSearch() {
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterSchemes, 300));
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                filterSchemes();
            }
        });
    }
}

// Initialize modals
function initializeModals() {
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
        if (e.target === cropModal) {
            closeCropModal();
        }
    });
}

// Initialize crop calendar
function initializeCropCalendar() {
    if (cropSelect && seasonSelect) {
        cropSelect.addEventListener('change', filterCrops);
        seasonSelect.addEventListener('change', filterCrops);
    }
}

// Filter crops based on selection
function filterCrops() {
    const cropFilter = cropSelect ? cropSelect.value : 'all';
    const seasonFilter = seasonSelect ? seasonSelect.value : 'all';
    
    let filteredCrops = cropCalendarData;
    
    if (cropFilter !== 'all') {
        filteredCrops = filteredCrops.filter(crop => 
            crop.name.toLowerCase() === cropFilter.toLowerCase()
        );
    }
    
    if (seasonFilter !== 'all') {
        filteredCrops = filteredCrops.filter(crop => 
            crop.season === seasonFilter || crop.season === 'all'
        );
    }
    
    renderCropCalendar(filteredCrops);
}

// Render crop calendar
function renderCropCalendar(crops) {
    if (!calendarGrid) return;
    
    calendarGrid.innerHTML = crops.map(crop => `
        <div class="crop-card" onclick="openCropModal(${crop.id})">
            <h3>
                <i class="fas fa-seedling"></i>
                ${crop.name}
            </h3>
            <div class="crop-info">
                <div class="crop-info-item">
                    <span class="crop-info-label">Season:</span>
                    <span class="season-badge season-${crop.season}">${crop.season.charAt(0).toUpperCase() + crop.season.slice(1)}</span>
                </div>
                <div class="crop-info-item">
                    <span class="crop-info-label">Sowing:</span>
                    <span class="crop-info-value">${crop.sowingStart} - ${crop.sowingEnd}</span>
                </div>
                <div class="crop-info-item">
                    <span class="crop-info-label">Harvest:</span>
                    <span class="crop-info-value">${crop.harvestStart} - ${crop.harvestEnd}</span>
                </div>
                <div class="crop-info-item">
                    <span class="crop-info-label">Duration:</span>
                    <span class="crop-info-value">${crop.duration}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Open crop details modal
function openCropModal(cropId) {
    const crop = cropCalendarData.find(c => c.id === cropId);
    if (!crop || !cropModal || !cropModalBody) return;
    
    cropModalBody.innerHTML = `
        <h2><i class="fas fa-seedling"></i> ${crop.name}</h2>
        <p class="description">${crop.description}</p>
        
        <div class="modal-section">
            <h3><i class="fas fa-calendar"></i> Growing Schedule</h3>
            <div class="schedule-grid">
                <div class="schedule-item">
                    <strong>Sowing Period:</strong> ${crop.sowingStart} - ${crop.sowingEnd}
                </div>
                <div class="schedule-item">
                    <strong>Harvest Period:</strong> ${crop.harvestStart} - ${crop.harvestEnd}
                </div>
                <div class="schedule-item">
                    <strong>Duration:</strong> ${crop.duration}
                </div>
                <div class="schedule-item">
                    <strong>Season:</strong> <span class="season-badge season-${crop.season}">${crop.season.charAt(0).toUpperCase() + crop.season.slice(1)}</span>
                </div>
            </div>
        </div>
        
        <div class="modal-section">
            <h3><i class="fas fa-tint"></i> Growing Conditions</h3>
            <div class="conditions-grid">
                <div class="condition-item">
                    <strong>Water Requirement:</strong> ${crop.waterRequirement}
                </div>
                <div class="condition-item">
                    <strong>Soil Type:</strong> ${crop.soilType}
                </div>
            </div>
        </div>
        
        <div class="modal-section">
            <h3><i class="fas fa-lightbulb"></i> Growing Tips</h3>
            <ul class="tips-list">
                ${crop.tips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
        </div>
        
        <div class="modal-section">
            <h3><i class="fas fa-bug"></i> Common Diseases</h3>
            <div class="tags">
                ${crop.diseases.map(disease => `<span class="tag disease-tag">${disease}</span>`).join('')}
            </div>
        </div>
        
        <div class="modal-section">
            <h3><i class="fas fa-flask"></i> Recommended Fertilizers</h3>
            <div class="tags">
                ${crop.fertilizers.map(fertilizer => `<span class="tag fertilizer-tag">${fertilizer}</span>`).join('')}
            </div>
        </div>
    `;
    
    cropModal.style.display = 'block';
}

// Close crop modal
function closeCropModal() {
    if (cropModal) {
        cropModal.style.display = 'none';
    }
}

// Show loading spinner
function showLoading() {
    loading.style.display = 'flex';
}

// Hide loading spinner
function hideLoading() {
    loading.style.display = 'none';
}

// Initialize event listeners
function initializeEventListeners() {
    // Mobile navigation toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Search functionality
    searchInput.addEventListener('input', debounce(filterSchemes, 300));
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            filterSchemes();
        }
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Render schemes in the grid
function renderSchemes(schemes) {
    if (!schemesGrid) return;

    if (schemes.length === 0) {
        schemesGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No schemes found</h3>
                <p>Try adjusting your search criteria or browse all available schemes.</p>
                <button class="btn btn-primary" onclick="clearSearch()">
                    <i class="fas fa-refresh"></i>
                    Show All Schemes
                </button>
            </div>
        `;
        return;
    }

    schemesGrid.innerHTML = schemes.map(scheme => `
        <div class="scheme-card fade-in" onclick="openSchemeModal(${scheme.id})">
            <div class="scheme-header">
                <div class="scheme-icon" style="background: ${scheme.iconColor}">
                    <i class="${scheme.icon}"></i>
                </div>
                <div>
                    <h3 class="scheme-title">${scheme.title}</h3>
                    <p class="scheme-category">${scheme.category}</p>
                </div>
            </div>
            
            <p class="scheme-description">${scheme.description}</p>
            
            <div class="scheme-benefits">
                <h4>Key Benefits:</h4>
                <ul class="benefit-list">
                    ${scheme.benefits.slice(0, 3).map(benefit => `<li>${benefit}</li>`).join('')}
                    ${scheme.benefits.length > 3 ? '<li>+ More benefits...</li>' : ''}
                </ul>
            </div>
            
            <div class="scheme-actions">
                <button class="btn-small btn-learn" onclick="event.stopPropagation(); openSchemeModal(${scheme.id})">
                    <i class="fas fa-info-circle"></i>
                    Learn More
                </button>
                <a href="${scheme.website}" target="_blank" class="btn-small btn-apply" onclick="event.stopPropagation()">
                    <i class="fas fa-external-link-alt"></i>
                    Visit Portal
                </a>
                ${scheme.contactNumber ? `
                    <a href="tel:${scheme.contactNumber}" class="btn-small btn-learn" onclick="event.stopPropagation()">
                        <i class="fas fa-phone"></i>
                        Call ${scheme.contactNumber}
                    </a>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Filter schemes based on search input
function filterSchemes() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (!searchTerm) {
        renderSchemes(governmentSchemes);
        return;
    }

    const filteredSchemes = governmentSchemes.filter(scheme => 
        scheme.title.toLowerCase().includes(searchTerm) ||
        scheme.category.toLowerCase().includes(searchTerm) ||
        scheme.description.toLowerCase().includes(searchTerm) ||
        scheme.benefits.some(benefit => benefit.toLowerCase().includes(searchTerm)) ||
        scheme.eligibility.toLowerCase().includes(searchTerm)
    );

    renderSchemes(filteredSchemes);
}

// Clear search and show all schemes
function clearSearch() {
    searchInput.value = '';
    renderSchemes(governmentSchemes);
}

// Open scheme details modal
function openSchemeModal(schemeId) {
    const scheme = governmentSchemes.find(s => s.id === schemeId);
    if (!scheme) return;

    modalTitle.textContent = scheme.title;
    modalBody.innerHTML = `
        <div class="modal-scheme-header">
            <div class="modal-scheme-icon" style="background: ${scheme.iconColor}">
                <i class="${scheme.icon}"></i>
            </div>
            <div>
                <h3>${scheme.title}</h3>
                <span class="modal-scheme-category">${scheme.category}</span>
            </div>
        </div>
        
        <div class="modal-section">
            <h4><i class="fas fa-info-circle"></i> Description</h4>
            <p>${scheme.description}</p>
        </div>
        
        <div class="modal-section">
            <h4><i class="fas fa-gift"></i> Benefits</h4>
            <ul class="modal-benefit-list">
                ${scheme.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
            </ul>
        </div>
        
        <div class="modal-section">
            <h4><i class="fas fa-user-check"></i> Eligibility</h4>
            <p>${scheme.eligibility}</p>
        </div>
        
        <div class="modal-section">
            <h4><i class="fas fa-link"></i> Quick Actions</h4>
            <div class="modal-actions">
                <a href="${scheme.website}" target="_blank" class="btn btn-primary">
                    <i class="fas fa-external-link-alt"></i>
                    Visit Official Portal
                </a>
                ${scheme.contactNumber ? `
                    <a href="tel:${scheme.contactNumber}" class="btn btn-secondary">
                        <i class="fas fa-phone"></i>
                        Call ${scheme.contactNumber}
                    </a>
                ` : ''}
                <button class="btn btn-secondary" onclick="shareScheme(${scheme.id})">
                    <i class="fas fa-share"></i>
                    Share Scheme
                </button>
            </div>
        </div>
        
        <div class="modal-section">
            <div class="modal-info-box">
                <i class="fas fa-exclamation-triangle"></i>
                <div>
                    <h5>Important Note</h5>
                    <p>Please verify eligibility criteria and required documents on the official portal before applying. For assistance, contact the Kisan Call Center at <strong>1551</strong>.</p>
                </div>
            </div>
        </div>
    `;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Open different types of modals
function openModal(type) {
    let title, content;
    
    switch(type) {
        case 'eligibility':
            title = 'Eligibility Checker';
            content = `
                <div class="eligibility-form">
                    <h4>Check Your Eligibility</h4>
                    <form id="eligibilityForm">
                        <div class="form-group">
                            <label>Land Holding (in hectares):</label>
                            <input type="number" step="0.1" placeholder="Enter land size">
                        </div>
                        <div class="form-group">
                            <label>Farmer Category:</label>
                            <select>
                                <option>Small & Marginal Farmer</option>
                                <option>Medium Farmer</option>
                                <option>Large Farmer</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>State:</label>
                            <select>
                                <option>Select your state</option>
                                <option>Andhra Pradesh</option>
                                <option>Bihar</option>
                                <option>Gujarat</option>
                                <option>Haryana</option>
                                <option>Karnataka</option>
                                <option>Madhya Pradesh</option>
                                <option>Maharashtra</option>
                                <option>Punjab</option>
                                <option>Rajasthan</option>
                                <option>Tamil Nadu</option>
                                <option>Uttar Pradesh</option>
                                <option>West Bengal</option>
                            </select>
                        </div>
                        <button type="button" class="btn btn-primary" onclick="checkEligibility()">
                            <i class="fas fa-check"></i>
                            Check Eligibility
                        </button>
                    </form>
                </div>
            `;
            break;
        case 'application':
            title = 'How to Apply';
            content = `
                <div class="application-guide">
                    <h4>Step-by-Step Application Process</h4>
                    <div class="steps">
                        <div class="step">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <h5>Prepare Documents</h5>
                                <p>Gather required documents like Aadhaar card, bank details, land records, and passport-size photographs.</p>
                            </div>
                        </div>
                        <div class="step">
                            <div class="step-number">2</div>
                            <div class="step-content">
                                <h5>Visit Official Portal</h5>
                                <p>Go to the official website of the respective scheme and create an account if required.</p>
                            </div>
                        </div>
                        <div class="step">
                            <div class="step-number">3</div>
                            <div class="step-content">
                                <h5>Fill Application Form</h5>
                                <p>Complete the online application form with accurate information and upload required documents.</p>
                            </div>
                        </div>
                        <div class="step">
                            <div class="step-number">4</div>
                            <div class="step-content">
                                <h5>Submit & Track</h5>
                                <p>Submit your application and note the reference number for tracking application status.</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            break;
        case 'faq':
            title = 'Frequently Asked Questions';
            content = `
                <div class="faq-section">
                    <div class="faq-item">
                        <h5><i class="fas fa-question-circle"></i> Who can apply for these schemes?</h5>
                        <p>Most schemes are designed for farmers, with specific eligibility criteria based on land holding, income, and other factors.</p>
                    </div>
                    <div class="faq-item">
                        <h5><i class="fas fa-question-circle"></i> How long does the application process take?</h5>
                        <p>Processing time varies by scheme, typically ranging from 15-60 days depending on verification requirements.</p>
                    </div>
                    <div class="faq-item">
                        <h5><i class="fas fa-question-circle"></i> Can I apply for multiple schemes?</h5>
                        <p>Yes, you can apply for multiple schemes as long as you meet the eligibility criteria for each.</p>
                    </div>
                    <div class="faq-item">
                        <h5><i class="fas fa-question-circle"></i> What if my application is rejected?</h5>
                        <p>You can reapply after addressing the rejection reasons or contact the helpline for assistance.</p>
                    </div>
                </div>
            `;
            break;
        default:
            title = 'Information';
            content = '<p>Content not available at the moment.</p>';
    }
    
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Share scheme functionality
function shareScheme(schemeId) {
    const scheme = governmentSchemes.find(s => s.id === schemeId);
    if (!scheme) return;

    if (navigator.share) {
        navigator.share({
            title: scheme.title,
            text: scheme.description,
            url: scheme.website
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        const shareText = `Check out this government scheme: ${scheme.title}\n\n${scheme.description}\n\nLearn more: ${scheme.website}`;
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Scheme details copied to clipboard!');
        });
    }
}

// Scroll to schemes section
function scrollToSchemes() {
    document.getElementById('schemes').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Open emergency contact modal
function openEmergencyContact() {
    modalTitle.textContent = 'Emergency Agricultural Support';
    modalBody.innerHTML = `
        <div class="emergency-contacts">
            <div class="emergency-header">
                <i class="fas fa-exclamation-triangle"></i>
                <h4>24x7 Emergency Agricultural Helpline</h4>
            </div>
            
            <div class="contact-card">
                <div class="contact-icon">
                    <i class="fas fa-phone"></i>
                </div>
                <div class="contact-info">
                    <h5>Kisan Call Center</h5>
                    <p class="contact-number">1551</p>
                    <p>Free agricultural advisory service available 24x7 in local languages</p>
                    <a href="tel:1551" class="btn btn-primary">
                        <i class="fas fa-phone"></i>
                        Call Now
                    </a>
                </div>
            </div>
            
            <div class="emergency-services">
                <h5>Other Emergency Services:</h5>
                <div class="service-list">
                    <div class="service-item">
                        <strong>Weather Alerts:</strong> <a href="tel:1551">1551</a>
                    </div>
                    <div class="service-item">
                        <strong>Crop Disease Emergency:</strong> <a href="tel:1551">1551</a>
                    </div>
                    <div class="service-item">
                        <strong>Livestock Emergency:</strong> <a href="tel:1962">1962</a>
                    </div>
                    <div class="service-item">
                        <strong>General Emergency:</strong> <a href="tel:112">112</a>
                    </div>
                </div>
            </div>
            
            <div class="emergency-note">
                <i class="fas fa-info-circle"></i>
                <p>For immediate assistance with crop diseases, pest attacks, weather-related issues, or any agricultural emergency, call the Kisan Call Center at 1551. The service is free and available in multiple Indian languages.</p>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Check eligibility function
function checkEligibility() {
    // This is a simplified eligibility check
    // In a real application, this would connect to a backend service
    const result = `
        <div class="eligibility-result">
            <div class="result-success">
                <i class="fas fa-check-circle"></i>
                <h4>You are eligible for the following schemes:</h4>
            </div>
            <ul class="eligible-schemes">
                <li><strong>PM Kisan Samman Nidhi</strong> - Direct income support</li>
                <li><strong>Pradhan Mantri Fasal Bima Yojana</strong> - Crop insurance</li>
                <li><strong>Kisan Call Center</strong> - Agricultural advisory</li>
                <li><strong>National Agriculture Market</strong> - Better market access</li>
            </ul>
            <div class="next-steps">
                <h5>Next Steps:</h5>
                <p>Visit the respective scheme portals to apply. Keep your documents ready and contact 1551 for any assistance.</p>
                <button class="btn btn-primary" onclick="closeModal()">
                    <i class="fas fa-arrow-right"></i>
                    Explore Schemes
                </button>
            </div>
        </div>
    `;
    
    modalBody.innerHTML = result;
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add some additional CSS styles via JavaScript for modal content
const additionalStyles = `
    <style>
        .modal-scheme-header {
            display: flex;
            align-items: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .modal-scheme-icon {
            width: 60px;
            height: 60px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            color: white;
            margin-right: 1rem;
        }
        
        .modal-scheme-category {
            background: #f1f5f9;
            color: #64748b;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 500;
        }
        
        .modal-section {
            margin-bottom: 2rem;
        }
        
        .modal-section h4 {
            color: #1e293b;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .modal-benefit-list {
            list-style: none;
            padding: 0;
        }
        
        .modal-benefit-list li {
            padding: 0.5rem 0;
            padding-left: 1.5rem;
            position: relative;
            color: #64748b;
        }
        
        .modal-benefit-list li::before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #10b981;
            font-weight: bold;
        }
        
        .modal-actions {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }
        
        .modal-info-box {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 12px;
            padding: 1rem;
            display: flex;
            gap: 1rem;
            align-items: flex-start;
        }
        
        .modal-info-box i {
            color: #f59e0b;
            font-size: 1.2rem;
            margin-top: 0.2rem;
        }
        
        .modal-info-box h5 {
            margin: 0 0 0.5rem 0;
            color: #92400e;
        }
        
        .modal-info-box p {
            margin: 0;
            color: #92400e;
        }
        
        .eligibility-form .form-group {
            margin-bottom: 1.5rem;
        }
        
        .eligibility-form label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: #1e293b;
        }
        
        .eligibility-form input,
        .eligibility-form select {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 1rem;
        }
        
        .steps {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        
        .step {
            display: flex;
            gap: 1rem;
            align-items: flex-start;
        }
        
        .step-number {
            width: 30px;
            height: 30px;
            background: #2563eb;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            flex-shrink: 0;
        }
        
        .step-content h5 {
            margin: 0 0 0.5rem 0;
            color: #1e293b;
        }
        
        .step-content p {
            margin: 0;
            color: #64748b;
        }
        
        .faq-item {
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .faq-item:last-child {
            border-bottom: none;
        }
        
        .faq-item h5 {
            color: #1e293b;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .faq-item i {
            color: #2563eb;
        }
        
        .emergency-contacts .emergency-header {
            text-align: center;
            margin-bottom: 2rem;
            color: #dc2626;
        }
        
        .emergency-contacts .emergency-header i {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }
        
        .contact-card {
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 12px;
            padding: 1.5rem;
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .contact-icon {
            width: 60px;
            height: 60px;
            background: #dc2626;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            margin: 0 auto 1rem;
        }
        
        .contact-number {
            font-size: 2rem;
            font-weight: bold;
            color: #dc2626;
            margin: 0.5rem 0;
        }
        
        .service-list {
            background: #f8fafc;
            border-radius: 8px;
            padding: 1rem;
        }
        
        .service-item {
            padding: 0.5rem 0;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .service-item:last-child {
            border-bottom: none;
        }
        
        .service-item a {
            color: #2563eb;
            text-decoration: none;
            font-weight: 500;
        }
        
        .emergency-note {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 8px;
            padding: 1rem;
            display: flex;
            gap: 0.5rem;
            align-items: flex-start;
            margin-top: 1.5rem;
        }
        
        .emergency-note i {
            color: #2563eb;
            margin-top: 0.2rem;
        }
        
        .eligibility-result .result-success {
            text-align: center;
            color: #10b981;
            margin-bottom: 1.5rem;
        }
        
        .eligibility-result .result-success i {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }
        
        .eligible-schemes {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 8px;
            padding: 1rem;
            list-style: none;
            margin-bottom: 1.5rem;
        }
        
        .eligible-schemes li {
            padding: 0.5rem 0;
            border-bottom: 1px solid #dcfce7;
        }
        
        .eligible-schemes li:last-child {
            border-bottom: none;
        }
        
        .next-steps {
            background: #eff6ff;
            border-radius: 8px;
            padding: 1rem;
        }
        
        .no-results {
            grid-column: 1 / -1;
            text-align: center;
            padding: 3rem;
            color: #64748b;
        }
        
        .no-results i {
            font-size: 3rem;
            margin-bottom: 1rem;
            color: #cbd5e1;
        }
        
        .no-results h3 {
            margin-bottom: 0.5rem;
            color: #1e293b;
        }
        
        @media (max-width: 768px) {
            .modal-actions {
                flex-direction: column;
            }
            
            .steps .step {
                flex-direction: column;
                text-align: center;
            }
            
            .modal-scheme-header {
                flex-direction: column;
                text-align: center;
            }
            
            .modal-scheme-icon {
                margin: 0 auto 1rem auto;
            }
        }
    </style>
`;

// Add the additional styles to the document head
document.head.insertAdjacentHTML('beforeend', additionalStyles);
