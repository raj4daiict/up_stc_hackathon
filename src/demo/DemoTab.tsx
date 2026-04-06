import React from 'react';
import { DemoProvider } from './DemoContext';
import { DemoStepController } from './DemoStepController';
import { PatientView } from './patient/PatientView';
import { AshaView } from './asha/AshaView';
import { FamilyView } from './family/FamilyView';
import { DoctorView } from './doctor/DoctorView';

export function DemoTab() {
  return (
    <DemoProvider>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <DemoStepController />
        <div style={{
          flex: 1, overflow: 'auto', padding: '20px 24px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 2fr',
          gap: 20,
          alignItems: 'start',
        }}>
          <PatientView />
          <AshaView />
          <FamilyView />
          <DoctorView />
        </div>
      </div>
    </DemoProvider>
  );
}
