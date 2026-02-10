import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router";
import Dashboard from './pages/Dashboard.tsx';
import ThemeById from './pages/ThemeById.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/theme/:idTheme" element={<ThemeById />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
)
