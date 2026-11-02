import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import vid from '../assets/viva_hero_video.mp4';

const Hero = () => {
    const navigate = useNavigate();
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            if (video.currentTime >= 12) {
                video.currentTime = 7.5;
                video.play();
            }
        };
        video.addEventListener('timeupdate', handleTimeUpdate);
        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, []);

    return (
        <div className="h-screen snap-start w-full relative">
            <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                src={vid}
                autoPlay
                muted
                playsInline
            />
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center space-y-2">
                <h1 className="text-6xl sm:text-8xl text-transparent bg-clip-text bg-gradient-to-l from-orange-500 via-fuchsia-600 to-blue-400 cursor-default select-none transition-all duration-300 delay-100 font-bold animate-bounce font-mabry pb-4"
                style={{
                    WebkitTextStroke: "0.5px #4A4947", // Text stroke for WebKit browsers
                    textStroke: "0.5px #4A4947",       // Standard property (for future support)
                  }}>
                    Road to Vivacity ’27
                </h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/registration')}
                        className="flex text-black dark:text-black group relative cursor-pointer overflow-hidden whitespace-nowrap h-11 px-3 sm:px-6 transition-all shadow-[0_0_0_3px_rgba(255,255,255,0.3)_inset] hover:scale-105 duration-300 w-max items-center justify-center bg-gradient-to-r from-white via-purple-300 to-purple-500 hover:bg-gradient-to-r hover:from-purple-600 hover:to-black hover:text-white [border-radius:var(--radius)]"
                    >
                        <div className="absolute inset-0 overflow-visible [container-type:size]">
                            <div className="absolute inset-0 h-[100cqh] animate-slide [aspect-ratio:1] [border-radius:0] [mask:none]">
                                <div className="absolute inset-[-100%] w-auto rotate-0 animate-spin [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,hsl(0_0%_100%/1)_var(--spread),transparent_var(--spread))] [translate:0_0]"></div>
                            </div>
                        </div>
                        <div className="absolute [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]"></div>
                        <span className="relative whitespace-pre text-center text-base font-semibold leading-none tracking-tight  z-10 font-mabry">
                            Register Now
                        </span>
                    </button>
                </div>
                <button
                onClick={e => navigate('/caportal')}
                className="flex text-black dark:text-black group relative cursor-pointer overflow-hidden whitespace-nowrap h-11 px-3 sm:px-6 transition-all shadow-[0_0_0_3px_rgba(255,255,255,0.3)_inset] hover:scale-105 duration-300 w-max items-center justify-center bg-gradient-to-r from-white via-purple-300 to-purple-500 hover:bg-gradient-to-r hover:from-purple-600 hover:to-black hover:text-white [border-radius:var(--radius)] sm:hidden"
                >
                <div className="absolute inset-0 overflow-visible [container-type:size]">
                    <div className="absolute inset-0 h-[100cqh] animate-slide [aspect-ratio:1] [border-radius:0] [mask:none] group-hover:opacity-0">
                        <div className="absolute inset-[-100%] w-auto rotate-0 animate-spin [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,hsl(0_0%_100%/1)_var(--spread),transparent_var(--spread))] [translate:0_0]"></div>
                    </div>
                </div>
                <div className="absolute [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]"></div>
                <span className="relative whitespace-pre text-center text-base font-semibold leading-none tracking-tight  z-10 font-mabry">
                    CA Portal
                </span>
            </button>
            </div>
        </div>
    );
};

export default Hero;
