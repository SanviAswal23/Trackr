export default function ClosingCTA({ onLogin }) {
    return (
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="bg-indigo-600 rounded-2xl px-10 py-14 text-center space-y-5">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Internship season is competitive.<br />Stay on top of it.
          </h2>
          <p className="text-indigo-200 text-sm">Free to use. Sign in with Google.</p>
          <button
            onClick={onLogin}
            className="bg-white text-indigo-700 text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-indigo-50 transition"
          >
            Get started — it's free
          </button>
        </div>
      </section>
    )
  }