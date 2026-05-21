export interface EnrolmentRecord {
  regId: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  mobile: string;
  cnic: string;
  email: string;
  address: string;
  gender: string;
  laptop: 'Yes' | 'No';
  paymentPlan: 'Full' | 'Installment';
  civilStatus: string;
  discount: number;
  totalFee: number;
  baseFee: number;
  laptopFee: number;
  status: 'Pending' | 'Verified';
  nextDueDate: string;
  createdAt: string;
}

export type AppView = 'form' | 'login' | 'admin' | 'success';

export interface DropdownData {
  genders: string[];
  statuses: string[];
}
