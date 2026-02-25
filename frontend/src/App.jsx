import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ModeSelection from './pages/ModeSelection';
import OverviewDashboard from './pages/OverviewDashboard';
import TeamAnalytics from './pages/TeamAnalytics';
import Reports from './pages/Reports';
import SettingsPage from './pages/SettingsPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/select" element={<ModeSelection />} />
            <Route path="/dashboard" element={<Navigate to="/dashboard/sales" replace />} />
            <Route path="/dashboard/sales" element={<OverviewDashboard />} />
            <Route path="/dashboard/presales" element={<OverviewDashboard />} />
            <Route path="/dashboard/team" element={<TeamAnalytics />} />
            <Route path="/dashboard/reports" element={<Reports />} />
            <Route path="/dashboard/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

export default App;