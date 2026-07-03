export default function Navbar({ onLogin }) {
    return (
      <nav className="sticky top-0 z-50 bg-[#F7F6F2]/90 backdrop-blur border-b border-[#E0DDD5]">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-bold text-base tracking-tight text-[#1A1A1A]">
            trackr<span className="text-indigo-500">.</span>
          </span>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-500">
            <a href="#features" className="hover:text-[#1A1A1A] transition">Features</a>
            <a href="#how-it-works" className="hover:text-[#1A1A1A] transition">How it works</a>
          </div>
          <button
            onClick={onLogin}
            className="text-sm font-semibold bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition"
          >
            Sign in
          </button>
        </div>
      </nav>
    )
  }