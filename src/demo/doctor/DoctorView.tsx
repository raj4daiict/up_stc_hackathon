import React, { useState } from 'react';
import { useDemoContext } from '../DemoContext';
import { PatientListTable } from './PatientListTable';
import { WeightTrendPanel } from './WeightTrendPanel';
import { AIRecommendationPanel } from './AIRecommendationPanel';
import { ClinicianJournalViewer } from './ClinicianJournalViewer';
import { MedicationPanel } from './MedicationPanel';

export function DoctorView() {
  const { state } = useDemoContext();
  const { weightHistory, anomalyDetected } = state;
  const [showDetail, setShowDetail] = useState(false);

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#5BBED3', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 8px' }}>
        👨‍⚕️ डॉक्टर — Dr. Priya Sharma
      </p>
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden', minHeight: 600 }}>
        <div style={{ background: '#1a3d44', padding: '16px 20px' }}>
          <h2 style={{ margin: '0 0 2px', fontSize: 16, fontWeight: 700, color: '#fff' }}>Clinical Dashboard</h2>
          <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Dr. Priya Sharma · Maternal Health</p>
        </div>
        <div style={{ padding: '16px 20px' }}>
          <PatientListTable anomalyDetected={anomalyDetected} onSelect={() => setShowDetail(true)} />
          {(showDetail || anomalyDetected) && (
            <>
              <WeightTrendPanel weights={weightHistory} />
              <MedicationPanel />
              <AIRecommendationPanel />
              <ClinicianJournalViewer />
            </>
          )}
          {!showDetail && !anomalyDetected && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
              <p style={{ fontSize: 13 }}>किसी मरीज़ का नाम क्लिक करें विवरण देखने के लिए</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
