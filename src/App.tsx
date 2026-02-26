/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import HostView from './pages/HostView';
import PlayerView from './pages/PlayerView';
import AdminDashboard from './pages/AdminDashboard';
import { Game3DView } from './pages/Game3DView';
import Chatbot from './components/Chatbot';
import AudioPlayer from './components/AudioPlayer';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Game 3D route - render độc lập không có wrapper */}
        <Route path="/game3d" element={<Game3DView />} />
        
        {/* Các route khác với layout chung */}
        <Route path="/*" element={
          <div className="min-h-screen bg-[#e8dfc7] text-[#1a1714] font-serif relative overflow-hidden">
            <div className="fixed inset-0 pointer-events-none" style={{
              backgroundImage: `
                repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.02) 2px, rgba(0,0,0,.02) 3px),
                repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,.02) 2px, rgba(0,0,0,.02) 3px),
                url('https://www.transparenttextures.com/patterns/old-map.png')
              `
            }}></div>
            <AudioPlayer />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/host" element={<HostView />} />
              <Route path="/play" element={<PlayerView />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
            <Chatbot />
          </div>
        } />
      </Routes>
    </Router>
  );
}
