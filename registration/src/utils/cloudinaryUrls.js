/**
 * Cloudinary Image URL Mappings
 * 
 * Auto-generated optimized Cloudinary URLs with f_auto (format) and q_auto (quality).
 * Use these instead of local imports for CDN-served, optimized images.
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'doxipu0v7';
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

// Helper to generate optimized URL
const url = (publicId) => `${BASE_URL}/f_auto,q_auto/${publicId}`;

// AWS S3 CDN URLs for GIF assets still hosted on S3
const S3_BASE_URL = 'https://viva-bucket-2026.s3.us-east-1.amazonaws.com';

export const S3Assets = {
    // billBoard.gif (33MB) & shops.gif (72MB) exceed Cloudinary 10MB free tier limit
    // → served as static assets from public/ folder
    billBoard: '/billBoard.gif',
    shops: '/shops.gif',
    jugnoo: `${S3_BASE_URL}/jugnoo.gif`,
    // tediux-logo.png uploaded to Cloudinary ✅
    tediuxLogo: `${BASE_URL}/f_auto,q_auto/viva-26/landingPage/tediux-logo`,
    thadiJugnoo: `${S3_BASE_URL}/thadi+jugnoo.gif`,
};

// Legacy Page Images
export const Legacy = {
    Television: url('viva-26/Legacy/Television'),
    LegacyBgMobile: url('viva-26/Legacy/LegacyBgMobile'),
    LegacyText: url('viva-26/Legacy/LegacyText'),
};

// Team Page Images
export const Team = {
    VivaLogo: url('viva-26/Team/VivaLogo'),
    Flower: url('viva-26/Team/Flower'),
    FlowerY: url('viva-26/Team/FlowerY'),
    Circle: url('viva-26/Team/Circle'),
    TeamHeader: url('viva-26/Team/TeamHeader'),
    TeamMid1: url('viva-26/Team/TeamMid1'),
    TeamMid2: url('viva-26/Team/TeamMid2'),
    TeamMidBorder: url('viva-26/Team/TeamMidBorder'),
    TeamMidBorderMobile: url('viva-26/Team/TeamMidBorderMobile'),
    TeamMidMobile: url('viva-26/Team/TeamMidMobile'),
    TeamFooter: url('viva-26/Team/TeamFooter'),
    BottomBg: url('viva-26/Team/BottomBg'),
    TeamBg: url('viva-26/Team/TeamBg'),
    StampBorder: url('viva-26/Team/StampBorder'),
};

// Landing Page Images
export const LandingPage = {
    aboutThemebg: url('viva-26/landingPage/aboutThemebg'),
    aboutTheme: url('viva-26/landingPage/aboutTheme'),
    aboutBgPhn: url('viva-26/landingPage/aboutBgPhn'),
    bgDoor: url('viva-26/landingPage/bgDoor'),
    bgAboutPhn: url('viva-26/landingPage/bgAboutPhn'),
    aboutViva: url('viva-26/landingPage/aboutViva'),
    bgAbout: url('viva-26/landingPage/bgAbout'),
    aboutThemeBorder: url('viva-26/landingPage/aboutThemeBorder'),
    ferrisWheel: url('viva-26/landingPage/ferrisWheel'),
    comingSoon: url('viva-26/landingPage/comingSoon'),
    doorImg: url('viva-26/landingPage/doorImg'),
    bottomImg: url('viva-26/landingPage/bottomImg'),
    jugnooGroundMobile: url('viva-26/landingPage/jugnooGroundMobile'),
    gateBelow: url('viva-26/landingPage/gateBelow'),
    jugnooGround: url('viva-26/landingPage/jugnooGround'),
    leftHand: url('viva-26/landingPage/leftHand'),
    mbabTheme: url('viva-26/landingPage/mbabTheme'),
    mobileJugnooGround: url('viva-26/landingPage/mobileJugnooGround'),
    nimbuMirchi: url('viva-26/landingPage/nimbuMirchi'),
    mobileThemeBorder: url('viva-26/landingPage/mobileThemeBorder'),
    registerNow: url('viva-26/landingPage/registerNow'),
    rightHand: url('viva-26/landingPage/rightHand'),
    tediuxLogo: url('viva-26/landingPage/tediux-logo'),
    uncle: url('viva-26/landingPage/uncle'),
    woodFrame: url('viva-26/landingPage/woodFrame'),
};

// Gate Animation Frames (for LandingPage.jsx)
export const GateAnimationFrames = Array.from({ length: 27 }, (_, i) => {
    const frameNum = String(i + 2).padStart(2, '0');
    return url(`viva-26/landingPage/gate-animation/frame_${frameNum}`);
});

// First 3 frames with higher quality for initial display
export const GateAnimationFramesPriority = Array.from({ length: 3 }, (_, i) => {
    const frameNum = String(i + 2).padStart(2, '0');
    return `${BASE_URL}/f_auto,q_auto:good,w_1920/${`viva-26/landingPage/gate-animation/frame_${frameNum}`}`;
});

// Footer Images
export const FooterImg = {
    footerLogo: url('viva-26/Footer/footerLogo'),
    footer: url('viva-26/Footer/footer'),
};

// Mascot Landing Images
export const MascotLanding = {
    ara: url('viva-26/MascotLanding/ara'),
    mascotFinal: url('viva-26/MascotLanding/mascot-final'),
    background1: url('viva-26/MascotLanding/background1'),
};

// Event Landing Images
export const EventLanding = {
    BottomBorder: url('viva-26/EventLanding/Bottom%20Border'),
    Dance1: url('viva-26/EventLanding/Dance1'),
    Background: url('viva-26/EventLanding/Backgound'),
    ArtImage: url('viva-26/EventLanding/ArtImage'),
    Hand: url('viva-26/EventLanding/Hand'),
    FashionImage: url('viva-26/EventLanding/FashionImage'),
    QuizEvent: url('viva-26/EventLanding/QuizEvent'),
    PhotoGraphyImage: url('viva-26/EventLanding/PhotoGraphyImage'),
    ExcitingImage: url('viva-26/EventLanding/ExcitingImage'),
    SideBorder: url('viva-26/EventLanding/SideBorder'),
    SpeakingImage: url('viva-26/EventLanding/SpeakingImage'),
    SocialImage: url('viva-26/EventLanding/SocialImage'),

};

// Past Artists Images
export const PastArtist = {
    AmitTrivedi: url('viva-26/PastArtist/AmitTrivedi'),
    AssesKaur: url('viva-26/PastArtist/AssesKaur'),
    DarshanRaval: url('viva-26/PastArtist/DarshanRaval'),
    JubinNautyal: url('viva-26/PastArtist/JubinNautyal'),
    Kullu: url('viva-26/PastArtist/Kullu'),
    MohitChauhan: url('viva-26/PastArtist/MohitChauhan'),
    Raftaar: url('viva-26/PastArtist/Raftaar'),
    Ritviz: url('viva-26/PastArtist/Ritviz'),
    PastArtistBackGround: url('viva-26/PastArtist/PastArtistBackGround'),
    MatchBoxOpen: url('viva-26/PastArtist/MatchBoxOpen'),
    LeftButton: url('viva-26/PastArtist/LeftButton'),
    RightButton: url('viva-26/PastArtist/RightButton'),
    LeftTopCorner: url('viva-26/PastArtist/LeftTopCorner'),
    RightTopCorner: url('viva-26/PastArtist/RightTopCorner'),
    LeftBottomCorner: url('viva-26/PastArtist/LeftBottomCorner'),
    RightBottomCorner: url('viva-26/PastArtist/RightBottomCorner'),
    TopLeftCornerPurple: url('viva-26/PastArtist/TopLeftCornerPurple'),
    TopRightCornerPurple: url('viva-26/PastArtist/TopRightCornerPurple'),
    BottomLeftCornerPurple: url('viva-26/PastArtist/BottomLeftCornerPurple'),
    BottomRightCornerPurple: url('viva-26/PastArtist/BottomRightCornerPurple'),
    TopLeftCornerYellow: url('viva-26/PastArtist/TopLeftCornerYellow'),
    TopRightCornerYellow: url('viva-26/PastArtist/TopRightCornerYellow'),
    BottomLeftCornerYellow: url('viva-26/PastArtist/BottomLeftCornerYellow'),
    BottomRightCornerYellow: url('viva-26/PastArtist/BottomRightCornerYellow'),
};

// Our Team Page Images
export const OurTeam = {
    c1: url('viva-26/ourTeam/c1'),
    c2: url('viva-26/ourTeam/c2'),
    c3: url('viva-26/ourTeam/c3'),
    c4: url('viva-26/ourTeam/c4'),
    cultural: url('viva-26/ourTeam/cultural'),
    cultural1: url('viva-26/ourTeam/cultural1'),
    cultural2: url('viva-26/ourTeam/cultural2'),
    cultural3: url('viva-26/ourTeam/cultural3'),
    creative: url('viva-26/ourTeam/creative'),
    d1: url('viva-26/ourTeam/d1'),
    d2: url('viva-26/ourTeam/d2'),
    d3: url('viva-26/ourTeam/d3'),
    development: url('viva-26/ourTeam/development'),
    email: url('viva-26/ourTeam/email'),
    festhead: url('viva-26/ourTeam/festhead'),
    festhead1: url('viva-26/ourTeam/festhead1'),
    festhead2: url('viva-26/ourTeam/festhead2'),
    instagram: url('viva-26/ourTeam/instagram'),
    lantern: url('viva-26/ourTeam/lantern'),
    leftBorder: url('viva-26/ourTeam/left-border'),
    rightBorder: url('viva-26/ourTeam/right-border'),
    mentors: url('viva-26/ourTeam/mentors'),
    mentorsCard: url('viva-26/ourTeam/mentors-card'),
    mentorImage: url('viva-26/ourTeam/mentorImage'),
    o1: url('viva-26/ourTeam/o1'),
    o2: url('viva-26/ourTeam/o2'),
    o3: url('viva-26/ourTeam/o3'),
    o4: url('viva-26/ourTeam/o4'),
    operational: url('viva-26/ourTeam/opertaional'),
    p1: url('viva-26/ourTeam/p1'),
    p2: url('viva-26/ourTeam/p2'),
    p3: url('viva-26/ourTeam/p3'),
    p4: url('viva-26/ourTeam/p4'),
    prEvents: url('viva-26/ourTeam/pr_events'),
    s1: url('viva-26/ourTeam/s1'),
    s2: url('viva-26/ourTeam/s2'),
    s4: url('viva-26/ourTeam/s4'),
    s5: url('viva-26/ourTeam/s5'),
    s6: url('viva-26/ourTeam/s6'),
    s7: url('viva-26/ourTeam/s7'),
    rickshaw: url('viva-26/ourTeam/rickshaw'),
    sponsor: url('viva-26/ourTeam/sponsor'),
    vivaLogo: url('viva-26/ourTeam/viva-logo'),
    purpleInsta: url('viva-26/ourTeam/purple_insta'),
    purpleGmail: url('viva-26/ourTeam/purple_gmail'),
    yellowEmail: url('viva-26/ourTeam/yellow_email'),
    yellowInsta: url('viva-26/ourTeam/yellow_insta'),
    image330: url('viva-26/ourTeam/image%20330'),
    vogue1: url('viva-26/ourTeam/vogue%201'),
    vogue2: url('viva-26/ourTeam/vogue%202'),
};

// Registration Page Images
export const Registration = {
    addEvent: url('viva-26/registration/addEvent'),
    doorPrev: url('viva-26/registration/door-prev'),
    doorHoriB: url('viva-26/registration/doorHoriB'),
    door: url('viva-26/registration/door'),
    doorHori: url('viva-26/registration/doorHori'),
    doorPng: url('viva-26/registration/doorPng'),
    next: url('viva-26/registration/next'),
    preRegisterHere: url('viva-26/registration/Pre%20register%20here'),
    doorOnly: url('viva-26/registration/door_only'),
    nav: url('viva-26/registration/nav'),
    graffitiWall: url('viva-26/registration/graffiti-wall-new'),
    vivacityLogo: url('viva-26/registration/vivacityLogo'),
    proceed: url('viva-26/registration/procced'),
};

// Events Images (grouped by event type)
export const Events = {
    BackGroundImage: url('viva-26/Events/BackGroundImage'),
    StampBorder: url('viva-26/Events/StampBorder'),

    // Dance Events
    Dance: {
        Header: url('viva-26/Events/DanceEvent/DanceEventsHeader'),
        LeftTopEdge: url('viva-26/Events/DanceEvent/LeftTopEdge'),
        RightTopEdge: url('viva-26/Events/DanceEvent/RightTopEdge'),
        YellowTextArea: url('viva-26/Events/DanceEvent/YellowTextArea'),
        PumpItUp: url('viva-26/Events/DanceEvent/First/PumpItUp'),
        PumpItUpText: url('viva-26/Events/DanceEvent/First/PumpItUpText'),
        StreetDance: url('viva-26/Events/DanceEvent/second/StreetDance'),
        StreetDanceText: url('viva-26/Events/DanceEvent/second/StreetDanceText'),
        Razzmatazz: url('viva-26/Events/DanceEvent/Third/Razzmatazz'),
        RazzmatazzText: url('viva-26/Events/DanceEvent/Third/RazzmatazzText'),
        TaalTarang: url('viva-26/Events/DanceEvent/Fourth/TaalTarang'),
        TaalTarangText: url('viva-26/Events/DanceEvent/Fourth/TaalTarangText'),
        LetsTangle: url('viva-26/Events/DanceEvent/Fifth/LetsTangle'),
        LetsTangleText: url('viva-26/Events/DanceEvent/Fifth/LetsTangleText'),
        Mudra: url('viva-26/Events/DanceEvent/Sixth/Mudra'),
        MudraText: url('viva-26/Events/DanceEvent/Sixth/MudraText'),
    },

    // Music Events
    Music: {
        Header: url('viva-26/Events/MusicEvent/MusicEventsHeader'),
        OrangeTextBox: url('viva-26/Events/MusicEvent/OrangeTextBox'),
        BattleOfBands: url('viva-26/Events/MusicEvent/First/BattleOfBands'),
        GullyWar: url('viva-26/Events/MusicEvent/Second/GullyWar'),
        Bandish: url('viva-26/Events/MusicEvent/Third/Bandish'),
        Aaroh: url('viva-26/Events/MusicEvent/Fourth/Aaroh'),
        Malhar: url('viva-26/Events/MusicEvent/Fiveth/Malhar'),
    },

    // Art Events
    Art: {
        Header: url('viva-26/Events/ArtEvent/ArtEventsHeader'),
        Contrasto: url('viva-26/Events/ArtEvent/Artists/Contrasto_1'),
        HueNiverse: url('viva-26/Events/ArtEvent/Artists/Hue_niverse_1'),
        TatooTales: url('viva-26/Events/ArtEvent/Artists/Tatoo_tales_1'),
        Splash: url('viva-26/Events/ArtEvent/Artists/Splash_1'),
        Eclectic: url('viva-26/Events/ArtEvent/Artists/eclectic_1'),
    },

    // Drama Events
    Drama: {
        Header: url('viva-26/Events/DramaEvent/DramaEventsHeader'),
        RedTextArea: url('viva-26/Events/DramaEvent/red_text_area'),
        Rangshala: url('viva-26/Events/DramaEvent/First/Rangshala_1'),
        Hunkaar: url('viva-26/Events/DramaEvent/Second/hunkaar_1'),
        Mukhauta: url('viva-26/Events/DramaEvent/Third/Mukhauta_1'),
        Paddhati: url('viva-26/Events/DramaEvent/Fourth/Paddhati_1'),
    },

    // Fashion Events
    Fashion: {
        Header: url('viva-26/Events/FashionEvent/FashionEventsHeader'),
        Viva: url('viva-26/Events/FashionEvent/Artists/Viva_1'),
        Vogue: url('viva-26/Events/FashionEvent/Artists/Vogue_1'),
    },

    // Photography Events
    Photography: {
        Header: url('viva-26/Events/PhotographyEvent/PhotographyEventHeader'),
        Photobooth: url('viva-26/Events/PhotographyEvent/Artists/photobooth_1'),
        ImageHunt: url('viva-26/Events/PhotographyEvent/Artists/Image_hunt_1'),
        FilmMaking: url('viva-26/Events/PhotographyEvent/Artists/filn_making_competition_1'),
        Kalakriti: url('viva-26/Events/PhotographyEvent/Artists/kalakriti_1'),
        Perspective: url('viva-26/Events/PhotographyEvent/Artists/perspective_1'),
        Pixels: url('viva-26/Events/PhotographyEvent/Artists/pixels_1'),
    },

    // Quizzing Events
    Quizzing: {
        Header: url('viva-26/Events/QuizzingEvent/QuizzingEventsHeader'),
        Bamboozled: url('viva-26/Events/QuizzingEvent/Artists/Bamboozled_1'),
        MovieAuction: url('viva-26/Events/QuizzingEvent/Artists/MovieAuction_1'),
    },

    // Speaking Arts Events
    SpeakingArt: {
        Header: url('viva-26/Events/SpeakingArt/SpeakingArtsHeader'),
        Afreen: url('viva-26/Events/SpeakingArt/Artists/Afreen_1'),
        Duologue: url('viva-26/Events/SpeakingArt/Artists/Duologue_1'),
        DareToSpell: url('viva-26/Events/SpeakingArt/Artists/Dare%20to%20Spell'),
        Spotlight: url('viva-26/Events/SpeakingArt/Artists/Spotlight_1'),
        FamilyFeud: url('viva-26/Events/SpeakingArt/Artists/Family%20Feud_1'),
        Potpourii: url('viva-26/Events/SpeakingArt/Artists/Potpourii_1'),
    },

    // Social Events
    Social: {
        Header: url('viva-26/Events/SocialEvent/SocialEventsHeader'),
        Sahyog: url('viva-26/Events/SocialEvent/Artists/Sahyog_1'),
    },

    // Exciting Pursuits
    ExcitingPursuits: {
        Header: url('viva-26/Events/ExcitingPursuits/ExcitingPurSuitsHeader'),
        JammingNight: url('viva-26/Events/ExcitingPursuits/Artists/Jamming_Night_1'),
        StageSpectrum: url('viva-26/Events/ExcitingPursuits/Artists/Stage_Spectrum_1'),
        PromNight: url('viva-26/Events/ExcitingPursuits/Artists/Prom_Night_1'),
        SilentDisco: url('viva-26/Events/ExcitingPursuits/Artists/Silent_Disco_1'),
    },
};

export default {
    Legacy,
    Team,
    LandingPage,
    GateAnimationFrames,
    GateAnimationFramesPriority,
    FooterImg,
    MascotLanding,
    EventLanding,
    PastArtist,
    OurTeam,
    Registration,
    Events,
    S3Assets,
};
