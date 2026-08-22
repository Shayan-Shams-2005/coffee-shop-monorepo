export function Footer() {
  return (
    <footer className="bg-coffee-900 text-coffee-100 py-8 mt-auto">
      <div className="container mx-auto px-4 text-center space-y-4">
        <p className="text-lg font-bold text-accent">نئو کافه</p>
        <p className="text-sm text-coffee-400">
          طعم واقعی قهوه، مستقیماً از مزرعه تا فنجان شما.
        </p>
        <div className="pt-4 border-t border-coffee-800 text-xs text-coffee-400">
          © {new Date().getFullYear()} تمامی حقوق محفوظ است. توسعه داده شده با
          ❤️
        </div>
      </div>
    </footer>
  );
}
