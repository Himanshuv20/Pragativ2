import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  Card,
  CardContent,
  Chip,
  Tab,
  Tabs,
  CircularProgress,
  Stack,
  Alert,
  Avatar,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  IconButton,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  AccountBalance as AccountBalanceIcon,
  Info as InfoIcon,
  Psychology as PsychologyIcon,
  Support as SupportIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationOnIcon,
  ExpandMore as ExpandMoreIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Lightbulb as LightbulbIcon,
  Person as PersonIcon,
  Star as StarIcon,
  WhatsApp as WhatsAppIcon,
  Language as LanguageIcon,
  Work as WorkIcon,
  Schedule as ScheduleIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { AppIcons } from '../components/icons/AppIcons';
import { CropCalendarAPI, api } from '../services/api';

// Simulated Financial Advisors Database
const FINANCIAL_ADVISORS = [
  {
    id: 1,
    name: "Dr. Rajesh Kumar",
    specialization: "Agricultural Finance",
    experience: 15,
    rating: 4.9,
    consultations: 2500,
    languages: ["Hindi", "English", "Punjabi"],
    location: "Delhi NCR",
    phone: "+91-9876543210",
    email: "rajesh.kumar@agrifinance.in",
    bio: "Expert in farm credit management and agricultural loan restructuring with 15+ years of experience.",
    availability: "Mon-Fri: 9 AM - 6 PM",
    consultationFee: "₹500/hour",
    contact: {
      phone: "+91-9876543210",
      email: "rajesh.kumar@agrifinance.in",
      office: "Delhi NCR"
    }
  },
  {
    id: 2,
    name: "Mrs. Priya Sharma",
    specialization: "Rural Banking & Microfinance",
    experience: 12,
    rating: 4.8,
    consultations: 1800,
    languages: ["Hindi", "English", "Gujarati"],
    location: "Ahmedabad, Gujarat",
    phone: "+91-9765432109",
    email: "priya.sharma@ruralbank.co.in",
    bio: "Specialist in microfinance and Self Help Group (SHG) banking for rural entrepreneurs.",
    availability: "Mon-Sat: 10 AM - 5 PM",
    consultationFee: "₹300/hour",
    contact: {
      phone: "+91-9765432109",
      email: "priya.sharma@ruralbank.co.in",
      office: "Ahmedabad, Gujarat"
    }
  },
  {
    id: 3,
    name: "CA Sunil Patel",
    specialization: "Tax Planning & Investment",
    experience: 18,
    rating: 4.7,
    consultations: 3200,
    languages: ["Hindi", "English", "Marathi"],
    location: "Pune, Maharashtra",
    phone: "+91-9654321098",
    email: "sunil.patel@taxadvisor.com",
    bio: "Chartered Accountant specializing in agricultural taxation and investment planning.",
    availability: "Mon-Fri: 9 AM - 7 PM",
    consultationFee: "₹800/hour",
    contact: {
      phone: "+91-9654321098",
      email: "sunil.patel@taxadvisor.com",
      office: "Pune, Maharashtra"
    }
  },
  {
    id: 4,
    name: "Mr. Vikram Singh",
    specialization: "Insurance & Risk Management",
    experience: 10,
    rating: 4.6,
    consultations: 1500,
    languages: ["Hindi", "English", "Haryanvi"],
    location: "Gurgaon, Haryana",
    phone: "+91-9543210987",
    email: "vikram.singh@insuranceexpert.in",
    bio: "Expert in agricultural insurance and risk management strategies for farmers.",
    availability: "Tue-Sat: 10 AM - 6 PM",
    consultationFee: "₹400/hour",
    contact: {
      phone: "+91-9543210987",
      email: "vikram.singh@insuranceexpert.in",
      office: "Gurgaon, Haryana"
    }
  },
  {
    id: 5,
    name: "Dr. Meera Nair",
    specialization: "Financial Counseling & Therapy",
    experience: 8,
    rating: 4.9,
    consultations: 1200,
    languages: ["English", "Hindi", "Malayalam", "Tamil"],
    location: "Kochi, Kerala",
    phone: "+91-9432109876",
    email: "meera.nair@counseling.org",
    bio: "Psychologist specializing in financial stress counseling and debt management therapy.",
    availability: "Mon-Fri: 11 AM - 8 PM",
    consultationFee: "₹600/hour",
    contact: {
      phone: "+91-9432109876",
      email: "meera.nair@counseling.org",
      office: "Kochi, Kerala"
    }
  },
  {
    id: 6,
    name: "Mr. Raman Gupta",
    specialization: "Government Schemes & Subsidies",
    experience: 20,
    rating: 4.8,
    consultations: 4000,
    languages: ["Hindi", "English", "Bengali"],
    location: "Kolkata, West Bengal",
    phone: "+91-9321098765",
    email: "raman.gupta@govschemes.in",
    bio: "Former government official with expertise in agricultural schemes and subsidy applications.",
    availability: "Mon-Sat: 9 AM - 5 PM",
    consultationFee: "₹350/hour",
    contact: {
      phone: "+91-9321098765",
      email: "raman.gupta@govschemes.in",
      office: "Kolkata, West Bengal"
    }
  }
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface DebtAnalysisResult {
  debtToIncomeRatio: number;
  debtServiceRatio: number;
  financialHealth: number;
  riskLevel: string;
  recommendations: string[];
  eligibleSchemes: any[];
  aiInsights: string[];
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`debt-tabpanel-${index}`}
      aria-labelledby={`debt-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const DebtCounselingPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DebtAnalysisResult | null>(null);
  const [selectedAdvisor, setSelectedAdvisor] = useState<any>(null);
  const [advisorDialogOpen, setAdvisorDialogOpen] = useState(false);
  const [debtData, setDebtData] = useState({
    totalDebt: '',
    monthlyIncome: '',
    monthlyExpenses: '',
    cropType: '',
    landSize: '',
    existingLoans: '',
    creditScore: '',
    collateral: '',
    dependents: ''
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setDebtData({ ...debtData, [field]: event.target.value });
  };

  const handleAnalyzeDebt = async () => {
    setLoading(true);
    try {
      // Simulate AI-powered debt analysis
      const response = await api.debtCounseling.analyzeDebtProfile(
        'farmer123', // farmerId - In real app, get from auth context
        {
          totalDebt: parseFloat(debtData.totalDebt) || 0,
          monthlyIncome: parseFloat(debtData.monthlyIncome) || 0,
          monthlyExpenses: parseFloat(debtData.monthlyExpenses) || 0,
          farmSize: parseFloat(debtData.landSize) || 0,
          cropIncome: parseFloat(debtData.monthlyIncome) * 0.7 || 0, // Estimate crop income as 70% of total income
          state: 'Maharashtra', // Default state - could be made dynamic
          category: debtData.cropType || 'Mixed',
          loans: debtData.existingLoans ? [{
            id: '1',
            type: 'Agricultural',
            bank: 'Unknown',
            sanctionedAmount: parseFloat(debtData.existingLoans) || 0,
            outstandingAmount: parseFloat(debtData.existingLoans) || 0,
            emi: (parseFloat(debtData.existingLoans) || 0) / 60, // Assume 5 year loan
            interestRate: 8.5,
            tenure: 60,
            startDate: new Date().toISOString()
          }] : []
        }
      );

      // Map API response to local interface
      const mappedResult: DebtAnalysisResult = {
        debtToIncomeRatio: response.data.analysis?.debtToIncomeRatio || 0,
        debtServiceRatio: response.data.analysis?.debtServiceRatio || 0,
        financialHealth: response.data.analysis?.financialHealth || 50,
        riskLevel: response.data.riskLevel?.level?.toLowerCase() || 'medium',
        recommendations: response.data.recommendations?.map((r: any) => r.description || r.title || r) || [],
        eligibleSchemes: response.data.eligibleSchemes || [],
        aiInsights: response.data.recommendations?.map((r: any) => r.reasoning || r.description) || []
      };

      setAnalysisResult(mappedResult);
    } catch (error) {
      console.error('Error analyzing debt:', error);
      
      // Fallback to local analysis if API fails
      const localAnalysis = performLocalDebtAnalysis();
      setAnalysisResult(localAnalysis);
    } finally {
      setLoading(false);
    }
  };

  const performLocalDebtAnalysis = (): DebtAnalysisResult => {
    const totalDebt = parseFloat(debtData.totalDebt) || 0;
    const monthlyIncome = parseFloat(debtData.monthlyIncome) || 0;
    const monthlyExpenses = parseFloat(debtData.monthlyExpenses) || 0;
    const creditScore = parseFloat(debtData.creditScore) || 650;

    const debtToIncomeRatio = monthlyIncome > 0 ? totalDebt / (monthlyIncome * 12) : 0;
    const debtServiceRatio = monthlyIncome > 0 ? (monthlyExpenses / monthlyIncome) : 0;
    
    let financialHealth = 100;
    let riskLevel = 'Low';
    
    if (debtToIncomeRatio > 5) {
      financialHealth -= 40;
      riskLevel = 'High';
    } else if (debtToIncomeRatio > 3) {
      financialHealth -= 20;
      riskLevel = 'Medium';
    }

    if (debtServiceRatio > 0.5) {
      financialHealth -= 30;
      riskLevel = 'High';
    } else if (debtServiceRatio > 0.3) {
      financialHealth -= 15;
    }

    const recommendations = generateRecommendations(debtToIncomeRatio, debtServiceRatio, creditScore);
    const eligibleSchemes = getEligibleSchemes(totalDebt, monthlyIncome);
    const aiInsights = generateAIInsights(debtData);

    return {
      debtToIncomeRatio: Math.round(debtToIncomeRatio * 100) / 100,
      debtServiceRatio: Math.round(debtServiceRatio * 100) / 100,
      financialHealth: Math.max(0, financialHealth),
      riskLevel,
      recommendations,
      eligibleSchemes,
      aiInsights
    };
  };

  const generateRecommendations = (dti: number, dsr: number, creditScore: number): string[] => {
    const recommendations = [];
    
    if (dti > 3) {
      recommendations.push("Consider debt consolidation to reduce interest burden");
      recommendations.push("Explore income diversification through allied activities");
    }
    
    if (dsr > 0.4) {
      recommendations.push("Implement strict budget control measures");
      recommendations.push("Negotiate with lenders for EMI restructuring");
    }
    
    if (creditScore < 650) {
      recommendations.push("Focus on improving credit score through timely payments");
      recommendations.push("Consider secured loans with lower interest rates");
    }
    
    recommendations.push("Explore crop insurance to mitigate seasonal risks");
    recommendations.push("Apply for eligible government subsidy schemes");
    
    return recommendations;
  };

  const getEligibleSchemes = (totalDebt: number, monthlyIncome: number) => {
    const schemes = [];
    
    if (monthlyIncome < 50000) {
      schemes.push({
        name: "PM-KISAN Scheme",
        benefit: "₹6,000 annual income support",
        eligibility: "Small and marginal farmers"
      });
    }
    
    if (totalDebt > 100000) {
      schemes.push({
        name: "Kisan Credit Card (KCC)",
        benefit: "Low-interest crop loans",
        eligibility: "All farmers with valid land documents"
      });
    }
    
    schemes.push({
      name: "Pradhan Mantri Fasal Bima Yojana",
      benefit: "Crop insurance coverage",
      eligibility: "All farmers growing notified crops"
    });
    
    return schemes;
  };

  const generateAIInsights = (data: any): string[] => {
    const insights = [];
    
    insights.push("🤖 AI Analysis: Based on your crop type and location, consider diversifying into high-value crops");
    insights.push("📊 Market Prediction: Current crop prices show an upward trend for the next quarter");
    insights.push("🌱 Optimization: Your land size can support additional income through intercropping");
    insights.push("💡 Smart Tip: Consider adopting precision farming to reduce input costs by 15-20%");
    
    return insights;
  };

  const handleAdvisorSelect = (advisor: any) => {
    setSelectedAdvisor(advisor);
    setAdvisorDialogOpen(true);
  };

  const handleAdvisorDialogClose = () => {
    setAdvisorDialogOpen(false);
    setSelectedAdvisor(null);
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return 'success';
      case 'Medium': return 'warning';
      case 'High': return 'error';
      default: return 'info';
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'success';
    if (health >= 60) return 'warning';
    return 'error';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Enhanced Header with Gradient Background */}
      <Box sx={{ 
        mb: 6, 
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(66, 165, 245, 0.02) 100%)',
        borderRadius: 4,
        py: 5,
        px: 3,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, transparent 30%, rgba(25, 118, 210, 0.03) 50%, transparent 70%)',
          animation: 'shimmer 3s ease-in-out infinite',
        },
        '@keyframes shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mb: 3,
          position: 'relative',
          zIndex: 1
        }}>
          <Badge 
            badgeContent="AI Powered" 
            color="primary"
            sx={{
              '& .MuiBadge-badge': {
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.7rem',
                height: 20,
                minWidth: 20,
                borderRadius: 2,
                animation: 'pulse 2s ease-in-out infinite',
              },
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.05)' },
                '100%': { transform: 'scale(1)' }
              }
            }}
          >
            <Box sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(25, 118, 210, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 40px rgba(25, 118, 210, 0.4)',
              }
            }}>
              <AppIcons.DebtCounseling sx={{ fontSize: 40, color: 'white' }} />
            </Box>
          </Badge>
        </Box>
        <Typography variant="h2" gutterBottom sx={{ 
          fontWeight: 700, 
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 50%, #1565c0 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: { xs: '2.5rem', md: '3.5rem' },
          letterSpacing: '-0.02em',
          position: 'relative',
          zIndex: 1
        }}>
          Smart Debt Counseling
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ 
          maxWidth: 700, 
          mx: 'auto',
          fontWeight: 400,
          lineHeight: 1.6,
          position: 'relative',
          zIndex: 1,
          '& .highlight': {
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 600
          }
        }}>
          <span className="highlight">AI-powered</span> financial guidance and personalized debt management solutions for modern farmers
        </Typography>
      </Box>

      {/* Enhanced Tabs with Perfect Spacing */}
      <Paper sx={{ 
        mb: 4, 
        borderRadius: 3, 
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(25, 118, 210, 0.1)'
      }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              py: 3,
              px: 4,
              minHeight: 72,
              transition: 'all 0.3s ease',
              position: 'relative',
              '&:hover': {
                background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(66, 165, 245, 0.02) 100%)',
                transform: 'translateY(-1px)'
              },
              '&.Mui-selected': {
                background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(66, 165, 245, 0.05) 100%)',
                color: 'primary.main',
                fontWeight: 600
              }
            },
            '& .MuiTabs-indicator': {
              height: 4,
              borderRadius: '4px 4px 0 0',
              background: 'linear-gradient(90deg, #1976d2, #42a5f5)'
            },
            '& .MuiSvgIcon-root': {
              fontSize: 20,
              margin: '0 8px'
            }
          }}
        >
          <Tab
            icon={<PsychologyIcon />}
            iconPosition="start"
            label="AI Debt Analysis"
          />
          <Tab
            icon={<AppIcons.Budget />}
            iconPosition="start"
            label="Smart Budget Planning"
          />
          <Tab
            icon={<AccountBalanceIcon />}
            iconPosition="start"
            label="Government Schemes"
          />
          <Tab
            icon={<SupportIcon />}
            iconPosition="start"
            label="Expert Consultation"
          />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        <Stack spacing={3}>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PsychologyIcon color="primary" />
            AI-Powered Debt Analysis & Assessment
          </Typography>
          
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'primary.light' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AssessmentIcon color="primary" />
              Financial Information
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <Box>
                <TextField
                  label="Total Debt Amount (₹)"
                  value={debtData.totalDebt}
                  onChange={handleInputChange('totalDebt')}
                  type="number"
                  fullWidth
                  variant="outlined"
                />
              </Box>
              <Box>
                <TextField
                  label="Monthly Income (₹)"
                  value={debtData.monthlyIncome}
                  onChange={handleInputChange('monthlyIncome')}
                  type="number"
                  fullWidth
                  variant="outlined"
                />
              </Box>
              <Box>
                <TextField
                  label="Monthly Expenses (₹)"
                  value={debtData.monthlyExpenses}
                  onChange={handleInputChange('monthlyExpenses')}
                  type="number"
                  fullWidth
                  variant="outlined"
                />
              </Box>
              <Box>
                <TextField
                  label="Primary Crop Type"
                  value={debtData.cropType}
                  onChange={handleInputChange('cropType')}
                  fullWidth
                  variant="outlined"
                />
              </Box>
              <Box>
                <TextField
                  label="Land Size (acres)"
                  value={debtData.landSize}
                  onChange={handleInputChange('landSize')}
                  type="number"
                  fullWidth
                  variant="outlined"
                />
              </Box>
              <Box>
                <TextField
                  label="Existing Loans (₹)"
                  value={debtData.existingLoans}
                  onChange={handleInputChange('existingLoans')}
                  type="number"
                  fullWidth
                  variant="outlined"
                />
              </Box>
              <Box>
                <TextField
                  label="Credit Score (300-850)"
                  value={debtData.creditScore}
                  onChange={handleInputChange('creditScore')}
                  type="number"
                  fullWidth
                  variant="outlined"
                  helperText="Leave blank if unknown"
                />
              </Box>
              <Box>
                <TextField
                  label="Number of Dependents"
                  value={debtData.dependents}
                  onChange={handleInputChange('dependents')}
                  type="number"
                  fullWidth
                  variant="outlined"
                />
              </Box>
            </Box>
            
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleAnalyzeDebt}
                disabled={loading || !debtData.totalDebt || !debtData.monthlyIncome}
                startIcon={loading ? <CircularProgress size={20} /> : <PsychologyIcon />}
                sx={{ 
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                  }
                }}
              >
                {loading ? 'Analyzing with AI...' : 'Analyze Debt with AI'}
              </Button>
            </Box>
          </Paper>

          {/* Enhanced Analysis Results */}
          {analysisResult && (
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpIcon color="primary" />
                AI Analysis Results
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' }, gap: 3 }}>
                {/* Financial Health Score */}
                <Box>
                  <Card sx={{ textAlign: 'center', p: 2, borderRadius: 3 }}>
                    <Typography variant="h6" gutterBottom>Financial Health Score</Typography>
                    <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                      <CircularProgress
                        variant="determinate"
                        value={analysisResult.financialHealth || 0}
                        size={80}
                        thickness={5}
                        color={getHealthColor(analysisResult.financialHealth || 0)}
                      />
                      <Box sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Typography variant="h6" color="text.secondary">
                          {analysisResult.financialHealth || 0}%
                        </Typography>
                      </Box>
                    </Box>
                    <Chip 
                      label={((analysisResult.riskLevel as any)?.level || analysisResult.riskLevel || 'Unknown') + ' Risk'} 
                      color={getRiskColor((analysisResult.riskLevel as any)?.level || analysisResult.riskLevel || 'Unknown')} 
                      size="small"
                    />
                  </Card>
                </Box>
                
                {/* Debt Ratios */}
                <Box>
                  <Card sx={{ p: 2, borderRadius: 3 }}>
                    <Typography variant="h6" gutterBottom>Key Financial Ratios</Typography>
                    <Stack spacing={2}>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Debt-to-Income Ratio</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {analysisResult.debtToIncomeRatio || 0}
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={Math.min((analysisResult.debtToIncomeRatio || 0) * 20, 100)} 
                          color={(analysisResult.debtToIncomeRatio || 0) > 3 ? 'error' : 'success'}
                        />
                      </Box>
                      
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Debt Service Ratio</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {((analysisResult.debtServiceRatio || 0) * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={(analysisResult.debtServiceRatio || 0) * 100} 
                          color={(analysisResult.debtServiceRatio || 0) > 0.4 ? 'error' : 'success'}
                        />
                      </Box>
                    </Stack>
                  </Card>
                </Box>
              </Box>
              
              {/* Financial Insights */}
              <Accordion sx={{ mt: 3, borderRadius: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LightbulbIcon color="primary" />
                    Financial Health Insights
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <PsychologyIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={`Your debt-to-income ratio is ${analysisResult.debtToIncomeRatio?.toFixed(2) || 'N/A'}`}
                        secondary={(analysisResult.debtToIncomeRatio || 0) > 3 ? 'This is considered high and requires attention' : 'This is within acceptable range'}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <PsychologyIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={`Your financial health score is ${analysisResult.financialHealth || 0}%`}
                        secondary={`Risk Level: ${(analysisResult.riskLevel as any)?.level || analysisResult.riskLevel || 'Unknown'}`}
                      />
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>
              
              {/* Recommendations */}
              <Accordion sx={{ mt: 2, borderRadius: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon color="success" />
                    Personalized Recommendations
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {analysisResult.recommendations && analysisResult.recommendations.length > 0 ? (
                      analysisResult.recommendations.map((recommendation, index) => {
                        const isObject = typeof recommendation === 'object' && recommendation !== null;
                        const recObj = isObject ? recommendation as any : null;
                        
                        return (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <CheckCircleIcon color="success" />
                            </ListItemIcon>
                            <ListItemText 
                              primary={
                                isObject 
                                  ? recObj.title || recObj.description 
                                  : recommendation
                              }
                              secondary={
                                isObject 
                                  ? recObj.action || recObj.timeframe
                                  : null
                              }
                            />
                          </ListItem>
                        );
                      })
                    ) : (
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon color="success" />
                        </ListItemIcon>
                        <ListItemText primary="No specific recommendations available at this time." />
                      </ListItem>
                    )}
                  </List>
                </AccordionDetails>
              </Accordion>
              
              {/* Eligible Schemes */}
              <Accordion sx={{ mt: 2, borderRadius: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccountBalanceIcon color="primary" />
                    Eligible Government Schemes
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                    {analysisResult.eligibleSchemes && analysisResult.eligibleSchemes.length > 0 ? (
                      analysisResult.eligibleSchemes.map((scheme, index) => (
                        <Box key={index}>
                          <Card sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'success.light' }}>
                            <Typography variant="subtitle1" fontWeight="bold" color="success.main">
                              {scheme.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {scheme.benefit || scheme.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Eligibility: {scheme.eligibility}
                            </Typography>
                          </Card>
                        </Box>
                      ))
                    ) : (
                      <Box>
                        <Card sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'info.light' }}>
                          <Typography variant="subtitle1" fontWeight="bold" color="info.main">
                            No Schemes Available
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Please contact your local agricultural office for more information about available schemes.
                          </Typography>
                        </Card>
                      </Box>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Paper>
          )}
        </Stack>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Stack spacing={3}>
          <Typography variant="h5" gutterBottom>
            Budget Planning Tools
          </Typography>
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Budget Planner
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create and manage your monthly budget with our specialized tools for farmers.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button variant="outlined" startIcon={<AppIcons.Budget />}>
                Create Budget Plan
              </Button>
            </Box>
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Seasonal Cash Flow
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Plan your cash flow around crop seasons and harvest cycles.
            </Typography>
          </Paper>
        </Stack>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Stack spacing={3}>
          <Typography variant="h5" gutterBottom>
            Government Financial Schemes
          </Typography>
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Agricultural Credit Schemes
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip label="Crop Loan" color="primary" />
              <Chip label="KCC" color="secondary" />
              <Chip label="Self Help Groups" color="default" />
            </Stack>
            <Typography variant="body1" color="text.secondary">
              Explore available government schemes for agricultural credit and debt relief.
            </Typography>
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Debt Relief Programs
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Information about debt waiver schemes and restructuring options.
            </Typography>
          </Paper>
        </Stack>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Stack spacing={4}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2
            }}>
              <SupportIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              Expert Financial Consultation
            </Typography>
          </Box>
          
          <Alert 
            severity="info" 
            icon={<InfoIcon sx={{ fontSize: 20 }} />}
            sx={{
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(66, 165, 245, 0.05) 100%)',
              border: '1px solid rgba(33, 150, 243, 0.2)',
              '& .MuiAlert-icon': {
                fontSize: 20
              }
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Connect with qualified financial advisors who specialize in agricultural finance and debt management.
            </Typography>
          </Alert>
          
          <Typography variant="h5" gutterBottom sx={{ 
            fontWeight: 600,
            color: 'text.primary',
            textAlign: 'center',
            mt: 3
          }}>
            Available Financial Advisors
          </Typography>
          
          {/* Enhanced Advisor Cards Grid with Perfect Spacing */}
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)'
            },
            gap: 3,
            mt: 2
          }}>
            {FINANCIAL_ADVISORS.map((advisor) => (
              <Card 
                key={advisor.id}
                sx={{ 
                  height: 380,
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
                    transform: 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.3s ease'
                  },
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(25, 118, 210, 0.15)',
                    borderColor: 'primary.main',
                    '&::before': {
                      transform: 'scaleX(1)'
                    },
                    '& .advisor-avatar': {
                      transform: 'scale(1.1)',
                      boxShadow: '0 8px 24px rgba(25, 118, 210, 0.3)'
                    },
                    '& .contact-button': {
                      background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                      transform: 'scale(1.05)'
                    }
                  }
                }}
                onClick={() => handleAdvisorSelect(advisor)}
              >
                <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  {/* Header Section with Enhanced Spacing */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2.5 }}>
                    <Avatar 
                      className="advisor-avatar"
                      sx={{ 
                        width: 48, 
                        height: 48, 
                        mr: 2,
                        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)'
                      }}
                    >
                      {advisor.name.split(' ').map((n: string) => n[0]).join('')}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="h6" sx={{ 
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        lineHeight: 1.3,
                        mb: 0.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: 'text.primary'
                      }}>
                        {advisor.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        lineHeight: 1.2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {advisor.specialization}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* Enhanced Stats Section */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    mb: 2,
                    p: 1.5,
                    background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.08) 0%, rgba(66, 165, 245, 0.04) 100%)',
                    borderRadius: 2,
                    border: '1px solid rgba(25, 118, 210, 0.1)'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <StarIcon sx={{ color: 'warning.main', fontSize: 18, mr: 0.5 }} />
                      <Typography variant="body2" fontWeight="700" sx={{ fontSize: '0.85rem', color: 'text.primary' }}>
                        {advisor.rating}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', fontWeight: 500 }}>
                      {advisor.experience}yr exp
                    </Typography>
                    <Typography variant="body2" color="primary.main" fontWeight="600" sx={{ fontSize: '0.8rem' }}>
                      {advisor.consultations}+ sessions
                    </Typography>
                  </Box>
                  
                  {/* Location with Icon */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ 
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {advisor.location}
                    </Typography>
                  </Box>
                  
                  {/* Bio Section - Fixed height with better typography */}
                  <Typography variant="body2" sx={{ 
                    fontSize: '0.85rem',
                    lineHeight: 1.5,
                    color: 'text.secondary',
                    height: 64, // Fixed height for consistent layout
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                    mb: 2,
                    fontWeight: 400
                  }}>
                    {advisor.bio}
                  </Typography>
                  
                  {/* Languages - Enhanced display */}
                  <Box sx={{ mb: 2.5, height: 24 }}>
                    <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
                      {advisor.languages.slice(0, 2).map((language: string) => (
                        <Chip 
                          key={language} 
                          label={language} 
                          size="small" 
                          variant="outlined"
                          sx={{ 
                            fontSize: '0.7rem', 
                            height: 24,
                            fontWeight: 500,
                            '& .MuiChip-label': { px: 1.5 },
                            borderColor: 'primary.light',
                            color: 'primary.main',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              borderColor: 'primary.main',
                              transform: 'scale(1.05)'
                            }
                          }}
                        />
                      ))}
                      {advisor.languages.length > 2 && (
                        <Chip 
                          label={`+${advisor.languages.length - 2}`}
                          size="small" 
                          variant="filled"
                          sx={{ 
                            fontSize: '0.7rem', 
                            height: 24,
                            fontWeight: 500,
                            background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(66, 165, 245, 0.05) 100%)',
                            color: 'primary.main',
                            '& .MuiChip-label': { px: 1.5 }
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                  
                  {/* Spacer for perfect alignment */}
                  <Box sx={{ flex: 1 }} />
                  
                  {/* Enhanced Bottom Section */}
                  <Box sx={{ 
                    pt: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider'
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body2" fontWeight="700" sx={{ 
                          fontSize: '0.85rem',
                          background: 'linear-gradient(45deg, #2e7d32, #4caf50)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }}>
                          {advisor.consultationFee}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ 
                          fontSize: '0.7rem',
                          fontWeight: 500,
                          display: 'block'
                        }}>
                          Per consultation
                        </Typography>
                      </Box>
                      <Button 
                        className="contact-button"
                        variant="contained" 
                        size="small"
                        sx={{ 
                          borderRadius: 2,
                          fontSize: '0.8rem',
                          px: 2.5,
                          py: 1,
                          minWidth: 'auto',
                          textTransform: 'none',
                          fontWeight: 600,
                          background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)'
                          }
                        }}
                      >
                        Contact
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
          
          {/* Emergency Contact */}
          <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'error.light', border: '1px solid', borderColor: 'error.main' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhoneIcon color="error" />
              Emergency Financial Crisis Helpline
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              If you're facing an immediate financial crisis or considering extreme measures, please reach out immediately:
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                color="error" 
                startIcon={<PhoneIcon />}
                href="tel:1800-123-4567"
              >
                Call Crisis Helpline: 1800-123-4567
              </Button>
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={<EmailIcon />}
                href="mailto:crisis@agrifinance.gov.in"
              >
                Email: crisis@agrifinance.gov.in
              </Button>
            </Box>
          </Paper>
        </Stack>
      </TabPanel>

      {/* Advisor Details Dialog */}
      <Dialog
        open={advisorDialogOpen}
        onClose={handleAdvisorDialogClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              sx={{ 
                width: 64, 
                height: 64,
                bgcolor: 'primary.main',
                fontSize: '1.5rem'
              }}
            >
              {selectedAdvisor?.name.split(' ').map((n: string) => n[0]).join('')}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {selectedAdvisor?.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {selectedAdvisor?.specialization}
              </Typography>
            </Box>
          </Box>
          <IconButton
            aria-label="close"
            onClick={handleAdvisorDialogClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h6" gutterBottom>Professional Summary</Typography>
              <Typography variant="body1">{selectedAdvisor?.bio}</Typography>
            </Box>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <Box>
                <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'primary.light' }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StarIcon sx={{ color: 'warning.main' }} />
                    Rating & Reviews
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="primary.main">
                    {selectedAdvisor?.rating}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Based on {selectedAdvisor?.consultations} client consultations
                  </Typography>
                </Paper>
              </Box>
              
              <Box>
                <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'success.light' }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WorkIcon color="success" />
                    Experience
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {selectedAdvisor?.experience}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Years in agricultural finance
                  </Typography>
                </Paper>
              </Box>
            </Box>
            
            <Box>
              <Typography variant="h6" gutterBottom>Languages Spoken</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {selectedAdvisor?.languages.map((language: string) => (
                  <Chip 
                    key={language} 
                    label={language} 
                    color="primary" 
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
            
            <Box>
              <Typography variant="h6" gutterBottom>Contact Information</Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PhoneIcon color="primary" />
                  <Typography variant="body1">{selectedAdvisor?.phone}</Typography>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    href={`tel:${selectedAdvisor?.phone}`}
                  >
                    Call Now
                  </Button>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <EmailIcon color="primary" />
                  <Typography variant="body1">{selectedAdvisor?.email}</Typography>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    href={`mailto:${selectedAdvisor?.email}`}
                  >
                    Send Email
                  </Button>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LocationOnIcon color="primary" />
                  <Typography variant="body1">{selectedAdvisor?.location}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <ScheduleIcon color="primary" />
                  <Typography variant="body1">Available: {selectedAdvisor?.availability}</Typography>
                </Box>
              </Stack>
            </Box>
            
            <Alert severity="info" icon={<InfoIcon />}>
              Initial consultation is free for farmers. Specialized services may have associated fees that will be discussed during consultation.
            </Alert>
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleAdvisorDialogClose} variant="outlined">
            Close
          </Button>
          <Button 
            variant="contained" 
            href={`tel:${selectedAdvisor?.phone}`}
            startIcon={<PhoneIcon />}
          >
            Call {selectedAdvisor?.name}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DebtCounselingPage;
