import React from 'react';

// Island 1 - Two palm trees on round mound (top-left)
export const Island1 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 120 100" className={className} fill={color}>
        {/* Left palm tree */}
        <path d="M35 55 C32 45 25 42 18 44 C25 46 30 50 32 54 C28 45 20 40 12 42 C22 45 28 50 32 56 C30 48 22 38 14 36 C24 42 30 50 33 56 C36 48 42 38 50 36 C42 42 36 50 35 56 C40 48 50 40 58 42 C48 45 40 52 36 56 L35 58" />
        <path d="M33 58 Q35 72 33 82" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round"/>
        {/* Right palm tree */}
        <path d="M75 48 C72 38 65 35 58 37 C65 39 70 43 72 47 C68 38 60 33 52 35 C62 38 68 43 72 49 C70 41 62 31 54 29 C64 35 70 43 73 49 C76 41 82 31 90 29 C82 35 76 43 75 49 C80 41 90 33 98 35 C88 38 80 45 76 49 L75 51" />
        <path d="M73 51 Q75 68 73 82" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round"/>
        {/* Ground mound */}
        <ellipse cx="55" cy="88" rx="48" ry="12" />
    </svg>
);

// Island 2 - Two tall palms on flat island (top-center)
export const Island2 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 120 100" className={className} fill={color}>
        {/* Left palm tree */}
        <path d="M38 42 C35 32 28 29 21 31 C28 33 33 37 35 41 C31 32 23 27 15 29 C25 32 31 37 35 43 C33 35 25 25 17 23 C27 29 33 37 36 43 C39 35 45 25 53 23 C45 29 39 37 38 43 C43 35 53 27 61 29 C51 32 43 39 39 43 L38 45" />
        <path d="M36 45 Q38 65 36 85" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round"/>
        {/* Right palm tree */}
        <path d="M78 35 C75 25 68 22 61 24 C68 26 73 30 75 34 C71 25 63 20 55 22 C65 25 71 30 75 36 C73 28 65 18 57 16 C67 22 73 30 76 36 C79 28 85 18 93 16 C85 22 79 30 78 36 C83 28 93 20 101 22 C91 25 83 32 79 36 L78 38" />
        <path d="M76 38 Q78 62 76 85" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round"/>
        {/* Ground - irregular flat island */}
        <path d="M8 88 Q25 78 45 82 Q60 76 80 82 Q100 78 112 88 Q90 96 60 94 Q30 96 8 88 Z" />
    </svg>
);

// Island 3 - Palm with sun, mountain, and birds (top-right)
export const Island3 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 120 100" className={className} fill={color}>
        {/* Sun */}
        <circle cx="100" cy="18" r="14" />
        {/* Birds */}
        <path d="M58 38 Q62 32 66 38" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M70 45 Q74 39 78 45" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M50 48 Q54 42 58 48" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        {/* Mountain */}
        <path d="M50 90 L78 40 L106 90 Z" />
        {/* Palm tree */}
        <path d="M28 50 C25 40 18 37 11 39 C18 41 23 45 25 49 C21 40 13 35 5 37 C15 40 21 45 25 51 C23 43 15 33 7 31 C17 37 23 45 26 51 C29 43 35 33 43 31 C35 37 29 45 28 51 C33 43 43 35 51 37 C41 40 33 47 29 51 L28 53" />
        <path d="M26 53 Q28 70 26 85" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round"/>
        {/* Ground */}
        <ellipse cx="50" cy="92" rx="45" ry="8" />
    </svg>
);

// Island 4 - Two palms on mound (middle-left)
export const Island4 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 120 100" className={className} fill={color}>
        {/* Left palm tree */}
        <path d="M35 48 C32 38 25 35 18 37 C25 39 30 43 32 47 C28 38 20 33 12 35 C22 38 28 43 32 49 C30 41 22 31 14 29 C24 35 30 43 33 49 C36 41 42 31 50 29 C42 35 36 43 35 49 C40 41 50 33 58 35 C48 38 40 45 36 49 L35 51" />
        <path d="M33 51 Q35 68 33 82" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round"/>
        {/* Right palm tree */}
        <path d="M75 42 C72 32 65 29 58 31 C65 33 70 37 72 41 C68 32 60 27 52 29 C62 32 68 37 72 43 C70 35 62 25 54 23 C64 29 70 37 73 43 C76 35 82 25 90 23 C82 29 76 37 75 43 C80 35 90 27 98 29 C88 32 80 39 76 43 L75 45" />
        <path d="M73 45 Q75 65 73 82" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round"/>
        {/* Ground mound */}
        <ellipse cx="55" cy="88" rx="45" ry="12" />
    </svg>
);

// Island 5 - Two palms different heights (middle-center)
export const Island5 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 120 100" className={className} fill={color}>
        {/* Left taller palm tree */}
        <path d="M38 38 C35 28 28 25 21 27 C28 29 33 33 35 37 C31 28 23 23 15 25 C25 28 31 33 35 39 C33 31 25 21 17 19 C27 25 33 33 36 39 C39 31 45 21 53 19 C45 25 39 33 38 39 C43 31 53 23 61 25 C51 28 43 35 39 39 L38 41" />
        <path d="M36 41 Q38 65 36 85" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round"/>
        {/* Right shorter palm tree */}
        <path d="M82 52 C79 44 73 41 67 43 C73 45 77 48 79 51 C76 44 69 40 63 42 C71 44 76 48 79 53 C77 47 71 39 65 38 C73 42 78 48 80 53 C82 47 87 39 93 38 C87 42 82 48 81 53 C85 47 92 41 98 43 C90 45 84 50 81 53 L80 55" />
        <path d="M79 55 Q80 72 79 85" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
        {/* Ground - flat irregular */}
        <path d="M8 88 Q25 78 45 82 Q60 76 80 82 Q100 78 112 88 Q90 96 60 94 Q30 96 8 88 Z" />
    </svg>
);

// Island 6 - Mountain with palm and sun (middle-right)
export const Island6 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 120 100" className={className} fill={color}>
        {/* Sun */}
        <circle cx="102" cy="18" r="12" />
        {/* Bird */}
        <path d="M78 32 Q82 26 86 32" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        {/* Large mountain */}
        <path d="M18 90 L58 22 L98 90 Z" />
        {/* Small palm tree on right */}
        <path d="M100 58 C98 51 93 49 88 50 C93 52 96 55 97 57 C95 51 89 48 84 49 C90 51 94 55 96 58 C95 53 90 47 86 46 C91 49 95 54 97 58 C98 53 102 47 107 46 C103 49 99 54 99 58 C101 53 106 48 110 50 C105 52 101 56 99 58 L99 60" />
        <path d="M98 60 Q99 75 98 88" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
        {/* Ground */}
        <ellipse cx="58" cy="92" rx="52" ry="8" />
    </svg>
);

// Island 7 - Three palms with signposts (bottom-left)
export const Island7 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 120 100" className={className} fill={color}>
        {/* Left small palm */}
        <path d="M22 55 C20 48 15 46 10 47 C15 49 18 52 19 54 C17 48 12 45 7 46 C13 48 17 52 19 55 C18 50 13 45 9 44 C14 47 18 52 20 55 C21 50 25 45 30 44 C26 47 22 52 21 55 C24 50 29 46 33 47 C28 49 24 53 22 55 L21 57" />
        <path d="M20 57 Q21 72 20 82" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
        {/* Center tall palm */}
        <path d="M55 38 C52 28 45 25 38 27 C45 29 50 33 52 37 C48 28 40 23 32 25 C42 28 48 33 52 39 C50 31 42 21 34 19 C44 25 50 33 53 39 C56 31 62 21 70 19 C62 25 56 33 55 39 C60 31 70 23 78 25 C68 28 60 35 56 39 L55 41" />
        <path d="M53 41 Q55 65 53 82" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round"/>
        {/* Right small palm */}
        <path d="M92 55 C90 48 85 46 80 47 C85 49 88 52 89 54 C87 48 82 45 77 46 C83 48 87 52 89 55 C88 50 83 45 79 44 C84 47 88 52 90 55 C91 50 95 45 100 44 C96 47 92 52 91 55 C94 50 99 46 103 47 C98 49 94 53 92 55 L91 57" />
        <path d="M90 57 Q91 72 90 82" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
        {/* Signpost left */}
        <rect x="35" y="68" width="2.5" height="18" />
        <path d="M28 70 L37.5 70 L37.5 75 L28 75 Z" />
        {/* Signpost right */}
        <rect x="72" y="66" width="2.5" height="20" />
        <path d="M65 68 L74.5 68 L74.5 73 L65 73 Z" />
        {/* Ground mound */}
        <ellipse cx="58" cy="90" rx="50" ry="12" />
    </svg>
);

// Island 8 - Palm with rock/mountain and birds (bottom-center)
export const Island8 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 120 100" className={className} fill={color}>
        {/* Birds */}
        <path d="M48 28 Q52 22 56 28" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M60 35 Q64 29 68 35" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        {/* Left palm tree */}
        <path d="M28 50 C25 40 18 37 11 39 C18 41 23 45 25 49 C21 40 13 35 5 37 C15 40 21 45 25 51 C23 43 15 33 7 31 C17 37 23 45 26 51 C29 43 35 33 43 31 C35 37 29 45 28 51 C33 43 43 35 51 37 C41 40 33 47 29 51 L28 53" />
        <path d="M26 53 Q28 70 26 85" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round"/>
        {/* Rock/Mountain in center */}
        <path d="M50 90 Q55 60 72 52 Q89 60 94 90 Z" />
        {/* Right small palm */}
        <path d="M100 58 C98 51 93 49 88 50 C93 52 96 55 97 57 C95 51 89 48 84 49 C90 51 94 55 96 58 C95 53 90 47 86 46 C91 49 95 54 97 58 C98 53 102 47 107 46 C103 49 99 54 99 58 C101 53 106 48 110 50 C105 52 101 56 99 58 L99 60" />
        <path d="M98 60 Q99 75 98 88" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
        {/* Ground */}
        <ellipse cx="60" cy="92" rx="52" ry="8" />
    </svg>
);

// Island 9 - Three palms with sun and grass (bottom-right)
export const Island9 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 120 100" className={className} fill={color}>
        {/* Sun */}
        <circle cx="102" cy="18" r="12" />
        {/* Left palm tree */}
        <path d="M22 55 C20 48 15 46 10 47 C15 49 18 52 19 54 C17 48 12 45 7 46 C13 48 17 52 19 55 C18 50 13 45 9 44 C14 47 18 52 20 55 C21 50 25 45 30 44 C26 47 22 52 21 55 C24 50 29 46 33 47 C28 49 24 53 22 55 L21 57" />
        <path d="M20 57 Q21 72 20 85" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
        {/* Center taller palm */}
        <path d="M55 38 C52 28 45 25 38 27 C45 29 50 33 52 37 C48 28 40 23 32 25 C42 28 48 33 52 39 C50 31 42 21 34 19 C44 25 50 33 53 39 C56 31 62 21 70 19 C62 25 56 33 55 39 C60 31 70 23 78 25 C68 28 60 35 56 39 L55 41" />
        <path d="M53 41 Q55 65 53 85" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round"/>
        {/* Right palm tree */}
        <path d="M88 50 C86 42 80 39 74 41 C80 43 84 47 86 50 C83 42 76 38 70 40 C77 42 82 47 85 51 C84 45 78 38 73 37 C79 40 84 46 86 51 C88 45 92 38 98 37 C93 40 88 46 88 51 C91 45 97 40 102 41 C96 43 91 48 89 51 L88 53" />
        <path d="M87 53 Q88 72 87 85" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
        {/* Ground with grass texture */}
        <ellipse cx="55" cy="90" rx="50" ry="12" />
        {/* Small grass tufts */}
        <path d="M30 87 L32 82 L34 87 M48 86 L50 81 L52 86 M68 86 L70 81 L72 86 M85 87 L87 82 L89 87" />
    </svg>
);

// Export all islands as an array for easy iteration
export const AllIslands = [Island1, Island2, Island3, Island4, Island5, Island6, Island7, Island8, Island9];

export default { Island1, Island2, Island3, Island4, Island5, Island6, Island7, Island8, Island9, AllIslands };