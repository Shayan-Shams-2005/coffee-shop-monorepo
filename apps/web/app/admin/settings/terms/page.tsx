// app/admin/settings/terms/page.tsx
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
  Scale, 
  Shield, 
  ShoppingBag, 
  CreditCard,
  FileText,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp
} from "lucide-react";

// --- Types ---
type TermParagraph = {
  id: string;
  text: string;
};

type TermGroup = {
  id: string;
  title: string;
  icon: string;
  content: TermParagraph[];
};

// Available icons for groups
const ICON_OPTIONS = [
  { id: "scale", label: "قوانین", icon: Scale },
  { id: "shield", label: "حریم شخصی", icon: Shield },
  { id: "shopping-bag", label: "سفارشات", icon: ShoppingBag },
  { id: "credit-card", label: "پرداخت", icon: CreditCard },
  { id: "file-text", label: "مستندات", icon: FileText },
  { id: "alert", label: "هشدار", icon: AlertCircle },
  { id: "info", label: "اطلاعات", icon: Info },
];

// --- Initial Mock Data ---
const INITIAL_DATA: TermGroup[] = [
  {
    id: "g1",
    title: "قوانین عمومی",
    icon: "scale",
    content: [
      { id: "p1", text: "توجه داشته باشید کلیه اصول و رویه‌های نئو کافه منطبق با قوانین جمهوری اسلامی ایران، قانون تجارت الکترونیک و قانون حمایت از حقوق مصرف‌کننده است." },
      { id: "p2", text: "کاربر نیز موظف به رعایت قوانین مرتبط با کاربر است. در صورتی که در قوانین مندرج، رویه‌ها و سرویس‌های نئو کافه تغییراتی در آینده ایجاد شود، در همین صفحه منتشر و به روز رسانی می‌شود." },
      { id: "p3", text: "استفاده شما از سایت نئو کافه به معنی پذیرش کامل این قوانین است." }
    ]
  },
  {
    id: "g2",
    title: "رعایت حریم شخصی",
    icon: "shield",
    content: [
      { id: "p4", text: "نئو کافه به اطلاعات خصوصی اشخاصى که از خدمات سایت استفاده می‌کنند، احترام گذاشته و از آن محافظت می‌کند." },
      { id: "p5", text: "ما متعهد می‌شویم در حد توان از حریم شخصی شما دفاع کنیم و در این راستا، تکنولوژی مورد نیاز برای هرچه مطمئن‌تر و امن‌تر شدن استفاده شما از سایت را توسعه دهیم." }
    ]
  }
];

export default function TermsSettingsPage() {
  const [groups, setGroups] = useState<TermGroup[]>(INITIAL_DATA);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Expanded states for accordions
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["g1"]);

  // Modal States
  const [groupModal, setGroupModal] = useState<{ isOpen: boolean; data: Partial<TermGroup> | null }>({ isOpen: false, data: null });
  const [paragraphModal, setParagraphModal] = useState<{ isOpen: boolean; groupId: string; data: Partial<TermParagraph> | null }>({ isOpen: false, groupId: "", data: null });

  const toggleGroup = (id: string) => {
    setExpandedGroups(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  };

  const handleSavePage = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Output payload for debugging/backend integration
    console.log("Saving Terms Data:", groups);

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
      setGroups(groups.map(g => g.id === groupModal.data?.id ? { ...g, title: groupModal.data.title!, icon: groupModal.data.icon || "scale" } : g));
    } else {
      const newId = Date.now().toString();
      setGroups([...groups, {
        id: newId,
        title: groupModal.data.title,
        icon: groupModal.data.icon || "scale",
        content: []
      }]);
      setExpandedGroups([...expandedGroups, newId]);
    }
    setGroupModal({ isOpen: false, data: null });
  };

  const handleDeleteGroup = (id: string) => {
    if (confirm("آیا از حذف این بخش و تمام بندهای آن مطمئن هستید؟")) {
      setGroups(groups.filter(g => g.id !== id));
    }
  };

  // --- Paragraph Handlers ---
  const handleSaveParagraph = (e: React.FormEvent) => {
    e.preventDefault();
    const { groupId, data } = paragraphModal;
    if (!data?.text) return;

    setGroups(groups.map(group => {
      if (group.id !== groupId) return group;
      if (data.id) {
        return {
          ...group,
          content: group.content.map(p => p.id === data.id ? { ...p, text: data.text! } : p)
        };
      } else {
        return {
          ...group,
          content: [...group.content, { id: Date.now().toString(), text: data.text! }]
        };
      }
    }));
    setParagraphModal({ isOpen: false, groupId: "", data: null });
  };

  const handleDeleteParagraph = (groupId: string, paragraphId: string) => {
    if (confirm("آیا از حذف این بند از قوانین مطمئن هستید؟")) {
      setGroups(groups.map(group => {
        if (group.id !== groupId) return group;
        return { ...group, content: group.content.filter(p => p.id !== paragraphId) };
      }));
    }
  };

  const getIconComponent = (iconId: string) => {
    const iconObj = ICON_OPTIONS.find(i => i.id === iconId);
    const IconComponent = iconObj ? iconObj.icon : Scale;
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <div className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 py-8 md:py-12 animate-in fade-in duration-500 font-sans" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#4A3022] dark:text-[#EAE0D5] tracking-tight">تنظیمات شرایط و قوانین</h1>
          <p className="text-[#8C7A6B] dark:text-[#A1A1A1] font-medium mt-2">
            بخش‌ها و بندهای متنی صفحه قوانین و مقررات سایت را مدیریت کنید.
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
                        {toFarsiNumber(group.content.length)} بند
                      </span>
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setGroupModal({ isOpen: true, data: group })}
                    className="p-2.5 rounded-xl text-[#8C7A6B] hover:text-[#C68E58] hover:bg-[#E3C3A4]/20 dark:hover:bg-[#3c2317] transition-colors"
                    title="ویرایش عنوان و آیکون"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteGroup(group.id)}
                    className="p-2.5 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                    title="حذف کامل این بخش"
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

              {/* Terms List (Paragraphs) */}
              {isExpanded && (
                <div className="p-4 sm:p-6 border-t border-[#E3C3A4]/60 dark:border-[#3c2317]">
                  <div className="flex flex-col gap-4">
                    {group.content.map((p, index) => (
                      <div key={p.id} className="bg-white dark:bg-[#1A0F0C] border border-[#E3C3A4]/40 dark:border-[#3c2317] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 justify-between group/item hover:border-[#C68E58]/40 transition-colors">
                        <div className="flex-1 flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#C68E58] mt-2.5 shrink-0"></div>
                          <p className="text-[#8C7A6B] dark:text-[#A1A1A1] text-sm sm:text-base leading-loose text-justify font-medium">
                            {p.text}
                          </p>
                        </div>
                        <div className="flex items-start gap-2 shrink-0 sm:opacity-0 group-hover/item:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setParagraphModal({ isOpen: true, groupId: group.id, data: p })}
                            className="p-2 rounded-lg text-[#8C7A6B] hover:text-[#C68E58] hover:bg-[#FCF9F5] dark:hover:bg-[#231511] transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteParagraph(group.id, p.id)}
                            className="p-2 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => setParagraphModal({ isOpen: true, groupId: group.id, data: { text: "" } })}
                      className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#E3C3A4] dark:border-[#3c2317] hover:border-[#C68E58] dark:hover:border-[#C68E58] text-[#8C7A6B] hover:text-[#C68E58] rounded-2xl py-4 font-bold text-sm transition-colors mt-2"
                    >
                      <Plus className="w-5 h-5" />
                      افزودن بند جدید به این بخش
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <button
          onClick={() => setGroupModal({ isOpen: true, data: { icon: "scale", title: "" } })}
          className="w-full flex items-center justify-center gap-2 bg-[#C68E58]/10 hover:bg-[#C68E58]/20 text-[#C68E58] rounded-[2rem] py-6 font-black text-lg transition-colors border-2 border-dashed border-[#C68E58]/30 hover:border-[#C68E58]/50"
        >
          <Plus className="w-6 h-6" />
          ایجاد بخش جدید
        </button>

      </div>

      {/* --- Group Modal --- */}
      {groupModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1A0F0C] rounded-[2rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#E3C3A4]/60 dark:border-[#3c2317] flex justify-between items-center bg-[#FCF9F5] dark:bg-[#231511]">
              <h3 className="font-black text-xl text-[#4A3022] dark:text-[#EAE0D5]">
                {groupModal.data?.id ? "ویرایش بخش" : "بخش جدید"}
              </h3>
              <button onClick={() => setGroupModal({ isOpen: false, data: null })} className="text-[#8C7A6B] hover:text-rose-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveGroup} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2">عنوان بخش</label>
                <input
                  type="text"
                  value={groupModal.data?.title || ""}
                  onChange={(e) => setGroupModal({ ...groupModal, data: { ...groupModal.data, title: e.target.value } })}
                  className="w-full bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#4A3022] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50"
                  placeholder="مثلاً: حریم خصوصی"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-3">آیکون نمایشی</label>
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
                ذخیره بخش
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- Paragraph Modal --- */}
      {paragraphModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1A0F0C] rounded-[2rem] border border-[#E3C3A4]/60 dark:border-[#3c2317] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#E3C3A4]/60 dark:border-[#3c2317] flex justify-between items-center bg-[#FCF9F5] dark:bg-[#231511]">
              <h3 className="font-black text-xl text-[#4A3022] dark:text-[#EAE0D5]">
                {paragraphModal.data?.id ? "ویرایش بند" : "بند جدید"}
              </h3>
              <button onClick={() => setParagraphModal({ isOpen: false, groupId: "", data: null })} className="text-[#8C7A6B] hover:text-rose-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveParagraph} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-[#4A3022] dark:text-[#EAE0D5] mb-2">متن قانون / مقررات</label>
                <textarea
                  rows={6}
                  value={paragraphModal.data?.text || ""}
                  onChange={(e) => setParagraphModal({ ...paragraphModal, data: { ...paragraphModal.data, text: e.target.value } })}
                  className="w-full bg-white dark:bg-[#231511] border border-[#E3C3A4]/60 dark:border-[#3c2317] rounded-xl px-4 py-3 text-[#4A3022] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C68E58]/50 resize-none custom-scrollbar leading-loose"
                  placeholder="متن کامل این بند از قوانین را وارد کنید..."
                  required
                />
              </div>
              <button type="submit" className="w-full bg-[#C68E58] hover:bg-[#A87242] text-white font-bold py-3.5 rounded-xl transition-all">
                ذخیره تغییرات
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