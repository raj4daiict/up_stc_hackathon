import React from 'react';
import { PreparednessProvider } from './PreparednessContext';
import { PreparednessStepController } from './PreparednessStepController';
import { PatientViewPrep } from './patient/PatientViewPrep';
import { FamilyViewPrep } from './family/FamilyViewPrep';
import { AshaViewPrep } from './asha/AshaViewPrep';
import { DoctorViewPrep } from './doctor/DoctorViewPrep';
import { FacilityView } from './facility/FacilityView';
import { TransportView } from './transport/TransportView';
import { SupervisorView } from './supervisor/SupervisorView';

export function PreparednessTab() {
  return (
    <PreparednessProvider>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <PreparednessStepController />
        <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Top row: 3 mobile views */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, alignItems: 'start' }}>
            <PatientViewPrep />
            <FamilyViewPrep />
            <AshaViewPrep />
          </div>
          {/* Bottom row: 2x2 web panels */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
            <DoctorViewPrep />
            <FacilityView />
            <TransportView />
            <SupervisorView />
          </div>
        </div>
      </div>
    </PreparednessProvider>
  );
}
