import React from 'react';
import { useDemoContext } from '../DemoContext';
import { AlertBanner } from './AlertBanner';
import { CarePlanProgress } from './CarePlanProgress';
import { WeightEntryForm } from './WeightEntryForm';
import { WeightChart } from './WeightChart';
import { MedicationSection } from './MedicationSection';
import { calculateAdherenceScore } from '../medicationUtils';

export function PatientView() {
  const { state } = useDemoContext();
  const { weightHistory, weightLogged, anomalyDetected, carePlanTasks, medicationAdherence } = state;
  const score = calculateAdherenceScore(medicationAdherence.ifaTotal, medicationAdherence.ifaRemaining);
  const showLowAdherenceBanner = score !== null && score < 50;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: '#5BBED3', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 8px' }}>
        👩 मरीज़ — सीमा देवी
      </p>
      <div style={{
        maxWidth: 390, width: '100%',
        background: '#fff', borderRadius: 24,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        minHeight: 600, overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ background: '#5BBED3', padding: '20px 20px 16px' }}>
          <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>नमस्ते,</p>
          <h2 style={{ margin: '2px 0 4px', fontSize: 18, fontWeight: 700, color: '#fff' }}>सीमा देवी</h2>
          <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
            आप 24 सप्ताह की गर्भवती हैं 🤰
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: '16px 16px 20px' }}>
          <AlertBanner show={anomalyDetected} />
          <CarePlanProgress tasks={carePlanTasks} week={24} />
          {showLowAdherenceBanner && (
            <div style={{
              background: '#f59e0b', color: '#fff', padding: '10px 12px',
              borderRadius: 8, marginBottom: 8, fontSize: 12, fontWeight: 600,
            }}>
              आपकी दवा नियमित रूप से लेना बहुत जरूरी है — कृपया रोज़ आयरन टैबलेट लें
            </div>
          )}
          <MedicationSection />
          <div style={{ height: 1, background: '#e5e7eb', margin: '16px 0' }} />
          <WeightEntryForm />
          {weightLogged && (
            <>
              <div style={{ height: 1, background: '#e5e7eb', margin: '16px 0' }} />
              <p style={{ fontSize: 12, fontWeight: 700, color: '#1a3d44', margin: '0 0 8px' }}>वजन का ग्राफ</p>
              <WeightChart weights={weightHistory} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
