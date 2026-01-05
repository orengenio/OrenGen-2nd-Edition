import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Trophy, ArrowRight, RotateCcw, BookOpen, BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';

const QUESTIONS = [
  {
    question: "What does the acronym BIMI stand for?",
    options: [
      "Brand Indicators for Message Identification",
      "Business Identity Mail Interface",
      "Brand Identity Mark Integration",
      "Binary Image Mail Indicator"
    ],
    answer: 0,
    explanation: "BIMI stands for Brand Indicators for Message Identification. It is an emerging standard that allows you to display your verified logo in the recipient's inbox."
  },
  {
    question: "Which specific SVG profile is strictly required for BIMI compliance?",
    options: [
      "SVG 1.1 Full",
      "SVG Tiny 1.2 (Tiny-PS)",
      "SVG 2.0",
      "Adobe Illustrator EPS"
    ],
    answer: 1,
    explanation: "BIMI requires the SVG Tiny 1.2 Portable/Secure (Tiny-PS) profile. This strict profile prevents malicious scripts and ensures consistent rendering across email clients."
  },
  {
    question: "To enable BIMI, what must your DMARC policy (p=) be set to?",
    options: [
      "p=none",
      "p=monitor",
      "p=quarantine or p=reject",
      "p=active"
    ],
    answer: 2,
    explanation: "The DMARC policy must be at enforcement, meaning 'p=quarantine' (at 100%) or 'p=reject'. A policy of 'none' is insufficient for BIMI."
  },
  {
    question: "What is a VMC in the context of BIMI?",
    options: [
      "Virtual Mail Configuration",
      "Verified Mark Certificate",
      "Vector Mask Compression",
      "Verified Mail Client"
    ],
    answer: 1,
    explanation: "A Verified Mark Certificate (VMC) is a digital certificate issued by a certificate authority that validates your ownership of the logo trademark."
  },
  {
    question: "Which major email provider requires a VMC to display the official blue verified checkmark?",
    options: [
      "Yahoo",
      "Gmail",
      "AOL",
      "Fastmail"
    ],
    answer: 1,
    explanation: "Gmail requires a VMC to display the blue verified checkmark. They may display the logo itself without a VMC if sending reputation is strong enough, but the checkmark requires it."
  },
  {
    question: "What is the primary function of an SPF record?",
    options: [
      "To encrypt email contents",
      "To verify the sender's logo",
      "To list IP addresses authorized to send email for a domain",
      "To sign emails with a cryptographic key"
    ],
    answer: 2,
    explanation: "SPF (Sender Policy Framework) lists the IP addresses and domains that are authorized to send email on behalf of your domain."
  },
  {
    question: "Where does the BIMI DNS TXT record live?",
    options: [
      "_bimi.yourdomain.com",
      "default._bimi.yourdomain.com",
      "_dmarc.yourdomain.com",
      "bimi.yourdomain.com"
    ],
    answer: 1,
    explanation: "The standard selector is 'default', so the record is typically located at 'default._bimi.yourdomain.com'. However, custom selectors can be used."
  },
  {
    question: "What makes BIMI Forge unique compared to standard converters?",
    options: [
      "It is cheaper",
      "It only supports PNG files",
      "It generates 100% compliant SVG Tiny 1.2 files from any format",
      "It is owned by Google"
    ],
    answer: 2,
    explanation: "BIMI Forge is designed specifically to convert various image formats directly into the strict SVG Tiny 1.2 profile required for BIMI compliance."
  },
  {
    question: "What does DKIM use to verify email authenticity?",
    options: [
      "IP Allowlisting",
      "Cryptographic Signatures (Public/Private Keys)",
      "SSL Certificates",
      "Manual Verification"
    ],
    answer: 1,
    explanation: "DKIM (DomainKeys Identified Mail) uses cryptographic signatures. The sender signs the email with a private key, and the receiver verifies it using the public key in the DNS."
  },
  {
    question: "If your DMARC policy is 'p=reject', what happens to unauthenticated emails?",
    options: [
      "They are delivered to the Inbox",
      "They are marked as Spam",
      "They are blocked/bounced and not delivered",
      "They are sent to the admin"
    ],
    answer: 2,
    explanation: "A 'p=reject' policy instructs receiving mail servers to block any email that fails authentication (SPF/DKIM alignment checks)."
  }
];

export const KnowledgeQuiz: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [activeQuestions, setActiveQuestions] = useState<typeof QUESTIONS>(QUESTIONS);

  const handleStart = () => {
    // Shuffle questions using Fisher-Yates algorithm
    const shuffled = [...QUESTIONS];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setActiveQuestions(shuffled);
    
    setStarted(true);
    setCurrentQ(0);
    setScore(0);
    setIsFinished(false);
    setSelected(null);
  };

  const handleAnswer = (idx: number) => {
    if (selected !== null) return; // Prevent multiple clicks
    setSelected(idx);
    if (idx === activeQuestions[currentQ].answer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQ < activeQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
    } else {
      setIsFinished(true);
    }
  };

  // Trigger Confetti on Perfect Score
  useEffect(() => {
    if (isFinished && score === activeQuestions.length) {
      const duration = 2.5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti({ 
            ...defaults, 
            particleCount, 
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            colors: ['#CC5500', '#003366', '#ffffff'] 
        });
        confetti({ 
            ...defaults, 
            particleCount, 
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            colors: ['#CC5500', '#003366', '#ffffff'] 
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isFinished, score, activeQuestions.length]);

  if (!started) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-brand-darker py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block p-4 rounded-full bg-brand-blue/10 dark:bg-brand-blue/20 mb-6">
            <BrainCircuit className="h-16 w-16 text-brand-blue dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">BIMI & Email Security Mastery Quiz</h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-8">
            Test your knowledge on Brand Indicators for Message Identification, DMARC, and DNS protocols. 
            Are you an Email Auth Expert?
          </p>
          <button 
            onClick={handleStart}
            className="inline-flex items-center px-8 py-4 bg-brand-orange hover:bg-orange-700 text-white rounded-xl text-lg font-bold transition-all shadow-lg hover:shadow-orange-500/30"
          >
            Start Quiz <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const percentage = Math.round((score / QUESTIONS.length) * 100);
    let title = "Novice";
    let msg = "Keep learning! BIMI is complex.";
    if (percentage >= 60) { title = "Apprentice"; msg = "Good job! You know the basics."; }
    if (percentage >= 80) { title = "Pro"; msg = "Great work! You're ready to secure domains."; }
    if (percentage === 100) { title = "BIMI Master"; msg = "Perfect score! You are an authentication legend."; }

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-brand-darker py-20 px-4">
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800 text-center">
          <Trophy className={`h-20 w-20 mx-auto mb-6 ${percentage === 100 ? 'text-yellow-400' : 'text-brand-blue'}`} />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">{msg}</p>
          
          <div className="text-5xl font-extrabold text-brand-orange mb-2">{percentage}%</div>
          <p className="text-sm text-gray-400 mb-8">You got {score} out of {QUESTIONS.length} correct</p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={handleStart}
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-900 dark:text-white rounded-lg font-semibold transition-colors"
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Try Again
            </button>
            <Link 
              to="/workspace"
              className="inline-flex items-center justify-center px-6 py-3 bg-brand-orange hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors"
            >
              Go to Workspace <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const q = activeQuestions[currentQ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-brand-darker py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                <span>Question {currentQ + 1} of {QUESTIONS.length}</span>
                <span>Score: {score}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-800 rounded-full h-2.5">
                <div 
                    className="bg-brand-orange h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }}
                ></div>
            </div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                    {q.question}
                </h2>

                <div className="space-y-3">
                    {q.options.map((opt, idx) => {
                        let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all font-medium ";
                        if (selected === null) {
                            btnClass += "border-gray-200 dark:border-gray-700 hover:border-brand-blue hover:bg-blue-50 dark:hover:bg-slate-800 dark:text-gray-200";
                        } else {
                            if (idx === q.answer) {
                                btnClass += "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300";
                            } else if (idx === selected) {
                                btnClass += "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300";
                            } else {
                                btnClass += "border-gray-200 dark:border-gray-800 opacity-50 dark:text-gray-500";
                            }
                        }

                        return (
                            <button 
                                key={idx}
                                onClick={() => handleAnswer(idx)}
                                disabled={selected !== null}
                                className={btnClass}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{opt}</span>
                                    {selected !== null && idx === q.answer && <CheckCircle className="h-5 w-5 text-green-500" />}
                                    {selected !== null && idx === selected && idx !== q.answer && <XCircle className="h-5 w-5 text-red-500" />}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Explanation Footer (shows after answer) */}
            {selected !== null && (
                <div className="bg-gray-50 dark:bg-slate-950/50 p-6 border-t border-gray-200 dark:border-gray-800 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 mt-1">
                            <BookOpen className="h-5 w-5 text-brand-blue" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white mb-1">Explanation</h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                {q.explanation}
                            </p>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button 
                            onClick={nextQuestion}
                            className="px-6 py-2 bg-brand-blue text-white rounded-lg font-bold hover:bg-blue-900 transition-colors flex items-center"
                        >
                            {currentQ < QUESTIONS.length - 1 ? "Next Question" : "Finish Quiz"} <ArrowRight className="ml-2 h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};