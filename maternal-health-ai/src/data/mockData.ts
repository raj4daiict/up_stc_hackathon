import type { Mother, Hospital, Ambulance, DistrictStats } from '../types';

export const DISTRICTS = ['Lucknow', 'Varanasi', 'Agra', 'Kanpur', 'Prayagraj', 'Gorakhpur', 'Jhansi', 'Bareilly'];
export const BLOCKS = ['Mohanlalganj', 'Bakshi Ka Talab', 'Sarojini Nagar', 'Chinhat', 'Malihabad', 'Kakori'];
export const VILLAGES = [
  'Rampur Kalan', 'Sultanpur Khurd', 'Bhagwanpur', 'Govindpur', 'Shivdaspur',
  'Laxmanpur', 'Hariharpur', 'Durgapur', 'Krishnapur', 'Sitapur Kalan',
  'Mohanpur', 'Raghunathpur', 'Devipatan', 'Chandrapur', 'Surajpur'
];

export const ASHA_WORKERS = [
  'Sunita Devi', 'Meera Yadav', 'Kavita Singh', 'Rani Kumari', 'Geeta Devi',
  'Pushpa Verma', 'Anita Gupta', 'Rekha Patel', 'Savitri Devi', 'Mamta Sharma'
];

export const ANM_WORKERS = [
  'Priya Mishra (ANM)', 'Neha Tiwari (ANM)', 'Suman Pandey (ANM)', 'Ritu Agarwal (ANM)', 'Deepa Chauhan (ANM)'
];

const RISK_FACTORS_POOL = [
  'Anemia (Hb < 7)', 'Previous C-section', 'Gestational Diabetes', 'Pre-eclampsia',
  'Age > 35', 'Age < 18', 'Multiple pregnancy', 'Previous stillbirth',
  'Rh-negative blood', 'Placenta previa', 'Hypertension', 'Underweight BMI',
  'Previous PPH', 'Grand multipara (>4)', 'Thyroid disorder'
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateMotherId(index: number): string {
  return `UP-MCH-${String(index + 1).padStart(5, '0')}`;
}

const HINDI_NAMES = [
  'Priya Devi', 'Sita Kumari', 'Radha Yadav', 'Lakshmi Singh', 'Parvati Devi',
  'Saraswati Gupta', 'Durga Verma', 'Kiran Patel', 'Asha Kumari', 'Nirmala Devi',
  'Renu Singh', 'Pooja Yadav', 'Anita Devi', 'Babita Kumari', 'Champa Devi',
  'Draupadi Singh', 'Fatima Begum', 'Guddi Devi', 'Hemlata Verma', 'Indira Kumari',
  'Janki Devi', 'Kamla Singh', 'Lata Yadav', 'Manju Devi', 'Nisha Kumari',
  'Omwati Devi', 'Phoolmati Singh', 'Rajkumari Devi', 'Shanti Verma', 'Tulsi Devi',
  'Uma Kumari', 'Vidya Devi', 'Yasmin Begum', 'Zarina Khatoon', 'Afsana Begum',
  'Bhagwati Devi', 'Chanda Kumari', 'Devki Devi', 'Ela Singh', 'Firdaus Begum'
];

export function generateMothers(count: number = 40): Mother[] {
  return Array.from({ length: count }, (_, i) => {
    const gestWeeks = randomBetween(4, 40);
    const trimester = gestWeeks <= 12 ? 1 : gestWeeks <= 28 ? 2 : 3;
    const riskRoll = Math.random();
    const riskLevel = riskRoll < 0.15 ? 'critical' : riskRoll < 0.35 ? 'high' : riskRoll < 0.6 ? 'medium' : 'low';
    const riskCount = riskLevel === 'critical' ? randomBetween(3, 5) : riskLevel === 'high' ? randomBetween(2, 3) : riskLevel === 'medium' ? 1 : 0;
    const riskFactors: string[] = [];
    const pool = [...RISK_FACTORS_POOL];
    for (let r = 0; r < riskCount; r++) {
      const idx = Math.floor(Math.random() * pool.length);
      riskFactors.push(pool.splice(idx, 1)[0]);
    }
    const hb = riskLevel === 'critical' ? randomBetween(50, 70) / 10 : riskLevel === 'high' ? randomBetween(70, 90) / 10 : randomBetween(90, 130) / 10;
    const systolic = riskLevel === 'critical' ? randomBetween(150, 180) : riskLevel === 'high' ? randomBetween(130, 150) : randomBetween(100, 130);
    const diastolic = riskLevel === 'critical' ? randomBetween(95, 110) : riskLevel === 'high' ? randomBetween(85, 95) : randomBetween(60, 85);

    return {
      id: generateMotherId(i),
      name: HINDI_NAMES[i % HINDI_NAMES.length],
      age: randomBetween(18, 38),
      village: randomFrom(VILLAGES),
      block: randomFrom(BLOCKS),
      district: randomFrom(DISTRICTS.slice(0, 3)),
      phone: Math.random() > 0.3 ? `+91 ${randomBetween(70000, 99999)}${randomBetween(10000, 99999)}` : undefined,
      hasSmartphone: Math.random() > 0.55,
      gestationWeeks: gestWeeks,
      trimester: trimester as 1 | 2 | 3,
      riskLevel,
      riskFactors,
      assignedAsha: randomFrom(ASHA_WORKERS),
      assignedAnm: randomFrom(ANM_WORKERS),
      lastCheckup: `2026-03-${String(randomBetween(1, 28)).padStart(2, '0')}`,
      nextCheckup: `2026-04-${String(randomBetween(5, 25)).padStart(2, '0')}`,
      hemoglobin: hb,
      bloodPressure: `${systolic}/${diastolic}`,
      weight: randomBetween(42, 78),
      bloodGroup: randomFrom(['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-']),
      previousDeliveries: randomBetween(0, 4),
      registrationDate: `2026-0${randomBetween(1, 3)}-${String(randomBetween(1, 28)).padStart(2, '0')}`,
      expectedDeliveryDate: `2026-${String(randomBetween(4, 12)).padStart(2, '0')}-${String(randomBetween(1, 28)).padStart(2, '0')}`,
      status: 'active',
    };
  });
}

export function generateHospitals(): Hospital[] {
  return [
    { id: 'H001', name: 'King George Medical University', district: 'Lucknow', type: 'Medical College', totalBeds: 45, availableBeds: 12, hasBloodBank: true, hasNICU: true, hasOperationTheater: true, distance: 15 },
    { id: 'H002', name: 'District Women Hospital, Lucknow', district: 'Lucknow', type: 'District', totalBeds: 30, availableBeds: 8, hasBloodBank: true, hasNICU: true, hasOperationTheater: true, distance: 8 },
    { id: 'H003', name: 'CHC Mohanlalganj', district: 'Lucknow', type: 'CHC', totalBeds: 15, availableBeds: 5, hasBloodBank: false, hasNICU: false, hasOperationTheater: true, distance: 3 },
    { id: 'H004', name: 'PHC Bakshi Ka Talab', district: 'Lucknow', type: 'PHC', totalBeds: 6, availableBeds: 3, hasBloodBank: false, hasNICU: false, hasOperationTheater: false, distance: 2 },
    { id: 'H005', name: 'BHU Hospital', district: 'Varanasi', type: 'Medical College', totalBeds: 40, availableBeds: 10, hasBloodBank: true, hasNICU: true, hasOperationTheater: true, distance: 20 },
    { id: 'H006', name: 'District Hospital Varanasi', district: 'Varanasi', type: 'District', totalBeds: 25, availableBeds: 6, hasBloodBank: true, hasNICU: false, hasOperationTheater: true, distance: 12 },
    { id: 'H007', name: 'SN Medical College', district: 'Agra', type: 'Medical College', totalBeds: 35, availableBeds: 9, hasBloodBank: true, hasNICU: true, hasOperationTheater: true, distance: 18 },
    { id: 'H008', name: 'CHC Chinhat', district: 'Lucknow', type: 'CHC', totalBeds: 12, availableBeds: 4, hasBloodBank: false, hasNICU: false, hasOperationTheater: true, distance: 5 },
  ];
}

export function generateAmbulances(): Ambulance[] {
  return [
    { id: 'AMB-001', vehicleNumber: 'UP32-T-1082', currentLocation: 'Mohanlalganj', status: 'available' },
    { id: 'AMB-002', vehicleNumber: 'UP32-T-2045', currentLocation: 'Chinhat', status: 'available' },
    { id: 'AMB-003', vehicleNumber: 'UP32-T-3091', currentLocation: 'Bakshi Ka Talab', status: 'available' },
    { id: 'AMB-004', vehicleNumber: 'UP65-T-4023', currentLocation: 'Varanasi City', status: 'available' },
    { id: 'AMB-005', vehicleNumber: 'UP80-T-5067', currentLocation: 'Agra Cantt', status: 'available' },
    { id: 'AMB-006', vehicleNumber: 'UP32-T-6011', currentLocation: 'Sarojini Nagar', status: 'available' },
  ];
}

export function generateDistrictStats(): DistrictStats[] {
  return DISTRICTS.slice(0, 3).map(district => ({
    district,
    totalRegistered: randomBetween(800, 2500),
    highRisk: randomBetween(80, 300),
    criticalCases: randomBetween(10, 45),
    deliveriesThisMonth: randomBetween(50, 200),
    institutionalDeliveryRate: randomBetween(65, 92),
    antenatalCoverage: randomBetween(55, 88),
    aiCallsMade: randomBetween(200, 1500),
    tasksCompleted: randomBetween(300, 2000),
    escalations: randomBetween(5, 40),
  }));
}
