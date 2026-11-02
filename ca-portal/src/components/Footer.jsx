import { Facebook, Instagram, LinkedIn, YouTube } from '@mui/icons-material';
import Logo from '../assets/vivacity-registration-logo.png';
import { Link } from 'react-router-dom';
import classes from './Footer.module.css';
import Gdg from '../assets/Gdg.png';

const Footer = () => {
    return (
        <footer
            className="flex flex-col text-center"
            style={{
                background:
                    'linear-gradient(0deg, rgba(40,1,56,1) 0%, rgba(0,0,0,1) 21%)',
            }}
        >
            <div className="snap-start flex flex-col sm:flex-row gap-10  bg-transparent text-white justify-around items-center px-4 py-12 border-t  border-gray-300">
                {' '}
                <div className="sm:w-1/4 flex flex-col items-center lg:items-start gap-6 text-center lg:text-left sm:pl-5">
                    <h1 className="text-4xl font-bold">Contact Us</h1>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col items-center lg:items-start pl-4">
                            <p className="text-xl font-semibold text-gray-200">
                                Snehit Raj
                            </p>
                            <p className="text-gray-400">+91 7678628043</p>
                        </div>
                        <div className="flex flex-col items-center lg:items-start pl-4">
                            <p className="text-xl font-semibold text-gray-200">
                                Harshil Agarwal
                            </p>
                            <p className="text-gray-400">+91 8273049979</p>
                        </div>
                    </div>
                </div>
                <div className="grow flex items-center justify-center w-1/2">
                    <img
                        className=" object-contain h-auto sm:max-w-[300px] max-w-[250px]"
                        src={Logo}
                        alt="Viva Logo"
                    />
                </div>
                <div className="grow flex items-end flex-col gap-6 sm:w-1/4 sm:pr-5">
                    <h1 className="text-4xl font-bold">Socials</h1>
                    <div className="flex flex-col gap-6 rounded-lg border-2 border-gray-400 p-4 hover:shadow-lg hover:shadow-gray-700 transition-shadow duration-150">
                        <div className="flex gap-6">
                            <Link
                                to="https://www.youtube.com/@VivacityLNMIIT"
                                className="text-gray-300 hover:text-red-500 transition-colors duration-150"
                                target="__blank"
                            >
                                <YouTube fontSize="large" />
                            </Link>
                            <Link
                                to="https://www.instagram.com/vivacity_lnmiit/"
                                className="text-gray-300 hover:text-pink-400 transition-colors duration-150"
                                target="__blank"
                            >
                                <Instagram fontSize="large" />
                            </Link>
                        </div>
                        <div className="flex gap-6">
                            <Link
                                to="https://www.facebook.com/vivacity.lnmiit.5/"
                                className="text-gray-300 hover:text-blue-600 transition-colors duration-150"
                                target="__blank"
                            >
                                <Facebook fontSize="large" />
                            </Link>
                            <Link
                                to="https://in.linkedin.com/company/vivacity-lnmiit"
                                className="text-gray-300 hover:text-sky-500 transition-colors duration-150"
                                target="__blank"
                            >
                                <LinkedIn fontSize="large" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div className="z-10 text-white bottom-0 w-full flex justify-center items-center ">
                    <a
                        href="https://gdg.community.dev/gdg-on-campus-the-lnm-institute-of-information-technology-jaipur-india/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <p className="font-bruno text-[12px] sm:text-[16px] xsm:text-[10px] md:text-2xl font-normal tracking-[0.16em] text-center">
                            <img
                                src={Gdg}
                                alt="GDG logo"
                                className="inline-block w-8 h-8 mr-3"
                            />
                            Designed and Developed by GDG on Campus, LNMIIT
                        </p>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
