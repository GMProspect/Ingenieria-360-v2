import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/Auth';
import { SyncProvider } from './contexts/SyncContext';
import AuthGuard from './components/AuthGuard';
import Layout from './components/Layout';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import OhmsLaw from './pages/OhmsLaw';
import Vibration from './pages/Vibration';
import Transmitter from './pages/Transmitter';
import Converter from './pages/Converter';
import TemperatureSensors from './pages/TemperatureSensors';
import WrenchConverter from './pages/WrenchConverter';
import TorqueCalculator from './pages/TorqueCalculator';
import Megohmetro from './pages/Megohmetro';
import Login from './pages/Login';
import History from './pages/History';
import FeedbackList from './pages/FeedbackList';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import AdminGuard from './components/AdminGuard';

import { App as CapacitorApp } from '@capacitor/app';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      } else {
        CapacitorApp.exitApp();
      }
    });
  }, []);

  return (
    <AuthProvider>
      <SyncProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />

            <Route path="/*" element={
              <AuthGuard>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/torque" element={<TorqueCalculator />} />
                    <Route path="/ohms-law" element={<OhmsLaw />} />
                    <Route path="/vibration" element={<Vibration />} />
                    <Route path="/transmitter" element={<Transmitter />} />
                    <Route path="/temperature-sensors" element={<TemperatureSensors />} />
                    <Route path="/converter" element={<Converter />} />
                    <Route path="/wrench-converter" element={<WrenchConverter />} />
                    <Route path="/megohmetro" element={<Megohmetro />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/feedback" element={
                      <AdminGuard>
                        <FeedbackList />
                      </AdminGuard>
                    } />
                  </Routes>
                </Layout>
              </AuthGuard>
            } />
          </Routes>
        </Router>
      </SyncProvider>
    </AuthProvider>
  );
}

export default App;
