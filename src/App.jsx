import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";

// Digital Personality Scanner - Single-file React component
// Usage: drop into a React app (Vite/CRA) as App.jsx and run.
// Tailwind CSS classes are used for styling.

const TYPES = {
  visionary: {
    id: "visionary",
    title: "The Visionary",
    emoji: "🌅",
    short: "Intuitive creator, big-picture thinker.",
    desc: "You love thinking about big ideas, seeking meaning, and tend to look far ahead. Your strength is innovation and vision; the risk is sometimes getting stuck in doubt or being too idealistic.",
    tips: [
      "Create small checklists to execute your ideas.",
      "Sharing your vision with friends can make it more real.",
    ],
  },
  caregiver: {
    id: "caregiver",
    title: "The Caregiver",
    emoji: "❤️",
    short: "Empathetic, supportive, and relationship-focused.",
    desc: "You are very sensitive to others, enjoy helping, and create warm environments. Your strength is empathy; the risk is emotional exhaustion.",
    tips: [
      "Set boundaries so your energy doesn't get drained.",
      "Maintain a self-care routine, even when busy helping others.",
    ],
  },
  explorer: {
    id: "explorer",
    title: "The Explorer",
    emoji: "🧭",
    short: "Adventurous, spontaneous, loves new experiences.",
    desc: "You easily adapt and seek new experiences. Your strength is flexibility; the risk is getting bored and struggling with consistency.",
    tips: ["Insert small routines to keep your goals moving forward.", "Record experiences so they can be evaluated later."],
  },
  strategist: {
    id: "strategist",
    title: "The Strategist",
    emoji: "🧠",
    short: "Structured, logical, and results-focused.",
    desc: "You like clear plans, discipline, and measurable targets. Your strength is execution; the risk is being less flexible to rapid changes.",
    tips: [
      "Set aside time for improvisation to increase flexibility.",
      "Delegate when details become overwhelming.",
    ],
  },
  harmonizer: {
    id: "harmonizer",
    title: "The Harmonizer",
    emoji: "🕊️",
    short: "Diplomatic, stable, maintains balance.",
    desc: "You are skilled at defusing conflicts and maintaining relationships. Your strength is diplomacy; the risk is hesitation in making firm decisions.",
    tips: ["Practice making small quick decisions every day.", "Learn to say 'no' politely."],
  },
};

const initialScores = Object.keys(TYPES).reduce((acc, k) => {
  acc[k] = 0;
  return acc;
}, {});

export default function App() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState(initialScores);
  const [history, setHistory] = useState([]);
  const [name, setName] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState({});

  useEffect(() => {
    // reset when step reset
    if (step === 0) {
      setScores(initialScores);
      setHistory([]);
      setSelectedAnswers({});
    }
  }, [step]);

  const addScore = (typeKey, points = 1, note = null) => {
    setScores((s) => ({ ...s, [typeKey]: s[typeKey] + points }));
    setHistory((h) => [...h, { type: typeKey, points, note }]);
  };

  const next = () => setStep((s) => s + 1);
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const computeResult = () => {
    // return top 2 types
    const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const top = entries.slice(0, 2).map((e) => TYPES[e[0]]);
    return top;
  };

  // --- Content for each module ---
  const ImageChoices = () => {
    const choices = [
      {
        key: "visionary",
        title: "Sunset Reflection",
        subtitle: "Calm, deep, & imaginative",
        img: "https://images.unsplash.com/photo-1501973801540-537f08ccae7b?q=80&w=1200&auto=format&fit=crop&crop=faces",
      },
      {
        key: "caregiver",
        title: "Coffee Shop Chat",
        subtitle: "Warm, social, comfortable",
        img: "https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=1200&auto=format&fit=crop&crop=faces",
      },
      {
        key: "explorer",
        title: "Forest Path",
        subtitle: "Curious, spontaneous, adventurous",
        img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop&crop=faces",
      },
      {
        key: "strategist",
        title: "Minimal Desk",
        subtitle: "Structured, organized, focused",
        img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop&crop=faces",
      },
    ];

    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Choose the image that best represents you
        </h2>
        <p className="text-sm text-gray-600">Click one image to select.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {choices.map((c) => (
            <button
              key={c.key}
              onClick={() => {
                addScore(c.key, 3, `Image: ${c.title}`);
                setSelectedAnswers({ ...selectedAnswers, image: c.key });
              }}
              className={`group bg-white rounded-2xl overflow-hidden shadow-lg transform hover:-translate-y-3 hover:shadow-2xl transition-all duration-300 p-0 border-2 ${
                selectedAnswers.image === c.key ? 'border-indigo-500 ring-4 ring-indigo-200 shadow-indigo-200' : 'border-transparent hover:border-indigo-300'
              }`}
            >
              <div className="h-56 bg-gray-100 overflow-hidden relative">
                <img src={c.img} alt={c.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                {selectedAnswers.image === c.key && (
                  <div className="absolute inset-0 bg-indigo-600 bg-opacity-20 flex items-center justify-center animate-fade-in">
                    <div className="text-white text-6xl animate-bounce-in">✓</div>
                  </div>
                )}
              </div>
              <div className="p-5 text-left bg-gradient-to-br from-white to-gray-50">
                <div className="font-bold text-lg text-gray-900">{c.title}</div>
                <div className="text-sm text-gray-600 mt-1">{c.subtitle}</div>
              </div>
            </button>
          ))}
        </div>
        <div className="flex justify-between pt-4">
          <button onClick={prev} className="px-6 py-3 rounded-xl border-2 border-gray-300 hover:border-gray-400 font-medium transition-all hover:shadow-md">
            ← Back
          </button>
          <button 
            onClick={next} 
            disabled={!selectedAnswers.image}
            className={`px-6 py-3 rounded-xl font-medium transition-all transform ${
              selectedAnswers.image
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-xl hover:scale-105 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue →
          </button>
        </div>
      </div>
    );
  };

  const StoryChoices = () => {
    const stories = [
      {
        q: "You join a new project; the team is confused about unclear tasks. Your reaction?",
        a: { text: "Calm the team & provide support", type: "caregiver" },
        b: { text: "Create breakdown & assign tasks", type: "strategist" },
      },
      {
        q: "Travel schedule changes due to weather. You…",
        a: { text: "Improvise! Find something new", type: "explorer" },
        b: { text: "Check the safest & most efficient option", type: "strategist" },
      },
      {
        q: "Your idea is rejected in discussion. You…",
        a: { text: "Evaluate it yourself first", type: "visionary" },
        b: { text: "Ask for reasons & find middle ground", type: "harmonizer" },
      },
    ];

    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Story Reaction — Choose the response you'd most likely do
        </h2>
        <div className="space-y-6 mt-6">
          {stories.map((s, idx) => (
            <div key={idx} className="bg-gradient-to-br from-white to-indigo-50 p-6 rounded-2xl shadow-lg border border-indigo-100 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="font-semibold text-lg text-gray-900 mb-4">{s.q}</div>
              <div className="mt-4 flex gap-4 flex-col md:flex-row">
                <button
                  onClick={() => {
                    addScore(s.a.type, 2, `Story ${idx + 1}A`);
                    setSelectedAnswers({ ...selectedAnswers, [`story${idx}`]: 'a' });
                  }}
                  className={`flex-1 px-6 py-4 rounded-xl border-2 font-medium transition-all duration-300 transform hover:scale-105 ${
                    selectedAnswers[`story${idx}`] === 'a'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-600 shadow-lg'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                  }`}
                >
                  <span className="text-lg">A.</span> {s.a.text}
                </button>
                <button
                  onClick={() => {
                    addScore(s.b.type, 2, `Story ${idx + 1}B`);
                    setSelectedAnswers({ ...selectedAnswers, [`story${idx}`]: 'b' });
                  }}
                  className={`flex-1 px-6 py-4 rounded-xl border-2 font-medium transition-all duration-300 transform hover:scale-105 ${
                    selectedAnswers[`story${idx}`] === 'b'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-600 shadow-lg'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                  }`}
                >
                  <span className="text-lg">B.</span> {s.b.text}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between pt-4">
          <button onClick={prev} className="px-6 py-3 rounded-xl border-2 border-gray-300 hover:border-gray-400 font-medium transition-all hover:shadow-md">
            ← Back
          </button>
          <button 
            onClick={next} 
            disabled={!selectedAnswers.story0 || !selectedAnswers.story1 || !selectedAnswers.story2}
            className={`px-6 py-3 rounded-xl font-medium transition-all transform ${
              selectedAnswers.story0 && selectedAnswers.story1 && selectedAnswers.story2
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-xl hover:scale-105 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue →
          </button>
        </div>
      </div>
    );
  };

  const ForcedChoice = () => {
    const pairs = [
      { a: { text: "Design big ideas", type: "visionary" }, b: { text: "Listen & help people", type: "caregiver" } },
      { a: { text: "Find logical solutions", type: "strategist" }, b: { text: "Maintain harmonious atmosphere", type: "harmonizer" } },
      { a: { text: "Solo exploration", type: "explorer" }, b: { text: "Deep talk with 1 person", type: "caregiver" } },
      { a: { text: "Create new ideas", type: "visionary" }, b: { text: "Complete structured tasks", type: "strategist" } },
    ];

    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Forced Choice — Pick one of two
        </h2>
        <div className="grid grid-cols-1 gap-5 mt-6">
          {pairs.map((p, i) => (
            <div key={i} className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-2xl shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                <div className="md:w-1/2">
                  <div className="text-sm font-semibold text-indigo-600 mb-2">Question {i + 1}</div>
                  <div className="font-medium text-gray-900">
                    {p.a.text} <span className="text-gray-400 mx-2">OR</span> {p.b.text}
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      addScore(p.a.type, 1, `Forced ${i + 1}A`);
                      setSelectedAnswers({ ...selectedAnswers, [`forced${i}`]: 'a' });
                    }}
                    className={`px-8 py-4 rounded-xl border-2 font-bold text-lg transition-all duration-300 transform hover:scale-110 ${
                      selectedAnswers[`forced${i}`] === 'a'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-600 shadow-xl scale-105'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                    }`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => {
                      addScore(p.b.type, 1, `Forced ${i + 1}B`);
                      setSelectedAnswers({ ...selectedAnswers, [`forced${i}`]: 'b' });
                    }}
                    className={`px-8 py-4 rounded-xl border-2 font-bold text-lg transition-all duration-300 transform hover:scale-110 ${
                      selectedAnswers[`forced${i}`] === 'b'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-600 shadow-xl scale-105'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                    }`}
                  >
                    B
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between pt-4">
          <button onClick={prev} className="px-6 py-3 rounded-xl border-2 border-gray-300 hover:border-gray-400 font-medium transition-all hover:shadow-md">
            ← Back
          </button>
          <button 
            onClick={next} 
            disabled={!selectedAnswers.forced0 || !selectedAnswers.forced1 || !selectedAnswers.forced2 || !selectedAnswers.forced3}
            className={`px-6 py-3 rounded-xl font-medium transition-all transform ${
              selectedAnswers.forced0 && selectedAnswers.forced1 && selectedAnswers.forced2 && selectedAnswers.forced3
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-xl hover:scale-105 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            View Results 🎉
          </button>
        </div>
      </div>
    );
  };

  const ResultScreen = () => {
    const top = computeResult();

    useEffect(() => {
      // Trigger confetti when results load
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#7C3AED', '#EC4899', '#8B5CF6']
      });
      
      // Second burst
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#4F46E5', '#7C3AED', '#EC4899']
        });
      }, 250);
      
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#4F46E5', '#7C3AED', '#EC4899']
        });
      }, 400);
    }, []);

    return (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            🎉 Personality Results 🎉
          </h2>
          <p className="text-gray-600">Here are the two types that best reflect your choices.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {top.map((t, idx) => (
            <div key={t.id} className="bg-gradient-to-br from-white via-indigo-50 to-purple-50 p-8 rounded-3xl shadow-2xl border-2 border-indigo-200 transform hover:scale-105 transition-all duration-300 animate-slide-up" style={{animationDelay: `${idx * 200}ms`}}>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-6xl">{t.emoji}</div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                    {idx === 0 ? '🏆 Primary Type' : '✨ Secondary Type'}
                  </div>
                  <div className="font-bold text-2xl text-gray-900 mt-1">{t.title}</div>
                </div>
              </div>
              <div className="text-sm text-indigo-600 font-medium mb-3">{t.short}</div>
              <div className="text-gray-700 leading-relaxed mb-4">{t.desc}</div>
              <div className="bg-white bg-opacity-60 p-4 rounded-xl">
                <div className="font-semibold text-indigo-700 mb-2">💡 Quick tips:</div>
                <ul className="space-y-2">
                  {t.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-indigo-500 mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-white to-indigo-50 p-6 rounded-2xl shadow-lg border-2 border-indigo-200">
          <div className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">📊</span> Score Breakdown
          </div>
          <div className="space-y-3">
            {Object.entries(scores)
              .sort((a, b) => b[1] - a[1])
              .map(([key, value]) => {
                const type = TYPES[key];
                const maxScore = Math.max(...Object.values(scores));
                const percentage = maxScore > 0 ? (value / maxScore) * 100 : 0;
                return (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{type.emoji}</span>
                        <span className="font-semibold text-gray-800">{type.title}</span>
                      </div>
                      <span className="font-bold text-indigo-600 text-lg">{value} pts</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="mt-4 pt-4 border-t border-indigo-200 text-sm text-gray-600 flex justify-between">
            <span>Total responses: {history.length}</span>
            <span>Max possible: {3 + (3 * 2) + (4 * 1)} points per type</span>
          </div>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => {
              setStep(0);
              setScores(initialScores);
              setHistory([]);
              setSelectedAnswers({});
            }}
            className="px-8 py-4 rounded-xl border-2 border-indigo-300 hover:border-indigo-500 font-semibold text-indigo-700 transition-all hover:shadow-lg transform hover:scale-105"
          >
            🔄 Try Again
          </button>
          <button
            onClick={() => {
              const topText = top.map((t) => `${t.title} — ${t.short}`).join("\n");
              const payload = `Name: ${name || "-"}\nResults: \n${topText} \n(Generated by Digital Personality Scanner)`;
              navigator.clipboard?.writeText(payload);
              alert("✅ Results copied to clipboard. You can paste it in chat or documents.");
            }}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:shadow-xl transition-all transform hover:scale-105"
          >
            📋 Copy Results
          </button>
        </div>

        <div className="text-sm text-gray-500 text-center mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          ℹ️ Note: this is not a formal psychological test. Use it for reflection and fun.
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-6 md:p-12 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-16 text-center relative z-10">
          {/* Logo */}
          <div className="flex justify-center mb-6 animate-float">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-white rounded-2xl p-4 shadow-lg">
                <img 
                  src="/binus-logo.png" 
                  alt="BINUS Logo" 
                  className="h-12 sm:h-16 md:h-20 w-auto object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="hidden">
                  <svg className="h-12 sm:h-16 md:h-20 w-auto" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="200" height="80" rx="10" fill="url(#grad1)"/>
                    <text x="100" y="50" fontFamily="Arial, sans-serif" fontSize="32" fontWeight="bold" fill="white" textAnchor="middle">BINUS</text>
                    <defs>
                      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{stopColor: '#4F46E5', stopOpacity: 1}} />
                        <stop offset="100%" style={{stopColor: '#7C3AED', stopOpacity: 1}} />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="inline-block mb-8 animate-fade-in-up px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 leading-tight py-2">
              ✨ Digital Personality Scanner
            </h1>
          </div>
          <p className="text-gray-700 text-lg md:text-xl font-medium animate-fade-in-up animation-delay-200 mb-6">Interactive game-style personality test</p>
          <div className="flex items-center justify-center gap-2 mb-12 text-sm text-gray-600 animate-fade-in-up animation-delay-400">
            <span className="bg-white px-3 py-1 rounded-full shadow-sm">📸 images</span>
            <span className="text-gray-400">→</span>
            <span className="bg-white px-3 py-1 rounded-full shadow-sm">📖 stories</span>
            <span className="text-gray-400">→</span>
            <span className="bg-white px-3 py-1 rounded-full shadow-sm">🔀 choices</span>
            <span className="text-gray-400">→</span>
            <span className="bg-white px-3 py-1 rounded-full shadow-sm">🎯 results</span>
          </div>
        </header>

        <main className="bg-transparent relative z-0">
          <div className="bg-white bg-opacity-60 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white border-opacity-40 hover:shadow-3xl transition-all duration-500">
            {/* Step navigator */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg transition-all duration-300 ${
                step === 0 ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-110" : "bg-gray-200 text-gray-600"
              }`}>
                1
              </div>
              <div className={`h-1 w-12 rounded ${step > 0 ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg transition-all duration-300 ${
                step === 1 ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-110" : step > 1 ? "bg-indigo-500 text-white" : "bg-gray-200 text-gray-600"
              }`}>
                2
              </div>
              <div className={`h-1 w-12 rounded ${step > 1 ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg transition-all duration-300 ${
                step === 2 ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-110" : step > 2 ? "bg-indigo-500 text-white" : "bg-gray-200 text-gray-600"
              }`}>
                3
              </div>
              <div className={`h-1 w-12 rounded ${step >= 3 ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-sm transition-all duration-300 ${
                step >= 3 ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg scale-110" : "bg-gray-200 text-gray-600"
              }`}>
                ✓
              </div>
            </div>

            {/* Content */}
            <div>
              {step === 0 && <ImageChoices />}
              {step === 1 && <StoryChoices />}
              {step === 2 && <ForcedChoice />}
              {step >= 3 && <ResultScreen />}
            </div>

            {/* Footer controls for name and navigation when relevant */}
            {step < 3 && (
              <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="✏️ Name (optional)"
                    className="px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-indigo-500 focus:outline-none transition-all"
                  />
                  <div className="text-sm text-gray-500 bg-indigo-50 px-3 py-2 rounded-lg">
                    📝 Answers: {history.length}
                  </div>
                </div>

                <div className="flex gap-3">
                  {step > 0 && (
                    <button onClick={prev} className="px-6 py-3 rounded-xl border-2 border-gray-300 hover:border-gray-400 font-medium transition-all hover:shadow-md">
                      ← Back
                    </button>
                  )}
                  {step === 0 && (
                    <button onClick={() => setStep(1)} className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:shadow-xl transition-all transform hover:scale-105">
                      Start Stories →
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <footer className="mt-6 text-center text-xs text-gray-600 bg-white bg-opacity-50 backdrop-blur-md p-4 rounded-xl border border-white border-opacity-40 hover:bg-opacity-70 transition-all duration-300">
            🎨 Built for workshop & interactive booths — customize questions, images, and scoring as needed.
          </footer>
        </main>
      </div>
    </div>
  );
}
