const cropData = {
  crops: [
    {
      name: 'wheat',
      scientificName: 'Triticum aestivum',
      category: 'Cereal',
      description: 'A widely grown cereal grain and staple food crop',
      aliases: ['winter wheat', 'spring wheat'],
      growingPeriodDays: 120,
      difficulty: 'Medium',
      plantingSeasons: {
        northern: [
          { start: 10, end: 12, type: 'winter' }, // October-December
          { start: 3, end: 4, type: 'spring' }   // March-April
        ],
        southern: [
          { start: 4, end: 6, type: 'winter' },  // April-June
          { start: 9, end: 10, type: 'spring' }  // September-October
        ]
      },
      requirements: {
        temperature: {
          minimum: 3,
          maximum: 32,
          optimal: 20
        },
        soilMoisture: {
          minimum: 25,
          maximum: 75,
          optimal: 50
        },
        soilPH: {
          minimum: 6.0,
          maximum: 7.5,
          optimal: 6.5
        }
      },
      growthStages: [
        {
          name: 'Germination',
          duration: 7,
          description: 'Seeds sprout and first shoots emerge',
          activities: ['Ensure adequate moisture', 'Monitor for pests'],
          careInstructions: ['Keep soil moist but not waterlogged', 'Protect from birds'],
          expectedSigns: ['Green shoots visible', 'First leaves unfurling']
        },
        {
          name: 'Tillering',
          duration: 30,
          description: 'Plant develops multiple stems from the base',
          activities: ['First fertilizer application', 'Weed control'],
          careInstructions: ['Apply nitrogen fertilizer', 'Control broadleaf weeds'],
          expectedSigns: ['Multiple shoots from each plant', 'Leaf development']
        },
        {
          name: 'Stem Extension',
          duration: 35,
          description: 'Stems grow rapidly in height',
          activities: ['Monitor for diseases', 'Apply growth regulators if needed'],
          careInstructions: ['Watch for fungal diseases', 'Ensure adequate nutrition'],
          expectedSigns: ['Rapid height increase', 'Node development']
        },
        {
          name: 'Heading',
          duration: 15,
          description: 'Flower heads emerge from leaf sheaths',
          activities: ['Flowering support', 'Pest monitoring'],
          careInstructions: ['Protect from strong winds', 'Monitor for aphids'],
          expectedSigns: ['Wheat heads visible', 'Beginning of flowering']
        },
        {
          name: 'Grain Filling',
          duration: 28,
          description: 'Grains develop and fill with starch',
          activities: ['Reduce irrigation', 'Monitor grain development'],
          careInstructions: ['Avoid water stress', 'Watch for grain diseases'],
          expectedSigns: ['Grains forming in heads', 'Heads becoming heavier']
        },
        {
          name: 'Maturity',
          duration: 5,
          description: 'Grains reach full maturity',
          activities: ['Prepare for harvest', 'Test grain moisture'],
          careInstructions: ['Allow to dry naturally', 'Prepare harvesting equipment'],
          expectedSigns: ['Golden color', 'Hard, dry grains']
        }
      ],
      fertilizationSchedule: [
        {
          daysAfterPlanting: 14,
          type: 'NPK',
          nutrient: '18-46-0',
          amount: 120,
          unit: 'kg/hectare',
          method: 'broadcast',
          instructions: 'Apply after first irrigation and incorporate into soil'
        },
        {
          daysAfterPlanting: 45,
          type: 'Urea',
          nutrient: 'Nitrogen',
          amount: 80,
          unit: 'kg/hectare',
          method: 'side-dress',
          instructions: 'Apply along rows and irrigate immediately'
        },
        {
          daysAfterPlanting: 75,
          type: 'Urea',
          nutrient: 'Nitrogen',
          amount: 40,
          unit: 'kg/hectare',
          method: 'foliar',
          instructions: 'Spray early morning or evening'
        }
      ],
      waterRequirement: 30, // liters per m² per week
      expectedYield: {
        amount: 4.5,
        unit: 'tons/hectare'
      },
      harvestingMethod: 'Combine harvester or manual cutting',
      postHarvestCare: 'Dry to 12-14% moisture content',
      storageInstructions: 'Store in dry, ventilated conditions',
      processingDays: 3
    },
    {
      name: 'rice',
      scientificName: 'Oryza sativa',
      category: 'Cereal',
      description: 'Major cereal grain and staple food for over half of the world population',
      aliases: ['paddy rice', 'asian rice'],
      growingPeriodDays: 95,
      difficulty: 'Hard',
      plantingSeasons: {
        northern: [
          { start: 5, end: 7, type: 'kharif' },  // May-July
          { start: 11, end: 1, type: 'rabi' }    // November-January
        ],
        southern: [
          { start: 11, end: 1, type: 'dry season' }, // November-January
          { start: 5, end: 7, type: 'wet season' }   // May-July
        ]
      },
      requirements: {
        temperature: {
          minimum: 16,
          maximum: 35,
          optimal: 25
        },
        soilMoisture: {
          minimum: 80,
          maximum: 100,
          optimal: 95
        },
        soilPH: {
          minimum: 5.5,
          maximum: 7.0,
          optimal: 6.0
        }
      },
      growthStages: [
        {
          name: 'Nursery',
          duration: 21,
          description: 'Seedlings grown in nursery beds',
          activities: ['Prepare nursery beds', 'Sow seeds densely'],
          careInstructions: ['Keep constantly moist', 'Thin if overcrowded'],
          expectedSigns: ['Seedling emergence', '3-4 leaf stage']
        },
        {
          name: 'Transplanting',
          duration: 3,
          description: 'Seedlings moved to main field',
          activities: ['Prepare flooded field', 'Transplant seedlings'],
          careInstructions: ['Maintain water level 2-3 cm', 'Handle seedlings gently'],
          expectedSigns: ['Seedlings established', 'New growth visible']
        },
        {
          name: 'Tillering',
          duration: 25,
          description: 'Plants produce multiple shoots',
          activities: ['Maintain water level', 'Apply nitrogen fertilizer'],
          careInstructions: ['Keep water level 3-5 cm', 'Control weeds'],
          expectedSigns: ['Multiple tillers per plant', 'Vigorous growth']
        },
        {
          name: 'Panicle Initiation',
          duration: 15,
          description: 'Flower heads begin to form inside stems',
          activities: ['Apply phosphorus fertilizer', 'Monitor water carefully'],
          careInstructions: ['Maintain consistent water level', 'Avoid water stress'],
          expectedSigns: ['Stems becoming thicker', 'Leaves darkening']
        },
        {
          name: 'Flowering',
          duration: 10,
          description: 'Panicles emerge and flowers open',
          activities: ['Reduce water level slightly', 'Monitor for pests'],
          careInstructions: ['Avoid disturbance', 'Watch for brown plant hopper'],
          expectedSigns: ['Panicles visible', 'White flowers opening']
        },
        {
          name: 'Grain Filling',
          duration: 18,
          description: 'Grains develop and fill',
          activities: ['Manage water carefully', 'Apply potassium'],
          careInstructions: ['Allow field to dry gradually', 'Protect from birds'],
          expectedSigns: ['Panicles heavy with grains', 'Grains milky then hard']
        },
        {
          name: 'Maturity',
          duration: 3,
          description: 'Grains fully mature',
          activities: ['Drain field', 'Prepare for harvest'],
          careInstructions: ['Ensure complete drainage', 'Test grain moisture'],
          expectedSigns: ['Golden yellow color', 'Grains hard and dry']
        }
      ],
      fertilizationSchedule: [
        {
          daysAfterPlanting: 7,
          type: 'NPK',
          nutrient: '20-10-10',
          amount: 150,
          unit: 'kg/hectare',
          method: 'broadcast',
          instructions: 'Apply in standing water and mix well'
        },
        {
          daysAfterPlanting: 35,
          type: 'Urea',
          nutrient: 'Nitrogen',
          amount: 100,
          unit: 'kg/hectare',
          method: 'broadcast',
          instructions: 'Apply in shallow water'
        },
        {
          daysAfterPlanting: 55,
          type: 'NPK',
          nutrient: '0-0-60',
          amount: 60,
          unit: 'kg/hectare',
          method: 'broadcast',
          instructions: 'Apply during panicle initiation'
        }
      ],
      waterRequirement: 150, // liters per m² per week
      expectedYield: {
        amount: 6.0,
        unit: 'tons/hectare'
      },
      harvestingMethod: 'Manual cutting or combine harvester',
      postHarvestCare: 'Dry to 14% moisture, thresh immediately',
      storageInstructions: 'Store in moisture-proof containers',
      processingDays: 5
    },
    {
      name: 'maize',
      scientificName: 'Zea mays',
      category: 'Cereal',
      description: 'Versatile cereal grain used for food, feed, and industrial purposes',
      aliases: ['corn', 'sweet corn'],
      growingPeriodDays: 85,
      difficulty: 'Easy',
      plantingSeasons: {
        northern: [
          { start: 4, end: 6, type: 'spring' },  // April-June
          { start: 7, end: 8, type: 'summer' }   // July-August
        ],
        southern: [
          { start: 10, end: 12, type: 'summer' }, // October-December
          { start: 2, end: 4, type: 'autumn' }    // February-April
        ]
      },
      requirements: {
        temperature: {
          minimum: 10,
          maximum: 35,
          optimal: 25
        },
        soilMoisture: {
          minimum: 35,
          maximum: 70,
          optimal: 55
        },
        soilPH: {
          minimum: 5.8,
          maximum: 7.2,
          optimal: 6.5
        }
      },
      growthStages: [
        {
          name: 'Germination',
          duration: 6,
          description: 'Seeds sprout and emerge from soil',
          activities: ['Ensure soil temperature above 10°C', 'Maintain moisture'],
          careInstructions: ['Water gently if rainfall insufficient', 'Watch for cutworms'],
          expectedSigns: ['Shoots breaking through soil', 'First leaves unfolding']
        },
        {
          name: 'Vegetative Growth',
          duration: 35,
          description: 'Plant develops leaves and grows in height',
          activities: ['Side-dress with nitrogen', 'Weed control', 'Pest monitoring'],
          careInstructions: ['Hill soil around plants', 'Apply mulch between rows'],
          expectedSigns: ['Rapid height increase', '6-8 fully developed leaves']
        },
        {
          name: 'Tasseling',
          duration: 8,
          description: 'Male flowers (tassels) appear at plant top',
          activities: ['Ensure adequate water', 'Monitor for corn borer'],
          careInstructions: ['Maintain consistent moisture', 'Avoid water stress'],
          expectedSigns: ['Tassels visible at top', 'Pollen being shed']
        },
        {
          name: 'Silking',
          duration: 6,
          description: 'Silks emerge from developing ears',
          activities: ['Critical irrigation period', 'Pollination support'],
          careInstructions: ['Never let plants wilt', 'Avoid overhead watering'],
          expectedSigns: ['Silks emerging from ears', 'Pollination occurring']
        },
        {
          name: 'Grain Filling',
          duration: 25,
          description: 'Kernels develop and fill with starch',
          activities: ['Reduce nitrogen', 'Monitor ear development'],
          careInstructions: ['Maintain steady moisture', 'Watch for ear worms'],
          expectedSigns: ['Kernels visible on ears', 'Ears growing heavier']
        },
        {
          name: 'Maturity',
          duration: 5,
          description: 'Kernels reach full size and moisture decreases',
          activities: ['Test kernel moisture', 'Prepare harvest equipment'],
          careInstructions: ['Allow natural field drying', 'Monitor for lodging'],
          expectedSigns: ['Husks brown and dry', 'Kernels dented and hard']
        }
      ],
      fertilizationSchedule: [
        {
          daysAfterPlanting: 14,
          type: 'NPK',
          nutrient: '12-32-16',
          amount: 200,
          unit: 'kg/hectare',
          method: 'band placement',
          instructions: 'Place 5 cm to the side and 5 cm below seed'
        },
        {
          daysAfterPlanting: 30,
          type: 'Urea',
          nutrient: 'Nitrogen',
          amount: 120,
          unit: 'kg/hectare',
          method: 'side-dress',
          instructions: 'Apply between rows and cultivate in'
        },
        {
          daysAfterPlanting: 50,
          type: 'Urea',
          nutrient: 'Nitrogen',
          amount: 60,
          unit: 'kg/hectare',
          method: 'side-dress',
          instructions: 'Final nitrogen application before tasseling'
        }
      ],
      waterRequirement: 35, // liters per m² per week
      expectedYield: {
        amount: 8.0,
        unit: 'tons/hectare'
      },
      harvestingMethod: 'Combine harvester or manual picking',
      postHarvestCare: 'Dry to 15% moisture content',
      storageInstructions: 'Store in dry, ventilated bins',
      processingDays: 2
    },
    {
      name: 'tomato',
      scientificName: 'Solanum lycopersicum',
      category: 'Vegetable',
      description: 'Popular fruit vegetable grown worldwide',
      aliases: ['tomatoes', 'love apple'],
      growingPeriodDays: 75,
      difficulty: 'Medium',
      plantingSeasons: {
        northern: [
          { start: 3, end: 5, type: 'spring' },  // March-May
          { start: 7, end: 8, type: 'summer' }   // July-August
        ],
        southern: [
          { start: 9, end: 11, type: 'spring' }, // September-November
          { start: 1, end: 3, type: 'summer' }   // January-March
        ]
      },
      requirements: {
        temperature: {
          minimum: 15,
          maximum: 30,
          optimal: 22
        },
        soilMoisture: {
          minimum: 40,
          maximum: 70,
          optimal: 60
        },
        soilPH: {
          minimum: 6.0,
          maximum: 7.0,
          optimal: 6.5
        }
      },
      growthStages: [
        {
          name: 'Seed Starting',
          duration: 14,
          description: 'Seeds germinate and develop first true leaves',
          activities: ['Start seeds indoors', 'Maintain warm conditions'],
          careInstructions: ['Keep soil warm (24°C)', 'Provide adequate light'],
          expectedSigns: ['Cotyledons emerge', 'First true leaves appear']
        },
        {
          name: 'Transplanting',
          duration: 7,
          description: 'Seedlings moved to garden or field',
          activities: ['Harden off seedlings', 'Transplant after frost danger'],
          careInstructions: ['Plant deeper than in containers', 'Water thoroughly after transplanting'],
          expectedSigns: ['Plants established', 'New growth begins']
        },
        {
          name: 'Vegetative Growth',
          duration: 21,
          description: 'Plants develop strong stems and foliage',
          activities: ['Install supports', 'Begin fertilization program'],
          careInstructions: ['Stake or cage plants', 'Mulch around plants'],
          expectedSigns: ['Rapid growth', 'Strong stem development']
        },
        {
          name: 'Flowering',
          duration: 10,
          description: 'First flower clusters appear',
          activities: ['Ensure consistent watering', 'Monitor for pests'],
          careInstructions: ['Avoid water stress', 'Remove suckers'],
          expectedSigns: ['Yellow flowers in clusters', 'Flower drop may occur']
        },
        {
          name: 'Fruit Set',
          duration: 8,
          description: 'Flowers pollinated and small fruits form',
          activities: ['Maintain steady moisture', 'Begin calcium supplementation'],
          careInstructions: ['Even watering critical', 'Support heavy branches'],
          expectedSigns: ['Small green fruits visible', 'Continued flowering']
        },
        {
          name: 'Fruit Development',
          duration: 12,
          description: 'Fruits grow to full size but remain green',
          activities: ['Monitor for diseases', 'Continue support'],
          careInstructions: ['Watch for blossom end rot', 'Maintain consistent watering'],
          expectedSigns: ['Fruits reaching full size', 'Still green color']
        },
        {
          name: 'Ripening',
          duration: 3,
          description: 'Fruits change color and reach maturity',
          activities: ['Begin harvest', 'Remove lower leaves'],
          careInstructions: ['Harvest regularly', 'Handle fruits carefully'],
          expectedSigns: ['Color change begins', 'Fruits soften slightly']
        }
      ],
      fertilizationSchedule: [
        {
          daysAfterPlanting: 7,
          type: 'NPK',
          nutrient: '10-10-10',
          amount: 100,
          unit: 'kg/hectare',
          method: 'broadcast',
          instructions: 'Work into soil around transplants'
        },
        {
          daysAfterPlanting: 21,
          type: 'NPK',
          nutrient: '5-10-10',
          amount: 80,
          unit: 'kg/hectare',
          method: 'side-dress',
          instructions: 'Apply around plants and water in'
        },
        {
          daysAfterPlanting: 35,
          type: 'NPK',
          nutrient: '5-10-10',
          amount: 80,
          unit: 'kg/hectare',
          method: 'side-dress',
          instructions: 'Continue regular feeding program'
        },
        {
          daysAfterPlanting: 49,
          type: 'Calcium',
          nutrient: 'Calcium',
          amount: 20,
          unit: 'kg/hectare',
          method: 'foliar',
          instructions: 'Spray to prevent blossom end rot'
        }
      ],
      waterRequirement: 40, // liters per m² per week
      expectedYield: {
        amount: 50,
        unit: 'tons/hectare'
      },
      harvestingMethod: 'Hand picking when fruits show color',
      postHarvestCare: 'Handle gently, sort by ripeness',
      storageInstructions: 'Store at 12-15°C, high humidity',
      processingDays: 0
    },
    {
      name: 'potato',
      scientificName: 'Solanum tuberosum',
      category: 'Tuber',
      description: 'Starchy tuber crop and important food staple',
      aliases: ['potatoes', 'spud'],
      growingPeriodDays: 90,
      difficulty: 'Easy',
      plantingSeasons: {
        northern: [
          { start: 3, end: 5, type: 'spring' },  // March-May
          { start: 8, end: 9, type: 'fall' }     // August-September
        ],
        southern: [
          { start: 8, end: 10, type: 'spring' }, // August-October
          { start: 1, end: 3, type: 'summer' }   // January-March
        ]
      },
      requirements: {
        temperature: {
          minimum: 7,
          maximum: 24,
          optimal: 18
        },
        soilMoisture: {
          minimum: 45,
          maximum: 75,
          optimal: 65
        },
        soilPH: {
          minimum: 5.0,
          maximum: 6.5,
          optimal: 5.8
        }
      },
      growthStages: [
        {
          name: 'Sprouting',
          duration: 14,
          description: 'Seed potatoes develop shoots and roots',
          activities: ['Plant seed potatoes', 'Ensure soil temperature above 7°C'],
          careInstructions: ['Plant 10-15 cm deep', 'Keep soil moist but not waterlogged'],
          expectedSigns: ['Shoots emerging from soil', 'Root system developing']
        },
        {
          name: 'Vegetative Growth',
          duration: 28,
          description: 'Plants develop foliage and stem system',
          activities: ['Hill soil around plants', 'Begin fertilization'],
          careInstructions: ['Hill every 2 weeks', 'Keep tubers covered from light'],
          expectedSigns: ['Rapid foliage development', 'Stems branching']
        },
        {
          name: 'Tuber Initiation',
          duration: 14,
          description: 'Underground stems begin forming tubers',
          activities: ['Continue hilling', 'Monitor soil moisture'],
          careInstructions: ['Maintain consistent moisture', 'Avoid cultivation damage'],
          expectedSigns: ['Plants reaching full height', 'Small tubers forming underground']
        },
        {
          name: 'Tuber Bulking',
          duration: 21,
          description: 'Tubers grow rapidly in size',
          activities: ['Maintain steady irrigation', 'Monitor for diseases'],
          careInstructions: ['Avoid water stress', 'Watch for late blight'],
          expectedSigns: ['Continued vigorous growth', 'Tubers enlarging']
        },
        {
          name: 'Tuber Maturation',
          duration: 10,
          description: 'Tubers reach full size and skin sets',
          activities: ['Reduce irrigation', 'Prepare for harvest'],
          careInstructions: ['Allow foliage to die back naturally', 'Test tuber maturity'],
          expectedSigns: ['Foliage yellowing', 'Skin difficult to rub off']
        },
        {
          name: 'Harvest Ready',
          duration: 3,
          description: 'Tubers fully mature and ready for harvest',
          activities: ['Cut foliage if not died back', 'Begin harvesting'],
          careInstructions: ['Wait 2 weeks after foliage death', 'Harvest on dry day'],
          expectedSigns: ['Foliage completely brown', 'Tuber skins set firmly']
        }
      ],
      fertilizationSchedule: [
        {
          daysAfterPlanting: 0,
          type: 'NPK',
          nutrient: '8-24-24',
          amount: 300,
          unit: 'kg/hectare',
          method: 'broadcast',
          instructions: 'Work into soil before planting'
        },
        {
          daysAfterPlanting: 28,
          type: 'Urea',
          nutrient: 'Nitrogen',
          amount: 60,
          unit: 'kg/hectare',
          method: 'side-dress',
          instructions: 'Apply when hilling and work into soil'
        },
        {
          daysAfterPlanting: 45,
          type: 'NPK',
          nutrient: '0-0-60',
          amount: 50,
          unit: 'kg/hectare',
          method: 'side-dress',
          instructions: 'Final application during tuber bulking'
        }
      ],
      waterRequirement: 25, // liters per m² per week
      expectedYield: {
        amount: 25,
        unit: 'tons/hectare'
      },
      harvestingMethod: 'Mechanical digger or hand digging',
      postHarvestCare: 'Cure in dark, ventilated area for 1-2 weeks',
      storageInstructions: 'Store in dark, cool (4-7°C), humid conditions',
      processingDays: 7
    },
    {
      name: 'soybean',
      scientificName: 'Glycine max',
      category: 'Legume',
      description: 'High-protein crop and nitrogen-fixing legume',
      aliases: ['soya', 'soja'],
      growingPeriodDays: 100,
      difficulty: 'Medium',
      plantingSeasons: {
        northern: [
          { start: 5, end: 6, type: 'spring' }   // May-June
        ],
        southern: [
          { start: 10, end: 12, type: 'spring' }  // October-December
        ]
      },
      requirements: {
        temperature: {
          minimum: 15,
          maximum: 35,
          optimal: 25
        },
        soilMoisture: {
          minimum: 30,
          maximum: 70,
          optimal: 50
        },
        soilPH: {
          minimum: 6.0,
          maximum: 7.0,
          optimal: 6.5
        }
      },
      growthStages: [
        {
          name: 'Emergence',
          duration: 7,
          description: 'Seedling emerges from soil',
          activities: ['Monitor emergence rate', 'Control weeds'],
          careInstructions: ['Ensure adequate soil moisture', 'Avoid soil crusting'],
          expectedSigns: ['Cotyledons visible above soil']
        },
        {
          name: 'Vegetative Growth',
          duration: 35,
          description: 'Leaf and stem development',
          activities: ['Weed control', 'Monitor for pests'],
          careInstructions: ['Maintain soil moisture', 'Side-dress with phosphorus'],
          expectedSigns: ['Multiple trifoliate leaves', 'Branching begins']
        },
        {
          name: 'Flowering',
          duration: 21,
          description: 'Reproductive stage begins',
          activities: ['Monitor flower development', 'Ensure adequate water'],
          careInstructions: ['Critical water period', 'Avoid stress'],
          expectedSigns: ['White/purple flowers appear']
        },
        {
          name: 'Pod Development',
          duration: 21,
          description: 'Pods form and fill with beans',
          activities: ['Monitor pod fill', 'Continue irrigation'],
          careInstructions: ['Maintain consistent moisture', 'Monitor for diseases'],
          expectedSigns: ['Green pods visible', 'Bean development']
        },
        {
          name: 'Maturity',
          duration: 16,
          description: 'Pods turn brown and dry',
          activities: ['Monitor moisture content', 'Plan harvest'],
          careInstructions: ['Reduce irrigation', 'Prepare harvest equipment'],
          expectedSigns: ['Brown pods', 'Rattling sound when shaken']
        }
      ],
      expectedYield: {
        amount: 2.5,
        unit: 'tons/hectare'
      }
    },
    {
      name: 'cotton',
      scientificName: 'Gossypium hirsutum',
      category: 'Fiber',
      description: 'Primary fiber crop for textile production',
      aliases: ['upland cotton'],
      growingPeriodDays: 150,
      difficulty: 'Hard',
      plantingSeasons: {
        northern: [
          { start: 4, end: 6, type: 'spring' }   // April-June
        ],
        southern: [
          { start: 9, end: 11, type: 'spring' }  // September-November
        ]
      },
      requirements: {
        temperature: {
          minimum: 18,
          maximum: 40,
          optimal: 28
        },
        soilMoisture: {
          minimum: 25,
          maximum: 60,
          optimal: 45
        },
        soilPH: {
          minimum: 5.5,
          maximum: 8.0,
          optimal: 6.5
        }
      },
      growthStages: [
        {
          name: 'Emergence',
          duration: 10,
          description: 'Seedling emergence and establishment',
          activities: ['Monitor plant stand', 'Early pest control'],
          careInstructions: ['Ensure warm soil temperature', 'Control thrips'],
          expectedSigns: ['Cotyledons emerge', 'First true leaves']
        },
        {
          name: 'Squaring',
          duration: 35,
          description: 'Flower buds (squares) form',
          activities: ['Monitor square development', 'Fertilizer application'],
          careInstructions: ['Adequate nitrogen', 'Regular irrigation'],
          expectedSigns: ['Flower buds visible', 'Plant branching']
        },
        {
          name: 'Flowering',
          duration: 45,
          description: 'Flowers bloom and bolls begin forming',
          activities: ['Monitor bloom rate', 'Pest management'],
          careInstructions: ['Critical water period', 'Control bollworm'],
          expectedSigns: ['White/yellow flowers', 'Boll development']
        },
        {
          name: 'Boll Development',
          duration: 45,
          description: 'Cotton bolls mature and fibers develop',
          activities: ['Monitor boll load', 'Late season irrigation'],
          careInstructions: ['Maintain plant health', 'Prevent stress'],
          expectedSigns: ['Bolls enlarging', 'Fiber development']
        },
        {
          name: 'Maturity',
          duration: 15,
          description: 'Bolls open revealing cotton fibers',
          activities: ['Monitor boll opening', 'Plan harvest'],
          careInstructions: ['Cease irrigation', 'Apply defoliant'],
          expectedSigns: ['Bolls splitting open', 'White fiber exposed']
        }
      ],
      expectedYield: {
        amount: 1.5,
        unit: 'tons/hectare'
      }
    },
    {
      name: 'sunflower',
      scientificName: 'Helianthus annuus',
      category: 'Oilseed',
      description: 'Oilseed crop with large yellow flower heads',
      aliases: ['common sunflower'],
      growingPeriodDays: 110,
      difficulty: 'Easy',
      plantingSeasons: {
        northern: [
          { start: 4, end: 6, type: 'spring' }   // April-June
        ],
        southern: [
          { start: 9, end: 11, type: 'spring' }  // September-November
        ]
      },
      requirements: {
        temperature: {
          minimum: 10,
          maximum: 35,
          optimal: 22
        },
        soilMoisture: {
          minimum: 20,
          maximum: 65,
          optimal: 40
        },
        soilPH: {
          minimum: 6.0,
          maximum: 7.5,
          optimal: 6.8
        }
      },
      growthStages: [
        {
          name: 'Emergence',
          duration: 8,
          description: 'Seedling emergence from soil',
          activities: ['Monitor plant stand', 'Early weed control'],
          careInstructions: ['Ensure adequate moisture', 'Protect from birds'],
          expectedSigns: ['Cotyledons visible', 'First true leaves']
        },
        {
          name: 'Vegetative Growth',
          duration: 35,
          description: 'Rapid leaf and stem development',
          activities: ['Fertilizer application', 'Weed management'],
          careInstructions: ['Regular irrigation', 'Side-dress nitrogen'],
          expectedSigns: ['Multiple leaf pairs', 'Stem elongation']
        },
        {
          name: 'Bud Formation',
          duration: 20,
          description: 'Flower bud develops at stem tip',
          activities: ['Monitor bud development', 'Ensure water supply'],
          careInstructions: ['Critical water period', 'Maintain nutrition'],
          expectedSigns: ['Flower bud visible', 'Plant height increase']
        },
        {
          name: 'Flowering',
          duration: 25,
          description: 'Large yellow flower head opens',
          activities: ['Monitor flowering progress', 'Pest control'],
          careInstructions: ['Continue irrigation', 'Protect from birds'],
          expectedSigns: ['Yellow flowers open', 'Pollen production']
        },
        {
          name: 'Seed Filling',
          duration: 22,
          description: 'Seeds develop and fill with oil',
          activities: ['Monitor seed development', 'Late irrigation'],
          careInstructions: ['Maintain moisture', 'Reduce nitrogen'],
          expectedSigns: ['Seeds enlarging', 'Head weight increasing']
        }
      ],
      expectedYield: {
        amount: 2.0,
        unit: 'tons/hectare'
      }
    },
    {
      name: 'barley',
      scientificName: 'Hordeum vulgare',
      category: 'Cereal',
      description: 'Versatile cereal grain for food, feed, and brewing',
      aliases: ['winter barley', 'spring barley'],
      growingPeriodDays: 100,
      difficulty: 'Medium',
      plantingSeasons: {
        northern: [
          { start: 9, end: 11, type: 'winter' }, // September-November
          { start: 3, end: 4, type: 'spring' }   // March-April
        ],
        southern: [
          { start: 4, end: 6, type: 'winter' },  // April-June
          { start: 8, end: 9, type: 'spring' }   // August-September
        ]
      },
      requirements: {
        temperature: {
          minimum: 0,
          maximum: 30,
          optimal: 18
        },
        soilMoisture: {
          minimum: 25,
          maximum: 70,
          optimal: 45
        },
        soilPH: {
          minimum: 6.0,
          maximum: 7.5,
          optimal: 6.8
        }
      },
      growthStages: [
        {
          name: 'Germination',
          duration: 7,
          description: 'Seeds sprout and emerge',
          activities: ['Monitor emergence', 'Early pest control'],
          careInstructions: ['Ensure soil moisture', 'Protect seedlings'],
          expectedSigns: ['Green shoots visible', 'First leaves unfurling']
        },
        {
          name: 'Tillering',
          duration: 25,
          description: 'Multiple shoots develop from base',
          activities: ['Monitor tiller development', 'Nitrogen application'],
          careInstructions: ['Side-dress fertilizer', 'Control weeds'],
          expectedSigns: ['Multiple shoots', 'Bushy appearance']
        },
        {
          name: 'Stem Extension',
          duration: 30,
          description: 'Main stem elongates rapidly',
          activities: ['Monitor growth', 'Disease prevention'],
          careInstructions: ['Adequate water', 'Fungicide if needed'],
          expectedSigns: ['Rapid height increase', 'Node development']
        },
        {
          name: 'Heading',
          duration: 15,
          description: 'Grain heads emerge from leaf sheath',
          activities: ['Monitor head emergence', 'Continued irrigation'],
          careInstructions: ['Critical water period', 'Pest monitoring'],
          expectedSigns: ['Grain heads visible', 'Awns developing']
        },
        {
          name: 'Grain Filling',
          duration: 23,
          description: 'Grains develop and fill',
          activities: ['Monitor grain development', 'Late fertilization'],
          careInstructions: ['Maintain moisture', 'Foliar nutrition'],
          expectedSigns: ['Grains swelling', 'Heads heavy']
        }
      ],
      expectedYield: {
        amount: 4.0,
        unit: 'tons/hectare'
      }
    },
    {
      name: 'canola',
      scientificName: 'Brassica napus',
      category: 'Oilseed',
      description: 'Cool-season oilseed crop with bright yellow flowers',
      aliases: ['rapeseed', 'oilseed rape'],
      growingPeriodDays: 130,
      difficulty: 'Medium',
      plantingSeasons: {
        northern: [
          { start: 8, end: 9, type: 'winter' },  // August-September
          { start: 3, end: 4, type: 'spring' }   // March-April
        ],
        southern: [
          { start: 3, end: 5, type: 'winter' },  // March-May
          { start: 8, end: 9, type: 'spring' }   // August-September
        ]
      },
      requirements: {
        temperature: {
          minimum: -5,
          maximum: 25,
          optimal: 15
        },
        soilMoisture: {
          minimum: 30,
          maximum: 70,
          optimal: 50
        },
        soilPH: {
          minimum: 6.0,
          maximum: 7.5,
          optimal: 6.5
        }
      },
      growthStages: [
        {
          name: 'Emergence',
          duration: 10,
          description: 'Seedling emergence and establishment',
          activities: ['Monitor plant stand', 'Flea beetle control'],
          careInstructions: ['Ensure even emergence', 'Early pest management'],
          expectedSigns: ['Cotyledons visible', 'First true leaves']
        },
        {
          name: 'Rosette',
          duration: 40,
          description: 'Leaves form rosette pattern',
          activities: ['Monitor leaf development', 'Nutrient management'],
          careInstructions: ['Fall fertilization', 'Weed control'],
          expectedSigns: ['Circular leaf arrangement', 'Root development']
        },
        {
          name: 'Stem Elongation',
          duration: 30,
          description: 'Vertical growth begins',
          activities: ['Spring fertilization', 'Growth monitoring'],
          careInstructions: ['Nitrogen application', 'Disease scouting'],
          expectedSigns: ['Stem emergence', 'Rapid height increase']
        },
        {
          name: 'Flowering',
          duration: 30,
          description: 'Bright yellow flowers bloom',
          activities: ['Monitor bloom progress', 'Bee activity'],
          careInstructions: ['Avoid spraying during bloom', 'Adequate moisture'],
          expectedSigns: ['Yellow flower clusters', 'Strong fragrance']
        },
        {
          name: 'Pod Development',
          duration: 20,
          description: 'Seed pods form and fill',
          activities: ['Monitor pod fill', 'Late season care'],
          careInstructions: ['Maintain plant health', 'Fungicide if needed'],
          expectedSigns: ['Green pods developing', 'Seeds visible in pods']
        }
      ],
      expectedYield: {
        amount: 2.2,
        unit: 'tons/hectare'
      }
    }
  ]
};

module.exports = cropData;
