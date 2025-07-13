import React from 'react';
import { Box, Typography } from '@mui/material';
import { brandConfig } from '../../config/brandConfig';

interface ICameraPlacementDiagramProps {
  stallSize?: 'standard' | 'large';
  showLabels?: boolean;
}

export const CameraPlacementDiagram: React.FC<ICameraPlacementDiagramProps> = ({
  stallSize = 'standard',
  showLabels = true
}) => {
  const styles = {
    container: {
      backgroundColor: brandConfig.colors.barnWhite,
      borderRadius: '12px',
      padding: brandConfig.spacing.lg,
      border: `1px solid ${brandConfig.colors.neutralGray}20`,
      textAlign: 'center' as const
    },
    title: {
      fontSize: brandConfig.typography.fontSizeLg,
      fontWeight: brandConfig.typography.weightBold,
      color: brandConfig.colors.stableMahogany,
      marginBottom: brandConfig.spacing.md
    },
    subtitle: {
      fontSize: brandConfig.typography.fontSizeBase,
      color: brandConfig.colors.neutralGray,
      marginBottom: brandConfig.spacing.lg
    }
  };

  return (
    <Box sx={styles.container}>
      <Typography sx={styles.title}>
        Optimal Camera Placement
      </Typography>
      <Typography sx={styles.subtitle}>
        160° field of view • Mount 8-10 feet high for best coverage
      </Typography>
      
      {/* 
        SVG CAMERA PLACEMENT DIAGRAM
        
        DESIGN NOTES FOR FUTURE ADJUSTMENTS:
        - Camera has 160° field of view (very wide angle)
        - Need to see horse movement for AI tracking
        - Optimal height: 8-10 feet for overhead view
        - Corner placement gives maximum coverage
        - Multiple angles show different stall layouts
        
        COORDINATE SYSTEM:
        - SVG is 400x300 viewBox
        - Origin (0,0) at top-left
        - Positive X goes right, positive Y goes down
        
        STALL DIMENSIONS (approximate scale):
        - Standard stall: 12x12 feet
        - Large stall: 14x14 feet
        - Door typically 4 feet wide
        
        CAMERA COVERAGE:
        - 160° field of view represented by arc
        - Blind spots shown in red
        - Optimal coverage in green
        
        COLOR SCHEME:
        - Camera: #8B4513 (stableMahogany)
        - Coverage area: #2C5530 with opacity (hunterGreen)
        - Blind spots: #d32f2f with opacity (alertRed)
        - Stall walls: #666666 (neutral)
        - Horse: #8B4513 (stableMahogany) for visibility
      */}
      
      <svg
        viewBox="0 0 400 300"
        style={{
          width: '100%',
          maxWidth: '400px',
          height: 'auto',
          border: `1px solid ${brandConfig.colors.neutralGray}40`,
          borderRadius: '8px',
          backgroundColor: '#f8f9fa'
        }}
      >
        {/* Stall Walls - Rectangular enclosure */}
        <rect
          x="50"
          y="50"
          width="300"
          height="200"
          fill="none"
          stroke="#666666"
          strokeWidth="3"
          strokeDasharray="none"
        />
        
        {/* Stall Door - Opening in bottom wall */}
        <line
          x1="150"
          y1="250"
          x2="200"
          y2="250"
          stroke="#f8f9fa"
          strokeWidth="4"
        />
        
        {/* Door Handle */}
        <circle
          cx="180"
          cy="245"
          r="3"
          fill="#666666"
        />
        
        {/* Camera Position - Top right corner for maximum coverage */}
        <circle
          cx="330"
          cy="70"
          r="8"
          fill={brandConfig.colors.stableMahogany}
          stroke="#ffffff"
          strokeWidth="2"
        />
        
        {/* Camera Housing - Rectangular mount */}
        <rect
          x="325"
          y="65"
          width="10"
          height="10"
          fill={brandConfig.colors.stableMahogany}
          stroke="#ffffff"
          strokeWidth="1"
          rx="2"
        />
        
        {/* 
          CAMERA FIELD OF VIEW - 160° coverage arc
          
          CALCULATION NOTES:
          - 160° is very wide, nearly 180°
          - Center angle pointing toward stall center
          - Arc starts at 200° and sweeps 160° 
          - Radius of 180 gives good coverage visualization
        */}
        <path
          d="M 330 70 L 200 200 A 180 180 0 0 0 150 90 Z"
          fill={brandConfig.colors.hunterGreen}
          fillOpacity="0.2"
          stroke={brandConfig.colors.hunterGreen}
          strokeWidth="2"
          strokeOpacity="0.6"
        />
        
        {/* Primary Coverage Zone - Where AI tracking works best */}
        <ellipse
          cx="220"
          cy="150"
          rx="120"
          ry="80"
          fill={brandConfig.colors.hunterGreen}
          fillOpacity="0.1"
          stroke={brandConfig.colors.hunterGreen}
          strokeWidth="1"
          strokeDasharray="5,5"
        />
        
        {/* Horse Figure - Simple representation */}
        <ellipse
          cx="200"
          cy="150"
          rx="25"
          ry="40"
          fill={brandConfig.colors.stableMahogany}
          fillOpacity="0.3"
        />
        
        {/* Horse Head */}
        <circle
          cx="200"
          cy="125"
          r="12"
          fill={brandConfig.colors.stableMahogany}
          fillOpacity="0.4"
        />
        
        {/* Horse Legs - Simple lines */}
        <line x1="185" y1="180" x2="185" y2="195" stroke={brandConfig.colors.stableMahogany} strokeWidth="3" />
        <line x1="200" y1="185" x2="200" y2="200" stroke={brandConfig.colors.stableMahogany} strokeWidth="3" />
        <line x1="215" y1="180" x2="215" y2="195" stroke={brandConfig.colors.stableMahogany} strokeWidth="3" />
        
        {/* 
          BLIND SPOTS - Areas where camera can't see well
          These are minimal with 160° field of view but worth showing
        */}
        <path
          d="M 50 50 L 70 50 L 70 80 L 50 80 Z"
          fill="#d32f2f"
          fillOpacity="0.2"
        />
        
        {/* Feed/Water Area - Important to monitor */}
        <rect
          x="60"
          y="60"
          width="15"
          height="10"
          fill="#4CAF50"
          rx="2"
        />
        
        {/* Labels for key elements */}
        {showLabels && (
          <>
            {/* Camera Label */}
            <text
              x="340"
              y="60"
              fontSize="12"
              fill={brandConfig.colors.stableMahogany}
              fontWeight="bold"
              textAnchor="start"
            >
              Camera
            </text>
            
            {/* Height Label */}
            <text
              x="345"
              y="85"
              fontSize="10"
              fill={brandConfig.colors.neutralGray}
              textAnchor="start"
            >
              8-10ft high
            </text>
            
            {/* Coverage Area Label */}
            <text
              x="120"
              y="120"
              fontSize="11"
              fill={brandConfig.colors.hunterGreen}
              fontWeight="bold"
              textAnchor="middle"
            >
              160° View
            </text>
            
            {/* Optimal Zone Label */}
            <text
              x="220"
              y="140"
              fontSize="10"
              fill={brandConfig.colors.hunterGreen}
              textAnchor="middle"
            >
              Optimal Zone
            </text>
            
            {/* Door Label */}
            <text
              x="175"
              y="270"
              fontSize="10"
              fill="#666666"
              textAnchor="middle"
            >
              Stall Door
            </text>
            
            {/* Feed Area Label */}
            <text
              x="68"
              y="90"
              fontSize="9"
              fill="#4CAF50"
              textAnchor="middle"
            >
              Feed
            </text>
            
            {/* Blind Spot Warning */}
            <text
              x="60"
              y="45"
              fontSize="9"
              fill="#d32f2f"
              fontWeight="bold"
              textAnchor="middle"
            >
              Minimal blind spot
            </text>
          </>
        )}
        
        {/* 
          MOUNTING GUIDELINES - Visual indicators
          These show proper camera mounting position
        */}
        
        {/* Mounting Bracket */}
        <rect
          x="320"
          y="55"
          width="20"
          height="4"
          fill="#888888"
          rx="2"
        />
        
        {/* Wall Mount Point */}
        <circle
          cx="345"
          cy="57"
          r="2"
          fill="#333333"
        />
        
        {/* Cable Run - Shows power/network cable path */}
        <path
          d="M 340 75 Q 350 85 350 100 Q 350 120 345 140"
          fill="none"
          stroke="#666666"
          strokeWidth="2"
          strokeDasharray="3,3"
        />
        
        {/* 
          DIMENSIONS - Scale reference
          These help users understand real-world sizing
        */}
        
        {/* Stall Width Dimension */}
        <line
          x1="50"
          y1="35"
          x2="350"
          y2="35"
          stroke="#999999"
          strokeWidth="1"
        />
        <text
          x="200"
          y="30"
          fontSize="10"
          fill="#999999"
          textAnchor="middle"
        >
          12' x 12' Standard Stall
        </text>
        
        {/* Camera Height Indicator */}
        <line
          x1="365"
          y1="70"
          x2="365"
          y2="250"
          stroke="#999999"
          strokeWidth="1"
          strokeDasharray="2,2"
        />
        <text
          x="375"
          y="160"
          fontSize="9"
          fill="#999999"
          textAnchor="start"
          transform="rotate(90, 375, 160)"
        >
          8-10 feet mounting height
        </text>
      </svg>
      
      {/* Key Points Below Diagram */}
      <Box sx={{ 
        marginTop: brandConfig.spacing.md, 
        textAlign: 'left',
        fontSize: brandConfig.typography.fontSizeSm,
        color: brandConfig.colors.neutralGray 
      }}>
        <Typography variant="caption" display="block" sx={{ marginBottom: brandConfig.spacing.xs }}>
          <strong>Key Points:</strong>
        </Typography>
        <Typography variant="caption" display="block">
          • Mount camera 8-10 feet high in corner for maximum coverage
        </Typography>
        <Typography variant="caption" display="block">
          • 160° field of view captures entire stall with minimal blind spots
        </Typography>
        <Typography variant="caption" display="block">
          • Position to see feeding area and stall door clearly
        </Typography>
        <Typography variant="caption" display="block">
          • Ensure stable WiFi signal at mounting location
        </Typography>
      </Box>
    </Box>
  );
}; 