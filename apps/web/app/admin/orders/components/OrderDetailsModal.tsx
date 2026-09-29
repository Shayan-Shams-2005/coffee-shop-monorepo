// app/admin/orders/components/OrderDetailsModal.tsx
import { Receipt, Calendar, X, Ban, User, Phone, MapPin } from "lucide-react";
import { Order, STATUS_CONFIG, toFarsiNumber, formatPrice, formatDate } from "../types";

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
  onCancelOrder: (id: string) => void;
}

export function OrderDetailsModal({ order, onClose, onCancelOrder }: OrderDetailsModalProps) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-[#1A1412] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]" dir="rtl">
        
        <div className="flex items-center justify-between p-6 border-b border-[#F5EFE6] dark:border-[#3c2317] shrink-0">
          <div>
            <h2 className="text-lg font-black text-[#2C1E16] dark:text-white flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[#C68E58]" />
              جزئیات سفارش <span className="dir-ltr inline-block text-[#C68E58]">{order.id}</span>
            </h2>
            <p className="text-xs text-[#8C7A6B] mt-1 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> ثبت شده در {toFarsiNumber(formatDate(order.date))}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors p-1 bg-gray-100 dark:bg-[#2A1B16] rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#FCF9F5] dark:bg-[#231511] border border-[#F5EFE6] dark:border-[#3c2317]">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-[#8C7A6B]">وضعیت فعلی:</span>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${STATUS_CONFIG[order.status].bg} ${STATUS_CONFIG[order.status].color}`}>
                {STATUS_CONFIG[order.status].icon}
                {STATUS_CONFIG[order.status].label}
              </div>
            </div>
            
            {order.status !== 'cancelled' && order.status !== 'delivered' && (
              <button
                onClick={() => {
                  if(confirm("آیا از لغو این سفارش اطمینان دارید؟")) {
                    onCancelOrder(order.id);
                  }
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 rounded-xl text-sm font-bold transition-colors"
              >
                <Ban className="w-4 h-4" /> لغو سفارش
              </button>
            )}
          </div>

          <div>
            <h3 className="text-sm font-black text-[#4A3022] dark:text-[#EAE0D5] mb-3">اطلاعات مشتری</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-xl border border-[#F5EFE6] dark:border-[#3c2317]">
                <div className="w-10 h-10 rounded-lg bg-[#C68E58]/10 text-[#C68E58] flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[#8C7A6B] mb-0.5">نام و نام خانوادگی</p>
                  <p className="font-bold text-[#2C1E16] dark:text-white text-sm">{order.customerName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl border border-[#F5EFE6] dark:border-[#3c2317]">
                <div className="w-10 h-10 rounded-lg bg-[#C68E58]/10 text-[#C68E58] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[#8C7A6B] mb-0.5">شماره تماس</p>
                  <p className="font-bold text-[#2C1E16] dark:text-white text-sm dir-ltr text-right">{toFarsiNumber(order.phone)}</p>
                </div>
              </div>
              <div className="flex gap-3 p-4 rounded-xl border border-[#F5EFE6] dark:border-[#3c2317] md:col-span-2">
                <div className="w-10 h-10 rounded-lg bg-[#C68E58]/10 text-[#C68E58] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[#8C7A6B] mb-1">آدرس ارسال</p>
                  <p className="font-bold text-[#2C1E16] dark:text-white text-sm leading-relaxed">{order.address}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-black text-[#4A3022] dark:text-[#EAE0D5] mb-3">اقلام سفارش</h3>
            <div className="border border-[#F5EFE6] dark:border-[#3c2317] rounded-xl overflow-hidden">
              {order.items.map((item, index) => (
                <div key={item.id} className={`flex items-center justify-between p-4 ${index !== order.items.length - 1 ? 'border-b border-[#F5EFE6] dark:border-[#3c2317]' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#FCF9F5] dark:bg-[#231511] flex items-center justify-center text-[#C68E58] text-xs font-bold shrink-0">
                      {toFarsiNumber(item.quantity)}x
                    </div>
                    <p className="text-sm font-bold text-[#2C1E16] dark:text-white">{item.name}</p>
                  </div>
                  <div className="text-sm font-bold text-[#8C7A6B] shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
              
              <div className="bg-[#FCF9F5] dark:bg-[#231511] p-4 flex items-center justify-between border-t border-[#F5EFE6] dark:border-[#3c2317]">
                <span className="font-black text-[#4A3022] dark:text-[#EAE0D5]">جمع کل پرداخت شده:</span>
                <span className="font-black text-lg text-[#C68E58]">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}