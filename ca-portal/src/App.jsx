import { useEffect } from 'react';

import CaPortal from './pages/CaPortal';
import CAPage from './pages/CAPage';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import SuccessfulRegistration from './pages/SucessfulRegistration';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import EventsPage from './pages/EventsPage';
import CaLoginForm from './components/CARegistration/CaLoginForm';
import UserProfile from './components/UserProfile/UserProfile';
import NormalRegistration from './pages/NormalRegistration';
import NotFound from './pages/NotFound';


function RegistrationEntry() {
    const { search } = useLocation();
    const configuredUrl = import.meta.env.VITE_REGISTRATION_URL;
    const target = configuredUrl ? new URL(configuredUrl, window.location.origin) : null;
    if (target) new URLSearchParams(search).forEach((value, key) => target.searchParams.set(key, value));
    const url = target?.href;
    useEffect(() => {
        if (url) window.location.replace(url);
    }, [url]);
    return url ? <p className="p-8 text-white">Opening registration…</p> : <NormalRegistration />;
}

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    return null;
}

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop /><Routes>
                <Route path="/userprofile" element={<UserProfile />} />
                <Route path="/" element={<Home />} />
                <Route path="/caportal" element={<CaPortal />} />
                <Route path="/caregistration" element={<CAPage />} />
                <Route
                    path="/successful"
                    element={<SuccessfulRegistration />}
                />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/calogin" element={<CaLoginForm />} />
                <Route path="/registration" element={<RegistrationEntry />} />
                <Route path="/normalregistration" element={<RegistrationEntry />} />
                <Route path='*' element={<NotFound/>}/>
            </Routes>
        </BrowserRouter>
    );
}
export default App;
