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
                  } />
                </Routes >
              </Layout >
            </AuthGuard >
          } />
        </Routes >
      </Router >
    </AuthProvider >
  );
}

export default App;
