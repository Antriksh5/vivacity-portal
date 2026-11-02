import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Registration from './pages/Registration.jsx'

function ExternalPage({ url }) {
    const { search } = useLocation()
    const target = new URL(url, window.location.origin)
    new URLSearchParams(search).forEach((value, key) => target.searchParams.set(key, value))
    const destination = target.href
    useEffect(() => { window.location.replace(destination) }, [destination])
    return <p className="p-8 text-white">Opening Vivacity…</p>
}

function App() {
    const location = useLocation()
    const home = import.meta.env.VITE_MAIN_SITE_URL
    const caPortal = import.meta.env.VITE_CA_PORTAL_URL
    const caPaths = ['/caportal', '/caregistration', '/calogin', '/userprofile']

    return (
        <Routes>
            <Route path="/" element={home
                ? <ExternalPage url={home} />
                : <Navigate to={{ pathname: '/registration', search: location.search }} replace />} />
            <Route path="/registration" element={<Registration isPreloaderComplete={true} />} />
            <Route path="/normalregistration" element={<Navigate to={{ pathname: '/registration', search: location.search }} replace />} />
            {caPortal && caPaths.map(path => <Route key={path} path={path}
                element={<ExternalPage url={new URL(path, new URL(caPortal, window.location.origin)).href} />} />)}
            <Route path="*" element={<Navigate to={{ pathname: '/', search: location.search }} replace />} />
        </Routes>
    )
}

export default App
