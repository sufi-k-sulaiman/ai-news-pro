import React from 'react';

// Island 1 - Two palm trees on round mound (top-left)
export const Island1 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 100 80" className={className} fill={color}>
        {/* Left palm tree */}
        <g transform="translate(25, 10)">
            {/* Fronds */}
            <path d="M12 30 Q8 20 -5 18 Q5 22 8 28 Q4 15 -8 12 Q5 18 10 26 Q8 12 -2 5 Q10 15 12 24 Q15 10 25 5 Q15 15 14 24 Q20 12 30 10 Q18 18 15 26 Q25 18 32 18 Q20 22 14 28 L12 30" />
            {/* Trunk */}
            <path d="M10 30 Q12 45 10 55" stroke={color} strokeWidth="4" fill="none" />
        </g>
        {/* Right palm tree */}
        <g transform="translate(55, 5)">
            {/* Fronds */}
            <path d="M12 25 Q8 15 -5 13 Q5 17 8 23 Q4 10 -8 7 Q5 13 10 21 Q8 7 -2 0 Q10 10 12 19 Q15 5 25 0 Q15 10 14 19 Q20 7 30 5 Q18 13 15 21 Q25 13 32 13 Q20 17 14 23 L12 25" />
            {/* Trunk */}
            <path d="M10 25 Q12 40 10 55" stroke={color} strokeWidth="4" fill="none" />
        </g>
        {/* Ground mound */}
        <ellipse cx="50" cy="68" rx="42" ry="12" />
    </svg>
);

// Island 2 - Two tall palms on flat island (top-center)
export const Island2 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 100 80" className={className} fill={color}>
        {/* Left palm tree */}
        <g transform="translate(22, 5)">
            <path d="M12 22 Q8 12 -5 10 Q5 14 8 20 Q4 7 -8 4 Q5 10 10 18 Q8 4 -2 -3 Q10 7 12 16 Q15 2 25 -3 Q15 7 14 16 Q20 4 30 2 Q18 10 15 18 Q25 10 32 10 Q20 14 14 20 L12 22" />
            <path d="M10 22 Q12 40 10 58" stroke={color} strokeWidth="4" fill="none" />
        </g>
        {/* Right palm tree */}
        <g transform="translate(58, 0)">
            <path d="M12 22 Q8 12 -5 10 Q5 14 8 20 Q4 7 -8 4 Q5 10 10 18 Q8 4 -2 -3 Q10 7 12 16 Q15 2 25 -3 Q15 7 14 16 Q20 4 30 2 Q18 10 15 18 Q25 10 32 10 Q20 14 14 20 L12 22" />
            <path d="M10 22 Q12 42 10 60" stroke={color} strokeWidth="4" fill="none" />
        </g>
        {/* Ground - irregular flat island */}
        <path d="M5 68 Q15 60 35 62 Q50 58 70 62 Q90 60 95 68 Q80 75 50 73 Q20 75 5 68 Z" />
    </svg>
);

// Island 3 - Palm with sun, mountain, and birds (top-right)
export const Island3 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 100 80" className={className} fill={color}>
        {/* Sun */}
        <circle cx="85" cy="12" r="10" />
        {/* Birds */}
        <path d="M55 28 Q58 24 61 28" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M65 35 Q68 31 71 35" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M50 38 Q53 34 56 38" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        {/* Mountain */}
        <path d="M45 70 L70 30 L95 70 Z" />
        {/* Palm tree */}
        <g transform="translate(8, 15)">
            <path d="M12 22 Q8 12 -5 10 Q5 14 8 20 Q4 7 -8 4 Q5 10 10 18 Q8 4 -2 -3 Q10 7 12 16 Q15 2 25 -3 Q15 7 14 16 Q20 4 30 2 Q18 10 15 18 Q25 10 32 10 Q20 14 14 20 L12 22" />
            <path d="M10 22 Q12 38 10 52" stroke={color} strokeWidth="4" fill="none" />
        </g>
        {/* Ground */}
        <ellipse cx="45" cy="72" rx="40" ry="8" />
    </svg>
);

// Island 4 - Two palms leaning on mound (middle-left)
export const Island4 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 100 80" className={className} fill={color}>
        {/* Left palm tree */}
        <g transform="translate(20, 8)">
            <path d="M12 22 Q8 12 -5 10 Q5 14 8 20 Q4 7 -8 4 Q5 10 10 18 Q8 4 -2 -3 Q10 7 12 16 Q15 2 25 -3 Q15 7 14 16 Q20 4 30 2 Q18 10 15 18 Q25 10 32 10 Q20 14 14 20 L12 22" />
            <path d="M10 22 Q12 38 10 52" stroke={color} strokeWidth="4" fill="none" />
        </g>
        {/* Right palm tree */}
        <g transform="translate(52, 5)">
            <path d="M12 22 Q8 12 -5 10 Q5 14 8 20 Q4 7 -8 4 Q5 10 10 18 Q8 4 -2 -3 Q10 7 12 16 Q15 2 25 -3 Q15 7 14 16 Q20 4 30 2 Q18 10 15 18 Q25 10 32 10 Q20 14 14 20 L12 22" />
            <path d="M10 22 Q12 40 10 55" stroke={color} strokeWidth="4" fill="none" />
        </g>
        {/* Ground mound */}
        <ellipse cx="50" cy="68" rx="38" ry="12" />
    </svg>
);

// Island 5 - Two palms different heights (middle-center)
export const Island5 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 100 80" className={className} fill={color}>
        {/* Left taller palm tree */}
        <g transform="translate(22, 2)">
            <path d="M12 22 Q8 12 -5 10 Q5 14 8 20 Q4 7 -8 4 Q5 10 10 18 Q8 4 -2 -3 Q10 7 12 16 Q15 2 25 -3 Q15 7 14 16 Q20 4 30 2 Q18 10 15 18 Q25 10 32 10 Q20 14 14 20 L12 22" />
            <path d="M10 22 Q12 42 10 58" stroke={color} strokeWidth="4" fill="none" />
        </g>
        {/* Right shorter palm tree */}
        <g transform="translate(55, 12)">
            <path d="M10 18 Q7 10 -3 8 Q4 11 7 16 Q4 6 -5 3 Q4 8 8 15 Q7 4 0 -1 Q8 6 10 13 Q12 2 20 -1 Q13 6 11 13 Q17 4 24 3 Q15 9 12 15 Q20 9 26 9 Q17 12 11 17 L10 18" />
            <path d="M8 18 Q10 35 8 48" stroke={color} strokeWidth="3.5" fill="none" />
        </g>
        {/* Ground - flat irregular */}
        <path d="M8 68 Q20 60 40 63 Q55 58 75 63 Q92 60 95 68 Q80 75 50 73 Q20 75 8 68 Z" />
    </svg>
);

// Island 6 - Mountain with palm and sun (middle-right)
export const Island6 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 100 80" className={className} fill={color}>
        {/* Sun */}
        <circle cx="88" cy="12" r="8" />
        {/* Bird */}
        <path d="M70 25 Q73 21 76 25" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        {/* Large mountain */}
        <path d="M15 72 L50 15 L85 72 Z" />
        {/* Small palm tree on right */}
        <g transform="translate(75, 30)">
            <path d="M8 15 Q5 8 -2 6 Q4 9 6 13 Q4 5 -3 2 Q4 6 7 12 Q6 3 1 -1 Q7 5 8 11 Q10 2 16 -1 Q11 5 9 11 Q14 4 19 3 Q13 8 10 13 Q16 8 20 8 Q14 10 9 14 L8 15" />
            <path d="M7 15 Q8 28 7 38" stroke={color} strokeWidth="3" fill="none" />
        </g>
        {/* Ground */}
        <ellipse cx="50" cy="74" rx="45" ry="6" />
    </svg>
);

// Island 7 - Three palms with signposts (bottom-left)
export const Island7 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 100 80" className={className} fill={color}>
        {/* Left small palm */}
        <g transform="translate(12, 20)">
            <path d="M8 15 Q5 8 -2 6 Q4 9 6 13 Q4 5 -3 2 Q4 6 7 12 Q6 3 1 -1 Q7 5 8 11 Q10 2 16 -1 Q11 5 9 11 Q14 4 19 3 Q13 8 10 13 Q16 8 20 8 Q14 10 9 14 L8 15" />
            <path d="M7 15 Q8 30 7 40" stroke={color} strokeWidth="3" fill="none" />
        </g>
        {/* Center tall palm */}
        <g transform="translate(38, 5)">
            <path d="M12 22 Q8 12 -5 10 Q5 14 8 20 Q4 7 -8 4 Q5 10 10 18 Q8 4 -2 -3 Q10 7 12 16 Q15 2 25 -3 Q15 7 14 16 Q20 4 30 2 Q18 10 15 18 Q25 10 32 10 Q20 14 14 20 L12 22" />
            <path d="M10 22 Q12 40 10 55" stroke={color} strokeWidth="4" fill="none" />
        </g>
        {/* Right small palm */}
        <g transform="translate(70, 25)">
            <path d="M8 15 Q5 8 -2 6 Q4 9 6 13 Q4 5 -3 2 Q4 6 7 12 Q6 3 1 -1 Q7 5 8 11 Q10 2 16 -1 Q11 5 9 11 Q14 4 19 3 Q13 8 10 13 Q16 8 20 8 Q14 10 9 14 L8 15" />
            <path d="M7 15 Q8 28 7 35" stroke={color} strokeWidth="3" fill="none" />
        </g>
        {/* Signpost left */}
        <rect x="28" y="52" width="2" height="16" />
        <path d="M22 54 L30 54 L30 58 L22 58 Z" />
        {/* Signpost right */}
        <rect x="62" y="50" width="2" height="18" />
        <path d="M56 52 L64 52 L64 56 L56 56 Z" />
        {/* Ground mound */}
        <ellipse cx="50" cy="70" rx="42" ry="10" />
    </svg>
);

// Island 8 - Palm with rock/mountain and birds (bottom-center)
export const Island8 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 100 80" className={className} fill={color}>
        {/* Birds */}
        <path d="M45 20 Q48 16 51 20" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M55 25 Q58 21 61 25" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        {/* Left palm tree */}
        <g transform="translate(10, 15)">
            <path d="M12 22 Q8 12 -5 10 Q5 14 8 20 Q4 7 -8 4 Q5 10 10 18 Q8 4 -2 -3 Q10 7 12 16 Q15 2 25 -3 Q15 7 14 16 Q20 4 30 2 Q18 10 15 18 Q25 10 32 10 Q20 14 14 20 L12 22" />
            <path d="M10 22 Q12 38 10 48" stroke={color} strokeWidth="4" fill="none" />
        </g>
        {/* Rock/Mountain in center */}
        <path d="M40 70 Q45 45 60 40 Q75 45 80 70 Z" />
        {/* Right small palm */}
        <g transform="translate(72, 25)">
            <path d="M8 15 Q5 8 -2 6 Q4 9 6 13 Q4 5 -3 2 Q4 6 7 12 Q6 3 1 -1 Q7 5 8 11 Q10 2 16 -1 Q11 5 9 11 Q14 4 19 3 Q13 8 10 13 Q16 8 20 8 Q14 10 9 14 L8 15" />
            <path d="M7 15 Q8 30 7 42" stroke={color} strokeWidth="3" fill="none" />
        </g>
        {/* Ground */}
        <ellipse cx="50" cy="72" rx="45" ry="8" />
    </svg>
);

// Island 9 - Three palms with sun (bottom-right)
export const Island9 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 100 80" className={className} fill={color}>
        {/* Sun */}
        <circle cx="88" cy="12" r="8" />
        {/* Left palm tree */}
        <g transform="translate(5, 15)">
            <path d="M10 18 Q7 10 -3 8 Q4 11 7 16 Q4 6 -5 3 Q4 8 8 15 Q7 4 0 -1 Q8 6 10 13 Q12 2 20 -1 Q13 6 11 13 Q17 4 24 3 Q15 9 12 15 Q20 9 26 9 Q17 12 11 17 L10 18" />
            <path d="M8 18 Q10 35 8 48" stroke={color} strokeWidth="3.5" fill="none" />
        </g>
        {/* Center taller palm */}
        <g transform="translate(32, 5)">
            <path d="M12 22 Q8 12 -5 10 Q5 14 8 20 Q4 7 -8 4 Q5 10 10 18 Q8 4 -2 -3 Q10 7 12 16 Q15 2 25 -3 Q15 7 14 16 Q20 4 30 2 Q18 10 15 18 Q25 10 32 10 Q20 14 14 20 L12 22" />
            <path d="M10 22 Q12 42 10 58" stroke={color} strokeWidth="4" fill="none" />
        </g>
        {/* Right palm tree */}
        <g transform="translate(62, 10)">
            <path d="M10 18 Q7 10 -3 8 Q4 11 7 16 Q4 6 -5 3 Q4 8 8 15 Q7 4 0 -1 Q8 6 10 13 Q12 2 20 -1 Q13 6 11 13 Q17 4 24 3 Q15 9 12 15 Q20 9 26 9 Q17 12 11 17 L10 18" />
            <path d="M8 18 Q10 38 8 52" stroke={color} strokeWidth="3.5" fill="none" />
        </g>
        {/* Ground with grass texture */}
        <ellipse cx="50" cy="70" rx="45" ry="10" />
        {/* Small grass tufts */}
        <path d="M25 67 L27 62 L29 67 M40 66 L42 61 L44 66 M60 66 L62 61 L64 66 M75 67 L77 62 L79 67" />
    </svg>
);

// Export all islands as an array for easy iteration
export const AllIslands = [Island1, Island2, Island3, Island4, Island5, Island6, Island7, Island8, Island9];

export default { Island1, Island2, Island3, Island4, Island5, Island6, Island7, Island8, Island9, AllIslands };