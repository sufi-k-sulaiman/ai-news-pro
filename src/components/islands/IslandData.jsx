// 10 unique island configurations
export const ISLANDS = [
    {
        id: 1,
        name: 'Technical Track',
        shape: 'M50,150 Q30,100 80,60 Q150,20 250,50 Q320,70 350,120 Q380,180 340,240 Q300,300 220,320 Q140,340 80,300 Q20,260 50,200 Q40,170 50,150 Z',
        ponds: [
            { path: 'M180,100 Q220,80 260,100 Q280,130 260,160 Q220,180 180,160 Q160,130 180,100 Z', name: 'Crystal Lake' },
            { path: 'M120,220 Q160,200 180,230 Q170,270 130,280 Q90,260 120,220 Z', name: 'Echo Pond' }
        ],
        rivers: ['M260,160 Q280,200 260,240 Q240,280 220,320'],
        trees: [
            { x: 15, y: 25 }, { x: 25, y: 45 }, { x: 70, y: 20 }, { x: 80, y: 55 },
            { x: 45, y: 70 }, { x: 60, y: 85 }, { x: 85, y: 75 }
        ],
        elements: [
            { type: 'house', x: 20, y: 15, status: 'completed', label: 'HQ Building' },
            { type: 'house', x: 35, y: 30, status: 'pending', label: 'Data Center' },
            { type: 'house', x: 55, y: 18, status: 'completed', label: 'Research Lab' },
            { type: 'house', x: 75, y: 35, status: 'pending', label: 'Training Center' },
            { type: 'house', x: 20, y: 55, status: 'completed', label: 'Server Room' },
            { type: 'house', x: 45, y: 48, status: 'pending', label: 'Workshop' },
            { type: 'house', x: 65, y: 60, status: 'completed', label: 'Innovation Hub' },
            { type: 'house', x: 25, y: 78, status: 'completed', label: 'Storage Facility' },
            { type: 'house', x: 50, y: 85, status: 'pending', label: 'Meeting Hall' }
        ]
    },
    {
        id: 2,
        name: 'Admin Track',
        shape: 'M200,30 Q280,20 340,60 Q390,110 380,180 Q370,250 320,300 Q260,340 180,330 Q100,320 50,270 Q10,210 30,140 Q50,70 120,40 Q160,30 200,30 Z',
        ponds: [
            { path: 'M150,120 Q200,90 250,120 Q280,170 250,220 Q200,250 150,220 Q120,170 150,120 Z', name: 'Central Lagoon' },
            { path: 'M280,180 Q310,160 330,190 Q320,230 290,230 Q260,210 280,180 Z', name: 'East Pool' }
        ],
        rivers: ['M50,200 Q100,180 150,200', 'M330,190 Q350,220 340,260'],
        trees: [
            { x: 12, y: 35 }, { x: 22, y: 55 }, { x: 75, y: 25 }, { x: 85, y: 45 },
            { x: 30, y: 75 }, { x: 70, y: 80 }
        ],
        elements: [
            { type: 'house', x: 25, y: 20, status: 'completed', label: 'Admin Office' },
            { type: 'house', x: 50, y: 15, status: 'pending', label: 'HR Department' },
            { type: 'house', x: 75, y: 22, status: 'completed', label: 'Finance Wing' },
            { type: 'house', x: 15, y: 45, status: 'pending', label: 'Legal Suite' },
            { type: 'house', x: 82, y: 48, status: 'completed', label: 'Executive Tower' },
            { type: 'house', x: 20, y: 70, status: 'completed', label: 'Records Hall' },
            { type: 'house', x: 45, y: 82, status: 'pending', label: 'Audit Center' },
            { type: 'house', x: 70, y: 75, status: 'completed', label: 'Compliance Office' }
        ]
    },
    {
        id: 3,
        name: 'Security Island',
        shape: 'M100,50 Q200,10 300,50 Q370,100 360,180 Q350,260 280,310 Q200,350 120,310 Q50,260 40,180 Q30,100 100,50 Z',
        ponds: [
            { path: 'M160,140 Q200,120 240,140 Q260,180 240,220 Q200,240 160,220 Q140,180 160,140 Z', name: 'Guard Lake' }
        ],
        rivers: ['M200,240 Q180,280 200,320'],
        trees: [
            { x: 18, y: 30 }, { x: 28, y: 50 }, { x: 72, y: 30 }, { x: 82, y: 50 },
            { x: 20, y: 70 }, { x: 80, y: 70 }, { x: 50, y: 25 }
        ],
        elements: [
            { type: 'house', x: 30, y: 20, status: 'completed', label: 'Watchtower Alpha' },
            { type: 'house', x: 70, y: 20, status: 'completed', label: 'Watchtower Beta' },
            { type: 'house', x: 50, y: 35, status: 'pending', label: 'Command Center' },
            { type: 'house', x: 20, y: 50, status: 'completed', label: 'Patrol Station 1' },
            { type: 'house', x: 80, y: 50, status: 'pending', label: 'Patrol Station 2' },
            { type: 'house', x: 35, y: 70, status: 'completed', label: 'Armory' },
            { type: 'house', x: 65, y: 70, status: 'completed', label: 'Barracks' },
            { type: 'house', x: 50, y: 85, status: 'pending', label: 'Emergency Bunker' }
        ]
    },
    {
        id: 4,
        name: 'Innovation Bay',
        shape: 'M80,80 Q150,30 250,40 Q340,50 370,130 Q390,210 350,280 Q290,340 180,330 Q80,320 40,250 Q10,180 40,110 Q60,60 80,80 Z',
        ponds: [
            { path: 'M200,150 Q250,130 280,160 Q290,210 250,240 Q200,250 170,220 Q160,180 200,150 Z', name: 'Think Tank' },
            { path: 'M80,180 Q110,160 130,190 Q120,230 90,230 Q60,210 80,180 Z', name: 'Idea Pool' }
        ],
        rivers: ['M280,160 Q310,180 320,220', 'M130,190 Q160,200 170,220'],
        trees: [
            { x: 15, y: 35 }, { x: 85, y: 25 }, { x: 25, y: 60 }, { x: 75, y: 65 },
            { x: 45, y: 80 }, { x: 55, y: 20 }
        ],
        elements: [
            { type: 'house', x: 25, y: 25, status: 'pending', label: 'Prototype Lab' },
            { type: 'house', x: 55, y: 18, status: 'completed', label: 'Design Studio' },
            { type: 'house', x: 80, y: 30, status: 'completed', label: 'Tech Workshop' },
            { type: 'house', x: 18, y: 50, status: 'completed', label: 'Maker Space' },
            { type: 'house', x: 82, y: 55, status: 'pending', label: 'Testing Facility' },
            { type: 'house', x: 30, y: 75, status: 'completed', label: 'Incubator' },
            { type: 'house', x: 60, y: 80, status: 'pending', label: 'Launch Pad' }
        ]
    },
    {
        id: 5,
        name: 'Learning Archipelago',
        shape: 'M60,100 Q100,40 200,30 Q300,20 350,80 Q390,150 370,230 Q340,300 260,330 Q160,350 80,300 Q20,250 30,170 Q35,120 60,100 Z',
        ponds: [
            { path: 'M150,130 Q190,110 230,130 Q250,170 230,210 Q190,230 150,210 Q130,170 150,130 Z', name: 'Knowledge Lake' }
        ],
        rivers: ['M230,210 Q250,250 240,290'],
        trees: [
            { x: 12, y: 40 }, { x: 22, y: 60 }, { x: 78, y: 35 }, { x: 88, y: 55 },
            { x: 35, y: 75 }, { x: 65, y: 78 }, { x: 50, y: 20 }
        ],
        elements: [
            { type: 'house', x: 30, y: 22, status: 'completed', label: 'Library' },
            { type: 'house', x: 60, y: 15, status: 'pending', label: 'Lecture Hall' },
            { type: 'house', x: 85, y: 28, status: 'completed', label: 'Study Center' },
            { type: 'house', x: 18, y: 48, status: 'pending', label: 'Tutorial Room' },
            { type: 'house', x: 80, y: 52, status: 'completed', label: 'Lab Building' },
            { type: 'house', x: 25, y: 72, status: 'completed', label: 'Archives' },
            { type: 'house', x: 55, y: 82, status: 'pending', label: 'Exam Hall' },
            { type: 'house', x: 75, y: 75, status: 'completed', label: 'Research Wing' }
        ]
    },
    {
        id: 6,
        name: 'Commerce Cove',
        shape: 'M90,70 Q170,20 270,40 Q360,70 380,160 Q390,250 340,310 Q270,360 160,340 Q60,310 30,230 Q10,150 50,90 Q70,60 90,70 Z',
        ponds: [
            { path: 'M180,160 Q220,140 260,160 Q280,200 260,240 Q220,260 180,240 Q160,200 180,160 Z', name: 'Trading Bay' },
            { path: 'M100,200 Q130,180 150,210 Q140,250 110,250 Q80,230 100,200 Z', name: 'Merchant Pool' }
        ],
        rivers: ['M150,210 Q165,200 180,200'],
        trees: [
            { x: 15, y: 30 }, { x: 25, y: 50 }, { x: 75, y: 25 }, { x: 85, y: 45 },
            { x: 20, y: 75 }, { x: 80, y: 72 }
        ],
        elements: [
            { type: 'house', x: 28, y: 22, status: 'completed', label: 'Market Hall' },
            { type: 'house', x: 58, y: 18, status: 'pending', label: 'Trade Center' },
            { type: 'house', x: 82, y: 30, status: 'completed', label: 'Exchange' },
            { type: 'house', x: 15, y: 48, status: 'completed', label: 'Warehouse A' },
            { type: 'house', x: 85, y: 55, status: 'pending', label: 'Warehouse B' },
            { type: 'house', x: 28, y: 78, status: 'pending', label: 'Shipping Dock' },
            { type: 'house', x: 65, y: 80, status: 'completed', label: 'Customs Office' }
        ]
    },
    {
        id: 7,
        name: 'Data Delta',
        shape: 'M70,90 Q130,30 220,25 Q310,20 360,90 Q400,170 380,260 Q350,330 260,350 Q150,360 70,300 Q10,240 20,160 Q30,90 70,90 Z',
        ponds: [
            { path: 'M160,150 Q200,120 250,150 Q280,200 250,250 Q200,280 160,250 Q130,200 160,150 Z', name: 'Data Lake' }
        ],
        rivers: ['M250,250 Q270,280 260,320', 'M130,200 Q100,220 90,260'],
        trees: [
            { x: 12, y: 35 }, { x: 88, y: 30 }, { x: 22, y: 65 }, { x: 78, y: 68 },
            { x: 50, y: 22 }, { x: 40, y: 80 }
        ],
        elements: [
            { type: 'house', x: 30, y: 20, status: 'completed', label: 'Server Farm' },
            { type: 'house', x: 60, y: 15, status: 'completed', label: 'Data Center' },
            { type: 'house', x: 85, y: 25, status: 'pending', label: 'Backup Facility' },
            { type: 'house', x: 18, y: 45, status: 'pending', label: 'Analytics Hub' },
            { type: 'house', x: 82, y: 50, status: 'completed', label: 'Processing Unit' },
            { type: 'house', x: 25, y: 72, status: 'completed', label: 'Storage Vault' },
            { type: 'house', x: 55, y: 85, status: 'pending', label: 'Network Station' },
            { type: 'house', x: 75, y: 78, status: 'completed', label: 'Control Room' }
        ]
    },
    {
        id: 8,
        name: 'Support Springs',
        shape: 'M100,60 Q180,20 280,40 Q370,80 380,170 Q385,260 330,320 Q250,370 140,340 Q50,300 30,210 Q15,130 60,80 Q80,50 100,60 Z',
        ponds: [
            { path: 'M170,140 Q210,120 250,150 Q270,200 240,240 Q200,260 160,230 Q140,180 170,140 Z', name: 'Help Desk Lake' },
            { path: 'M290,180 Q320,160 340,200 Q330,240 300,240 Q270,220 290,180 Z', name: 'Resolution Pool' }
        ],
        rivers: ['M240,240 Q260,270 250,310'],
        trees: [
            { x: 15, y: 30 }, { x: 25, y: 55 }, { x: 72, y: 28 }, { x: 82, y: 52 },
            { x: 35, y: 78 }, { x: 65, y: 82 }
        ],
        elements: [
            { type: 'house', x: 28, y: 18, status: 'pending', label: 'Help Center' },
            { type: 'house', x: 55, y: 15, status: 'completed', label: 'Ticket Office' },
            { type: 'house', x: 80, y: 25, status: 'completed', label: 'Call Center' },
            { type: 'house', x: 18, y: 45, status: 'completed', label: 'Chat Support' },
            { type: 'house', x: 85, y: 48, status: 'pending', label: 'Email Hub' },
            { type: 'house', x: 25, y: 70, status: 'pending', label: 'FAQ Library' },
            { type: 'house', x: 58, y: 82, status: 'completed', label: 'Training Room' }
        ]
    },
    {
        id: 9,
        name: 'Quality Quarters',
        shape: 'M80,80 Q160,25 260,35 Q350,50 380,140 Q400,230 360,300 Q290,360 170,345 Q70,320 35,240 Q10,160 40,100 Q55,65 80,80 Z',
        ponds: [
            { path: 'M180,150 Q230,120 280,160 Q300,220 260,260 Q200,280 160,240 Q140,190 180,150 Z', name: 'Testing Pool' }
        ],
        rivers: ['M260,260 Q280,290 270,330', 'M140,190 Q110,210 100,250'],
        trees: [
            { x: 15, y: 32 }, { x: 85, y: 28 }, { x: 25, y: 62 }, { x: 75, y: 65 },
            { x: 48, y: 18 }, { x: 55, y: 82 }
        ],
        elements: [
            { type: 'house', x: 28, y: 20, status: 'completed', label: 'QA Lab' },
            { type: 'house', x: 62, y: 15, status: 'pending', label: 'Test Suite' },
            { type: 'house', x: 85, y: 28, status: 'completed', label: 'Bug Tracker' },
            { type: 'house', x: 15, y: 48, status: 'pending', label: 'Review Station' },
            { type: 'house', x: 85, y: 52, status: 'completed', label: 'Automation Hub' },
            { type: 'house', x: 22, y: 75, status: 'completed', label: 'Report Center' },
            { type: 'house', x: 70, y: 80, status: 'pending', label: 'Certification Office' }
        ]
    },
    {
        id: 10,
        name: 'Strategy Summit',
        shape: 'M90,70 Q170,15 270,30 Q365,60 385,160 Q395,260 340,320 Q265,375 150,350 Q55,315 25,225 Q5,140 45,85 Q70,50 90,70 Z',
        ponds: [
            { path: 'M165,140 Q210,110 260,145 Q290,200 255,250 Q200,275 155,240 Q125,185 165,140 Z', name: 'Vision Lake' },
            { path: 'M85,195 Q115,175 140,205 Q130,245 100,248 Q65,228 85,195 Z', name: 'Planning Pond' }
        ],
        rivers: ['M140,205 Q155,195 165,200', 'M255,250 Q275,280 265,320'],
        trees: [
            { x: 12, y: 35 }, { x: 88, y: 28 }, { x: 22, y: 60 }, { x: 78, y: 62 },
            { x: 45, y: 82 }, { x: 52, y: 20 }
        ],
        elements: [
            { type: 'house', x: 30, y: 18, status: 'completed', label: 'Board Room' },
            { type: 'house', x: 65, y: 12, status: 'completed', label: 'War Room' },
            { type: 'house', x: 88, y: 28, status: 'pending', label: 'Think Tank' },
            { type: 'house', x: 15, y: 45, status: 'pending', label: 'Planning Suite' },
            { type: 'house', x: 85, y: 52, status: 'completed', label: 'Operations Hub' },
            { type: 'house', x: 25, y: 75, status: 'completed', label: 'Analytics Wing' },
            { type: 'house', x: 60, y: 85, status: 'pending', label: 'Decision Center' },
            { type: 'house', x: 78, y: 78, status: 'completed', label: 'Forecast Office' }
        ]
    }
];