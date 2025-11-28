import React from 'react';

// Island 19 - Palm with coconuts and beach umbrella
export const Island19 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 120 100" className={className} fill={color}>
        {/* Palm fronds */}
        <path d="M28 42 C24 35 18 33 12 35 C18 36 23 39 26 42 Z" />
        <path d="M28 42 C22 33 14 29 6 32 C16 34 23 38 27 42 Z" />
        <path d="M29 42 C26 31 20 23 12 22 C20 27 26 35 29 42 Z" />
        <path d="M30 42 C34 31 40 23 48 22 C40 27 34 35 31 42 Z" />
        <path d="M31 42 C38 33 46 29 54 32 C44 34 36 38 32 42 Z" />
        {/* Coconuts */}
        <circle cx="26" cy="44" r="3" />
        <circle cx="31" cy="45" r="3" />
        <circle cx="28" cy="48" r="3" />
        {/* Trunk */}
        <path d="M27 48 Q29 65 30 82 Q32 65 30 48 Z" />
        {/* Beach umbrella */}
        <path d="M75 50 Q85 35 95 50 Z" />
        <rect x="84" y="50" width="2" height="32" />
        {/* Beach chair */}
        <path d="M70 78 L78 68 L86 78 M72 75 L84 75" stroke={color} strokeWidth="2" fill="none" />
        {/* Ground */}
        <ellipse cx="58" cy="88" rx="50" ry="12" />
    </svg>
);

// Island 20 - Fishing pier with palm
export const Island20 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 120 100" className={className} fill={color}>
        {/* Palm */}
        <path d="M25 50 C21 43 15 41 9 43 C15 44 20 47 23 50 Z" />
        <path d="M25 50 C19 41 11 37 3 40 C13 42 20 46 24 50 Z" />
        <path d="M26 50 C23 39 17 31 9 30 C17 35 23 43 26 50 Z" />
        <path d="M27 50 C31 39 37 31 45 30 C37 35 31 43 28 50 Z" />
        <path d="M28 50 C35 41 43 37 51 40 C41 42 33 46 29 50 Z" />
        <path d="M24 50 Q26 65 27 82 Q29 65 27 50 Z" />
        {/* Pier */}
        <rect x="55" y="78" width="60" height="4" />
        <rect x="60" y="78" width="3" height="14" />
        <rect x="80" y="78" width="3" height="14" />
        <rect x="100" y="78" width="3" height="14" />
        {/* Fishing rod */}
        <path d="M95 78 L95 60 Q105 55 110 65" stroke={color} strokeWidth="2" fill="none" />
        <path d="M110 65 L110 80" stroke={color} strokeWidth="1" fill="none" strokeDasharray="2,2" />
        {/* Fish */}
        <path d="M105 85 Q110 82 115 85 Q110 88 105 85 Z" />
        {/* Ground */}
        <path d="M5 88 Q25 78 45 82 Q55 80 55 82 L55 88 Q30 94 5 88 Z" />
    </svg>
);

// Island 21 - Campfire scene
export const Island21 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 120 100" className={className} fill={color}>
        {/* Stars/Night sky dots */}
        <circle cx="20" cy="15" r="1.5" />
        <circle cx="45" cy="10" r="1" />
        <circle cx="80" cy="12" r="1.5" />
        <circle cx="100" cy="18" r="1" />
        <circle cx="65" cy="8" r="1" />
        {/* Moon */}
        <path d="M105 25 Q115 25 110 35 Q100 30 105 25 Z" />
        {/* Left palm */}
        <path d="M20 55 C17 49 12 48 7 49 C12 50 16 53 19 55 Z" />
        <path d="M20 55 C16 48 10 46 4 47 C11 49 16 52 19 55 Z" />
        <path d="M21 55 C19 47 14 42 8 41 C14 44 19 50 21 55 Z" />
        <path d="M22 55 C25 47 30 42 36 41 C30 44 25 50 22 55 Z" />
        <path d="M23 55 C27 48 34 46 40 47 C33 49 27 52 24 55 Z" />
        <path d="M19 55 Q20 70 21 82 Q23 70 21 55 Z" />
        {/* Campfire */}
        <path d="M55 82 L60 65 L65 82 Z" /> {/* Flame */}
        <path d="M52 82 L58 70 L64 82 Z" /> {/* Flame */}
        <path d="M58 82 L63 68 L68 82 Z" /> {/* Flame */}
        {/* Logs */}
        <path d="M48 84 L72 80" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <path d="M48 80 L72 84" stroke={color} strokeWidth="3" strokeLinecap="round" />
        {/* Tent */}
        <path d="M85 82 L95 55 L105 82 Z" />
        <path d="M92 82 L95 70 L98 82" stroke="white" strokeWidth="2" />
        {/* Ground */}
        <ellipse cx="60" cy="88" rx="52" ry="10" />
    </svg>
);

// Island 22 - Waterfall with rocks
export const Island22 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 120 100" className={className} fill={color}>
        {/* Cliff/Mountain with waterfall */}
        <path d="M40 90 L50 40 L70 35 L80 90 Z" />
        {/* Waterfall (white gap) */}
        <path d="M56 42 L56 75 L64 75 L64 42 Z" fill="white" />
        {/* Water lines */}
        <path d="M58 45 L58 70" stroke={color} strokeWidth="1" strokeDasharray="3,3" />
        <path d="M60 45 L60 70" stroke={color} strokeWidth="1" strokeDasharray="3,3" />
        <path d="M62 45 L62 70" stroke={color} strokeWidth="1" strokeDasharray="3,3" />
        {/* Pool at bottom */}
        <ellipse cx="60" cy="78" rx="12" ry="4" />
        <ellipse cx="60" cy="78" rx="9" ry="2.5" fill="white" />
        {/* Palm left */}
        <path d="M18 55 C15 49 10 48 5 49 C10 50 14 53 17 55 Z" />
        <path d="M18 55 C14 48 8 46 2 47 C9 49 14 52 17 55 Z" />
        <path d="M19 55 C17 47 12 42 6 41 C12 44 17 50 19 55 Z" />
        <path d="M20 55 C23 47 28 42 34 41 C28 44 23 50 20 55 Z" />
        <path d="M17 55 Q18 70 19 85 Q21 70 19 55 Z" />
        {/* Palm right */}
        <path d="M98 50 C95 44 90 43 85 44 C90 45 94 48 97 50 Z" />
        <path d="M98 50 C94 43 88 41 82 42 C89 44 94 47 97 50 Z" />
        <path d="M99 50 C97 42 92 37 86 36 C92 39 97 45 99 50 Z" />
        <path d="M100 50 C103 42 108 37 114 36 C108 39 103 45 100 50 Z" />
        <path d="M97 50 Q98 68 99 85 Q101 68 99 50 Z" />
        {/* Rocks */}
        <circle cx="28" cy="82" r="5" />
        <circle cx="92" cy="80" r="6" />
        <circle cx="85" cy="85" r="4" />
        {/* Ground */}
        <ellipse cx="60" cy="90" rx="55" ry="10" />
    </svg>
);

// Island 23 - Bridge connecting two islands
export const Island23 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 120 100" className={className} fill={color}>
        {/* Left island palm */}
        <path d="M18 50 C15 44 10 43 5 44 C10 45 14 48 17 50 Z" />
        <path d="M18 50 C14 43 8 41 2 42 C9 44 14 47 17 50 Z" />
        <path d="M19 50 C17 42 12 37 6 36 C12 39 17 45 19 50 Z" />
        <path d="M20 50 C23 42 28 37 34 36 C28 39 23 45 20 50 Z" />
        <path d="M17 50 Q18 68 19 82 Q21 68 19 50 Z" />
        {/* Right island palm */}
        <path d="M98 45 C95 39 90 38 85 39 C90 40 94 43 97 45 Z" />
        <path d="M98 45 C94 38 88 36 82 37 C89 39 94 42 97 45 Z" />
        <path d="M99 45 C97 37 92 32 86 31 C92 34 97 40 99 45 Z" />
        <path d="M100 45 C103 37 108 32 114 31 C108 34 103 40 100 45 Z" />
        <path d="M97 45 Q98 65 99 82 Q101 65 99 45 Z" />
        {/* Bridge */}
        <path d="M35 78 Q60 68 85 78" fill="none" stroke={color} strokeWidth="3" />
        {/* Bridge posts */}
        <rect x="38" y="72" width="2" height="10" />
        <rect x="50" y="70" width="2" height="12" />
        <rect x="68" y="70" width="2" height="12" />
        <rect x="80" y="72" width="2" height="10" />
        {/* Rope railings */}
        <path d="M39 72 Q60 64 81 72" fill="none" stroke={color} strokeWidth="1" />
        {/* Left island */}
        <ellipse cx="22" cy="88" rx="25" ry="10" />
        {/* Right island */}
        <ellipse cx="98" cy="88" rx="25" ry="10" />
    </svg>
);

// Island 24 - Dock with boat and seagulls
export const Island24 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 120 100" className={className} fill={color}>
        {/* Seagulls */}
        <path d="M25 20 Q30 14 35 20" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M40 25 Q45 19 50 25" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M15 28 Q20 22 25 28" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        {/* Palm */}
        <path d="M75 45 C71 38 65 36 59 38 C65 39 70 42 73 45 Z" />
        <path d="M75 45 C69 36 61 32 53 35 C63 37 70 41 74 45 Z" />
        <path d="M76 45 C73 34 67 26 59 25 C67 30 73 38 76 45 Z" />
        <path d="M77 45 C81 34 87 26 95 25 C87 30 81 38 78 45 Z" />
        <path d="M78 45 C85 36 93 32 101 35 C91 37 83 41 79 45 Z" />
        <path d="M74 45 Q76 62 77 80 Q79 62 77 45 Z" />
        {/* Dock */}
        <rect x="5" y="75" width="45" height="5" />
        <rect x="10" y="75" width="3" height="15" />
        <rect x="25" y="75" width="3" height="15" />
        <rect x="42" y="75" width="3" height="15" />
        {/* Boat at dock */}
        <path d="M8 72 Q18 78 28 72 L25 65 L11 65 Z" />
        <rect x="17" y="55" width="2" height="10" />
        <path d="M19 55 L19 62 L26 62 Z" />
        {/* Anchor */}
        <circle cx="100" cy="78" r="4" fill="none" stroke={color} strokeWidth="2" />
        <path d="M100 74 L100 68 M96 72 L104 72" stroke={color} strokeWidth="2" />
        {/* Ground */}
        <path d="M45 85 Q65 78 85 82 Q105 78 115 85 Q95 93 80 91 Q60 93 45 85 Z" />
    </svg>
);

// Island 25 - Treehouse
export const Island25 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 120 100" className={className} fill={color}>
        {/* Large tree trunk */}
        <path d="M52 85 Q55 50 58 35 Q62 50 65 85 Z" />
        {/* Tree canopy */}
        <circle cx="58" cy="28" r="18" />
        <circle cx="45" cy="35" r="12" />
        <circle cx="72" cy="35" r="12" />
        <circle cx="50" cy="22" r="10" />
        <circle cx="68" cy="22" r="10" />
        {/* Treehouse platform */}
        <rect x="40" y="48" width="38" height="4" />
        {/* Treehouse */}
        <rect x="45" y="35" width="28" height="13" />
        <path d="M43" y="35" L59 22 L75 35 Z" />
        {/* Window */}
        <rect x="55" y="40" width="8" height="6" fill="white" />
        {/* Ladder */}
        <rect x="70" y="52" width="2" height="33" />
        <rect x="76" y="52" width="2" height="33" />
        <rect x="70" y="58" width="8" height="2" />
        <rect x="70" y="66" width="8" height="2" />
        <rect x="70" y="74" width="8" height="2" />
        {/* Ground */}
        <ellipse cx="58" cy="90" rx="50" ry="10" />
    </svg>
);

// Island 26 - Windmill on hill
export const Island26 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 120 100" className={className} fill={color}>
        {/* Sun */}
        <circle cx="95" cy="20" r="10" />
        {/* Hill */}
        <path d="M10 90 Q40 55 70 60 Q100 55 115 90 Z" />
        {/* Windmill tower */}
        <path d="M52 82 L55 45 L65 45 L68 82 Z" />
        {/* Windmill blades */}
        <circle cx="60" cy="42" r="3" />
        <path d="M60 42 L60 20 L65 35 Z" />
        <path d="M60 42 L80 42 L65 47 Z" />
        <path d="M60 42 L60 64 L55 49 Z" />
        <path d="M60 42 L40 42 L55 37 Z" />
        {/* Door */}
        <path d="M57 82 L57 72 Q60 70 63 72 L63 82 Z" fill="white" />
        {/* Flowers/bushes */}
        <circle cx="25" cy="78" r="4" />
        <circle cx="30" cy="80" r="3" />
        <circle cx="90" cy="75" r="4" />
        <circle cx="95" cy="78" r="3" />
        {/* Ground */}
        <ellipse cx="60" cy="92" rx="55" ry="8" />
    </svg>
);

// Island 27 - Castle ruins on cliff
export const Island27 = ({ className = "", color = "currentColor" }) => (
    <svg viewBox="0 0 120 100" className={className} fill={color}>
        {/* Birds */}
        <path d="M20 18 Q24 12 28 18" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        <path d="M35 22 Q39 16 43 22" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
        {/* Cliff */}
        <path d="M25 90 L35 50 L95 50 L105 90 Z" />
        {/* Castle tower left */}
        <rect x="40" y="25" width="15" height="25" />
        <rect x="38" y="20" width="4" height="8" />
        <rect x="44" y="20" width="4" height="8" />
        <rect x="50" y="20" width="4" height="8" />
        {/* Castle tower right */}
        <rect x="70" y="30" width="15" height="20" />
        <rect x="68" y="25" width="4" height="8" />
        <rect x="74" y="25" width="4" height="8" />
        <rect x="80" y="25" width="4" height="8" />
        {/* Castle wall */}
        <rect x="55" y="38" width="15" height="12" />
        {/* Windows */}
        <rect x="45" y="35" width="5" height="8" fill="white" />
        <rect x="75" y="38" width="5" height="6" fill="white" />
        {/* Flag */}
        <rect x="47" y="10" width="2" height="12" />
        <path d="M49 10 L58 14 L49 18 Z" />
        {/* Palm at base */}
        <path d="M15 65 C13 60 9 59 5 60 C9 61 12 63 14 65 Z" />
        <path d="M15 65 C12 59 7 57 2 58 C8 60 12 63 14 65 Z" />
        <path d="M16 65 C14 58 10 53 5 52 C10 55 14 60 16 65 Z" />
        <path d="M17 65 C19 58 23 53 28 52 C23 55 19 60 17 65 Z" />
        <path d="M14 65 Q15 77 16 85 Q18 77 16 65 Z" />
        {/* Ground */}
        <ellipse cx="60" cy="92" rx="55" ry="8" />
    </svg>
);

// Export all islands
export const AllIslands3 = [Island19, Island20, Island21, Island22, Island23, Island24, Island25, Island26, Island27];

export default { Island19, Island20, Island21, Island22, Island23, Island24, Island25, Island26, Island27, AllIslands3 };