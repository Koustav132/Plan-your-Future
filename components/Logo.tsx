
import React from 'react';

interface LogoProps {
  className?: string;
  color?: string;
  secondaryColor?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = "w-10 h-10", 
  color = "currentColor",
  secondaryColor = "#f59e0b"
}) => {
  return (
    <svg 
      viewBox="0 0 400 400" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Majestic Symmetrical Eagle Silhouette */}
      <path 
        d="M200 135C200 135 185 155 185 165C185 175 190 180 200 180C210 180 215 175 215 165C215 155 200 135 200 135Z" 
        fill={color} 
      />
      
      {/* Head Detail */}
      <path 
        d="M200 130C190 130 185 138 185 145C185 150 190 155 200 155C210 155 215 150 215 145C215 138 210 130 200 130Z" 
        fill={color} 
      />
      
      {/* Wings - Left */}
      <path 
        d="M180 170C150 140 100 100 100 100C130 130 160 180 170 210C180 240 190 260 195 280C170 240 160 220 160 220L120 180C120 180 150 220 175 250L185 270L190 230L170 200L180 170Z" 
        fill={color} 
      />
      
      {/* Wings - Right */}
      <path 
        d="M220 170C250 140 300 100 300 100C270 130 240 180 230 210C220 240 210 260 205 280C230 240 240 220 240 220L280 180C280 180 250 220 225 250L215 270L210 230L230 200L220 170Z" 
        fill={color} 
      />
      
      {/* Tail Feathers */}
      <path 
        d="M200 280L180 320C180 320 190 340 200 340C210 340 220 320 220 320L200 280Z" 
        fill={color} 
      />
      <path 
        d="M185 290L165 315C165 315 175 330 185 330L185 290Z" 
        fill={color} 
        opacity="0.8"
      />
      <path 
        d="M215 290L235 315C235 315 225 330 215 330L215 290Z" 
        fill={color} 
        opacity="0.8"
      />
      
      {/* Chest detail V-shape */}
      <path 
        d="M200 190L175 240L200 270L225 240L200 190Z" 
        fill={color} 
        stroke={color} 
        strokeWidth="2"
      />
    </svg>
  );
};
