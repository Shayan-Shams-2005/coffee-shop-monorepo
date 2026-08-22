import { Button } from "@repo/ui/button";

export default function Home() {
  return (
    <div className="bg-coffee-100 min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-5xl font-bold text-coffee-900">
          به فروشگاه قهوه ما خوش آمدید!
        </h1>
        <p className="text-xl text-coffee-600">
          طعم واقعی اسپرسو را با دانه‌های دست‌چین شده ما تجربه کنید.
        </p>

        <div className="flex justify-center gap-4 pt-4">
          <Button>مشاهده محصولات</Button>
          <Button className="bg-coffee-800 hover:bg-coffee-900">
            حساب کاربری
          </Button>
        </div>
      </div>
    </div>
  );
}
