import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import './gradient.css'; // Ensure this file contains the .centered-element class

function GradientCircularProgress() {
    return (
        <div className="centered-element">
            <svg width={0} height={0}>
                <defs>
                    <linearGradient id="my_gradient" x1="0%" y1="0%" x2="100%">
                        <stop offset="0%" style={{stopColor: '#9c2ce6', stopOpacity: 1}}/>
                        <stop offset="33%" style={{stopColor: '#4b26f1', stopOpacity: 1}}/>
                        <stop offset="66%" style={{stopColor: '#2df8d3', stopOpacity: 1}}/>
                        <stop offset="100%" style={{stopColor: '#affa69', stopOpacity: 1}}/>
                    </linearGradient>
                </defs>
            </svg>
            <CircularProgress size={66} sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
        </div>
    );
}

export default GradientCircularProgress;