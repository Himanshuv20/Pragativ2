import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { designTokens } from '../../theme/theme';

// Base icon wrapper with consistent styling
interface CustomIconProps extends Omit<SvgIconProps, 'children'> {
  children: React.ReactNode;
  variant?: 'filled' | 'outlined' | 'duotone';
  gradient?: boolean;
}

const CustomIcon: React.FC<CustomIconProps> = ({ 
  children, 
  variant = 'outlined', 
  gradient = false,
  sx,
  ...props 
}) => {
  const getIconStyles = () => {
    const baseStyles = {
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    if (gradient) {
      return {
        ...baseStyles,
        background: `linear-gradient(135deg, ${designTokens.colors.primary[500]} 0%, ${designTokens.colors.primary[700]} 100%)`,
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        ...sx,
      };
    }

    return {
      ...baseStyles,
      ...sx,
    };
  };

  return (
    <SvgIcon sx={getIconStyles()} {...props}>
      {children}
    </SvgIcon>
  );
};

// Debt Counseling and Financial Management Icons
export const DebtCounselingIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <defs>
      <linearGradient id="debtGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1976D2" />
        <stop offset="100%" stopColor="#0D47A1" />
      </linearGradient>
    </defs>
    {/* Bank building base */}
    <rect x="3" y="8" width="18" height="14" fill="url(#debtGradient)" rx="1"/>
    {/* Pillars */}
    <rect x="5" y="6" width="2" height="16" fill="#1565C0"/>
    <rect x="9" y="6" width="2" height="16" fill="#1565C0"/>
    <rect x="13" y="6" width="2" height="16" fill="#1565C0"/>
    <rect x="17" y="6" width="2" height="16" fill="#1565C0"/>
    {/* Roof */}
    <polygon points="2,8 12,4 22,8" fill="#0D47A1"/>
    {/* Rupee symbol */}
    <circle cx="12" cy="15" r="3" fill="#FFF" opacity="0.9"/>
    <text x="12" y="17" textAnchor="middle" fontSize="2.5" fill="#1976D2" fontWeight="bold">₹</text>
    {/* Steps */}
    <rect x="2" y="20" width="20" height="2" fill="#0D47A1"/>
  </CustomIcon>
);

export const FinancialPlanningIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <defs>
      <linearGradient id="planningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2E7D32" />
        <stop offset="100%" stopColor="#1B5E20" />
      </linearGradient>
    </defs>
    {/* Chart background */}
    <rect x="3" y="3" width="18" height="14" fill="url(#planningGradient)" rx="2" opacity="0.1"/>
    {/* Chart bars */}
    <rect x="5" y="10" width="2" height="7" fill="#2E7D32"/>
    <rect x="8" y="8" width="2" height="9" fill="#4CAF50"/>
    <rect x="11" y="6" width="2" height="11" fill="#66BB6A"/>
    <rect x="14" y="9" width="2" height="8" fill="#4CAF50"/>
    <rect x="17" y="7" width="2" height="10" fill="#2E7D32"/>
    {/* Trend line */}
    <path d="M5 12 L8 10 L11 8 L14 10 L17 9" stroke="#1976D2" strokeWidth="2" fill="none"/>
    {/* Calculator */}
    <rect x="4" y="18" width="6" height="4" fill="#424242" rx="0.5"/>
    <circle cx="5.5" cy="19.5" r="0.3" fill="#FFF"/>
    <circle cx="7" cy="19.5" r="0.3" fill="#FFF"/>
    <circle cx="8.5" cy="19.5" r="0.3" fill="#FFF"/>
    <circle cx="5.5" cy="20.5" r="0.3" fill="#FFF"/>
    {/* Rupee symbol */}
    <text x="19" y="7" textAnchor="middle" fontSize="4" fill="#1976D2" fontWeight="bold">₹</text>
  </CustomIcon>
);

export const BudgetIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <defs>
      <linearGradient id="budgetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF6B35" />
        <stop offset="100%" stopColor="#D84315" />
      </linearGradient>
    </defs>
    {/* Pie chart circle */}
    <circle cx="12" cy="12" r="8" fill="none" stroke="#E0E0E0" strokeWidth="2"/>
    {/* Pie segments */}
    <path d="M 12 4 A 8 8 0 0 1 20 12 L 12 12 Z" fill="#4CAF50"/>
    <path d="M 20 12 A 8 8 0 0 1 12 20 L 12 12 Z" fill="#FF9800"/>
    <path d="M 12 20 A 8 8 0 0 1 4 12 L 12 12 Z" fill="#F44336"/>
    <path d="M 4 12 A 8 8 0 0 1 12 4 L 12 12 Z" fill="#2196F3"/>
    {/* Center circle */}
    <circle cx="12" cy="12" r="3" fill="url(#budgetGradient)"/>
    <text x="12" y="13" textAnchor="middle" fontSize="2" fill="#FFF" fontWeight="bold">₹</text>
  </CustomIcon>
);

export const LoanIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <defs>
      <linearGradient id="loanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF5722" />
        <stop offset="100%" stopColor="#BF360C" />
      </linearGradient>
    </defs>
    {/* Document */}
    <rect x="5" y="3" width="14" height="18" fill="url(#loanGradient)" rx="1" opacity="0.1"/>
    <rect x="5" y="3" width="14" height="18" fill="none" stroke="url(#loanGradient)" strokeWidth="2" rx="1"/>
    {/* Text lines */}
    <line x1="7" y1="7" x2="17" y2="7" stroke="#FF5722" strokeWidth="1"/>
    <line x1="7" y1="9" x2="15" y2="9" stroke="#FF5722" strokeWidth="1"/>
    <line x1="7" y1="11" x2="16" y2="11" stroke="#FF5722" strokeWidth="1"/>
    {/* Rupee symbol */}
    <circle cx="12" cy="16" r="2.5" fill="#FF5722"/>
    <text x="12" y="17" textAnchor="middle" fontSize="2" fill="#FFF" fontWeight="bold">₹</text>
    {/* Interest indicator */}
    <text x="17" y="6" fontSize="1.5" fill="#F44336">%</text>
  </CustomIcon>
);

export const CreditScoreIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <defs>
      <linearGradient id="creditGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4CAF50" />
        <stop offset="50%" stopColor="#FF9800" />
        <stop offset="100%" stopColor="#F44336" />
      </linearGradient>
    </defs>
    {/* Gauge background */}
    <path d="M 6 18 A 10 10 0 0 1 18 18" fill="none" stroke="#E0E0E0" strokeWidth="3"/>
    {/* Gauge fill */}
    <path d="M 6 18 A 10 10 0 0 1 15 9" fill="none" stroke="url(#creditGradient)" strokeWidth="3"/>
    {/* Center circle */}
    <circle cx="12" cy="12" r="2" fill="#424242"/>
    {/* Needle */}
    <line x1="12" y1="12" x2="15" y2="9" stroke="#424242" strokeWidth="2" strokeLinecap="round"/>
    {/* Score text */}
    <text x="12" y="8" textAnchor="middle" fontSize="3" fill="#424242" fontWeight="bold">750</text>
  </CustomIcon>
);

export const SavingsIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <defs>
      <linearGradient id="savingsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4CAF50" />
        <stop offset="100%" stopColor="#2E7D32" />
      </linearGradient>
    </defs>
    {/* Piggy bank body */}
    <ellipse cx="12" cy="14" rx="7" ry="5" fill="url(#savingsGradient)"/>
    {/* Piggy bank head */}
    <circle cx="8" cy="10" r="3" fill="#66BB6A"/>
    {/* Eye */}
    <circle cx="7" cy="9" r="0.5" fill="#2E7D32"/>
    {/* Snout */}
    <ellipse cx="5.5" cy="10.5" rx="1" ry="0.5" fill="#4CAF50"/>
    {/* Legs */}
    <rect x="7" y="18" width="1.5" height="2" fill="#2E7D32" rx="0.5"/>
    <rect x="10" y="18" width="1.5" height="2" fill="#2E7D32" rx="0.5"/>
    <rect x="13" y="18" width="1.5" height="2" fill="#2E7D32" rx="0.5"/>
    <rect x="16" y="18" width="1.5" height="2" fill="#2E7D32" rx="0.5"/>
    {/* Coin slot */}
    <rect x="11" y="11" width="2" height="0.5" fill="#2E7D32" rx="0.25"/>
    {/* Rupee coin */}
    <circle cx="15" cy="8" r="1.5" fill="#FFD700"/>
    <text x="15" y="8.5" textAnchor="middle" fontSize="1.2" fill="#F57F17">₹</text>
  </CustomIcon>
);

export const InvestmentIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <defs>
      <linearGradient id="investmentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1976D2" />
        <stop offset="100%" stopColor="#0D47A1" />
      </linearGradient>
    </defs>
    {/* Growth chart */}
    <rect x="3" y="15" width="2" height="6" fill="#4CAF50"/>
    <rect x="6" y="13" width="2" height="8" fill="#66BB6A"/>
    <rect x="9" y="10" width="2" height="11" fill="#81C784"/>
    <rect x="12" y="8" width="2" height="13" fill="#A5D6A7"/>
    <rect x="15" y="6" width="2" height="15" fill="#C8E6C9"/>
    <rect x="18" y="4" width="2" height="17" fill="#E8F5E8"/>
    {/* Trend arrow */}
    <path d="M4 16 L20 6" stroke="url(#investmentGradient)" strokeWidth="2"/>
    <polygon points="18,4 20,6 18,8" fill="#1976D2"/>
    {/* Rupee symbols */}
    <text x="5" y="3" fontSize="2" fill="#4CAF50">₹</text>
    <text x="19" y="3" fontSize="2" fill="#4CAF50">₹</text>
  </CustomIcon>
);

export const InterestRateIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <defs>
      <linearGradient id="rateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF9800" />
        <stop offset="100%" stopColor="#F57C00" />
      </linearGradient>
    </defs>
    {/* Clock circle */}
    <circle cx="12" cy="12" r="8" fill="none" stroke="url(#rateGradient)" strokeWidth="2"/>
    {/* Clock hands */}
    <line x1="12" y1="12" x2="12" y2="8" stroke="#FF9800" strokeWidth="2" strokeLinecap="round"/>
    <line x1="12" y1="12" x2="16" y2="12" stroke="#FF9800" strokeWidth="2" strokeLinecap="round"/>
    {/* Percentage symbol */}
    <text x="8" y="8" fontSize="3" fill="#FF9800" fontWeight="bold">%</text>
    {/* Center dot */}
    <circle cx="12" cy="12" r="1" fill="#FF9800"/>
    {/* Rate indicators */}
    <text x="20" y="6" fontSize="2" fill="#F44336">↑</text>
    <text x="4" y="18" fontSize="2" fill="#4CAF50">↓</text>
  </CustomIcon>
);

// Agriculture & Farming Icons
export const AgricultureIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" 
          fill="currentColor" opacity="0.3"/>
    <path d="M7 18C7 16.9 7.9 16 9 16H15C16.1 16 17 16.9 17 18V19C17 20.1 16.1 21 15 21H9C7.9 21 7 20.1 7 19V18Z" 
          fill="currentColor"/>
    <path d="M12 2V16M8 6L12 2L16 6M9 12H15" 
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </CustomIcon>
);

export const CropCalendarIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon gradient {...props}>
    <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19Z" 
          fill="currentColor" opacity="0.2"/>
    <circle cx="9" cy="11" r="1.5" fill="currentColor"/>
    <circle cx="15" cy="11" r="1.5" fill="currentColor"/>
    <circle cx="12" cy="14" r="1.5" fill="currentColor"/>
    <path d="M5 8H19M8 1V3M16 1V3" 
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </CustomIcon>
);

// Weather Icons with Blue Theme
export const WeatherSunnyIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <circle cx="12" cy="12" r="4" fill="#FFA726" opacity="0.8"/>
    <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" 
          stroke="#FF8F00" strokeWidth="2" strokeLinecap="round"/>
  </CustomIcon>
);

export const WeatherCloudyIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M17.5 17H6.5C4.57 17 3 15.43 3 13.5C3 11.57 4.57 10 6.5 10C6.67 10 6.83 10.02 7 10.05C7.09 7.68 9.02 5.76 11.39 5.67C13.76 5.58 15.76 7.22 16.24 9.5C18.84 9.65 21 11.89 21 14.5C21 17.26 18.76 19.5 16 19.5H17.5Z" 
          fill="#78909C" opacity="0.6"/>
    <path d="M6.5 17C4.57 17 3 15.43 3 13.5S4.57 10 6.5 10C6.83 10 7.13 10.04 7.41 10.11C7.87 7.36 10.16 5.5 12.91 5.5C15.96 5.5 18.5 8.04 18.5 11.09C20.43 11.3 22 12.96 22 15C22 17.21 20.21 19 18 19H6.5Z" 
          stroke="#546E7A" strokeWidth="1.5" fill="none"/>
  </CustomIcon>
);

export const WeatherRainyIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M17.5 15H6.5C4.57 15 3 13.43 3 11.5S4.57 8 6.5 8C6.83 8 7.13 8.04 7.41 8.11C7.87 5.36 10.16 3.5 12.91 3.5C15.96 3.5 18.5 6.04 18.5 9.09C20.43 9.3 22 10.96 22 13C22 15.21 20.21 17 18 17H17.5Z" 
          fill="#5C6BC0" opacity="0.4"/>
    <path d="M8 17L9 20M12 17L13 20M16 17L17 20" 
          stroke="#3F51B5" strokeWidth="2" strokeLinecap="round"/>
  </CustomIcon>
);

export const WeatherStormyIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M17.5 15H6.5C4.57 15 3 13.43 3 11.5S4.57 8 6.5 8C6.83 8 7.13 8.04 7.41 8.11C7.87 5.36 10.16 3.5 12.91 3.5C15.96 3.5 18.5 6.04 18.5 9.09C20.43 9.3 22 10.96 22 13C22 15.21 20.21 17 18 17H17.5Z" 
          fill="#455A64" opacity="0.6"/>
    <path d="M11 17L8 22H10L13 17H11Z" 
          fill="#FFD54F"/>
    <path d="M13 19L10 24H12L15 19H13Z" 
          fill="#FFC107"/>
  </CustomIcon>
);

export const WeatherSnowyIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M17.5 15H6.5C4.57 15 3 13.43 3 11.5S4.57 8 6.5 8C6.83 8 7.13 8.04 7.41 8.11C7.87 5.36 10.16 3.5 12.91 3.5C15.96 3.5 18.5 6.04 18.5 9.09C20.43 9.3 22 10.96 22 13C22 15.21 20.21 17 18 17H17.5Z" 
          fill="#E3F2FD" opacity="0.8"/>
    <circle cx="8" cy="19" r="1" fill="#42A5F5"/>
    <circle cx="12" cy="21" r="1" fill="#42A5F5"/>
    <circle cx="16" cy="19" r="1" fill="#42A5F5"/>
    <circle cx="10" cy="17" r="1" fill="#42A5F5"/>
    <circle cx="14" cy="17" r="1" fill="#42A5F5"/>
  </CustomIcon>
);

// Sustainable Practices Icons
export const SustainableIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon gradient {...props}>
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8 20C19 20 22 3 22 3C21 5 14 5.25 9 6.25C4 7.25 2 11.5 2 13.5C2 15.5 3.75 17.25 3.75 17.25" 
          fill="currentColor" opacity="0.3"/>
    <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" 
          stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <circle cx="6" cy="18" r="2" fill="currentColor"/>
  </CustomIcon>
);

export const EcoFriendlyIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8 20C19 20 22 3 22 3C21 5 14 5.25 9 6.25C4 7.25 2 11.5 2 13.5C2 15.5 3.75 17.25 3.75 17.25" 
          fill="currentColor" opacity="0.4"/>
    <path d="M12 2C12 2 15 5 15 9S12 16 12 16S9 13 9 9S12 2 12 2Z" 
          stroke="currentColor" strokeWidth="1.5" fill="none"/>
  </CustomIcon>
);

// Emergency & SOS Icons
export const EmergencyIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <circle cx="12" cy="12" r="10" fill="#F44336" opacity="0.2"/>
    <path d="M12 6V13L16 17" 
          stroke="#D32F2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="9" 
           stroke="#D32F2F" strokeWidth="2" fill="none"/>
    <path d="M12 2L14 8H20L15 12L17 18L12 15L7 18L9 12L4 8H10L12 2Z" 
          fill="#FF5722" opacity="0.8"/>
  </CustomIcon>
);

export const SOSIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <circle cx="12" cy="12" r="10" fill="#F44336"/>
    <path d="M8 9H10V11H8V9ZM8 13H10V15H8V13ZM12 9H14V15H12V9ZM16 9H18V11H16V9ZM16 13H18V15H16V13Z" 
          fill="white"/>
  </CustomIcon>
);

// Navigation & Action Icons
export const LocationIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2Z" 
          fill="currentColor" opacity="0.3"/>
    <circle cx="12" cy="9" r="2.5" fill="currentColor"/>
    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2Z" 
          stroke="currentColor" strokeWidth="1.5" fill="none"/>
  </CustomIcon>
);

export const RefreshIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4 7.58 4 12S7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12S8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z" 
          fill="currentColor"/>
  </CustomIcon>
);

export const SearchIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <circle cx="11" cy="11" r="8" 
           stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M21 21L16.65 16.65" 
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </CustomIcon>
);

// Status & Data Icons
export const TrendingUpIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L19.71 9.71L22 12V6H16Z" 
          fill="currentColor"/>
  </CustomIcon>
);

export const TemperatureIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M15 13V5C15 3.34 13.66 2 12 2S9 3.34 9 5V13C7.79 13.91 7 15.37 7 17C7 19.76 9.24 22 12 22S17 19.76 17 17C17 15.37 16.21 13.91 15 13Z" 
          fill="currentColor" opacity="0.3"/>
    <circle cx="12" cy="17" r="3" fill="currentColor"/>
    <path d="M12 5V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </CustomIcon>
);

export const HumidityIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M12 2C9.38 2 7.25 4.13 7.25 6.75C7.25 9.32 9.26 11.4 11.88 11.49C14.5 11.58 16.75 9.45 16.75 6.81C16.75 4.19 14.62 2.06 12 2Z" 
          fill="currentColor" opacity="0.4"/>
    <path d="M12 3L16.5 16H7.5L12 3Z" 
          stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <circle cx="12" cy="17" r="2" fill="currentColor"/>
  </CustomIcon>
);

export const VisibilityIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.4"/>
    <path d="M12 1C5.93 1 1 5.93 1 12S5.93 23 12 23S23 18.07 23 12S18.07 1 12 1ZM12 19C8.13 19 5 15.87 5 12S8.13 5 12 5S19 8.13 19 12S15.87 19 12 19Z" 
          stroke="currentColor" strokeWidth="1.5" fill="none"/>
    <circle cx="12" cy="12" r="1" fill="currentColor"/>
  </CustomIcon>
);

export const WindIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M3 8H11C12.1 8 13 7.1 13 6S12.1 4 11 4S9 4.9 9 6" 
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M3 12H15C16.1 12 17 11.1 17 10S16.1 8 15 8S13 8.9 13 10" 
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M3 16H13C14.1 16 15 16.9 15 18S14.1 20 13 20S11 19.1 11 18" 
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
  </CustomIcon>
);

export const PhoneIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" 
          fill="currentColor"/>
  </CustomIcon>
);

export const CloseIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M18 6L6 18M6 6L18 18" 
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </CustomIcon>
);

export const WarningIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M12 2L22 20H2L12 2Z" 
          fill="#FF9800" opacity="0.3"/>
    <path d="M12 2L22 20H2L12 2Z" 
          stroke="#FF9800" strokeWidth="2" fill="none"/>
    <path d="M12 8V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="17" r="1" fill="currentColor"/>
  </CustomIcon>
);

export const BuildIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M22.7 19L13.6 9.9C14.5 7.6 14 4.9 12.1 3C10.1 1 7.1 0.6 4.7 1.7L9 6L6 9L1.6 4.7C0.4 7.1 0.9 10.1 2.9 12.1C4.8 14 7.5 14.5 9.8 13.6L18.9 22.7C19.3 23.1 19.9 23.1 20.3 22.7L22.6 20.4C23.1 20 23.1 19.3 22.7 19Z" 
          fill="currentColor"/>
  </CustomIcon>
);

export const WaterIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M12 2C9.38 2 7.25 4.13 7.25 6.75C7.25 9.32 9.26 11.4 11.88 11.49C14.5 11.58 16.75 9.45 16.75 6.81C16.75 4.19 14.62 2.06 12 2Z" 
          fill="#2196F3" opacity="0.6"/>
    <path d="M12 22C16.97 22 21 17.97 21 13C21 8.03 16.97 4 12 4S3 8.03 3 13C3 17.97 7.03 22 12 22Z" 
          fill="#2196F3" opacity="0.3"/>
    <path d="M12 22C16.97 22 21 17.97 21 13C21 8.03 16.97 4 12 4S3 8.03 3 13C3 17.97 7.03 22 12 22Z" 
          stroke="#2196F3" strokeWidth="1.5" fill="none"/>
  </CustomIcon>
);

export const BugIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M20 8H17.19C16.74 7.22 16.12 6.55 15.37 6.04L17 4.41L15.59 3L13.42 5.17C12.96 5.06 12.49 5 12 5S11.04 5.06 10.59 5.17L8.41 3L7 4.41L8.62 6.04C7.88 6.55 7.26 7.22 6.81 8H4V10H6.09C6.04 10.33 6 10.66 6 11V12H4V14H6V15C6 15.34 6.04 15.67 6.09 16H4V18H6.81C7.85 19.79 9.78 21 12 21S16.15 19.79 17.19 18H20V16H17.91C17.96 15.67 18 15.34 18 15V14H20V12H18V11C18 10.66 17.96 10.33 17.91 10H20V8ZM14 16H10V14H14V16ZM14 12H10V10H14V12Z" 
          fill="#F44336"/>
  </CustomIcon>
);

export const PetsIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M4.5 12C5.33 12 6 11.33 6 10.5S5.33 9 4.5 9S3 9.67 3 10.5S3.67 12 4.5 12Z" 
          fill="currentColor"/>
    <path d="M19.5 12C20.33 12 21 11.33 21 10.5S20.33 9 19.5 9S18 9.67 18 10.5S18.67 12 19.5 12Z" 
          fill="currentColor"/>
    <path d="M9 12C9.83 12 10.5 11.33 10.5 10.5S9.83 9 9 9S7.5 9.67 7.5 10.5S8.17 12 9 12Z" 
          fill="currentColor"/>
    <path d="M15 12C15.83 12 16.5 11.33 16.5 10.5S15.83 9 15 9S13.5 9.67 13.5 10.5S14.17 12 15 12Z" 
          fill="currentColor"/>
    <path d="M15.17 18.5C15.17 20.43 14.04 22 12.5 22S9.83 20.43 9.83 18.5C9.83 16.57 10.96 15 12.5 15S15.17 16.57 15.17 18.5Z" 
          fill="currentColor" opacity="0.7"/>
    <ellipse cx="12.5" cy="16" rx="2.5" ry="1.5" fill="currentColor"/>
  </CustomIcon>
);

export const EcoIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M15.5 5.5C18 8 18 12 15.5 14.5S8 18 5.5 15.5S2 8 4.5 5.5S13 3 15.5 5.5Z" 
          fill="#4CAF50" opacity="0.3"/>
    <path d="M12 2L13.5 8.5L20 7L14.5 12L20 17L13.5 15.5L12 22L10.5 15.5L4 17L9.5 12L4 7L10.5 8.5L12 2Z" 
          fill="#4CAF50"/>
    <circle cx="12" cy="12" r="2" fill="#2E7D32"/>
  </CustomIcon>
);

export const EnergyIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M11 21H8L13 2H16L11 21Z" 
          fill="#FF9800"/>
    <path d="M8 11L4 15H7L6 21L10 17H7L8 11Z" 
          fill="#FF9800" opacity="0.7"/>
  </CustomIcon>
);

export const NatureIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z" 
          fill="#8BC34A"/>
    <path d="M21 9C21 14 16.97 18 12 18S3 14 3 9C3 7.5 4.5 6 6 6C7.5 6 9 7.5 9 9V12C9 13.1 9.9 14 11 14H13C14.1 14 15 13.1 15 12V9C15 7.5 16.5 6 18 6C19.5 6 21 7.5 21 9Z" 
          fill="#8BC34A" opacity="0.4"/>
    <rect x="11" y="18" width="2" height="4" fill="#8BC34A"/>
  </CustomIcon>
);

export const CheckIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <circle cx="12" cy="12" r="10" fill="#4CAF50" opacity="0.3"/>
    <path d="M8 12L11 15L16 10" 
          stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </CustomIcon>
);

export const InfoIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <circle cx="12" cy="12" r="10" 
           stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M12 8V12" 
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="16" r="1" fill="currentColor"/>
  </CustomIcon>
);

export const ExpandMoreIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M7 10L12 15L17 10H7Z" fill="currentColor"/>
  </CustomIcon>
);

export const TimelineIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M23 8C23 9.1 22.1 10 21 10C19.9 10 19 9.1 19 8C19 6.9 19.9 6 21 6C22.1 6 23 6.9 23 8Z" 
          fill="currentColor"/>
    <path d="M5 8C5 9.1 4.1 10 3 10C1.9 10 1 9.1 1 8C1 6.9 1.9 6 3 6C4.1 6 5 6.9 5 8Z" 
          fill="currentColor"/>
    <path d="M14 8C14 9.1 13.1 10 12 10C10.9 10 10 9.1 10 8C10 6.9 10.9 6 12 6C13.1 6 14 6.9 14 8Z" 
          fill="currentColor"/>
    <path d="M3 8H12H21" stroke="currentColor" strokeWidth="2"/>
    <path d="M7 12L10 15L17 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </CustomIcon>
);

export const MoneyIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <circle cx="12" cy="12" r="10" 
           stroke="#4CAF50" strokeWidth="2" fill="none"/>
    <path d="M12 6V8M12 16V18M8 12H16M10 8.5C10 7.67 10.67 7 11.5 7H12.5C13.33 7 14 7.67 14 8.5S13.33 10 12.5 10H11.5C10.67 10 10 10.67 10 11.5S10.67 13 11.5 13H12.5C13.33 13 14 13.33 14 14S13.33 15 12.5 15H11.5C10.67 15 10 14.33 10 13.5" 
          stroke="#4CAF50" strokeWidth="1.5" strokeLinecap="round"/>
  </CustomIcon>
);

// Government & Schemes Icon
export const GovernmentIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" 
          fill="currentColor"/>
    <rect x="2" y="17" width="20" height="2" fill="currentColor"/>
    <rect x="3.5" y="12" width="2" height="5" fill="currentColor"/>
    <rect x="6.5" y="12" width="2" height="5" fill="currentColor"/>
    <rect x="9.5" y="12" width="2" height="5" fill="currentColor"/>
    <rect x="12.5" y="12" width="2" height="5" fill="currentColor"/>
    <rect x="15.5" y="12" width="2" height="5" fill="currentColor"/>
    <rect x="18.5" y="12" width="2" height="5" fill="currentColor"/>
    <rect x="4" y="10" width="16" height="1" fill="currentColor"/>
    <path d="M4 8.5L12 6l8 2.5v1H4z" fill="currentColor"/>
  </CustomIcon>
);

// Mandi Data Icon
export const MandiIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon variant="duotone" {...props}>
    <defs>
      <linearGradient id="mandiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4CAF50"/>
        <stop offset="100%" stopColor="#2E7D32"/>
      </linearGradient>
    </defs>
    {/* Market building structure */}
    <rect x="4" y="8" width="16" height="12" rx="2" fill="url(#mandiGradient)" opacity="0.9"/>
    <rect x="4" y="8" width="16" height="3" rx="1" fill="#66BB6A"/>
    
    {/* Market entrance */}
    <rect x="9" y="12" width="6" height="8" fill="rgba(255,255,255,0.2)" rx="1"/>
    <rect x="10" y="13" width="4" height="6" fill="rgba(255,255,255,0.3)" rx="0.5"/>
    
    {/* Agricultural symbols */}
    <circle cx="7" cy="6" r="1.5" fill="#FFA726" opacity="0.8"/>
    <circle cx="12" cy="5" r="1.2" fill="#FF7043" opacity="0.8"/>
    <circle cx="17" cy="6" r="1.3" fill="#8BC34A" opacity="0.8"/>
    
    {/* Market pillars */}
    <rect x="6" y="8" width="1" height="12" fill="rgba(255,255,255,0.3)"/>
    <rect x="17" y="8" width="1" height="12" fill="rgba(255,255,255,0.3)"/>
  </CustomIcon>
);

export const SchemesIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
          fill="currentColor"/>
    <rect x="7" y="11" width="2" height="6" fill="white" opacity="0.8"/>
    <rect x="11" y="11" width="2" height="6" fill="white" opacity="0.8"/>
    <rect x="15" y="11" width="2" height="6" fill="white" opacity="0.8"/>
    <circle cx="12" cy="6" r="2" fill="white"/>
  </CustomIcon>
);

// Crop-specific icons for better visual representation
export const WheatIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <path d="M12 2L11 8L12 14L13 8L12 2ZM8 6L7 8L8 10L9 8L8 6ZM16 6L15 8L16 10L17 8L16 6ZM6 10L5 12L6 14L7 12L6 10ZM18 10L17 12L18 14L19 12L18 10ZM4 14L3 16L4 18L5 16L4 14ZM20 14L19 16L20 18L21 16L20 14ZM2 18L1 20L2 22L3 20L2 18ZM22 18L21 20L22 22L23 20L22 18Z" 
          fill="#FFA726" opacity="0.8"/>
    <path d="M12 1V15M8 5V11M16 5V11M6 9V15M18 9V15M4 13V19M20 13V19M2 17V23M22 17V23" 
          stroke="#FF8F00" strokeWidth="1.5"/>
  </CustomIcon>
);

export const RiceIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <ellipse cx="12" cy="8" rx="8" ry="4" fill="#66BB6A" opacity="0.6"/>
    <ellipse cx="12" cy="12" rx="6" ry="3" fill="#4CAF50" opacity="0.8"/>
    <ellipse cx="12" cy="16" rx="4" ry="2" fill="#388E3C"/>
    <path d="M12 4C8 4 4 6 4 8C4 10 8 12 12 12C16 12 20 10 20 8C20 6 16 4 12 4Z" 
          stroke="#2E7D32" strokeWidth="1" fill="none"/>
  </CustomIcon>
);

export const OnionIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <circle cx="12" cy="14" r="6" fill="#AB47BC" opacity="0.6"/>
    <path d="M12 8C14 8 16 9 16 10C16 11 14 12 12 12C10 12 8 11 8 10C8 9 10 8 12 8Z" 
          fill="#9C27B0" opacity="0.8"/>
    <path d="M12 6L11 8L12 10L13 8L12 6Z" fill="#8E24AA"/>
    <circle cx="12" cy="14" r="5" stroke="#7B1FA2" strokeWidth="1.5" fill="none"/>
  </CustomIcon>
);

export const PotatoIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <ellipse cx="12" cy="12" rx="7" ry="5" fill="#8D6E63" opacity="0.8"/>
    <circle cx="9" cy="10" r="1" fill="#5D4037" opacity="0.6"/>
    <circle cx="15" cy="11" r="0.8" fill="#5D4037" opacity="0.6"/>
    <circle cx="12" cy="14" r="0.8" fill="#5D4037" opacity="0.6"/>
    <ellipse cx="12" cy="12" rx="6.5" ry="4.5" stroke="#6D4C41" strokeWidth="1" fill="none"/>
  </CustomIcon>
);

export const TomatoIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon {...props}>
    <circle cx="12" cy="13" r="6" fill="#F44336" opacity="0.8"/>
    <path d="M9 7C9 6 10 5 12 5C14 5 15 6 15 7C15 8 14 8 12 8C10 8 9 8 9 7Z" 
          fill="#4CAF50"/>
    <path d="M10 7L11 5M12 7L12 4M14 7L13 5" 
          stroke="#388E3C" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="13" r="5.5" stroke="#D32F2F" strokeWidth="1" fill="none"/>
  </CustomIcon>
);

export const MarketIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon variant="duotone" {...props}>
    <defs>
      <linearGradient id="marketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#388E3C"/>
        <stop offset="100%" stopColor="#1B5E20"/>
      </linearGradient>
    </defs>
    {/* Main market structure */}
    <path d="M3 21H21V9L12 4L3 9V21Z" fill="url(#marketGradient)" opacity="0.9"/>
    <path d="M3 9L12 4L21 9" stroke="#66BB6A" strokeWidth="2" fill="none"/>
    
    {/* Market stalls */}
    <rect x="6" y="12" width="3" height="6" fill="rgba(255,255,255,0.2)" rx="0.5"/>
    <rect x="10.5" y="12" width="3" height="6" fill="rgba(255,255,255,0.2)" rx="0.5"/>
    <rect x="15" y="12" width="3" height="6" fill="rgba(255,255,255,0.2)" rx="0.5"/>
    
    {/* Produce baskets */}
    <circle cx="7.5" cy="14" r="0.8" fill="#FFA726" opacity="0.9"/>
    <circle cx="12" cy="14" r="0.8" fill="#F44336" opacity="0.9"/>
    <circle cx="16.5" cy="14" r="0.8" fill="#4CAF50" opacity="0.9"/>
  </CustomIcon>
);

export const PriceTagIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon variant="duotone" {...props}>
    <defs>
      <linearGradient id="priceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF9800"/>
        <stop offset="100%" stopColor="#F57C00"/>
      </linearGradient>
    </defs>
    {/* Price tag background */}
    <path d="M12.4 2.1C13 1.5 14 1.5 14.6 2.1L21.9 9.4C22.5 10 22.5 11 21.9 11.6L11.6 21.9C11 22.5 10 22.5 9.4 21.9L2.1 14.6C1.5 14 1.5 13 2.1 12.4L12.4 2.1Z" 
          fill="url(#priceGradient)" opacity="0.9"/>
    
    {/* Rupee symbol */}
    <path d="M9 7H15M9 11H13L15 15H13L11 11" 
          stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    
    {/* Tag hole */}
    <circle cx="17" cy="7" r="1.5" fill="rgba(255,255,255,0.8)"/>
    <circle cx="17" cy="7" r="0.8" fill="#F57C00"/>
  </CustomIcon>
);

export const TrendUpIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon variant="duotone" {...props}>
    <defs>
      <linearGradient id="trendUpGradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#4CAF50"/>
        <stop offset="100%" stopColor="#8BC34A"/>
      </linearGradient>
    </defs>
    {/* Trend arrow background */}
    <path d="M3 17L9 11L13 15L21 7" 
          stroke="url(#trendUpGradient)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    
    {/* Arrow head */}
    <path d="M17 7L21 7L21 11" 
          stroke="url(#trendUpGradient)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    
    {/* Data points */}
    <circle cx="3" cy="17" r="2" fill="#4CAF50" opacity="0.8"/>
    <circle cx="9" cy="11" r="2" fill="#66BB6A" opacity="0.8"/>
    <circle cx="13" cy="15" r="2" fill="#4CAF50" opacity="0.8"/>
    <circle cx="21" cy="7" r="2" fill="#8BC34A" opacity="0.8"/>
  </CustomIcon>
);

export const TrendDownIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon variant="duotone" {...props}>
    <defs>
      <linearGradient id="trendDownGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F44336"/>
        <stop offset="100%" stopColor="#D32F2F"/>
      </linearGradient>
    </defs>
    {/* Trend arrow background */}
    <path d="M3 7L9 13L13 9L21 17" 
          stroke="url(#trendDownGradient)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    
    {/* Arrow head */}
    <path d="M17 17L21 17L21 13" 
          stroke="url(#trendDownGradient)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    
    {/* Data points */}
    <circle cx="3" cy="7" r="2" fill="#F44336" opacity="0.8"/>
    <circle cx="9" cy="13" r="2" fill="#E57373" opacity="0.8"/>
    <circle cx="13" cy="9" r="2" fill="#F44336" opacity="0.8"/>
    <circle cx="21" cy="17" r="2" fill="#D32F2F" opacity="0.8"/>
  </CustomIcon>
);

export const WeightScaleIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon variant="duotone" {...props}>
    <defs>
      <linearGradient id="scaleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#795548"/>
        <stop offset="100%" stopColor="#5D4037"/>
      </linearGradient>
    </defs>
    {/* Scale base */}
    <rect x="6" y="18" width="12" height="3" rx="1.5" fill="url(#scaleGradient)" opacity="0.9"/>
    <rect x="11" y="12" width="2" height="6" fill="#8D6E63" opacity="0.8"/>
    
    {/* Scale pans */}
    <ellipse cx="8" cy="10" rx="4" ry="2" fill="#BCAAA4" opacity="0.8"/>
    <ellipse cx="16" cy="10" rx="4" ry="2" fill="#BCAAA4" opacity="0.8"/>
    
    {/* Scale chains */}
    <path d="M8 10L12 12M16 10L12 12" stroke="#8D6E63" strokeWidth="1.5"/>
    
    {/* Produce on scales */}
    <circle cx="7" cy="9" r="1" fill="#FFA726" opacity="0.9"/>
    <circle cx="9" cy="9" r="0.8" fill="#FF7043" opacity="0.9"/>
    <circle cx="15" cy="9" r="1" fill="#4CAF50" opacity="0.9"/>
    <circle cx="17" cy="9" r="0.8" fill="#8BC34A" opacity="0.9"/>
  </CustomIcon>
);

export const TransportIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon variant="duotone" {...props}>
    <defs>
      <linearGradient id="transportGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2196F3"/>
        <stop offset="100%" stopColor="#1976D2"/>
      </linearGradient>
    </defs>
    {/* Truck body */}
    <rect x="2" y="8" width="12" height="6" rx="1" fill="url(#transportGradient)" opacity="0.9"/>
    <rect x="14" y="10" width="6" height="4" rx="1" fill="#42A5F5" opacity="0.8"/>
    
    {/* Truck cab */}
    <rect x="14" y="8" width="4" height="6" rx="1" fill="url(#transportGradient)"/>
    <rect x="15" y="9" width="2" height="2" fill="rgba(255,255,255,0.3)" rx="0.2"/>
    
    {/* Wheels */}
    <circle cx="6" cy="16" r="2.5" fill="#424242" opacity="0.8"/>
    <circle cx="6" cy="16" r="1.5" fill="#616161"/>
    <circle cx="16" cy="16" r="2.5" fill="#424242" opacity="0.8"/>
    <circle cx="16" cy="16" r="1.5" fill="#616161"/>
    
    {/* Cargo (produce) */}
    <circle cx="5" cy="10" r="1" fill="#FFA726" opacity="0.9"/>
    <circle cx="8" cy="9" r="1" fill="#4CAF50" opacity="0.9"/>
    <circle cx="11" cy="10" r="1" fill="#F44336" opacity="0.9"/>
  </CustomIcon>
);

// Pest and Disease Analysis Icon
export const PestDiseaseIcon: React.FC<SvgIconProps> = (props) => (
  <CustomIcon variant="duotone" {...props}>
    <defs>
      <linearGradient id="pestGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF6B35"/>
        <stop offset="50%" stopColor="#F7931E"/>
        <stop offset="100%" stopColor="#FFD23F"/>
      </linearGradient>
      <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4CAF50"/>
        <stop offset="100%" stopColor="#8BC34A"/>
      </linearGradient>
    </defs>
    
    {/* Leaf background */}
    <path d="M12 2C16 2 20 6 20 12C20 16 18 18 16 20C14 18 12 16 10 14C8 12 6 8 8 6C10 4 12 2 12 2Z" 
          fill="url(#leafGradient)" opacity="0.8"/>
    
    {/* Leaf veins */}
    <path d="M12 4L12 18M8 8L16 8M9 12L15 12" 
          stroke="#2E7D32" strokeWidth="1" opacity="0.6"/>
    
    {/* Disease spots */}
    <circle cx="10" cy="8" r="1.5" fill="#8D6E63" opacity="0.7"/>
    <circle cx="14" cy="10" r="1" fill="#5D4037" opacity="0.8"/>
    <circle cx="11" cy="14" r="1.2" fill="#6D4C41" opacity="0.6"/>
    
    {/* Magnifying glass overlay */}
    <circle cx="16" cy="8" r="4" stroke="url(#pestGradient)" strokeWidth="2" fill="none" opacity="0.9"/>
    <circle cx="16" cy="8" r="2.5" fill="rgba(255,255,255,0.3)"/>
    
    {/* Magnifying glass handle */}
    <path d="M19 11L21 13" stroke="url(#pestGradient)" strokeWidth="2.5" strokeLinecap="round"/>
    
    {/* Analysis indicators */}
    <circle cx="15" cy="7" r="0.5" fill="#FF5722" opacity="0.8"/>
    <circle cx="17" cy="9" r="0.4" fill="#FF9800" opacity="0.8"/>
    
    {/* AI scan lines */}
    <path d="M13 6L19 6M13 8L19 8M13 10L18 10" 
          stroke="#FF6B35" strokeWidth="0.8" opacity="0.6"/>
  </CustomIcon>
);

// Export all icons for easy importing
