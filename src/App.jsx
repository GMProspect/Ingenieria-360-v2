import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/Auth';
import AuthGuard from './components/AuthGuard';
import Layout from './components/Layout';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import OhmsLaw from './pages/OhmsLaw';
import Vibration from './pages/Vibration';
import Transmitter from './pages/Transmitter';
import Converter from './pages/Converter';
import Login from './pages/Login';
import History from './pages/History';
import FeedbackList from './pages/FeedbackList';
import AdminGuard from './components/AdminGuard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/*" element={
            <AuthGuard>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/ohms-law" element={<OhmsLaw />} />
                  <Route path="/vibration" element={<Vibration />} />
                  <Route path="/transmitter" element={<Transmitter />} />
                  <Route path="/converter" element={<Converter />} />
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
    </AuthProvider>
  );
}

export default App;
