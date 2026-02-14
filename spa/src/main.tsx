import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import 'react-toastify/dist/ReactToastify.css'
import { BrowserRouter, Routes, Route } from "react-router";
import { ToastContainer } from 'react-toastify';
import Dashboard from './pages/Dashboard.tsx';
import CollectionDetail from './pages/CollectionDetail.tsx';
import Player from './pages/Player.tsx';
import Congratulations from './pages/Congratulations.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/collection/:id" element={<CollectionDetail />} />
                <Route path="/player/:id" element={<Player />} />
                <Route path="/congratulations/:id" element={<Congratulations />} />
            </Routes>
            <ToastContainer />
        </BrowserRouter>
    </StrictMode>
)
