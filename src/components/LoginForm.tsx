import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Building2,
  Lock,
  User,
  Phone,
  ShieldCheck,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  FileSpreadsheet,
  ChevronDown,
  Search,
  Check,
  X,
} from 'lucide-react';
import { AuthUser, MajlisUserRecord } from '../types';
import { INITIAL_MAJLIS_USERS, authenticateUser } from '../data/majlisUsers';

interface LoginFormProps {
  onLogin: (user: AuthUser) => void;
  usersList?: MajlisUserRecord[];
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  usersList = INITIAL_MAJLIS_USERS,
}) => {
  const [activeTab, setActiveTab] = useState<'majlis' | 'admin'>('majlis');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Majlis Dropdown State
  const [isMajlisDropdownOpen, setIsMajlisDropdownOpen] = useState(false);
  const [majlisSearchQuery, setMajlisSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sorted list of all Majlis (all 139+ majlises)
  const sortedUsersList = useMemo(() => {
    return [...usersList].sort((a, b) => a.english.localeCompare(b.english));
  }, [usersList]);

  // Filtered Majlis list for the dropdown - includes ALL majlis by default!
  const filteredMajlisList = useMemo(() => {
    if (!majlisSearchQuery.trim()) {
      return sortedUsersList;
    }
    const q = majlisSearchQuery.toLowerCase().trim();
    return sortedUsersList.filter(
      (m) =>
        m.english.toLowerCase().includes(q) ||
        m.bangla.toLowerCase().includes(q) ||
        m.fullName.toLowerCase().includes(q) ||
        (m.district && m.district.toLowerCase().includes(q))
    );
  }, [sortedUsersList, majlisSearchQuery]);

  // Find currently selected record
  const selectedMajlisRecord = useMemo(() => {
    if (!username) return null;
    return (
      usersList.find(
        (m) =>
          m.english.toLowerCase() === username.toLowerCase() ||
          m.bangla === username ||
          m.fullName === username
      ) || null
    );
  }, [usersList, username]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsMajlisDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-focus search input when dropdown opens
  useEffect(() => {
    if (isMajlisDropdownOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setMajlisSearchQuery('');
    }
  }, [isMajlisDropdownOpen]);

  const handleTabChange = (tab: 'majlis' | 'admin') => {
    setActiveTab(tab);
    setErrorMessage('');
    setUsername('');
    setPassword('');
    setIsMajlisDropdownOpen(false);
    setMajlisSearchQuery('');
  };

  const handleSelectMajlis = (m: MajlisUserRecord) => {
    setUsername(m.english);
    setIsMajlisDropdownOpen(false);
    setMajlisSearchQuery('');
    setErrorMessage('');
  };

  const handleClearSelectedMajlis = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUsername('');
    setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (activeTab === 'majlis' && !username.trim()) {
      setErrorMessage('অনুগ্রহ করে ড্রপডাউন থেকে আপনার মজলিস নির্বাচন করুন।');
      return;
    }

    setIsSubmitting(true);

    try {
      const authUser = authenticateUser(username, password, usersList);
      if (authUser) {
        onLogin(authUser);
      } else {
        if (activeTab === 'admin') {
          setErrorMessage('ভুল অ্যাডমিন ক্রেডেনশিয়াল! সঠিক ইউজারনেম এবং পাসওয়ার্ড প্রদান করুন।');
        } else {
          setErrorMessage(
            'ইউজারনেম অথবা পাসওয়ার্ড সঠিক নয়। ড্রপডাউন থেকে মজলিস নাম এবং পাসওয়ার্ড হিসেবে সংশ্লিষ্ট "Mobile" নম্বর সঠিকভাবে প্রদান করুন।'
          );
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'লগইনে সমস্যা হয়েছে');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/70 via-gray-50 to-white flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 mb-3">
            <FileSpreadsheet className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            মজলিস ডাটা এন্ট্রি পোর্টাল
          </h1>
          <p className="text-xs text-emerald-800 font-medium mt-1">
            Majlis Monthly Report Submission System
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-900 text-[11px] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>নিরাপদ রিপোর্ট সাবমিশন সিস্টেম</span>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="grid grid-cols-2 p-1.5 bg-gray-100/80 border-b border-gray-200">
            <button
              type="button"
              onClick={() => handleTabChange('majlis')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'majlis'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>মজলিস লগইন</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('admin')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-white text-purple-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>অ্যাডমিন লগইন</span>
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-shake">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">{errorMessage}</div>
              </div>
            )}

            {/* Username / Majlis Selection */}
            {activeTab === 'admin' ? (
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-purple-600" />
                    অ্যাডমিন ইউজারনেম
                    <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="অ্যাডমিন ইউজারনেম লিখুন"
                  required
                  autoFocus
                  autoComplete="username"
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-300 focus:bg-white rounded-xl text-xs font-semibold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition shadow-2xs"
                />
              </div>
            ) : (
              /* Majlis Selection Dropdown (All 139+ Majlis) */
              <div className="relative" ref={dropdownRef}>
                <label className="block text-xs font-bold text-gray-800 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                    মজলিস নাম (Majlis in English)
                    <span className="text-red-500">*</span>
                  </span>
                  <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold border border-emerald-200">
                    {usersList.length}টি মজলিস ড্রপডাউন
                  </span>
                </label>

                {/* Dropdown Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsMajlisDropdownOpen((prev) => !prev)}
                  className={`w-full min-h-[44px] px-3.5 py-2.5 bg-white border rounded-xl flex items-center justify-between text-left transition shadow-2xs cursor-pointer ${
                    isMajlisDropdownOpen
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                      : username
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : 'border-gray-300 hover:border-emerald-400'
                  }`}
                >
                  {selectedMajlisRecord ? (
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="font-bold text-gray-900 text-xs truncate">
                        {selectedMajlisRecord.english}
                      </span>
                      <span className="text-gray-500 text-[11px] shrink-0">
                        ({selectedMajlisRecord.bangla})
                      </span>
                      {selectedMajlisRecord.district && (
                        <span className="text-[10px] text-emerald-800 bg-emerald-100/70 border border-emerald-200 px-1.5 py-0.5 rounded shrink-0">
                          {selectedMajlisRecord.district}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 font-normal">
                      -- ড্রপডাউন থেকে মজলিস নির্বাচন করুন (মোট {usersList.length}টি) --
                    </span>
                  )}

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {username && (
                      <span
                        onClick={handleClearSelectedMajlis}
                        title="মুছে ফেলুন"
                        className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                        isMajlisDropdownOpen ? 'transform rotate-180 text-emerald-600' : ''
                      }`}
                    />
                  </div>
                </button>

                {/* Dropdown Menu (All Majlises with Search Filter) */}
                {isMajlisDropdownOpen && (
                  <div className="absolute z-30 left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                    {/* Search Input Box */}
                    <div className="p-2.5 bg-gray-50/90 border-b border-gray-200">
                      <div className="relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={majlisSearchQuery}
                          onChange={(e) => setMajlisSearchQuery(e.target.value)}
                          placeholder="মজলিস খুঁজুন (যেমন: Ahmadnagar, Mirpur বা মিরপুর)..."
                          className="w-full pl-9 pr-8 py-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                        {majlisSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setMajlisSearchQuery('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="mt-1.5 flex items-center justify-between text-[11px] text-gray-500 px-1">
                        <span>
                          {filteredMajlisList.length === usersList.length
                            ? `সকল ${usersList.length}টি মজলিস ড্রপডাউনে আছে (স্ক্রোল করুন)`
                            : `পাওয়া গেছে: ${filteredMajlisList.length}টি মজলিস`}
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsMajlisDropdownOpen(false)}
                          className="text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer"
                        >
                          বন্ধ করুন
                        </button>
                      </div>
                    </div>

                    {/* Scrollable list of ALL majlises */}
                    <div className="max-h-60 overflow-y-auto divide-y divide-gray-100">
                      {filteredMajlisList.length > 0 ? (
                        filteredMajlisList.map((m) => {
                          const isSelected =
                            username.toLowerCase() === m.english.toLowerCase();
                          return (
                            <div
                              key={m.sl}
                              onClick={() => handleSelectMajlis(m)}
                              className={`px-3.5 py-2.5 hover:bg-emerald-50 cursor-pointer flex items-center justify-between text-xs transition ${
                                isSelected
                                  ? 'bg-emerald-50/90 text-emerald-950 font-bold border-l-4 border-emerald-600'
                                  : 'text-gray-800'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="font-bold text-gray-900">{m.english}</span>
                                <span className="text-gray-500 text-[11px]">({m.bangla})</span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0 ml-2">
                                {m.district && (
                                  <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                    {m.district}
                                  </span>
                                )}
                                {isSelected && (
                                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-6 text-center text-xs text-gray-500">
                          <p>"{majlisSearchQuery}" নামে কোনো মজলিস পাওয়া যায়নি।</p>
                          <button
                            type="button"
                            onClick={() => setMajlisSearchQuery('')}
                            className="mt-2 text-xs text-emerald-700 font-semibold hover:underline cursor-pointer"
                          >
                            সকল মজলিস দেখতে সার্চ মুছুন
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  {activeTab === 'admin' ? (
                    <Lock className="w-3.5 h-3.5 text-purple-600" />
                  ) : (
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                  {activeTab === 'admin' ? 'পাসওয়ার্ড (Password)' : 'পাসওয়ার্ড (Mobile No.)'}
                </span>
                {activeTab === 'majlis' && (
                  <span className="text-[10px] text-gray-500 font-normal">
                    শিটে থাকা মোবাইল নম্বর
                  </span>
                )}
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    activeTab === 'admin'
                      ? 'পাসওয়ার্ড লিখুন'
                      : 'মোবাইল নম্বর লিখুন'
                  }
                  required
                  autoComplete="current-password"
                  className="w-full px-3.5 py-2.5 pr-10 bg-gray-50/50 border border-gray-300 focus:bg-white rounded-xl text-xs font-semibold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition shadow-2xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 p-0.5"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Instruction Banner */}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-[11px] text-gray-600 leading-relaxed">
              {activeTab === 'admin' ? (
                <p>
                  🛡️ <strong className="text-purple-900">অ্যাডমিন সুবিধা:</strong> সকল ১৩৯+ মজলিসের জন্য রিপোর্ট সাবমিট, ড্রপডাউন থেকে যেকোনো মজলিস নির্বাচন ও গুগল শিট সেটিংস পরিবর্তন করতে পারবেন।
                </p>
              ) : (
                <p>
                  🔒 <strong className="text-emerald-900">মজলিস সুবিধা:</strong> লগইন করার পর ১. মজলিস নাম ড্রপডাউনে{' '}
                  <span className="font-bold text-emerald-800">শুধুমাত্র আপনার মজলিস</span> থাকবে। অন্য কোনো মজলিস প্রদর্শিত হবে না।
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold text-white transition flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/20'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? 'যাচাই করা হচ্ছে...'
                  : activeTab === 'admin'
                  ? 'অ্যাডমিন হিসেবে প্রবেশ করুন'
                  : 'মজলিস অ্যাকাউন্টে প্রবেশ করুন'}
              </span>
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-gray-400 mt-6">
          গুগল স্প্রেডশিট &quot;Majlis-Names&quot; ডাটার সাথে সিঙ্ক করা।
        </p>
      </div>
    </div>
  );
};
