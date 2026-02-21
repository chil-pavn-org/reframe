import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ScenarioPage from './pages/ScenarioPage';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:slug" element={<ScenarioPage />} />
      </Routes>
    </Layout>
  );
}
