import { Link } from 'react-router-dom'
import './Navbar.css'
import { Registration } from '../../utils/cloudinaryUrls'

const Navbar = () => (
    <nav className="registration-navbar" aria-label="Registration portal">
        <div className="navbar-container">
            <div className="navbar-logo">
                <a href={import.meta.env.VITE_MAIN_SITE_URL || '/'} aria-label="Vivacity home">
                    <img src={Registration.vivacityLogo} alt="Vivacity" className="logo-image" />
                </a>
            </div>
            <div className="flex items-center gap-4">
                <Link to="/registration" className="nav-link">REGISTRATION</Link>
                {import.meta.env.VITE_CA_PORTAL_URL && <a href={import.meta.env.VITE_CA_PORTAL_URL} className="nav-link">CA PORTAL</a>}
            </div>
        </div>
    </nav>
)

export default Navbar
