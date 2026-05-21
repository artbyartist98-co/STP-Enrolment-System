import { useState, useEffect, useMemo, FormEvent } from 'react';
import {
  Search,
  Lock,
  Printer,
  Edit2,
  Plus,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Calendar,
  DollarSign,
  Laptop,
  Check,
  Building,
  Activity,
  User,
  LogOut,
  ChevronRight,
  ShieldAlert,
  Moon,
  Sun,
  Database,
  Download,
  Copy,
  Settings,
  RefreshCw,
  ExternalLink,
  FileText,
  Trash2
} from 'lucide-react';
import { EnrolmentRecord, AppView, DropdownData } from './types';
import AdminCharts from './components/AdminCharts';

// Seed Initial Data to sync with localStorage
const INITIAL_RECORDS: EnrolmentRecord[] = [
  {
    regId: '147796229041872',
    firstName: 'Faisal',
    lastName: 'Farrukh',
    fatherName: 'Farrukh Shahzad',
    mobile: '03001234567',
    cnic: '3520244005827',
    email: 'faisal.farrukh@example.com',
    address: 'House 24-B, Sector C, Shah Rukn-e-Alam, Multan',
    gender: 'Male',
    laptop: 'No',
    paymentPlan: 'Full',
    civilStatus: 'Civil',
    discount: 0,
    baseFee: 30000,
    laptopFee: 0,
    totalFee: 30000,
    status: 'Verified',
    nextDueDate: '2026-06-20',
    createdAt: '2026-05-19T10:30:00Z'
  },
  {
    regId: '147796229041873',
    firstName: 'Amna',
    lastName: 'Sajid',
    fatherName: 'Sajid Mahmood',
    mobile: '03217654321',
    cnic: '3120288495021',
    email: 'amna.sajid@example.com',
    address: 'Model Town A, Bahawalpur',
    gender: 'Female',
    laptop: 'Yes',
    paymentPlan: 'Installment',
    civilStatus: 'Civil',
    discount: 5000,
    baseFee: 30000,
    laptopFee: 3000,
    totalFee: 30000, // Civil minimum 30000
    status: 'Pending',
    nextDueDate: '2026-06-25',
    createdAt: '2026-05-20T14:22:00Z'
  },
  {
    regId: '147796229041874',
    firstName: 'Zubair',
    lastName: 'Ali',
    fatherName: 'Ali Hassan',
    mobile: '03335559992',
    cnic: '3120512345671',
    email: 'zubair.ali@example.com',
    address: 'Street 4, Bilal Colony, Bahawalpur',
    gender: 'Male',
    laptop: 'No',
    paymentPlan: 'Full',
    civilStatus: 'Military (Lower Rank)',
    discount: 10000,
    baseFee: 30000,
    laptopFee: 0,
    totalFee: 20000, // Non-civil can go below 30000
    status: 'Verified',
    nextDueDate: '2026-06-20',
    createdAt: '2026-05-20T16:45:00Z'
  }
];

export default function App() {
  // Splash Loader status
  const [loading, setLoading] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<AppView>('form');
  const [records, setRecords] = useState<EnrolmentRecord[]>([]);

  // Form step state (1, 2, or 3)
  const [formStep, setFormStep] = useState<number>(1);
  const [role, setRole] = useState<'student' | 'admin'>('student');

  // Search filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Authentication
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Custom admin password configuration
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('rohi_admin_password') || 'admin123';
  });
  const [currentPassChange, setCurrentPassChange] = useState<string>('');
  const [newPassChange, setNewPassChange] = useState<string>('');
  const [confirmPassChange, setConfirmPassChange] = useState<string>('');

  // New enrolment form fields
  const [newFirstName, setNewFirstName] = useState<string>('');
  const [newLastName, setNewLastName] = useState<string>('');
  const [newFatherName, setNewFatherName] = useState<string>('');
  const [newMobile, setNewMobile] = useState<string>('');
  const [newCnic, setNewCnic] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newAddress, setNewAddress] = useState<string>('');
  const [newGender, setNewGender] = useState<string>('Male');
  const [newLaptop, setNewLaptop] = useState<'Yes' | 'No'>('No');
  const [newPaymentPlan, setNewPaymentPlan] = useState<'Full' | 'Installment'>('Full');
  const [newCivilStatus, setNewCivilStatus] = useState<string>('Civil');
  const [newDiscount, setNewDiscount] = useState<number>(0);
  const [newNextDueDate, setNewNextDueDate] = useState<string>('');
  const [newStatus, setNewStatus] = useState<'Pending' | 'Verified'>('Pending');

  // Notification / Toast
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'err' | 'info' } | null>(null);

  // Success screen display record
  const [submittedRecord, setSubmittedRecord] = useState<EnrolmentRecord | null>(null);

  // Print voucher focus state
  const [voucherRecord, setVoucherRecord] = useState<EnrolmentRecord | null>(null);

  // Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);

  // Edit Fields
  const [editFirstName, setEditFirstName] = useState<string>('');
  const [editLastName, setEditLastName] = useState<string>('');
  const [editFatherName, setEditFatherName] = useState<string>('');
  const [editMobile, setEditMobile] = useState<string>('');
  const [editCnic, setEditCnic] = useState<string>('');
  const [editEmail, setEditEmail] = useState<string>('');
  const [editAddress, setEditAddress] = useState<string>('');
  const [editGender, setEditGender] = useState<string>('Male');
  const [editLaptop, setEditLaptop] = useState<'Yes' | 'No'>('No');
  const [editCivilStatus, setEditCivilStatus] = useState<string>('Civil');
  const [editDiscount, setEditDiscount] = useState<number>(0);
  const [editPaymentPlan, setEditPaymentPlan] = useState<'Full' | 'Installment'>('Full');
  const [editStatus, setEditStatus] = useState<'Pending' | 'Verified'>('Pending');
  const [editNextDueDate, setEditNextDueDate] = useState<string>('');

  // ── GOOGLE SHEETS APPS SCRIPT INTEGRATION STATE ──
  const [appsScriptUrl, setAppsScriptUrl] = useState<string>(() => {
    return localStorage.getItem('rohi_apps_script_url') || '';
  });
  const [autoSheetsSync, setAutoSheetsSync] = useState<boolean>(() => {
    return localStorage.getItem('rohi_auto_sheets_sync') === 'true';
  });
  const [syncingStatus, setSyncingStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => {
    return localStorage.getItem('rohi_last_sync_time') || '';
  });

  // Automatically save configuration options to localStorage
  useEffect(() => {
    localStorage.setItem('rohi_apps_script_url', appsScriptUrl);
  }, [appsScriptUrl]);

  useEffect(() => {
    localStorage.setItem('rohi_auto_sheets_sync', autoSheetsSync ? 'true' : 'false');
  }, [autoSheetsSync]);

  // Synchronize a specific record (asynchronously with fail-safes)
  const syncRecordToSheets = async (record: EnrolmentRecord, overrideUrl = appsScriptUrl) => {
    const url = overrideUrl.trim();
    if (!url) return;

    try {
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors', // Solves Google Apps Script cross-origin redirect sandboxing
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'addRecord',
          record: {
            ...record,
            createdAtFormatted: new Date(record.createdAt).toLocaleString('en-US'),
            totalFeeFormatted: `${record.totalFee} PKR`
          }
        })
      });
      console.log('Synchronized to Google Sheet successfully');
    } catch (err) {
      console.error('Failed to auto-sync to Google Sheets:', err);
    }
  };

  // Synchronize all existing records in database to Google Sheets
  const handleBulkSyncToSheets = async () => {
    const url = appsScriptUrl.trim();
    if (!url) {
      showToast('Please provide a Google Apps Script Web App URL first.', 'err');
      return;
    }

    setSyncingStatus('syncing');
    showToast('Uploading records to Google Sheets...', 'info');

    try {
      // Create request payload
      const payload = {
        action: 'bulkSync',
        records: records.map(r => ({
          ...r,
          createdAtFormatted: r.createdAt ? new Date(r.createdAt).toLocaleString('en-US') : '',
          totalFeeFormatted: `${r.totalFee} PKR`
        }))
      };

      await fetch(url, {
        method: 'POST',
        mode: 'no-cors', // Web app returns status redirection which naturally trips CORS but finishes execution safely
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const nowStr = new Date().toLocaleString();
      setLastSyncTime(nowStr);
      localStorage.setItem('rohi_last_sync_time', nowStr);
      setSyncingStatus('success');
      showToast('All records successfully synchronized with Google Sheet!', 'success');
    } catch (err) {
      console.error('Google Sheets sync failed:', err);
      setSyncingStatus('error');
      showToast('Error syncing with Google Apps Script Web App.', 'err');
    }
  };

  // Test connection with Google Sheets Apps Script Web App
  const handleTestConnection = async () => {
    const url = appsScriptUrl.trim();
    if (!url) {
      showToast('Please provide a Google Apps Script Web App URL first.', 'err');
      return;
    }

    setSyncingStatus('syncing');
    showToast('Testing Web Service endpoint connection...', 'info');

    try {
      await fetch(url, {
        method: 'GET',
        mode: 'no-cors'
      });
      setSyncingStatus('idle');
      showToast('Connection handshake successful! Web app has responded.', 'success');
    } catch (err) {
      console.error('Connection check failed:', err);
      setSyncingStatus('error');
      showToast('Could not handshake. Please verify your Web App URL deployment.', 'err');
    }
  };

  // Export records to CSV
  const handleExportCSV = () => {
    if (records.length === 0) {
      showToast('No records available to export.', 'err');
      return;
    }

    const headers = [
      'Application ID',
      'First Name',
      'Last Name',
      'Father Name',
      'Email Address',
      'Mobile No',
      'CNIC',
      'Address',
      'Gender',
      'Laptop Needed',
      'Payment Plan',
      'Civil Status',
      'Discount Applied (PKR)',
      'Net Total Fee (PKR)',
      'Base Fee (PKR)',
      'Laptop Fee (PKR)',
      'Ledger Status',
      'Next Due Date',
      'Submission Date'
    ];

    const rows = records.map(rec => [
      `"${rec.regId}"`,
      `"${(rec.firstName || '').replace(/"/g, '""')}"`,
      `"${(rec.lastName || '').replace(/"/g, '""')}"`,
      `"${(rec.fatherName || '').replace(/"/g, '""')}"`,
      `"${(rec.email || '').replace(/"/g, '""')}"`,
      `"${(rec.mobile || '').replace(/"/g, '""')}"`,
      `"${(rec.cnic || '').replace(/"/g, '""')}"`,
      `"${(rec.address || '').replace(/"/g, '""')}"`,
      `"${rec.gender || ''}"`,
      rec.laptop ? 'Yes' : 'No',
      `"${rec.paymentPlan || 'Full'}"`,
      `"${rec.civilStatus || ''}"`,
      rec.discount || 0,
      rec.totalFee || 0,
      rec.baseFee || 30000,
      rec.laptopFee || 0,
      `"${rec.status || 'Pending'}"`,
      `"${rec.nextDueDate || ''}"`,
      `"${rec.createdAt || ''}"`
    ]);

    const csvContent = "\ufeff" + [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `STP_Enrolments_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Student ledger CSV successfully exported!', 'success');
  };

  // Trigger splash screen
  useEffect(() => {
    // Read from localStorage
    const saved = localStorage.getItem('rohi_enrolments');
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch (e) {
        setRecords(INITIAL_RECORDS);
      }
    } else {
      setRecords(INITIAL_RECORDS);
      localStorage.setItem('rohi_enrolments', JSON.stringify(INITIAL_RECORDS));
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Save changes to localStorage whenever records update
  const saveRecords = (updated: EnrolmentRecord[]) => {
    setRecords(updated);
    localStorage.setItem('rohi_enrolments', JSON.stringify(updated));
  };

  // Helper to show Toast popup
  const showToast = (text: string, type: 'success' | 'err' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Log in as standard admin
  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim().toLowerCase() === 'admin' && passwordInput === adminPassword) {
      setRole('admin');
      setActiveView('admin');
      showToast('Successfully Logged in as Administrator', 'success');
      setAuthError('');
      setUsernameInput('');
      setPasswordInput('');
    } else {
      setAuthError(`Invalid Admin Username or Password. Hint: admin / ${adminPassword === 'admin123' ? 'admin123' : '(your custom password)'}`);
      showToast('Authentication failed', 'err');
    }
  };

  // Handle changing the administrator password
  const handleChangePassword = (e: FormEvent) => {
    e.preventDefault();
    if (!currentPassChange || !newPassChange || !confirmPassChange) {
      showToast('Please fill out all fields in the security console.', 'err');
      return;
    }
    if (currentPassChange !== adminPassword) {
      showToast('The current password you entered is incorrect.', 'err');
      return;
    }
    if (newPassChange.length < 5) {
      showToast('The new password must be at least 5 characters long.', 'err');
      return;
    }
    if (newPassChange !== confirmPassChange) {
      showToast('The new password and confirmation do not match.', 'err');
      return;
    }

    setAdminPassword(newPassChange);
    localStorage.setItem('rohi_admin_password', newPassChange);
    setCurrentPassChange('');
    setNewPassChange('');
    setConfirmPassChange('');
    showToast('Admin access password changed successfully!', 'success');
  };

  // Log out Admin
  const handleLogout = () => {
    setRole('student');
    setActiveView('form');
    setFormStep(1);
    showToast('Logged out of Admin Space', 'info');
  };

  // Auto pre-fill due dates helper
  useEffect(() => {
    if (!newNextDueDate) {
      const d = new Date();
      d.setDate(d.getDate() + 30);
      setNewNextDueDate(d.toISOString().slice(0, 10)); // YYYY-MM-DD
    }
  }, [newNextDueDate]);

  // Force Full package payment plan if student role is active
  useEffect(() => {
    if (role === 'student') {
      setNewPaymentPlan('Full');
    }
  }, [role]);

  // Recalculate enrolment fee based on guidelines
  const calculateTotalFee = (
    laptopRequired: 'Yes' | 'No',
    civilStatus: string,
    discountAmount: number
  ) => {
    const base = 30000;
    const laptop = laptopRequired === 'Yes' ? 3000 : 0;
    const discount = Number(discountAmount) || 0;
    let total = base + laptop - discount;

    // Minimum 30,000 PKR cap for normal Civil profiles
    if (civilStatus === 'Civil' && total < 30000) {
      total = 30000;
    }
    return {
      total,
      base,
      laptop
    };
  };

  // Dynamic fee calculation for NEW form
  const currentNewFeeLayout = useMemo(() => {
    return calculateTotalFee(newLaptop, newCivilStatus, newDiscount);
  }, [newLaptop, newCivilStatus, newDiscount]);

  // Dynamic fee calculation for EDIT form
  const currentEditFeeLayout = useMemo(() => {
    return calculateTotalFee(editLaptop, editCivilStatus, editDiscount);
  }, [editLaptop, editCivilStatus, editDiscount]);

  // Handle Form Submission (Both student-facing and admin new enrollment creation)
  const handleEnrolSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Verify fields in confirming state
    if (!newFirstName || !newLastName || !newCnic || !newMobile || !newEmail || !newAddress) {
      showToast('Please verify all required fields on Step 1 before submitting', 'err');
      setFormStep(1);
      return;
    }

    // Generate unique 15-digit application ID
    const generatedRegId = Math.floor(Math.random() * 900000000000000 + 100000000000000).toString();

    const prices = calculateTotalFee(newLaptop, newCivilStatus, newDiscount);

    const newRecord: EnrolmentRecord = {
      regId: generatedRegId,
      firstName: newFirstName.trim(),
      lastName: newLastName.trim(),
      fatherName: newFatherName.trim() || 'Not Provided',
      mobile: newMobile.trim(),
      cnic: newCnic.trim(),
      email: newEmail.trim(),
      address: newAddress.trim(),
      gender: newGender,
      laptop: newLaptop,
      paymentPlan: role === 'admin' ? newPaymentPlan : 'Full',
      civilStatus: role === 'admin' ? newCivilStatus : 'Civil',
      discount: role === 'admin' ? newDiscount : 0,
      baseFee: prices.base,
      laptopFee: prices.laptop,
      totalFee: role === 'admin' ? prices.total : prices.base + prices.laptop, // Since student has 0 discount
      status: role === 'admin' ? newStatus : 'Pending',
      nextDueDate: newNextDueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      createdAt: new Date().toISOString()
    };

    const updated = [newRecord, ...records];
    saveRecords(updated);

    // If Google Sheets auto-sync is enabled, push the new registration in background
    if (autoSheetsSync && appsScriptUrl) {
      syncRecordToSheets(newRecord);
    }

    // Save as currently processed
    setSubmittedRecord(newRecord);
    setVoucherRecord(newRecord);

    // Clear form
    setNewFirstName('');
    setNewLastName('');
    setNewFatherName('');
    setNewMobile('');
    setNewCnic('');
    setNewEmail('');
    setNewAddress('');
    setNewGender('Male');
    setNewLaptop('No');
    setNewPaymentPlan('Full');
    setNewCivilStatus('Civil');
    setNewDiscount(0);
    setNewStatus('Pending');

    setActiveView('success');
    showToast('Enrolment recorded successfully & Voucher Generated!', 'success');
  };

  // Navigate forward in multi-step student-facing / staff form
  const validateAndNextStep = (target: number) => {
    if (target === 2) {
      if (!newFirstName || !newLastName || !newFatherName || !newMobile || !newCnic || !newEmail || !newAddress) {
        showToast('Please fill out all personal details on Step 1', 'err');
        return;
      }
      // Simple phone/cnic structure advice
      if (newCnic.length < 10) {
        showToast('Please check CNIC number length', 'info');
      }
    }
    setFormStep(target);
  };

  // Verify Record Status from table directly
  const handleVerifyStatus = (regId: string) => {
    let affectedRecord: EnrolmentRecord | null = null;
    const updated = records.map(r => {
      if (r.regId === regId) {
        affectedRecord = { ...r, status: 'Verified' as const };
        return affectedRecord;
      }
      return r;
    });
    saveRecords(updated);
    showToast(`Application ${regId} successfully verified!`, 'success');

    // Sync updated status to Google Sheets
    if (autoSheetsSync && appsScriptUrl && affectedRecord) {
      syncRecordToSheets(affectedRecord);
    }
  };

  // Delete Record from list of enrollments
  const handleDeleteRecord = (regId: string) => {
    const updated = records.filter(r => r.regId !== regId);
    saveRecords(updated);
    setConfirmDeleteId(null);
    showToast(`Enrolment record ${regId} successfully deleted.`, 'success');
  };

  // Open Edit Dialog
  const handleOpenEdit = (r: EnrolmentRecord) => {
    setEditingRecordId(r.regId);
    setEditFirstName(r.firstName);
    setEditLastName(r.lastName);
    setEditFatherName(r.fatherName);
    setEditMobile(r.mobile);
    setEditCnic(r.cnic);
    setEditEmail(r.email);
    setEditAddress(r.address);
    setEditGender(r.gender);
    setEditLaptop(r.laptop);
    setEditCivilStatus(r.civilStatus);
    setEditDiscount(r.discount);
    setEditPaymentPlan(r.paymentPlan);
    setEditStatus(r.status);
    setEditNextDueDate(r.nextDueDate);

    setIsEditModalOpen(true);
  };

  // Save changes from Edit Modal
  const handleSaveEdit = (andPrint: boolean) => {
    if (!editingRecordId) return;

    if (!editFirstName.trim() || !editLastName.trim() || !editCnic.trim()) {
      showToast('Student Name, Last Name and CNIC are required.', 'err');
      return;
    }

    const prices = calculateTotalFee(editLaptop, editCivilStatus, editDiscount);

    const updatedRecords = records.map(r => {
      if (r.regId === editingRecordId) {
        return {
          ...r,
          firstName: editFirstName.trim(),
          lastName: editLastName.trim(),
          fatherName: editFatherName.trim(),
          mobile: editMobile.trim(),
          cnic: editCnic.trim(),
          email: editEmail.trim(),
          address: editAddress.trim(),
          gender: editGender,
          laptop: editLaptop,
          civilStatus: editCivilStatus,
          discount: editDiscount,
          paymentPlan: editPaymentPlan,
          status: editStatus,
          nextDueDate: editNextDueDate,
          baseFee: prices.base,
          laptopFee: prices.laptop,
          totalFee: prices.total
        };
      }
      return r;
    });

    saveRecords(updatedRecords);

    // Filter out our current edited record
    const updatedRecord = updatedRecords.find(r => r.regId === editingRecordId);
    if (updatedRecord) {
      setVoucherRecord(updatedRecord);
    }

    // Sync edited record to Sheets
    if (autoSheetsSync && appsScriptUrl && updatedRecord) {
      syncRecordToSheets(updatedRecord);
    }

    setIsEditModalOpen(false);
    setEditingRecordId(null);
    showToast('Enrolment records changed successfully.', 'success');

    if (andPrint && updatedRecord) {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  };

  // Trigger quick voucher printing from the grid/table
  const handlePrintVoucherDirect = (r: EnrolmentRecord) => {
    setVoucherRecord(r);
    showToast('Preparing slip print interface...', 'info');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  // Filter records based on search bar
  const filteredRecords = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return records;
    return records.filter(r =>
      r.regId.includes(q) ||
      `${r.firstName} ${r.lastName}`.toLowerCase().includes(q) ||
      r.cnic.includes(q) ||
      (r.fatherName && r.fatherName.toLowerCase().includes(q))
    );
  }, [records, searchQuery]);

  // Statistics calculation
  const stats = useMemo(() => {
    return {
      total: records.length,
      pending: records.filter(r => r.status === 'Pending').length,
      verified: records.filter(r => r.status === 'Verified').length,
      installment: records.filter(r => r.paymentPlan === 'Installment').length
    };
  }, [records]);

  // Handle printing action
  const triggerPrintService = () => {
    window.print();
  };

  // Auto layout spacing heights calculator for pristine voucher representation
  const emptyRowCounts = useMemo(() => {
    if (!voucherRecord) return 8;
    // For installments, we have more rows in tables, so we render fewer blank lines to ensure A4 compatibility
    return voucherRecord.paymentPlan === 'Installment' ? 6 : 9;
  }, [voucherRecord]);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* ── SPARKLY LOADER OVERLAY ── */}
      {loading && (
        <div id="loader" className="transition-all duration-500 ease-in-out">
          <img
            src="https://raw.githubusercontent.com/artbyartist98-co/stp-assets/main/logo.png"
            className="bounce w-32 h-32 object-contain"
            alt="Rohi Logo"
            referrerPolicy="no-referrer"
          />
          <h6 className="mt-6 text-xl font-bold tracking-wider text-[#004173] text-uppercase">
            STP Bahawalpur
          </h6>
          <p className="text-gray-400 text-xs mt-1 font-medium select-none">
            Rohi eSkills Learning Hub
          </p>
        </div>
      )}

      {/* ── TOAST NOTIFICATION ── */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 animate-bounce cursor-pointer shadow-xl rounded-md overflow-hidden no-print">
          <div
            className={`flex items-center gap-3 px-5 py-3 ${
              toastMessage.type === 'success'
                ? 'bg-emerald-600 text-white'
                : toastMessage.type === 'err'
                ? 'bg-red-600 text-white'
                : 'bg-blue-600 text-white'
            }`}
          >
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-xs font-semibold">{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* ── DECORATIVE PORTAL NAVIGATION (NO PRINT) ── */}
      <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="https://rohieskillslearninghub.com/" className="flex items-center gap-2">
              <img
                src="https://raw.githubusercontent.com/artbyartist98-co/stp-assets/main/logo.png"
                alt="Hub Logo"
                className="h-11 w-11 object-contain"
                referrerPolicy="no-referrer"
              />
              <div className="hidden sm:block">
                <span className="block text-sm font-bold text-gray-900 tracking-tight leading-none">
                  Rohi eSkills Hub
                </span>
                <span className="text-[10px] text-gray-500 font-semibold tracking-wider">
                  STP BAHAWALPUR
                </span>
              </div>
            </a>
          </div>

          <div className="flex items-center gap-3">
            {role === 'admin' ? (
              <>
                <button
                  onClick={() => {
                    setActiveView('admin');
                  }}
                  className={`text-xs px-4 py-2 rounded-md font-semibold transition ${
                    activeView === 'admin'
                      ? 'bg-[#004173] text-white'
                      : 'border border-[#004173] text-[#004173] hover:bg-gray-50'
                  }`}
                >
                  Admin Panel
                </button>
                <button
                  onClick={() => {
                    setFormStep(1);
                    setActiveView('form');
                  }}
                  className={`text-xs px-4 py-2 rounded-md font-semibold transition ${
                    activeView === 'form'
                      ? 'bg-[#004173] text-white'
                      : 'border border-[#004173] text-[#004173] hover:bg-gray-50'
                  }`}
                >
                  Direct Entry
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-50 text-red-600 hover:bg-red-100 text-xs px-3 py-2 rounded-md font-semibold flex items-center gap-1 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setFormStep(1);
                    setActiveView('form');
                  }}
                  className="bg-[#004173] hover:bg-[#2491bf] text-white text-xs px-5 py-2 rounded-md font-semibold transition"
                >
                  Enroll Now
                </button>
                <button
                  onClick={() => setActiveView('login')}
                  className="border border-[#004173] text-[#004173] hover:bg-gray-50 text-xs px-4 py-2 rounded-md font-semibold flex items-center gap-1.5 transition"
                >
                  <Lock className="w-3 h-3" />
                  <span>LMS Login</span>
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── CORE SPA SCENE GRAPH (NO PRINT) ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full no-print">
        {/* VIEW 1: STUDENT / STAFF ENROLMENT FORM */}
        {activeView === 'form' && (
          <div className="enrollment-container">
            <div className="form-header">
              <h3 className="text-xl font-bold tracking-tight">Executive Program Enrollment</h3>
              <p className="text-xs tracking-wider opacity-90 mt-1">
                eBay &amp; TikTok Shop Mastery Program · STP Bahawalpur
              </p>
            </div>

            {/* Step indicators */}
            <div className="progress-steps bg-gray-50">
              <div
                onClick={() => formStep > 1 && setFormStep(1)}
                className={`step cursor-pointer ${formStep >= 1 ? 'active' : ''}`}
                id="s1"
              >
                <div className="step-number text-xs">1</div>
                <span className="step-label">PERSONAL PROFILE</span>
              </div>
              <div
                onClick={() => {
                  if (newFirstName && newLastName && newCnic && newMobile) {
                    setFormStep(2);
                  }
                }}
                className={`step cursor-pointer ${formStep >= 2 ? 'active' : ''}`}
                id="s2"
              >
                <div className="step-number text-xs">2</div>
                <span className="step-label">COURSE DETAILS</span>
              </div>
              <div
                onClick={() => {
                  if (newFirstName && newLastName && newCnic && newMobile) {
                    setFormStep(3);
                  }
                }}
                className={`step cursor-pointer ${formStep >= 3 ? 'active' : ''}`}
                id="s3"
              >
                <div className="step-number text-xs">3</div>
                <span className="step-label">CONFIRMATION</span>
              </div>
            </div>

            <div className="form-inner">
              <form onSubmit={handleEnrolSubmit}>
                {/* STEP 1: Personal Profile Info */}
                {formStep === 1 && (
                  <div className="space-y-6">
                    <div className="card-box bg-white">
                      <div className="card-title text-[#004173] font-bold border-b border-gray-100 pb-2 mb-4">
                        Applicant Personal Information
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            First Name <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={newFirstName}
                            onChange={(e) => setNewFirstName(e.target.value)}
                            className="form-control w-full p-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-sky-500 text-xs"
                            placeholder="Enter first name"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Last Name <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={newLastName}
                            onChange={(e) => setNewLastName(e.target.value)}
                            className="form-control w-full p-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-sky-500 text-xs"
                            placeholder="Enter last name"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Father's Name <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={newFatherName}
                            onChange={(e) => setNewFatherName(e.target.value)}
                            className="form-control w-full p-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-sky-500 text-xs"
                            placeholder="Enter Father's name"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Phone Number <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="tel"
                            value={newMobile}
                            onChange={(e) => setNewMobile(e.target.value)}
                            className="form-control w-full p-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-sky-500 text-xs"
                            placeholder="e.g. 03001234567"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            CNIC Number <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={newCnic}
                            onChange={(e) => setNewCnic(e.target.value)}
                            className="form-control w-full p-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-sky-500 text-xs"
                            placeholder="13-digit CNIC e.g. 3520244005827"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Email Address <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="form-control w-full p-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-sky-500 text-xs"
                            placeholder="e.g. name@example.com"
                            required
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Residential Address <span className="text-rose-500">*</span>
                          </label>
                          <textarea
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                            className="form-control w-full p-2.5 border border-gray-200 rounded-md focus:outline-none focus:border-sky-500 text-xs"
                            rows={3}
                            placeholder="Complete residential address details"
                            required
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => validateAndNextStep(2)}
                        className="bg-[#004173] hover:bg-[#2491bf] text-white px-8 py-2.5 rounded-md font-semibold text-xs flex items-center gap-1 transition"
                      >
                        <span>Next Step</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Program and Option parameters */}
                {formStep === 2 && (
                  <div className="space-y-6">
                    <div className="card-box bg-white">
                      <div className="card-title text-[#004173] font-bold border-b border-gray-100 pb-2 mb-4">
                        Program and Billing Options
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Selected Course Program
                          </label>
                          <input
                            type="text"
                            value="eBay &amp; TikTok Shop Mastery"
                            readOnly
                            className="form-control w-full p-2.5 bg-gray-50 border border-gray-200 rounded-md text-gray-600 font-semibold text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Gender
                          </label>
                          <select
                            value={newGender}
                            onChange={(e) => setNewGender(e.target.value)}
                            className="form-select w-full p-2.5 border border-gray-200 rounded-md text-xs"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Laptop Required?
                          </label>
                          <select
                            value={newLaptop}
                            onChange={(e) => setNewLaptop(e.target.value as 'Yes' | 'No')}
                            className="form-select w-full p-2.5 border border-gray-200 rounded-md text-xs"
                          >
                            <option value="No">No</option>
                            <option value="Yes">Yes (+3,000 PKR)</option>
                          </select>
                        </div>

                        {/* Admin space values toggle */}
                        {role === 'admin' ? (
                          <div className="md:col-span-2 border-t border-dashed border-red-200 pt-4 mt-2">
                            <div className="bg-red-50/50 p-4 rounded-xl border border-rose-100">
                              <h5 className="text-red-800 text-xs font-bold uppercase tracking-wider mb-3">
                                Staff Administrative Overrides
                              </h5>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                                    Civil/Military Status
                                  </label>
                                  <select
                                    value={newCivilStatus}
                                    onChange={(e) => setNewCivilStatus(e.target.value)}
                                    className="form-select w-full p-2 border border-gray-200 rounded text-xs bg-white"
                                  >
                                    <option value="Civil">Civil</option>
                                    <option value="Military (Officer Rank)">
                                      Military (Officer Rank)
                                    </option>
                                    <option value="Military (Lower Rank)">
                                      Military (Lower Rank)
                                    </option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                                    Direct Discount (PKR)
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={newDiscount}
                                    onChange={(e) => setNewDiscount(Number(e.target.value) || 0)}
                                    className="form-control w-full p-2 border border-gray-200 rounded text-xs bg-white"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                                    Registration Status
                                  </label>
                                  <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value as 'Pending' | 'Verified')}
                                    className="form-select w-full p-2 border border-gray-200 rounded text-xs bg-white"
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Verified">Verified</option>
                                  </select>
                                </div>
                              </div>

                              <div className="mt-3 flex items-center justify-between text-xs bg-white p-2.5 rounded border border-rose-100 font-semibold">
                                <span className="text-gray-600">Calculated Course Fee:</span>
                                <span className="text-[#004173] text-sm">
                                  {currentNewFeeLayout.total.toLocaleString()} PKR
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : null}

                        {/* Payment Plan selector (Only visible to admin) */}
                        {role === 'admin' && (
                          <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-gray-700 mb-2">
                              Select Payment Schedule
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div
                                onClick={() => setNewPaymentPlan('Full')}
                                className={`plan-card ${newPaymentPlan === 'Full' ? 'selected' : ''}`}
                              >
                                <input
                                  type="radio"
                                  checked={newPaymentPlan === 'Full'}
                                  onChange={() => setNewPaymentPlan('Full')}
                                  className="mr-2"
                                />
                                <div>
                                  <span className="plan-label block">Full Package Payment</span>
                                  <span className="plan-desc block">
                                    Pay whole amount in single billing — 30,000 PKR
                                  </span>
                                </div>
                              </div>

                              <div
                                onClick={() => {
                                  if (role === 'admin') {
                                    setNewPaymentPlan('Installment');
                                  } else {
                                    showToast('🔒 Installment plans are only available via Admin Desk registration.', 'info');
                                  }
                                }}
                                className={`plan-card ${newPaymentPlan === 'Installment' ? 'selected' : ''} ${
                                  role !== 'admin' ? 'opacity-60 cursor-not-allowed bg-gray-50/50 hover:bg-gray-50/55' : ''
                                }`}
                              >
                                <input
                                  type="radio"
                                  checked={newPaymentPlan === 'Installment'}
                                  disabled={role !== 'admin'}
                                  onChange={() => {
                                    if (role === 'admin') {
                                      setNewPaymentPlan('Installment');
                                    }
                                  }}
                                  className={`mr-2 ${role !== 'admin' ? 'cursor-not-allowed' : ''}`}
                                />
                                <div>
                                  <span className="plan-label block flex items-center gap-1.5">
                                    <span>Split 2 Installments</span>
                                    {role !== 'admin' && (
                                      <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                        🔒 Admin Only
                                      </span>
                                    )}
                                  </span>
                                  <span className="plan-desc block">
                                    {role === 'admin' 
                                      ? '1st: 15,000 PKR now · 2nd: 15,000 PKR due later'
                                      : 'Please contact STP administration to apply for instalment verification.'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Due Date Option for installment plan */}
                        {newPaymentPlan === 'Installment' && (
                          <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                              2nd Installment Due Date
                            </label>
                            <input
                              type="date"
                              value={newNextDueDate}
                              onChange={(e) => setNewNextDueDate(e.target.value)}
                              className="form-control w-full sm:w-60 p-2.5 border border-sky-200 rounded-md focus:outline-none text-xs"
                            />
                            <p className="text-[10px] text-gray-400 mt-1">
                              This deadline date is printed on the dual voucher copies for the student's next installment deadline.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setFormStep(1)}
                        className="border border-[#004173] text-[#004173] hover:bg-gray-50 px-6 py-2.5 rounded-md font-semibold text-xs flex items-center gap-1 transition"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => validateAndNextStep(3)}
                        className="bg-[#004173] hover:bg-[#2491bf] text-white px-8 py-2.5 rounded-md font-semibold text-xs flex items-center gap-1 transition"
                      >
                        <span>Confirm Enrollment</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Read review summary info before submitting */}
                {formStep === 3 && (
                  <div className="space-y-6 animate-fade-in-quick">
                    <div className="card-box bg-white text-center py-8">
                      <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                      <h4 className="text-lg font-bold text-gray-900">Are you ready to submit details?</h4>
                      <p className="text-gray-500 text-xs mt-1 max-w-lg mx-auto">
                        Please review the details of your application below. Clicking submit initiates registration and generates your course voucher.
                      </p>

                      <div className="text-left mt-8 max-w-xl mx-auto p-4 rounded-xl bg-sky-50/50 border border-sky-100/80 text-xs space-y-2.5">
                        <div className="flex justify-between border-b border-sky-100/50 pb-2">
                          <span className="font-semibold text-gray-500">Student Profile:</span>
                          <span className="font-bold text-gray-800">
                            {newFirstName} {newLastName}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-sky-100/50 pb-2">
                          <span className="font-semibold text-gray-500">Father's Name:</span>
                          <span className="font-medium text-gray-800">{newFatherName || '—'}</span>
                        </div>
                        <div className="flex justify-between border-b border-sky-100/50 pb-2">
                          <span className="font-semibold text-gray-500">National CNIC:</span>
                          <span className="font-medium font-mono text-gray-800">{newCnic}</span>
                        </div>
                        <div className="flex justify-between border-b border-sky-100/50 pb-2">
                          <span className="font-semibold text-gray-500">Program Target:</span>
                          <span className="font-semibold text-[#004173]">
                            eBay &amp; TikTok Shop Mastery
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-sky-100/50 pb-2">
                          <span className="font-semibold text-gray-500">Option Laptop:</span>
                          <span className="font-medium text-gray-800">
                            {newLaptop === 'Yes' ? 'Yes (+3,000 PKR)' : 'No'}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-sky-100/50 pb-2">
                          <span className="font-semibold text-gray-500">Payment Plan chosen:</span>
                          <span className="font-bold text-gray-800">
                            {newPaymentPlan === 'Installment'
                              ? '2 Installments'
                              : 'Full Course Package'}
                          </span>
                        </div>

                        {role === 'admin' ? (
                          <>
                            <div className="flex justify-between border-b border-rose-100/50 pb-2 pt-1 text-red-800 font-semibold bg-rose-50/50 px-1">
                              <span>Override Discount Applied:</span>
                              <span>{newDiscount.toLocaleString()} PKR</span>
                            </div>
                            <div className="flex justify-between border-b border-rose-100/50 pb-2 text-red-800 font-semibold bg-rose-50/50 px-1">
                              <span>Civilian / Military Category:</span>
                              <span>{newCivilStatus}</span>
                            </div>
                          </>
                        ) : null}

                        <div className="flex justify-between text-sm pt-2 text-[#004173] font-bold">
                          <span>Calculated Amount Due:</span>
                          <span>
                            {(role === 'admin'
                              ? currentNewFeeLayout.total
                              : Number(30000 + (newLaptop === 'Yes' ? 3000 : 0))
                            ).toLocaleString()}{' '}
                            PKR
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setFormStep(2)}
                        className="border border-[#004173] text-[#004173] hover:bg-gray-50 px-6 py-2.5 rounded-md font-semibold text-xs flex items-center gap-1 transition"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>

                      <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-md font-semibold text-xs flex items-center gap-1.5 transition shadow"
                      >
                        <Check className="w-4 h-4" />
                        <span>Submit &amp; Generate Voucher</span>
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* VIEW 2: SUCCESS ENROLMENT SCREEN */}
        {activeView === 'success' && submittedRecord && (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center animate-fade-in-quick">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900">Registration Complete!</h2>
            <p className="text-gray-500 text-xs mt-1">
              Your profile has been processed into Software Technology Park Bahawalpur system.
            </p>

            <div className="my-6 p-4 bg-gray-50 rounded-xl max-w-xs mx-auto">
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider block">
                Your Registration ID
              </span>
              <span className="text-lg font-mono font-bold text-gray-900 block mt-1 tracking-wider leading-none">
                {submittedRecord.regId}
              </span>
            </div>

            {submittedRecord.paymentPlan === 'Installment' && (
              <div className="bg-sky-50 text-sky-700 border border-sky-100 rounded-xl p-3.5 text-xs text-left max-w-md mx-auto space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-600 block"></span>
                  Active Split Plan Installment Details
                </span>
                <p className="pl-3.5 font-medium leading-relaxed">
                  1st Installment Due Today: <strong>15,000 PKR</strong> <br />
                  2nd Installment Deadline: <strong>{submittedRecord.nextDueDate}</strong>
                </p>
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setVoucherRecord(submittedRecord);
                  triggerPrintService();
                }}
                className="bg-[#004173] hover:bg-[#2491bf] text-white font-bold text-xs px-8 py-3 rounded-lg flex items-center justify-center gap-2 transition shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>🖨️ Print Fee Voucher</span>
              </button>

              <button
                onClick={() => {
                  setFormStep(1);
                  setActiveView('form');
                  setSubmittedRecord(null);
                }}
                className="border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-xs px-6 py-3 rounded-lg transition"
              >
                Return &amp; Register Again
              </button>
            </div>
          </div>
        )}

        {/* VIEW 3: STAFF LOGIN ACCESS */}
        {activeView === 'login' && (
          <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mt-12 animate-fade-in-quick">
            <div className="text-center mb-6">
              <Lock className="w-10 h-10 text-[#004173] mx-auto mb-2" />
              <h4 className="text-lg font-bold text-gray-900">Admin Staff Access</h4>
              <p className="text-gray-400 text-xs">Enter credentials to edit status and course fees.</p>
            </div>

            {authError && (
              <div className="bg-red-50 text-red-600 text-xs font-semibold p-3.5 rounded-lg border border-red-100 mb-4 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Username</label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. admin"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. admin123"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#004173] hover:bg-[#2491bf] text-white py-2.5 rounded-lg font-bold text-xs transition mt-6"
              >
                Unlock Dashboard
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setActiveView('form')}
                className="text-gray-400 hover:text-gray-600 text-[11px] font-semibold transition"
              >
                ← Return to Student Registration Page
              </button>
            </div>
          </div>
        )}

        {/* VIEW 4: MASTER HUB ADMIN DASHBOARD */}
        {activeView === 'admin' && (
          <div className="space-y-8 animate-fade-in-quick">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 leading-tight">LMS Staff Workspace</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Review student course registrations, confirm ledger invoice status and verify dues.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto self-stretch sm:self-auto justify-end">
                <button
                  onClick={() => {
                    setFormStep(1);
                    setActiveView('form');
                  }}
                  className="bg-[#004173] hover:bg-[#2491bf] text-white text-xs px-4 py-2 rounded-lg font-semibold flex items-center gap-1 transition shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Enroll Student</span>
                </button>
              </div>
            </div>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="stat-card bg-[#fff]">
                <p>All Applicants</p>
                <h4>{stats.total}</h4>
              </div>
              <div className="stat-card bg-[#fff]">
                <p style={{ color: '#f59e0b' }}>Pending verification</p>
                <h4 style={{ color: '#f59e0b' }}>{stats.pending}</h4>
              </div>
              <div className="stat-card bg-[#fff]">
                <p style={{ color: '#10b981' }}>Verified ledger</p>
                <h4 style={{ color: '#10b981' }}>{stats.verified}</h4>
              </div>
              <div className="stat-card bg-[#fff]">
                <p style={{ color: '#3b82f6' }}>Active Installments</p>
                <h4 style={{ color: '#3b82f6' }}>{stats.installment}</h4>
              </div>
            </div>

            {/* Visual Analytics Hub Charts */}
            <AdminCharts records={records} />

            {/* Main Records Table panel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-4">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:bg-white focus:border-[#2491bf]"
                    placeholder="Search ID, student name, or CNIC..."
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-[11px] font-semibold text-gray-400">
                    Showing {filteredRecords.length} records in active memory
                  </div>
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 rounded-lg text-xs font-semibold cursor-pointer transition-colors border border-emerald-100"
                    title="Export all database records to Excel/CSV format"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-100">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 font-bold text-xs border-b border-gray-100">
                      <th className="py-3 px-4">Application ID</th>
                      <th className="py-3 px-4">Student Profile</th>
                      <th className="py-3 px-4">Course Title</th>
                      <th className="py-3 px-4">Net Total</th>
                      <th className="py-3 px-4">Dues Setup</th>
                      <th className="py-3 px-4 text-center">Receipt Status</th>
                      <th className="py-3 px-4 text-right">Perform Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {filteredRecords.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-gray-400 font-medium">
                          No registration records matching query.
                        </td>
                      </tr>
                    ) : (
                      filteredRecords.map((r) => {
                        const isVerified = r.status === 'Verified';
                        return (
                          <tr key={r.regId} className="hover:bg-gray-50/50 transition">
                            <td className="py-3.5 px-4 font-mono font-bold text-gray-600">
                              {r.regId}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-gray-800 block">
                                {r.firstName} {r.lastName}
                              </span>
                              <span className="text-[10px] text-gray-400 block font-mono">
                                CNIC: {r.cnic}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-medium text-gray-500">
                              {r.course || 'eBay & TikTok Shop Mastery'}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-gray-800">
                              {r.totalFee.toLocaleString()} PKR
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                                  r.paymentPlan === 'Installment'
                                    ? 'bg-sky-50 text-sky-700'
                                    : 'bg-indigo-50 text-indigo-700'
                                }`}
                              >
                                {r.paymentPlan} Plan
                              </span>
                              {r.paymentPlan === 'Installment' && (
                                <span className="text-[9px] text-gray-400 block mt-1 font-semibold">
                                  Due: {r.nextDueDate}
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold ${
                                  isVerified
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                    : 'bg-amber-50 text-amber-600 border border-amber-100'
                                }`}
                              >
                                {r.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                              {!isVerified && (
                                <button
                                  onClick={() => handleVerifyStatus(r.regId)}
                                  className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2 py-1 rounded font-bold text-[10px] transition cursor-pointer"
                                  title="Confirm verified status"
                                >
                                  ✔ Verify
                                </button>
                              )}
                              <button
                                onClick={() => handleOpenEdit(r)}
                                className="bg-amber-50 text-amber-700 hover:bg-amber-100 px-2 py-1 rounded font-bold text-[10px] transition cursor-pointer"
                                title="Edit variables"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => handlePrintVoucherDirect(r)}
                                className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-2 py-1 rounded font-bold text-[10px] transition cursor-pointer"
                                title="Print voucher copy"
                              >
                                🖨️ Reprint
                              </button>

                              {confirmDeleteId === r.regId ? (
                                <span className="inline-flex gap-1 align-middle">
                                  <button
                                    onClick={() => handleDeleteRecord(r.regId)}
                                    className="bg-red-600 text-white hover:bg-red-700 px-2.5 py-1 rounded font-bold text-[10px] transition cursor-pointer"
                                    title="Yes, delete"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() => setConfirmDeleteId(null)}
                                    className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-2 py-1 rounded font-bold text-[10px] transition cursor-pointer"
                                    title="No, cancel"
                                  >
                                    Cancel
                                  </button>
                                </span>
                              ) : (
                                <button
                                  onClick={() => setConfirmDeleteId(r.regId)}
                                  className="bg-red-50 text-red-700 hover:bg-red-100 px-2 py-1 rounded font-bold text-[10px] transition cursor-pointer inline-flex items-center gap-1"
                                  title="Delete enrollment record"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Delete</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── GOOGLE SHEETS CONNECTOR SETTINGS PANEL ── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#004173]" />
                    <span>Google Sheets Integration Node</span>
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Connect your React LMS to Google Sheets dynamically using Google Apps Script Web Service.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold border border-green-100 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block animate-pulse animate-duration-1000"></span>
                  <span>SHEETS DRIVER READY</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* CONFIGURATION COLUMN */}
                <div className="space-y-4 lg:col-span-1 border-r border-gray-100 pr-0 lg:pr-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 block">
                      Deployed Web Service Web App URL
                    </label>
                    <input
                      type="url"
                      value={appsScriptUrl}
                      onChange={(e) => setAppsScriptUrl(e.target.value)}
                      placeholder="https://script.google.com/macros/s/.../exec"
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#2491bf] font-mono"
                    />
                    <p className="text-[10px] text-gray-400 leading-normal">
                      Copy the "Web App URL" from the Apps Script deployment screen and paste it here.
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-gray-50/50 rounded-xl border border-gray-100">
                    <div className="pr-2">
                      <span className="text-xs font-bold text-gray-700 block">Automated Sync Push</span>
                      <span className="text-[10px] text-gray-400 block leading-relaxed max-w-[160px]">
                        Instantly sync data on student registration or verification.
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={autoSheetsSync}
                        onChange={(e) => setAutoSheetsSync(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="pt-2 space-y-2">
                    <button
                      onClick={handleTestConnection}
                      disabled={syncingStatus === 'syncing' || !appsScriptUrl}
                      className={`w-full text-xs font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 border transition cursor-pointer ${
                        syncingStatus === 'syncing'
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          : !appsScriptUrl
                          ? 'bg-transparent text-gray-400 border-gray-200 cursor-not-allowed'
                          : 'bg-white hover:bg-sky-50 text-[#004173] border-sky-200 shadow-xs'
                      }`}
                    >
                      <Database className="w-3.5 h-3.5" />
                      <span>Test Connection</span>
                    </button>

                    <button
                      onClick={handleBulkSyncToSheets}
                      disabled={syncingStatus === 'syncing' || !appsScriptUrl}
                      className={`w-full text-xs font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer ${
                        syncingStatus === 'syncing'
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : !appsScriptUrl
                          ? 'bg-[#004173]/10 text-[#004173]/40 cursor-not-allowed'
                          : 'bg-[#004173] hover:bg-[#2491bf] text-white shadow-sm'
                      }`}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${syncingStatus === 'syncing' ? 'animate-spin' : ''}`} />
                      <span>{syncingStatus === 'syncing' ? 'Syncing...' : 'Sync All Records to Sheet'}</span>
                    </button>
                    {lastSyncTime && (
                      <span className="text-[10px] text-gray-400 block text-center mt-1 font-semibold">
                        Last uploaded: {lastSyncTime}
                      </span>
                    )}
                  </div>
                </div>

                {/* INSTRUCTIONS COLUMN */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                    <span className="text-xs font-bold text-[#004173] flex items-center gap-1.5 uppercase tracking-wider">
                      <Settings className="w-3.5 h-3.5" />
                      <span>Google Sheet Integration Steps (Minutes to Setup)</span>
                    </span>
                    <ol className="text-xs text-gray-600 space-y-2 list-decimal list-inside leading-relaxed pl-1.5">
                      <li>Create a new <strong className="text-gray-900">Google Sheet</strong> and make sure the working sheet tab name is exactly <strong className="text-gray-900">Enrolments</strong>.</li>
                      <li>In the Google Sheets menu, navigate to <strong className="text-gray-900">Extensions &gt; Apps Script</strong>.</li>
                      <li>Delete any dummy code present, and <strong className="text-gray-900">Paste</strong> the script code provided on the right.</li>
                      <li>Click the <strong className="text-gray-900">Deploy &gt; New deployment</strong> button.</li>
                      <li>Select configuration type <strong className="text-gray-900">Web App</strong>. Set "Execute as" to <strong className="text-gray-900">Me</strong> and "Who has access" to <strong className="text-gray-900">Anyone</strong> (crucial for fetch access).</li>
                      <li>Click Deploy, approve standard OAuth prompts, copy the generated <strong className="text-gray-900">Web App URL</strong>, and paste it into the Config box on the left!</li>
                    </ol>
                  </div>

                  {/* CODE COPY BOX */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-gray-900 text-gray-200 px-4 py-2 rounded-t-lg text-xs font-bold font-mono">
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-orange-400" />
                        <span>Code.gs (Apps Script Source)</span>
                      </span>
                      <button
                        onClick={() => {
                          const code = getAppsScriptCode();
                          navigator.clipboard.writeText(code);
                          showToast('Apps Script source code copied to clipboard!', 'success');
                        }}
                        className="hover:text-white flex items-center gap-1 text-[11px] font-semibold bg-white/10 px-2 py-1 rounded hover:bg-white/20 transition"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </button>
                    </div>
                    <div className="bg-gray-950 text-gray-300 p-4 rounded-b-lg text-[10px] font-mono max-h-[160px] overflow-y-auto leading-relaxed border border-gray-900 scrollbar-thin">
                      <pre className="whitespace-pre">{getAppsScriptCode()}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── SECURITY CREDENTIALS UPDATE PANEL ── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6 mt-6">
              <div className="border-b border-gray-100 pb-4">
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#004173]" />
                  <span>Administrative Access Security</span>
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  Update the login credentials for accessing this staff workspace panel. The changed password is saved persistently in your local profile.
                </p>
              </div>

              <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end justify-between">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Current Password</label>
                  <input
                    type="password"
                    value={currentPassChange}
                    onChange={(e) => setCurrentPassChange(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#2491bf]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">New Password</label>
                  <input
                    type="password"
                    value={newPassChange}
                    onChange={(e) => setNewPassChange(e.target.value)}
                    placeholder="Min 5 characters"
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#2491bf]"
                    required
                  />
                </div>

                <div className="flex gap-2 items-end">
                  <div className="flex-grow">
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassChange}
                      onChange={(e) => setConfirmPassChange(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#2491bf]"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#004173] hover:bg-[#2491bf] text-white text-xs px-5 py-2.5 rounded-lg font-bold transition flex-shrink-0 cursor-pointer h-[38px] flex items-center justify-center"
                  >
                    Save Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* ── SECTOR EDIT MODAL (NO PRINT) ── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 no-print overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative animate-fade-in-quick max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-[#004173] flex items-center gap-1.5">
                <span>✏️ Edit Enrolment Record</span>
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <div className="bg-blue-50 text-blue-800 text-xs px-3.5 py-1.5 rounded-lg border border-blue-100 mb-4 font-semibold">
              Editing System ID: <strong className="font-mono">{editingRecordId}</strong>
            </div>

            <div className="space-y-4">
              <div className="edit-section-heading">Personal Information System</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="edit-field-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                  />
                </div>
                <div className="edit-field-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                  />
                </div>
                <div className="edit-field-group">
                  <label>Father's Name</label>
                  <input
                    type="text"
                    value={editFatherName}
                    onChange={(e) => setEditFatherName(e.target.value)}
                  />
                </div>
                <div className="edit-field-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    value={editMobile}
                    onChange={(e) => setEditMobile(e.target.value)}
                  />
                </div>
                <div className="edit-field-group">
                  <label>CNIC</label>
                  <input
                    type="text"
                    value={editCnic}
                    onChange={(e) => setEditCnic(e.target.value)}
                  />
                </div>
                <div className="edit-field-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2 edit-field-group">
                  <label>Address</label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                  />
                </div>
              </div>

              <div className="edit-section-heading">Program details &amp; overrides</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="edit-field-group">
                  <label>Gender</label>
                  <select value={editGender} onChange={(e) => setEditGender(e.target.value)}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="edit-field-group">
                  <label>Laptop Required?</label>
                  <select
                    value={editLaptop}
                    onChange={(e) => setEditLaptop(e.target.value as 'Yes' | 'No')}
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes (+3,000 PKR)</option>
                  </select>
                </div>

                <div className="edit-field-group">
                  <label>Civilian / Military Category</label>
                  <select
                    value={editCivilStatus}
                    onChange={(e) => setEditCivilStatus(e.target.value)}
                  >
                    <option value="Civil">Civil</option>
                    <option value="Military (Officer Rank)">Military (Officer Rank)</option>
                    <option value="Military (Lower Rank)">Military (Lower Rank)</option>
                  </select>
                </div>

                <div className="edit-field-group">
                  <label>Staff discount (PKR)</label>
                  <input
                    type="number"
                    min="0"
                    value={editDiscount}
                    onChange={(e) => setEditDiscount(Number(e.target.value) || 0)}
                  />
                </div>

                {/* mini plan options inside modal */}
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-500 block mb-2">
                    Payment Plan Configuration
                  </label>
                  <div className="flex gap-3">
                    <div
                      onClick={() => setEditPaymentPlan('Full')}
                      className={`mini-plan ${editPaymentPlan === 'Full' ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        checked={editPaymentPlan === 'Full'}
                        onChange={() => setEditPaymentPlan('Full')}
                        className="mr-1"
                      />
                      <div>
                        <span className="mini-plan-label block">Full Package</span>
                        <span className="mini-plan-desc block">Single payment setup</span>
                      </div>
                    </div>

                    <div
                      onClick={() => setEditPaymentPlan('Installment')}
                      className={`mini-plan ${editPaymentPlan === 'Installment' ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        checked={editPaymentPlan === 'Installment'}
                        onChange={() => setEditPaymentPlan('Installment')}
                        className="mr-1"
                      />
                      <div>
                        <span className="mini-plan-label block">Installments</span>
                        <span className="mini-plan-desc block">15,000 × 2 split</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recalculate preview strip */}
                <div className="md:col-span-2 bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-xs flex justify-between items-center">
                  <span className="font-semibold text-emerald-800">
                    Calculated Total Ledger Fee:
                  </span>
                  <span className="font-bold text-sm text-emerald-900">
                    {currentEditFeeLayout.total.toLocaleString()} PKR
                  </span>
                </div>

                <div className="edit-field-group">
                  <label>Payment Ledger Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as 'Pending' | 'Verified')}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Verified">Verified</option>
                  </select>
                </div>

                {editPaymentPlan === 'Installment' && (
                  <div className="edit-field-group animate-fade-in-quick">
                    <label>2nd Installment Due Date</label>
                    <input
                      type="date"
                      value={editNextDueDate}
                      onChange={(e) => setEditNextDueDate(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-2 border-t border-gray-100 pt-4 flex-wrap">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs px-5 py-2.5 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveEdit(false)}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition"
              >
                💾 Save Changes
              </button>
              <button
                onClick={() => handleSaveEdit(true)}
                className="bg-[#004173] hover:bg-[#2491bf] text-white font-bold text-xs px-5 py-2.5 rounded-lg transition shadow"
              >
                💾 Save &amp; Printer Reprint
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER VISUAL NO-PRINT ── */}
      <footer className="bg-white border-t border-gray-100 py-6 text-center text-xs text-gray-400 no-print">
        <p className="font-semibold text-gray-500">
          Software Technology Park Bahawalpur — Rohi eSkills Learning Hub
        </p>
        <p className="text-[10px] text-gray-400 mt-1 select-none">
          Approved Course Enrolment Slip Portal &copy; {new Date().getFullYear()} All rights
          reserved.
        </p>
      </footer>

      {/* ════════════════════════════════════════════════════════
         PRINT-ONLY DUAL VOUCHER AREA — EXACT APPROVED FORMAT
         (Under normal viewing, wrapped in beautifully grey container)
         (Under print, everything else collapses to render this cleanly)
      ════════════════════════════════════════════════════════ */}
      {activeView === 'success' && (
        <div className="no-print bg-slate-100 py-8 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="flex justify-between items-center mb-4 max-w-[1060px] mx-auto">
              <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1">
                <span>🖨️ Interactive Print Voucher Preview</span>
              </h4>
              {voucherRecord ? (
                <button
                  onClick={triggerPrintService}
                  className="bg-[#004173] hover:bg-[#2491bf] text-white text-xs px-4 py-1.5 rounded font-bold flex items-center gap-1 transition shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Fee Voucher</span>
                </button>
              ) : null}
            </div>

          {voucherRecord ? (
            <div className="voucher-preview-container select-none">
              <div className="page" id="print-area">
                {/* ── STUDENT COPY ── */}
                <div className="slip">
                  <div className="slip-header">
                    <div className="logo-circle">
                      <img
                        src="https://raw.githubusercontent.com/artbyartist98-co/stp-assets/main/logo.png"
                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '3px' }}
                        alt="Logo"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="header-text">
                      <div className="line1">Software Technology Park Bahawalpur</div>
                      <div className="line2">Rohi eSkills Learning Hub</div>
                      <div className="line3">Executive Course Enrolment Slip</div>
                      <div className="line4 text-slate-500">Student Copy</div>
                    </div>
                  </div>

                  <table className="slip-body">
                    <tbody>
                      <tr className="blank-spacer">
                        <td colSpan={2}></td>
                      </tr>
                      <tr>
                        <td className="lbl">Application ID:</td>
                        <td className="val font-mono font-bold">{voucherRecord.regId}</td>
                      </tr>
                      <tr>
                        <td className="lbl">Student Name:</td>
                        <td className="val font-bold">
                          {voucherRecord.firstName} {voucherRecord.lastName}
                        </td>
                      </tr>
                      {voucherRecord.fatherName && (
                        <tr>
                          <td className="lbl">Father's Name:</td>
                          <td className="val">{voucherRecord.fatherName}</td>
                        </tr>
                      )}
                      <tr>
                        <td className="lbl">CNIC:</td>
                        <td className="val font-mono">{voucherRecord.cnic}</td>
                      </tr>
                      <tr>
                        <td className="lbl">Selected Course:</td>
                        <td className="val">eBay &amp; TikTok Shop Mastery</td>
                      </tr>
                      <tr>
                        <td className="lbl">Base Course Fee:</td>
                        <td className="val">
                          {(voucherRecord.baseFee || 30000).toLocaleString()} PKR
                        </td>
                      </tr>
                      <tr>
                        <td className="lbl">Laptop Charges:</td>
                        <td className="val">
                          {(voucherRecord.laptopFee || 0).toLocaleString()} PKR
                        </td>
                      </tr>

                      {/* Display plan properties if Installment */}
                      {voucherRecord.paymentPlan === 'Installment' && (
                        <>
                          <tr>
                            <td className="lbl text-sky-800">1st Installment:</td>
                            <td className="val font-bold text-sky-800">
                              {Math.ceil(voucherRecord.totalFee / 2).toLocaleString()} PKR (Due
                              Today)
                            </td>
                          </tr>
                          <tr>
                            <td className="lbl text-sky-800">2nd Installment:</td>
                            <td className="val font-bold text-sky-800 border-b border-sky-200">
                              {(voucherRecord.totalFee - Math.ceil(voucherRecord.totalFee / 2)).toLocaleString()}{' '}
                              PKR
                            </td>
                          </tr>
                          <tr>
                            <td className="lbl text-[#990000]">Next Due Deadline:</td>
                            <td className="val font-bold text-[#990000]">
                              {voucherRecord.nextDueDate || '—'}
                            </td>
                          </tr>
                        </>
                      )}

                      {/* Padding spaces to keep double voucher slips synchronized in height */}
                      {Array.from({ length: emptyRowCounts }).map((_, idx) => (
                        <tr key={idx} className="empty">
                          <td className="lbl"></td>
                          <td className="val"></td>
                        </tr>
                      ))}

                      <tr className="total-row border-t-2 border-slate-400">
                        <td className="lbl">Total Payable:</td>
                        <td className="val tracking-wide font-extrabold text-sm font-sans text-black">
                          {voucherRecord.totalFee.toLocaleString()} PKR
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* ── ACCOUNTS OFFICE COPY ── */}
                <div className="slip">
                  <div className="slip-header">
                    <div className="logo-circle">
                      <img
                        src="https://raw.githubusercontent.com/artbyartist98-co/stp-assets/main/logo.png"
                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '3px' }}
                        alt="Logo"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="header-text">
                      <div className="line1">Software Technology Park Bahawalpur</div>
                      <div className="line2">Rohi eSkills Learning Hub</div>
                      <div className="line3">Executive Course Enrolment Slip</div>
                      <div className="line4 text-slate-500">Accounts Office Copy</div>
                    </div>
                  </div>

                  <table className="slip-body">
                    <tbody>
                      <tr className="blank-spacer">
                        <td colSpan={2}></td>
                      </tr>
                      <tr>
                        <td className="lbl">Application ID:</td>
                        <td className="val font-mono font-bold">{voucherRecord.regId}</td>
                      </tr>
                      <tr>
                        <td className="lbl">Student Name:</td>
                        <td className="val font-bold">
                          {voucherRecord.firstName} {voucherRecord.lastName}
                        </td>
                      </tr>
                      {voucherRecord.fatherName && (
                        <tr>
                          <td className="lbl">Father's Name:</td>
                          <td className="val">{voucherRecord.fatherName}</td>
                        </tr>
                      )}
                      <tr>
                        <td className="lbl">CNIC:</td>
                        <td className="val font-mono">{voucherRecord.cnic}</td>
                      </tr>
                      <tr>
                        <td className="lbl">Selected Course:</td>
                        <td className="val">eBay &amp; TikTok Shop Mastery</td>
                      </tr>
                      <tr>
                        <td className="lbl">Base Course Fee:</td>
                        <td className="val">
                          {(voucherRecord.baseFee || 30000).toLocaleString()} PKR
                        </td>
                      </tr>
                      <tr>
                        <td className="lbl">Laptop Charges:</td>
                        <td className="val">
                          {(voucherRecord.laptopFee || 0).toLocaleString()} PKR
                        </td>
                      </tr>

                      {/* Display plan properties if Installment */}
                      {voucherRecord.paymentPlan === 'Installment' && (
                        <>
                          <tr>
                            <td className="lbl text-sky-800">1st Installment:</td>
                            <td className="val font-bold text-sky-800">
                              {Math.ceil(voucherRecord.totalFee / 2).toLocaleString()} PKR (Due
                              Today)
                            </td>
                          </tr>
                          <tr>
                            <td className="lbl text-sky-800">2nd Installment:</td>
                            <td className="val font-bold text-sky-800 border-b border-sky-200">
                              {(voucherRecord.totalFee - Math.ceil(voucherRecord.totalFee / 2)).toLocaleString()}{' '}
                              PKR
                            </td>
                          </tr>
                          <tr>
                            <td className="lbl text-[#990000]">Next Due Deadline:</td>
                            <td className="val font-bold text-[#990000]">
                              {voucherRecord.nextDueDate || '—'}
                            </td>
                          </tr>
                        </>
                      )}

                      {/* Padding spaces to keep double voucher slips synchronized in height */}
                      {Array.from({ length: emptyRowCounts }).map((_, idx) => (
                        <tr key={idx} className="empty">
                          <td className="lbl"></td>
                          <td className="val"></td>
                        </tr>
                      ))}

                      <tr className="total-row border-t-2 border-slate-400">
                        <td className="lbl">Total Payable:</td>
                        <td className="val tracking-wide font-extrabold text-sm font-sans text-black">
                          {voucherRecord.totalFee.toLocaleString()} PKR
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-[1060px] mx-auto bg-white p-12 text-center rounded-xl border border-gray-100/80 text-gray-400 font-semibold text-xs">
              Fill out and process the enrollment form to preview the dual-slip approved fee voucher.
            </div>
          )}
        </div>
      </div>
      )}

      {/* ════════════════════════════════════════════════════════
         PRINT-ONLY HIGH FIDELITY ELEMENT (ALWAYS LOADED - HIDDEN FROM NORMAL DOM)
         BUT TRIPPED ACTIVE DURING @MEDIA PRINT EMISSION FOR PERFECT OUTPUTS
      ════════════════════════════════════════════════════════ */}
      {voucherRecord && (
        <div className="hidden print-only">
          <div className="page" style={{ margin: 0, padding: 0 }}>
            {/* ── STUDENT COPY ── */}
            <div className="slip" style={{ border: '2px solid #222' }}>
              <div className="slip-header">
                <div className="logo-circle">
                  <img
                    src="https://raw.githubusercontent.com/artbyartist98-co/stp-assets/main/logo.png"
                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '3px' }}
                    alt="Logo"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="header-text">
                  <div className="line1">Software Technology Park Bahawalpur</div>
                  <div className="line2" style={{ fontSize: '14px', fontWeight: 'bold' }}>Rohi eSkills Learning Hub</div>
                  <div className="line3">Executive Course Enrolment Slip</div>
                  <div className="line4" style={{ fontWeight: 'bold' }}>Student Copy</div>
                </div>
              </div>

              <table className="slip-body">
                <tbody>
                  <tr className="blank-spacer">
                    <td colSpan={2}></td>
                  </tr>
                  <tr>
                    <td className="lbl">Application ID:</td>
                    <td className="val" style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{voucherRecord.regId}</td>
                  </tr>
                  <tr>
                    <td className="lbl">Student Name:</td>
                    <td className="val" style={{ fontWeight: 'bold' }}>
                      {voucherRecord.firstName} {voucherRecord.lastName}
                    </td>
                  </tr>
                  {voucherRecord.fatherName && (
                    <tr>
                      <td className="lbl">Father's Name:</td>
                      <td className="val">{voucherRecord.fatherName}</td>
                    </tr>
                  )}
                  <tr>
                    <td className="lbl">CNIC:</td>
                    <td className="val" style={{ fontFamily: 'monospace' }}>{voucherRecord.cnic}</td>
                  </tr>
                  <tr>
                    <td className="lbl">Selected Course:</td>
                    <td className="val">eBay &amp; TikTok Shop Mastery</td>
                  </tr>
                  <tr>
                    <td className="lbl">Base Course Fee:</td>
                    <td className="val">
                      {(voucherRecord.baseFee || 30000).toLocaleString()} PKR
                    </td>
                  </tr>
                  <tr>
                    <td className="lbl">Laptop Charges:</td>
                    <td className="val">
                      {(voucherRecord.laptopFee || 0).toLocaleString()} PKR
                    </td>
                  </tr>

                  {/* Display plan properties if Installment */}
                  {voucherRecord.paymentPlan === 'Installment' && (
                    <>
                      <tr>
                        <td className="lbl" style={{ color: '#004173' }}>1st Installment:</td>
                        <td className="val" style={{ fontWeight: 'bold', color: '#004173' }}>
                          {Math.ceil(voucherRecord.totalFee / 2).toLocaleString()} PKR (Due Today)
                        </td>
                      </tr>
                      <tr>
                        <td className="lbl" style={{ color: '#004173' }}>2nd Installment:</td>
                        <td className="val" style={{ fontWeight: 'bold', color: '#004173', borderBottom: '1px solid #c8c8c8' }}>
                          {(voucherRecord.totalFee - Math.ceil(voucherRecord.totalFee / 2)).toLocaleString()} PKR
                        </td>
                      </tr>
                      <tr>
                        <td className="lbl" style={{ color: '#990000' }}>Next Due Deadline:</td>
                        <td className="val" style={{ fontWeight: 'bold', color: '#990000' }}>
                          {voucherRecord.nextDueDate || '—'}
                        </td>
                      </tr>
                    </>
                  )}

                  {/* Padding spaces to keep double voucher slips synchronized in height */}
                  {Array.from({ length: emptyRowCounts }).map((_, idx) => (
                    <tr key={idx} className="empty">
                      <td className="lbl"></td>
                      <td className="val"></td>
                    </tr>
                  ))}

                  <tr className="total-row" style={{ borderTop: '2.5px solid #222' }}>
                    <td className="lbl" style={{ fontSize: '13px', fontWeight: 'bold' }}>Total Payable:</td>
                    <td className="val" style={{ fontStyle: 'normal', fontWeight: '900', fontSize: '13.5px', color: '#000' }}>
                      {voucherRecord.totalFee.toLocaleString()} PKR
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ── ACCOUNTS OFFICE COPY ── */}
            <div className="slip" style={{ border: '2px solid #222' }}>
              <div className="slip-header">
                <div className="logo-circle">
                  <img
                    src="https://raw.githubusercontent.com/artbyartist98-co/stp-assets/main/logo.png"
                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '3px' }}
                    alt="Logo"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="header-text">
                  <div className="line1">Software Technology Park Bahawalpur</div>
                  <div className="line2" style={{ fontSize: '14px', fontWeight: 'bold' }}>Rohi eSkills Learning Hub</div>
                  <div className="line3">Executive Course Enrolment Slip</div>
                  <div className="line4" style={{ fontWeight: 'bold' }}>Accounts Office Copy</div>
                </div>
              </div>

              <table className="slip-body">
                <tbody>
                  <tr className="blank-spacer">
                    <td colSpan={2}></td>
                  </tr>
                  <tr>
                    <td className="lbl">Application ID:</td>
                    <td className="val" style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{voucherRecord.regId}</td>
                  </tr>
                  <tr>
                    <td className="lbl">Student Name:</td>
                    <td className="val" style={{ fontWeight: 'bold' }}>
                      {voucherRecord.firstName} {voucherRecord.lastName}
                    </td>
                  </tr>
                  {voucherRecord.fatherName && (
                    <tr>
                      <td className="lbl">Father's Name:</td>
                      <td className="val">{voucherRecord.fatherName}</td>
                    </tr>
                  )}
                  <tr>
                    <td className="lbl">CNIC:</td>
                    <td className="val" style={{ fontFamily: 'monospace' }}>{voucherRecord.cnic}</td>
                  </tr>
                  <tr>
                    <td className="lbl">Selected Course:</td>
                    <td className="val">eBay &amp; TikTok Shop Mastery</td>
                  </tr>
                  <tr>
                    <td className="lbl">Base Course Fee:</td>
                    <td className="val">
                      {(voucherRecord.baseFee || 30000).toLocaleString()} PKR
                    </td>
                  </tr>
                  <tr>
                    <td className="lbl">Laptop Charges:</td>
                    <td className="val">
                      {(voucherRecord.laptopFee || 0).toLocaleString()} PKR
                    </td>
                  </tr>

                  {/* Display plan properties if Installment */}
                  {voucherRecord.paymentPlan === 'Installment' && (
                    <>
                      <tr>
                        <td className="lbl" style={{ color: '#004173' }}>1st Installment:</td>
                        <td className="val" style={{ fontWeight: 'bold', color: '#004173' }}>
                          {Math.ceil(voucherRecord.totalFee / 2).toLocaleString()} PKR (Due Today)
                        </td>
                      </tr>
                      <tr>
                        <td className="lbl" style={{ color: '#004173' }}>2nd Installment:</td>
                        <td className="val" style={{ fontWeight: 'bold', color: '#004173', borderBottom: '1px solid #c8c8c8' }}>
                          {(voucherRecord.totalFee - Math.ceil(voucherRecord.totalFee / 2)).toLocaleString()} PKR
                        </td>
                      </tr>
                      <tr>
                        <td className="lbl" style={{ color: '#990000' }}>Next Due Deadline:</td>
                        <td className="val" style={{ fontWeight: 'bold', color: '#990000' }}>
                          {voucherRecord.nextDueDate || '—'}
                        </td>
                      </tr>
                    </>
                  )}

                  {/* Padding spaces to keep double voucher slips synchronized in height */}
                  {Array.from({ length: emptyRowCounts }).map((_, idx) => (
                    <tr key={idx} className="empty">
                      <td className="lbl"></td>
                      <td className="val"></td>
                    </tr>
                  ))}

                  <tr className="total-row" style={{ borderTop: '2.5px solid #222' }}>
                    <td className="lbl" style={{ fontSize: '13px', fontWeight: 'bold' }}>Total Payable:</td>
                    <td className="val" style={{ fontStyle: 'normal', fontWeight: '900', fontSize: '13.5px', color: '#000' }}>
                      {voucherRecord.totalFee.toLocaleString()} PKR
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getAppsScriptCode(): string {
  return `/*
  ============================================================
           STP ENROLMENT LEDGER SHEET CONNECTOR SCRIPT
  ============================================================
  Instructions for Google Sheets Setup:
  1. Create a Google Sheet. Name the working sheet tab "Enrolments".
  2. Select 'Extensions' > 'Apps Script' from the top menu.
  3. Replace any auto-generated placeholder code with this code.
  4. Click the 'Save' icon, then click the 'Deploy' button > 'New deployment'.
  5. Select configuration type: 'Web app'.
  6. Execute as: 'Me' (your security account email).
  7. Who has access: 'Anyone' (Required for the dynamic POST requests to connect).
  8. Click Deploy, copy the "Web App URL" and paste into the administration console!
*/

function doPost(e) {
  var sheetName = "Enrolments";
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow([
      "Application ID", 
      "First Name", 
      "Last Name", 
      "Father Name", 
      "Mobile No", 
      "CNIC", 
      "Email Address", 
      "Address", 
      "Gender", 
      "Laptop Needed", 
      "Payment Plan", 
      "Civil Status", 
      "Discount Applied (PKR)", 
      "Net Total Fee (PKR)", 
      "Base Fee (PKR)", 
      "Laptop Fee (PKR)", 
      "Ledger Status", 
      "Next Due Date", 
      "Submission Date"
    ]);
    sheet.getRange(1, 1, 1, 19).setFontWeight("bold").setBackground("#f3f4f6");
  }
  
  try {
    var data = JSON.parse(e.postData.contents);
    
    if (data.action === "addRecord") {
      var rec = data.record;
      addOrUpdateRecord(sheet, rec);
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Processed" }))
        .setMimeType(ContentService.MimeType.JSON);
    } 
    else if (data.action === "bulkSync") {
      var records = data.records;
      var lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        sheet.deleteRows(2, lastRow - 1);
      }
      for (var i = 0; i < records.length; i++) {
        addOrUpdateRecord(sheet, records[i]);
      }
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Synced " + records.length + " rows" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "invalid_action" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function addOrUpdateRecord(sheet, rec) {
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  var regIdColIndex = 0; // Col A
  var existingRowIndex = -1;
  
  for (var i = 1; i < values.length; i++) {
    if (values[i][regIdColIndex].toString() === rec.regId.toString()) {
      existingRowIndex = i + 1;
      break;
    }
  }
  
  var rowData = [
    rec.regId.toString(),
    rec.firstName || "",
    rec.lastName || "",
    rec.fatherName || "",
    rec.mobile || "",
    rec.cnic || "",
    rec.email || "",
    rec.address || "",
    rec.gender || "",
    rec.laptop || "No",
    rec.paymentPlan || "Full",
    rec.civilStatus || "",
    rec.discount || 0,
    rec.totalFee || 0,
    rec.baseFee || 30000,
    rec.laptopFee || 0,
    rec.status || "Pending",
    rec.nextDueDate || "",
    rec.createdAtFormatted || rec.createdAt || new Date().toISOString()
  ];
  
  if (existingRowIndex > -1) {
    sheet.getRange(existingRowIndex, 1, 1, rowData.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("STP Ledger Web App connector is working successfully!")
    .setMimeType(ContentService.MimeType.TEXT);
}`;
}
