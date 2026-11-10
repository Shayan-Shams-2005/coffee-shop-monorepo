// app/admin/settings/faq/page.tsx
"use client";

import { useState } from "react";
import { 
  Save, 
  Plus, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  Loader2,
  X,
  Truck,
  CreditCard,
  Package,
  ShieldCheck,
  HelpCircle,
  MessageCircleQuestion,
  ChevronDown,
  ChevronUp
} from "lucide-react";

// --- Types ---
type FAQQuestion = {
  id: string;
  question: string;
  answer: string;
};

type FAQGroup = {
  id: string;
  title: string;
  icon: string;
  questions: FAQQuestion[];
};

// Available icons for groups
const ICON_OPTIONS = [
  { id: "truck", label: "ارسال", icon: Truck },
  { id: "credit-card", label: "پرداخت", icon: CreditCard },
  { id: "package", label: "محصولات", icon: Package },
  { id: "shield", label: "ضمانت", icon: ShieldCheck },
  { id: "help", label: "عمومی", icon: HelpCircle },
];

// --- Initial Mock Data ---
const INITIAL_DATA: FAQGroup[] = [
  {
    id: "g1",
    title: "سفارش و ارسال",
    icon: "truck",
    questions: [
      {
        id: "q1",
        question: "هزینه ارسال سفارشات چقدر است؟",
        answer: "هزینه ارسال برای سفارش‌های بالای ۱ میلیون تومان کاملاً رایگان است. برای سفارش‌های کمتر از این مبلغ، هزینه ارسال محاسبه می‌شود."
      }
    ]
  },
  {
    id: "g2",
    title: "روند پرداخت",
    icon: "credit-card",
    questions: [
      {
        id: "q3",
        question: "آیا امکان پرداخت درب منزل وجود دارد؟",
        answer: "در حال حاضر پرداخت درب منزل تنها برای مشتریان ساکن تهران امکان‌پذیر است."
      }
    ]
  }
];

export default function FAQSettingsPage() {
  const [groups, setGroups] = useState<FAQGroup[]>(INITIAL_DATA);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Expanded states for accordions
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["g1", "g2"]);

  // Modal States
  const [groupModal, setGroupModal] = useState<{ isOpen: boolean; data: Partial<FAQGroup> | null }>({ isOpen: false, data: null });
  const [questionModal, setQuestionModal] = useState<{ isOpen: boolean; groupId: string; data: Partial<FAQQuestion> | null }>({ isOpen: false, groupId: "", data: null });

  const toggleGroup = (id: string) => {
    setExpandedGroups(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  };

  const handleSavePage = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    }, 1500);
  };

  // --- Group Handlers ---
  const handleSaveGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupModal.data?.title) return;

    if (groupModal.data.id) {
      setGroups(groups.map(g => g.id === groupModal.data?.id ? { ...g, title: groupModal.data.title!, icon: groupModal.data.icon || "help" } : g));
    } else {
      const newId = Date.now().toString();
      setGroups([...groups, {
        id: newId,
        title: groupModal.data.title,
        icon: groupModal.data.icon || "help",
        questions: []
      }]);
      setExpandedGroups([...expandedGroups, newId]);
    }
    setGroupModal({ isOpen: false, data: null });
  };

  const handleDeleteGroup = (id: string) => {
    if (confirm("آیا از حذف این گروه و تمام سوالات آن مطمئن هستید؟")) {
      setGroups(groups.filter(g => g.id !== id));
    }
  };

  // --- Question Handlers ---
  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const { groupId, data } = questionModal;
    if (!data?.question || !data?.answer) return;

    setGroups(groups.map(group => {
      if (group.id !== groupId) return group;
      if (data.id) {
        return {
          ...group,
          questions: group.questions.map(q => q.id === data.id ? { ...q, question: data.question!, answer: data.answer! } : q)
        };
      } else {
        return {
          ...group,
          questions: [...group.questions, { id: Date.now().toString(), question: data.question!, answer: data.answer! }]
        };
      }
    }));
    setQuestionModal({ isOpen: false, groupId: "", data: null });
  };

  const handleDeleteQuestion = (groupId: string, questionId: string) => {
    if (confirm("آیا از حذف این سوال مطمئن هستید؟")) {
      setGroups(groups.map(group => {
        if (group.id !== groupId) return group;
        return { ...group, questions: group.questions.filter(q => q.id !== questionId) };
      }));
    }
  };

  const getIconComponent = (iconId: string) => {
    const iconObj = ICON_OPTIONS.find(i => i.id === iconId);
    const IconComponent = iconObj ? iconObj.icon : HelpCircle;
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <div className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 py-8 md:py-12 animate-in fade-in duration-500 font-sans" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#4A3022] dark:text-[#EAE0D5] tracking-tight">تنظیمات سوالات متداول</h1>
          <p className="text-[#8C7A6B] dark:text-[#A1A1A1] font-medium mt-2">
            گروه‌بندی‌ها و پرسش و پاسخ‌های صفحه FAQ را در اینجا مدیریت کنید.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4CAF50]/10 border border-[#4CAF50]/20 text-[#2E7D32] dark:text-[#81C784] font-bold text-sm transition-all duration-300 ${showSuccess ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
            <CheckCircle2 className="w-5 h-5" />
            تغییرات با موفقیت ذخیره شد
          </div>
          
          <button
            onClick={handleSavePage}
            disabled={isSaving}
            className="h-11 px-6 bg-[#C68E58] hover:bg-[#A87242] text-white font-bold rounded-xl transition-all shadow-[0_4px_15px_rgba(198,142,88,0.25)] dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            ذخیره تغییرات
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-6">
        
        {groups.map((group) => {
          const isExpanded = expandedGroups.includes(group.id);
          
          return (
            <div key={group.id} className="bg-[#FCF9F5] dark:bg-[#1A0F0C] rounded-[2rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] overflow-hidden shadow-sm transition-all">
              
              {/* Group Header */}
              <div className="p-4 sm:p-6 bg-white dark:bg-[#231511]/30 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => toggleGroup(group.id)}>
                  <div className="w-12 h-12 rounded-2xl bg-[#FCF9F5] dark:bg-[#1A0F0C] border border-[#E3C3A4]/50 dark:border-[#3c2317] flex items-center justify-center text-[#C68E58]">
                    {getIconComponent(group.icon)}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-[#4A3022] dark:text-[#EAE0D5] flex items-center gap-2">
                      {group.title}
                      <span className="bg-[#E3C3A4]/30 dark:bg-[#3c2317] text-[#8C7A6B] dark:text-[#A1A1A1] text-xs px-2 py-0.5 rounded-md">
                        {toFarsiNumber(group.questions.length)} سوال
                      </span>
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setGroupModal({ isOpen: true, data: group })}
                    className="p-2.5 rounded-xl text-[#8C7A6B] hover:text-[#C68E58] hover:bg-[#E3C3A4]/20 dark:hover:bg-[#3c2317] transition-colors"
                    title="ویرایش گروه"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteGroup(group.id)}
                    className="p-2.5 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                    title="حذف گروه"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => toggleGroup(group.id)}
                    className="p-2.5 rounded-xl text-[#8C7A6B] hover:text-[#C68E58] hover:bg-[#E3C3A4]/20 dark:hover:bg-[#3c2317] transition-colors ml-2"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Questions List */}
              {isExpanded && (
                <div className="p-4 sm:p-6 border-t border-[#E3C3A4]/60 dark:border-[#3c2317]">
                  <div className="flex flex-col gap-4">
                    {group.questions.map((q) => (
                      <div key={q.id} className="bg-white dark:bg-[#1A0F0C] border border-[#E3C3A4]/40 dark:border-[#3c2317] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 justify-between group/item hover:border-[#C68E58]/40 transition-colors">
                        <div className="flex-1">
                          <h3 className="font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2 flex items-start gap-2">
                            <MessageCircleQuestion className="w-5 h-5 text-[#C68E58] shrink-0 mt-0.5" />
                            {q.question}
                          </h3>
                          <p className="text-sm font-medium text-[#8C7A6B] dark:text-[#A1A1A1] leading-loose pl-7 text-justify">
                            {q.answer}
                          </p>
                        </div>
                        <div className="flex items-start gap-2 shrink-0 sm:opacity-0 group-hover/item:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setQuestionModal({ isOpen: true, groupId: group.id, data: q })}
                            className="p-2 rounded-lg text-[#8C7A6B] hover:text-[#C68E58] hover:bg-[#FCF9F5] dark:hover:bg-[#231511] transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteQuestion(group.id, q.id)}
                            className="p-2 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => setQuestionModal({ isOpen: true, groupId: group.id, data: { question: "", answer: "" } })}
                      className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#E3C3A4] dark:border-[#3c2317] hover:border-[#C68E58] dark:hover:border-[#C68E58] text-[#8C7A6B] hover:text-[#C68E58] rounded-2xl py-4 font-bold text-sm transition-colors mt-2"
                    >
                      <Plus className="w-5 h-5" />
                      افزودن سوال جدید به این گروه
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <button
          onClick={() => setGroupModal({ isOpen: true, data: { icon: "help", title: "" } })}
          className="w-full flex items-center justify-center gap-2 bg-[#C68E58]/10 hover:bg-[#C68E58]/20 text-[#C68E58] rounded-[2rem] py-6 font-black text-lg transition-colors border-2 border-dashed border-[#C68E58]/30 hover:border-[#C68E58]/50"
        >
          <Plus className="w-6 h-6" />
          ایجاد گروه جدید
        </button>

      </div>

      {/* --- Group Modal --- */}
      {groupModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1A0F0C] rounded-[2rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#E3C3A4]/60 dark:border-[#3c2317] flex justify-between items-center bg-[#FCF9F5] dark:bg-[#231511]">
              <h3 className="font-black text-xl text-[#4A3022] dark:text-[#EAE0D5]">
                {groupModal.data?.id ? "ویرایش گروه" : "گروه جدید"}
              </h3>
              <button onClick={() => setGroupModal({ isOpen: false, data: null })} className="text-[#8C7A6B] hover:text-rose-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveGroup} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2">عنوان گروه</label>
                <input
                  type="text"
                  value={groupModal.data?.title || ""}
                  onChange={(e) => setGroupModal({ ...groupModal, data: { ...groupModal.data, title: e.target.value } })}
                  className="w-full bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#4A3022] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50"
                  placeholder="مثلاً: شرایط بازگشت کالا"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-3">آیکون گروه</label>
                <div className="grid grid-cols-5 gap-2">
                  {ICON_OPTIONS.map(opt => {
                    const IconComp = opt.icon;
                    const isSelected = groupModal.data?.icon === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setGroupModal({ ...groupModal, data: { ...groupModal.data, icon: opt.id } })}
                        className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1.5 border transition-all ${
                          isSelected 
                            ? "bg-[#C68E58]/10 border-[#C68E58] text-[#C68E58]" 
                            : "bg-[#FCF9F5] dark:bg-[#231511] border-[#E3C3A4]/40 dark:border-[#3c2317] text-[#8C7A6B] hover:border-[#C68E58]/50"
                        }`}
                        title={opt.label}
                      >
                        <IconComp className="w-6 h-6" />
                      </button>
                    );
                  })}
                </div>
              </div>
              <button type="submit" className="w-full bg-[#C68E58] hover:bg-[#A87242] text-white font-bold py-3.5 rounded-xl transition-all">
                ذخیره گروه
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- Question Modal --- */}
      {questionModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1A0F0C] rounded-[2rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#E3C3A4]/60 dark:border-[#3c2317] flex justify-between items-center bg-[#FCF9F5] dark:bg-[#231511]">
              <h3 className="font-black text-xl text-[#4A3022] dark:text-[#EAE0D5]">
                {questionModal.data?.id ? "ویرایش سوال" : "ثبت سوال جدید"}
              </h3>
              <button onClick={() => setQuestionModal({ isOpen: false, groupId: "", data: null })} className="text-[#8C7A6B] hover:text-rose-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveQuestion} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2">پرسش</label>
                <input
                  type="text"
                  value={questionModal.data?.question || ""}
                  onChange={(e) => setQuestionModal({ ...questionModal, data: { ...questionModal.data, question: e.target.value } })}
                  className="w-full bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#4A3022] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 font-bold"
                  placeholder="سوال کاربر را اینجا بنویسید..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2">پاسخ</label>
                <textarea
                  rows={5}
                  value={questionModal.data?.answer || ""}
                  onChange={(e) => setQuestionModal({ ...questionModal, data: { ...questionModal.data, answer: e.target.value } })}
                  className="w-full bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#4A3022] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 resize-none custom-scrollbar leading-loose"
                  placeholder="پاسخ کامل را در این کادر وارد کنید..."
                  required
                />
              </div>
              <button type="submit" className="w-full bg-[#C68E58] hover:bg-[#A87242] text-white font-bold py-3.5 rounded-xl transition-all">
                ذخیره پرسش و پاسخ
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// Convert numbers helper for the badge
const toFarsiNumber = (num: number | string) => {
  if (num === null || num === undefined) return "۰";
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)] || x);
};