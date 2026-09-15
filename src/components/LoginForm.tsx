import React, { useState, useMemo } from 'react';
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

  // Suggestions for English Majlis Name
  const [majlisFilterQuery, setMajlisFilterQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const majlisSuggestions = useMemo(() => {
    if (!username.trim()) return usersList.slice(0, 8);
    const q = username.toLowerCase().trim();
    return usersList
      .filter(
        (m) =>
          m.english.toLowerCase().includes(q) ||
          m.bangla.toLowerCase().includes(q) ||
          m.fullName.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [usersList, username]);

  const handleTabChange = (tab: 'majlis' | 'admin') => {
    setActiveTab(tab);
    setErrorMessage('');
    setUsername('');
    setPassword('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
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
            'ইউজারনেম অথবা পাসওয়ার্ড সঠিক নয়। ইউজারনেম হিসেবে "Majlis in English" (যেমন: Ahmadnagar) এবং পাসওয়ার্ড হিসেবে সংশ্লিষ্ট "Mobile" নম্বর প্রদান করুন।'
          );
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'লগইনে সমস্যা হয়েছে');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper when user selects a majlis name from suggestions
  const handleQuickMajlisSelect = (m: MajlisUserRecord) => {
    setUsername(m.english);
    setShowSuggestions(false);
    setErrorMessage('');
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

            {/* Username Input */}
            <div className="relative">
              <label className="block text-xs font-bold text-gray-800 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  {activeTab === 'admin' ? (
                    <User className="w-3.5 h-3.5 text-purple-600" />
                  ) : (
                    <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                  {activeTab === 'admin' ? 'অ্যাডমিন ইউজারনেম' : 'মজলিস নাম (Majlis in English)'}
                </span>
                {activeTab === 'majlis' && (
                  <span className="text-[10px] text-gray-500 font-normal">
                    ইংরেজি নাম (যেমন: Ahmadnagar)
                  </span>
                )}
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (activeTab === 'majlis') setShowSuggestions(true);
                  }}
                  onFocus={() => {
                    if (activeTab === 'majlis') setShowSuggestions(true);
                  }}
                  placeholder={
                    activeTab === 'admin'
                      ? 'অ্যাডমিন ইউজারনেম লিখুন'
                      : 'ইংরেজি নাম লিখুন (যেমন: Ahmadnagar, Mirpur)'
                  }
                  required
                  autoFocus
                  autoComplete="username"
                  className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-300 focus:bg-white rounded-xl text-xs font-semibold text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition shadow-2xs"
                />
              </div>

              {/* Majlis Auto-complete dropdown suggestions for convenience */}
              {activeTab === 'majlis' && showSuggestions && majlisSuggestions.length > 0 && (
                <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-48 overflow-y-auto divide-y divide-gray-100">
                  <div className="px-3 py-1.5 bg-emerald-50/60 text-[10px] font-bold text-emerald-900 flex items-center justify-between">
                    <span>মজলিস তালিকা থেকে নির্বাচন:</span>
                    <button
                      type="button"
                      onClick={() => setShowSuggestions(false)}
                      className="text-gray-400 hover:text-gray-700 text-[10px]"
                    >
                      বন্ধ করুন
                    </button>
                  </div>
                  {majlisSuggestions.map((m) => (
                    <div
                      key={m.sl}
                      onClick={() => handleQuickMajlisSelect(m)}
                      className="px-3.5 py-2 hover:bg-emerald-50 cursor-pointer flex items-center justify-between text-xs transition"
                    >
                      <div>
                        <span className="font-bold text-gray-900">{m.english}</span>
                        <span className="text-gray-500 text-[11px] ml-1.5">({m.bangla})</span>
                      </div>
                      {m.district && (
                        <span className="text-[10px] text-gray-400">
                          {m.district}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

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
