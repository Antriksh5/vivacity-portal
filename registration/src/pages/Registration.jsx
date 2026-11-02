import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import '../styles/Registration.css'
import { Registration as RegistrationImages } from '../utils/cloudinaryUrls'
import doorGif from '../assets/registration/door.gif'
import Navbar from '../components/Registeration/Navbar'
import { cleanText, parseTeamMembers, normalizeTeamMembers, isValidTeamSize } from '../utils/registrationData'

const eventData = {
    "Drama Events": ["Gully Gully", "Halla Bol", "Natyatumb", "Manchpan"],
    "Art Events": ["Hue-niverse", "Contrasto", "Eclectic", "Tattoo Tales", "Splash"],
    "Music Events": ["Bandish", "Malhaar", "Battle of Bands", "Aaroh", "Gully War"],
    "Quizzing Events": ["Bamboozled", "Movie Auction"],
    "Dance Events": ["Razzamatazz", "Let's Tangle", "Taal-Tarang", "Mudra", "Pump It Up", "Street Dance"],
    "Nukkad Events": ["Hunkaar"],
    "Speaking Arts": ["Open Discussion", "Dare to Spell", "Potpourrii", "Duologue", "Spotlight", "Family Feud"],
    "Photography & Videography Events": ["Kalakriti", "Pixels (Photography Contest)", "Perspective (Workshop)", "Film Making Competition", "Photo Booth", "Image Hunt"],
    "Fashion Events": ["Vogue", "Mr. and Miss Viva"]
};

const Registration = ({ isPreloaderComplete }) => {
    const doorRef = useRef(null)
    const finalRef = useRef(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 1024)
    const [isVerySmallScreen, setIsVerySmallScreen] = useState(window.innerWidth < 500)
    const [isExtremelySmallScreen, setIsExtremelySmallScreen] = useState(window.innerWidth < 330)

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 1024)
            setIsVerySmallScreen(window.innerWidth < 500)
            setIsExtremelySmallScreen(window.innerWidth < 330)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Get step from URL or default to 1
    const step = parseInt(searchParams.get('step') || '1', 10)

    useEffect(() => {
        if (doorRef.current) {
            doorRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
        } else {
            window.scrollTo(0, 0);
        }
    }, []);

    const setStep = (newStep) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev)
            next.set('step', newStep)
            return next
        })
    }

    const [showGif, setShowGif] = useState(true)
    const [showPng, setShowPng] = useState(false)
    const [isZoomed, setIsZoomed] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const submittingRef = useRef(false)
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        university: '',
        referral: searchParams.get('ref') || '',
        participant: '',
        eventCategory: '',
        eventName: '',
        teamSize: '',
        isTeamCaptain: '',
        teamName: '',
        teamMembers: ''
    })
    const [addedEvents, setAddedEvents] = useState([])
    const [errors, setErrors] = useState({})

    const [gifSrc, setGifSrc] = useState(null)

    // Control body overflow based on addedEvents
    useEffect(() => {
        const body = document.querySelector('body.registration-page');
        if (body) {
            if (addedEvents.length > 0) {
                body.style.overflowY = 'auto';
                body.style.height = 'auto';
            } else {
                body.style.overflowY = 'hidden';
                body.style.height = '100vh';
            }
        }
    }, [addedEvents]);

    useEffect(() => {
        document.body.classList.add('registration-page')

        // Preload the PNG first (this is what stays after GIF ends)
        const pngImg = new Image()
        const doorOnlyImg = new Image()
        const preGif = new Image()

        let pngLoaded = false
        let doorOnlyLoaded = false
        let gifLoaded = false

        const checkAllLoaded = () => {
            if (pngLoaded && doorOnlyLoaded && gifLoaded && isPreloaderComplete) {
                // Now that it's cached and preloader is complete, setting the src will be instant
                setGifSrc(`${doorGif}?t=${Date.now()}`)
            }
        }

        pngImg.onload = () => {
            pngLoaded = true
            checkAllLoaded()
        }
        doorOnlyImg.onload = () => {
            doorOnlyLoaded = true
            checkAllLoaded()
        }
        preGif.onload = () => {
            gifLoaded = true
            checkAllLoaded()
        }

        pngImg.src = RegistrationImages.doorPng
        doorOnlyImg.src = RegistrationImages.doorOnly
        preGif.src = doorGif

        return () => {
            document.body.classList.remove('registration-page')
        }
    }, [isPreloaderComplete])

    useEffect(() => {
        if (!gifSrc) return

        // Start fading in the PNG near the end of the GIF
        const pngTimer = setTimeout(() => {
            setShowPng(true)
        }, 1000)

        // Hide GIF after it completes and PNG has faded in
        const timer = setTimeout(() => {
            setShowGif(false)
        }, 1600)

        // Start zoom animation after GIF finishes (for mobile)
        const zoomTimer = setTimeout(() => {
            setIsZoomed(true)
        }, 1800)

        return () => {
            clearTimeout(timer)
            clearTimeout(pngTimer)
            clearTimeout(zoomTimer)
        }
    }, [gifSrc])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            // If category changes, reset event name
            if (name === 'eventCategory') {
                newData.eventName = '';
            }
            return newData;
        })

        // Auto-transition to Step 4 after selecting Event Name
        if (name === 'eventName' && value !== '') {
            setTimeout(() => setStep(4), 300); // 300ms delay for visual feedback of selection
        }

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validate = () => {
        const newErrors = {}
        if (step === 1) {
            if (!formData.name.trim()) newErrors.name = 'Please enter your name'
            if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required'
            else if (!/^\d{10}$/.test(formData.mobile.trim())) newErrors.mobile = 'Enter a valid 10-digit number'

            if (!formData.email.trim()) newErrors.email = 'Email address is required'
            else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) newErrors.email = 'Enter a valid email address'

            if (!formData.university.trim()) newErrors.university = 'University name is required'
        } else if (step === 2) {
            if (!formData.participant) newErrors.participant = 'Please select an option'
        } else if (step === 3) {
            if (!formData.eventCategory) newErrors.eventCategory = 'Please select a category'
            if (!formData.eventName) newErrors.eventName = 'Please select an event'
        } else if (step === 4) {
            if (!isValidTeamSize(formData.teamSize)) newErrors.teamSize = 'Enter a whole number of at least 1'
            if (isValidTeamSize(formData.teamSize) && parseTeamMembers(formData.teamMembers).length > Number(formData.teamSize)) {
                newErrors.teamMembers = 'The number of names exceeds the team size'
            }
            if (!formData.isTeamCaptain) newErrors.isTeamCaptain = 'Required'
            if (!formData.teamName.trim()) newErrors.teamName = 'Team name is required'
        }
        return newErrors
    }

    const handleAddAnotherEvent = () => {
        const validationErrors = validate()
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        // Add current event to the list
        setAddedEvents(prev => [...prev, {
            category: formData.eventCategory,
            name: formData.eventName,
            teamSize: formData.teamSize,
            teamName: formData.teamName,
            isTeamCaptain: formData.isTeamCaptain,
            teamMembers: formData.teamMembers
        }])

        // Reset only event-related fields, keep personal info
        setFormData(prev => ({
            ...prev,
            eventCategory: '',
            eventName: '',
            teamSize: '',
            isTeamCaptain: '',
            teamName: '',
            teamMembers: ''
        }))
        setErrors({})
        setStep(3)

        // Scroll to the bottom to show the "Events Added" tab
        setTimeout(() => {
            if (finalRef.current) {
                finalRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100)
    }

    const submitData = async (eventsList) => {
        const caApi = import.meta.env.VITE_CA_API_URL;
        if (caApi) {
            const response = await fetch(`${caApi.replace(/\/$/, '')}/register/registerUser`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    personaldetails: {
                        name: cleanText(formData.name),
                        email: formData.email.trim().toLowerCase(),
                        mobile: formData.mobile.trim(),
                        university: cleanText(formData.university),
                        referralCode: formData.referral.trim().toUpperCase(),
                        participant: formData.participant === 'yes',
                    },
                    eventdetails: (eventsList || []).map(event => ({
                        category: event.category, eventName: event.name,
                        teamSize: event.teamSize.trim(),
                        captain: (event.isTeamCaptain || formData.isTeamCaptain) === 'yes',
                        teamName: cleanText(event.teamName),
                        teamMembers: parseTeamMembers(event.teamMembers || ''),
                    })),
                }),
            });
            const result = await response.json();
            if (!response.ok || !result.success) {
                if (response.status === 404) {
                    setStep(1);
                    setErrors({ referral: result.message });
                }
                throw new Error(result.message || 'Registration could not be saved.');
            }
            return;
        }
        const url = import.meta.env.VITE_GOOGLE_SHEET_API_URL;
        if (!url) {
            alert("Critical Error: VITE_GOOGLE_SHEET_API_URL is missing. Please restart your terminal (npm run dev) to load the new .env file.");
            console.error("VITE_GOOGLE_SHEET_API_URL is undefined");
            throw new Error("Registration service is not configured.");
        }

        // Helper to send a single row
        const sendRow = async (rowPayload) => {
            try {
                // Using 'no-cors' mode
                await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plain;charset=utf-8',
                    },
                    body: JSON.stringify(rowPayload),
                    mode: 'no-cors'
                });
                console.log("Request sent to Google Sheet for:", rowPayload.eventName || "Registration");
            } catch (error) {
                console.error("Error sending to Google Sheet:", error);
                throw error;
            }
        };

        const baseData = {
            name: cleanText(formData.name),
            email: formData.email.trim().toLowerCase(),
            phone: formData.mobile.trim(),
            college: cleanText(formData.university),
            referral: cleanText(formData.referral),
            isParticipant: formData.participant
        };

        if (!eventsList || eventsList.length === 0) {
            // Send just the personal info if no events
            await sendRow({
                ...baseData,
                eventCat: "",
                eventName: "",
                teamSize: "",
                isCaptain: "",
                teamName: "",
                membersName: ""
            });
        } else {
            // Send one request per event
            for (const event of eventsList) {
                await sendRow({
                    ...baseData,
                    eventCat: event.category,
                    eventName: event.name,
                    teamSize: event.teamSize.trim(),
                    isCaptain: event.isTeamCaptain || formData.isTeamCaptain,
                    teamName: cleanText(event.teamName),
                    membersName: normalizeTeamMembers(event.teamMembers || "")
                });
            }
        }
    }

    const submitRegistration = async (events) => {
        if (submittingRef.current) return;
        submittingRef.current = true;
        setIsSubmitting(true);
        try {
            await submitData(events);
            setShowSuccess(true);
        } catch (error) {
            alert(error.message || 'Unable to submit. Please try again.');
        } finally {
            submittingRef.current = false;
            setIsSubmitting(false);
        }
    }

    const handleSubmitAll = () => submitRegistration(addedEvents)

    const handleNext = async (e) => {
        if (e) e.preventDefault()
        if (submittingRef.current) return;
        // console.log("Processing Step:", step);

        const validationErrors = validate()
        if (Object.keys(validationErrors).length > 0) {
            console.log("Validation Errors:", validationErrors);
            setErrors(validationErrors)
            // alert("Please fix the errors in the form before proceeding.");
            return
        }

        if (step === 1) {
            setStep(2)
        } else if (step === 2) {
            if (formData.participant === 'yes') {
                setStep(3)
            } else {
                await submitRegistration([]);
            }
        } else if (step === 4) {
            const currentEvent = {
                category: formData.eventCategory,
                name: formData.eventName,
                teamSize: formData.teamSize,
                teamName: formData.teamName,
                isTeamCaptain: formData.isTeamCaptain,
                teamMembers: formData.teamMembers
            }
            const finalEvents = [...addedEvents, currentEvent]
            await submitRegistration(finalEvents);
        } else {
            setStep(step + 1)
        }
    }

    return (
        <div className={`w-full ${isSmallScreen ? 'min-h-screen scroll-smooth overflow-y-auto overflow-x-hidden' : (addedEvents.length > 0 ? 'min-h-screen overflow-y-auto' : 'h-screen overflow-hidden')} relative ${isVerySmallScreen ? 'pt-[10vh] pb-[20vh]' : (isSmallScreen ? 'pb-[50vh]' : '')}`}>
            <Navbar />
            {isSubmitting && <div role="status" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] rounded-lg bg-slate-900 px-6 py-3 text-white">Saving registration…</div>}
            <div className={`flex items-center justify-center w-full ${isSmallScreen ? 'min-h-screen' : 'h-screen'} relative z-0 flex-shrink-0`}>
                <div
                    ref={doorRef}
                    className={`relative flex-shrink-0 flex items-center justify-center transform-gpu backface-hidden transition-all duration-300 ${isVerySmallScreen
                        ? 'w-[95vw] max-w-[400px] h-[85vh] max-h-[600px]'
                        : 'w-320 h-320'
                        }`}>
                    <img
                        src={isVerySmallScreen ? RegistrationImages.doorOnly : RegistrationImages.doorPng}
                        alt="Door"
                        className={`absolute w-full h-full object-contain block z-10 m-auto transition-opacity duration-500 ${isVerySmallScreen ? '' : '-translate-x-1'
                            } ${showPng ? 'opacity-100' : 'opacity-0'}`}
                    />
                    {showGif && gifSrc && (
                        <img
                            src={gifSrc}
                            alt="Door Animation"
                            className={`absolute w-full h-full object-contain block z-20 m-auto ${isVerySmallScreen
                                ? 'scale-[2.3]'
                                : '-translate-x-1'
                                }`}
                        />
                    )}

                    <div className={`absolute left-1/2 -translate-x-1/2 flex flex-col z-40 py-1 transition-all ease-out ${isVerySmallScreen
                        ? 'w-[85%] max-w-[300px]'
                        : `w-[36%] max-w-95 ${isSmallScreen ? 'max-h-[75%] overflow-y-auto pr-2 scrollbar-thin' : ''}`
                        } ${showSuccess
                            ? 'top-[35%] items-center'
                            : step === 2
                                ? (isVerySmallScreen ? 'top-[28%] items-start' : 'top-[35%] items-start')
                                : step === 3
                                    ? (isVerySmallScreen ? 'top-[22%] items-center' : 'top-[34%] items-center')
                                    : step === 4
                                        ? (isVerySmallScreen ? 'top-[14%] items-start' : 'top-[32%] items-start')
                                        : (isVerySmallScreen ? 'top-[16%] items-center' : 'top-[31%] items-center')
                        } opacity-0 animate-formSlow`}>
                        {showSuccess ? (
                            <div className="w-full text-center flex flex-col items-center justify-center px-2">
                                <h1 className="text-white font-lemon-milk text-[20px] md:text-[24px] leading-tight mb-8 tracking-wider max-[480px]:text-[14px] font-medium">
                                    CONGRATULATIONS!
                                    <br />
                                    YOU HAVE SUCCESSFULLY
                                    <br />
                                    REGISTERED FOR VIVACITY 2027
                                </h1>
                                <p className="text-white font-lemon-milk text-[12px] md:text-[14px] mb-6 opacity-90 max-[480px]:text-[10px]">
                                    You will shortly receive the payment
                                    <br />
                                    details on your registered email
                                    <br />
                                    address
                                </p>
                                <button
                                    onClick={() => window.location.href = import.meta.env.VITE_MAIN_SITE_URL || '/'}
                                    className="bg-gradient-to-r from-[#4a3fad] to-[#216d7d] text-white font-lemon-milk text-[16px] px-8 py-2 rounded-full hover:scale-105 transition-transform duration-200 cursor-pointer border-none outline-none max-[480px]:text-[14px] max-[480px]:px-6 max-[480px]:py-1.5"
                                >
                                    HOME
                                </button>
                            </div>
                        ) : step === 1 ? (
                            <>
                                <img
                                    src={RegistrationImages.preRegisterHere}
                                    alt="Pre Register Here"
                                    className={`w-full mx-auto block h-auto uppercase ${isVerySmallScreen
                                        ? 'max-w-[180px] mt-1 mb-1'
                                        : 'max-w-72 mt-3 mb-3 max-[480px]:max-w-77.5 max-[480px]:mb-3 max-[480px]:mt-2.5'
                                        }`}
                                />
                                <form className="w-full" onSubmit={handleNext}>
                                    {[
                                        { label: 'FULL NAME', name: 'name', type: 'text', placeholder: 'Your full name', autoComplete: 'name' },
                                        { label: 'MOBILE NUMBER', name: 'mobile', type: 'tel', placeholder: '10-digit mobile number', autoComplete: 'tel-national' },
                                        { label: 'EMAIL ADDRESS', name: 'email', type: 'email', placeholder: 'you@example.com', autoComplete: 'email' },
                                        { label: 'COLLEGE / INSTITUTION', name: 'university', type: 'text', placeholder: 'Full institution name', autoComplete: 'organization' },
                                        { label: 'REFERRAL CODE (OPTIONAL)', name: 'referral', type: 'text', placeholder: 'Referral code, if any' }
                                    ].map((field) => (
                                        <div key={field.name} className="mb-2 flex flex-col relative pb-4 max-[480px]:mb-1 max-[480px]:pb-4">
                                            <label className="text-white font-lemon-milk text-[14px] font-medium mb-1 text-left tracking-[0.5px] opacity-90 max-[768px]:text-[13px] max-[480px]:text-[10px] max-[480px]:mb-0.5">
                                                {field.label}
                                            </label>
                                            <input
                                                type={field.type}
                                                name={field.name}
                                                value={formData[field.name]}
                                                onChange={handleChange}
                                                placeholder={field.placeholder}
                                                autoComplete={field.autoComplete}
                                                className={`gradient-input rounded-md px-3 py-1.5 text-white text-[14px] font-vito-sans font-semibold w-full outline-none transition-all duration-300 placeholder-white/30 focus:border-white/40 focus:bg-[#0d1321]/95 max-[768px]:text-[13px] max-[480px]:text-[10px] max-[480px]:px-2 max-[480px]:py-0 max-[480px]:h-[28px] ${errors[field.name] ? 'border-[#ff4d4d] bg-[#ff4d4d]/5' : ''
                                                    }`}
                                            />
                                            {errors[field.name] && <span className="text-[#ff4d4d] text-[11px] font-lemon-milk absolute bottom-0 left-0 font-medium tracking-[0.3px] animate-shake">{errors[field.name]}</span>}
                                        </div>
                                    ))}
                                </form>
                            </>
                        ) : step === 2 ? (
                            <div className="w-full h-full text-left p-1.25 flex flex-col justify-start items-start pt-16">
                                <h2 className="text-white font-lemon-milk text-[25px] font-extralight mb-5 tracking-[0.5px] leading-[1.2] max-[768px]:text-[22px] max-[480px]:text-[20px]">
                                    ARE YOU A PARTICIPANT?
                                </h2>
                                <div className="flex flex-col gap-5">
                                    {['yes', 'no'].map((option) => (
                                        <label key={option} className="flex items-center gap-3.75 text-white font-lemon-milk text-[20px] cursor-pointer relative select-none max-[768px]:text-[18px] max-[480px]:text-[16px] max-[480px]:gap-2.5 group">
                                            <input
                                                type="radio"
                                                name="participant"
                                                value={option}
                                                checked={formData.participant === option}
                                                onChange={handleChange}
                                                className="absolute opacity-0 cursor-pointer peer"
                                            />
                                            <span className="h-6.25 w-6.25 bg-transparent border-2 border-white rounded-full flex justify-center items-center transition-all duration-200 shrink-0 peer-checked:border-white max-[480px]:h-5.5 max-[480px]:w-5.5 group-hover:border-white/70">
                                                <span className={`w-4.5 h-4.5 rounded-full bg-white max-[480px]:w-3 max-[480px]:h-3 ${formData.participant === option ? 'block' : 'hidden'}`}></span>
                                            </span>
                                            {option === 'yes' ? 'Yes' : 'No'}
                                        </label>
                                    ))}
                                </div>
                                <div className="mt-2.5 pb-5 relative w-full h-5">
                                    {errors.participant && <span className="text-[#ff4d4d] text-[11px] font-lemon-milk absolute top-0 left-0 font-medium tracking-[0.3px] animate-shake">{errors.participant}</span>}
                                </div>
                            </div>
                        ) : step === 3 ? (
                            <form className="RegisterforEvent1 w-full rounded-md mx-auto p-0 m-0" onSubmit={(e) => e.preventDefault()}>
                                <h1 className="text-center font-lemon-milk text-[#57E8E8] tracking-wider leading-none mb-12 text-[18px] md:text-[24px] font-medium uppercase">
                                    Register for an event
                                </h1>
                                <div className="flex flex-col gap-8 md:gap-14 mb-32 w-full mt-20 pb-20">
                                    <div className="normal-select w-5/6 mx-auto flex flex-col gap-2 md:gap-2.5">
                                        <label className="block font-lemon-milk text-white text-center leading-none text-[15px] md:text-[18px] tracking-wider uppercase font-medium">
                                            Event Category
                                        </label>
                                        <select
                                            name="eventCategory"
                                            value={formData.eventCategory}
                                            onChange={handleChange}
                                            className={`gradient-input text-white text-center text-[14px] md:text-[16px] font-vito-sans font-medium cursor-pointer py-2 px-4 md:py-2.5 md:px-6 rounded-[10px] outline-none ${errors.eventCategory ? 'border-[#ff4d4d]' : ''}`}
                                        >
                                            <option value="" className="bg-[#0d1321]">--- Select Category ---</option>
                                            {Object.keys(eventData).map(cat => (
                                                <option key={cat} value={cat} className="bg-[#0d1321]">{cat}</option>
                                            ))}
                                        </select>
                                        {errors.eventCategory && <span className="text-[#ff4d4d] text-center text-[12px] font-lemon-milk font-medium tracking-[0.3px] mt-1">{errors.eventCategory}</span>}
                                    </div>

                                    <div className="mb-4 w-full">
                                        <div className="normal-select w-5/6 mx-auto flex flex-col gap-2 md:gap-2.5">
                                            <label className="block font-lemon-milk text-white text-center leading-none text-[15px] md:text-[18px] tracking-wider uppercase font-medium">
                                                Event Name
                                            </label>
                                            <select
                                                name="eventName"
                                                value={formData.eventName}
                                                onChange={handleChange}
                                                disabled={!formData.eventCategory}
                                                className={`gradient-input text-white text-center text-[14px] md:text-[16px] font-vito-sans font-medium cursor-pointer py-2 px-4 md:py-2.5 md:px-6 rounded-[10px] outline-none disabled:opacity-50 disabled:cursor-not-allowed ${errors.eventName ? 'border-[#ff4d4d]' : ''}`}
                                            >
                                                <option value="" className="bg-[#0d1321]">--- Select Event ---</option>
                                                {formData.eventCategory && eventData[formData.eventCategory].map(evt => (
                                                    <option key={evt} value={evt} className="bg-[#0d1321]">{evt}</option>
                                                ))}
                                            </select>
                                            {errors.eventName && <span className="text-[#ff4d4d] text-center text-[12px] font-lemon-milk font-medium tracking-[0.3px] mt-1">{errors.eventName}</span>}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        ) : step === 4 ? (
                            <form className="RegisterforEventTeam w-full rounded-md mx-auto p-0 m-0" onSubmit={(e) => e.preventDefault()}>
                                <div className="flex flex-col gap-1 md:gap-2 mb-0 w-full mt-5">
                                    <div className="mb-3 md:mb-5 w-full relative pb-3 md:pb-5">
                                        <div className="normal-select w-5/6 mx-auto flex flex-col gap-1.5">
                                            <label className="block font-lemon-milk text-white text-left leading-none text-[15px] tracking-wider uppercase">
                                                Team Size
                                            </label>
                                            <input
                                                type="text"
                                                name="teamSize"
                                                value={formData.teamSize}
                                                onChange={handleChange}
                                                placeholder="Total number of team members"
                                                inputMode="numeric"
                                                className={`gradient-input rounded-md px-3 py-2 text-white text-[16px] font-vito-sans font-semibold w-full outline-none placeholder-white/30 ${errors.teamSize ? 'border-[#ff4d4d]' : ''}`}
                                            />
                                            {errors.teamSize && <span className="text-[#ff4d4d] text-[11px] absolute bottom-0 left-[8.33%] animate-shake">{errors.teamSize}</span>}
                                        </div>
                                    </div>

                                    <div className="mb-3 md:mb-5 w-full relative pb-3 md:pb-5">
                                        <div className="w-5/6 mx-auto flex flex-col gap-1 md:gap-2">
                                            <label className="block font-lemon-milk text-white text-left leading-none text-[15px] tracking-wider uppercase">
                                                Are you the Team Captain?
                                            </label>
                                            <div className="flex flex-col gap-1">
                                                {['yes', 'no'].map((option) => (
                                                    <label key={option} className="flex items-center gap-2 text-white font-lemon-milk text-[16px] cursor-pointer relative select-none">
                                                        <input
                                                            type="radio"
                                                            name="isTeamCaptain"
                                                            value={option}
                                                            checked={formData.isTeamCaptain === option}
                                                            onChange={handleChange}
                                                            className="absolute opacity-0 cursor-pointer peer"
                                                        />
                                                        <span className="h-4 w-4 bg-transparent border-2 border-white rounded-full flex justify-center items-center transition-all duration-200 shrink-0 peer-checked:border-white">
                                                            <span className={`w-2.5 h-2.5 rounded-full bg-white ${formData.isTeamCaptain === option ? 'block' : 'hidden'}`}></span>
                                                        </span>
                                                        <span className="uppercase">{option === 'yes' ? 'Yes' : 'No'}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            {errors.isTeamCaptain && <span className="text-[#ff4d4d] text-[11px] font-medium absolute bottom-0 left-[8.33%] animate-shake">{errors.isTeamCaptain}</span>}
                                        </div>
                                    </div>

                                    <div className="mb-3 md:mb-5 w-full relative pb-3 md:pb-5">
                                        <div className="normal-select w-5/6 mx-auto flex flex-col gap-1.5">
                                            <label className="block font-lemon-milk text-white text-left leading-none text-[15px] tracking-wider uppercase">
                                                Team Name
                                            </label>
                                            <input
                                                type="text"
                                                name="teamName"
                                                value={formData.teamName}
                                                onChange={handleChange}
                                                placeholder="Enter Team Name"
                                                className={`gradient-input rounded-md px-3 py-2 text-white text-[16px] font-vito-sans font-semibold w-full outline-none placeholder-white/30 ${errors.teamName ? 'border-[#ff4d4d]' : ''}`}
                                            />
                                            {errors.teamName && <span className="text-[#ff4d4d] text-[11px] absolute bottom-0 left-[8.33%] animate-shake">{errors.teamName}</span>}
                                        </div>
                                    </div>

                                    <div className="mb-0 w-full">
                                        <div className="normal-select w-5/6 mx-auto flex flex-col gap-1.5">
                                            <label className="block font-lemon-milk text-white text-left leading-none text-[15px] tracking-wider uppercase">
                                                Team Members (Optional)
                                            </label>
                                            <textarea
                                                rows={2}
                                                aria-label="Team member names"
                                                aria-describedby="team-members-help"
                                                aria-invalid={Boolean(errors.teamMembers)}
                                                name="teamMembers"
                                                value={formData.teamMembers}
                                                onChange={handleChange}
                                                placeholder={"Aarav Sharma\nDiya Patel"}
                                                className="gradient-input rounded-md px-3 py-2 text-white text-[16px] font-vito-sans font-semibold w-full outline-none placeholder-white/30 focus:border-white/40 focus:bg-[#0d1321]/95"
                                            />
                                            <span id="team-members-help" className="text-white/75 text-[10px] leading-snug">
                                                One name per line, or separate names with commas. Extra spaces are removed automatically.
                                            </span>
                                            {errors.teamMembers && <span role="alert" className="text-[#ff4d4d] text-[11px]">{errors.teamMembers}</span>}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div className="text-white font-lemon-milk opacity-50">Please select an event</div>
                        )}
                    </div>

                    {!showSuccess && step !== 3 && step !== 4 && (
                        <button
                            key={`btn-${step}`}
                            disabled={isSubmitting}
                            onClick={handleNext}
                            className={`absolute z-50 transition-all duration-200 hover:scale-105 active:scale-95 outline-none focus:outline-none cursor-pointer opacity-0 animate-formSlow left-1/2 -translate-x-1/2 ${isVerySmallScreen ? (step === 1 ? 'bottom-[10%] w-28' : 'bottom-[11%] w-28') : (step === 1 ? 'bottom-[27.8%] max-[480px]:bottom-[16.3%] w-[150px]' : 'bottom-[28.5%] max-[480px]:bottom-[17%] w-[150px]')
                                }`}
                        >
                            <img
                                src={RegistrationImages.next}
                                alt="Next"
                                className="w-full h-auto border-none outline-none"
                            />
                        </button>
                    )}

                    {!showSuccess && step === 4 && (
                        <div className={`absolute z-50 flex gap-4 justify-center items-center opacity-0 animate-formSlow left-1/2 -translate-x-1/2 ${isVerySmallScreen ? 'bottom-[11%] w-full' : 'bottom-[28.5%] max-[480px]:bottom-[17%] w-full'}`}>
                            <button
                                disabled={isSubmitting}
                            onClick={handleAddAnotherEvent}
                                className={`transition-all duration-200 hover:scale-105 active:scale-95 outline-none focus:outline-none cursor-pointer ${isVerySmallScreen ? 'w-24' : 'w-[140px]'}`}
                            >
                                <img src={RegistrationImages.addEvent} alt="Add Event" className="w-full h-auto border-none outline-none" />
                            </button>
                            <button
                                disabled={isSubmitting}
                            onClick={handleNext}
                                className={`transition-all duration-200 hover:scale-105 active:scale-95 outline-none focus:outline-none cursor-pointer ${isVerySmallScreen ? 'w-24' : 'w-[140px]'}`}
                            >
                                <img src={RegistrationImages.proceed} alt="Proceed" className="w-full h-auto border-none outline-none" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Events Added Tab - Below the door area */}
            {
                !showSuccess && addedEvents.length > 0 && (
                    <div
                        ref={finalRef}
                        className={`relative mb-32 mx-auto w-full z-50 flex flex-col items-center animate-formReveal px-4 ${isVerySmallScreen
                            ? 'mt-[-5vh] max-w-[650px] scale-125'
                            : isSmallScreen
                                ? 'mt-[-15vh] max-w-[750px] scale-120'
                                : 'mt-0 max-w-[800px]'
                            }`}>
                        <div className="relative w-full aspect-[2/1] md:aspect-[2.5/1] flex flex-col items-center justify-center">
                            <img
                                src={RegistrationImages.doorHoriB}
                                alt="Events Added Background"
                                className="absolute inset-0 w-full h-full object-contain"
                            />
                            <div className={`relative z-10 flex flex-col items-center w-full max-w-[600px] ${isVerySmallScreen ? 'justify-start p-2 pt-1' : 'justify-center p-4 md:p-8'
                                }`}>
                                <h3 className={`text-[#57E8E8] font-lemon-milk tracking-wider uppercase ${isVerySmallScreen ? 'text-[14px] mb-2' : 'text-[18px] md:text-[24px] mb-4 md:mb-6'
                                    }`}>
                                    EVENTS ADDED
                                </h3>
                                <div className={`flex flex-wrap items-center justify-center overflow-y-auto w-full px-4 scrollbar-thin py-0.5 ${isVerySmallScreen ? 'max-h-[85px] mb-1 gap-1' : 'max-h-[180px] mb-8 gap-3'
                                    }`}>
                                    {addedEvents.map((event, index) => (
                                        <div
                                            key={index}
                                            className={`gradient-input text-white font-lemon-milk rounded-full whitespace-nowrap ${isVerySmallScreen ? 'px-1.5 py-0 text-[8px]' : 'px-6 py-2 text-[13px] md:text-[15px]'
                                                }`}
                                        >
                                            {event.name}
                                        </div>
                                    ))}
                                </div>
                                <button
                                    disabled={isSubmitting}
                            onClick={handleSubmitAll}
                                    className={`transition-all duration-200 hover:scale-110 active:scale-95 outline-none focus:outline-none cursor-pointer ${isVerySmallScreen ? 'translate-y-6' : 'translate-y-12'
                                        }`}
                                >
                                    <img
                                        src={RegistrationImages.proceed}
                                        alt="Proceed"
                                        className={`${isVerySmallScreen ? 'w-[110px]' : 'w-[140px] md:w-[180px]'} h-auto border-none outline-none`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    )
}

export default Registration