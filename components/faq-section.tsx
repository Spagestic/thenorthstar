"use client";

import { useState } from "react";

type FaqItem = {
  question: string;
  answer: string;
};

const faqData: FaqItem[] = [
  {
    question: "What is Ovoxa and who is it for?",
    answer:
      "Ovoxa is an AI-powered interview practice platform designed for university students preparing for job interviews. We simulate realistic voice-based interviews and provide personalized feedback to help you improve your interview skills faster.",
  },
  {
    question: "How does the voice-based interview simulation work?",
    answer:
      "Our AI conducts realistic interview sessions tailored to specific companies and roles. You respond verbally, and our system analyzes both your content and delivery—including filler words, pauses, pace, and clarity—to give you actionable feedback on how to improve.",
  },
  {
    question: "What kind of feedback will I receive?",
    answer:
      "You'll get detailed, personalized feedback on your speech delivery (filler words, pace, pauses, clarity) and content relevance. Our AI identifies specific areas for improvement and provides targeted suggestions to help you sound more confident and articulate.",
  },
  {
    question: "Can I practice for specific companies or roles?",
    answer:
      "Yes! We curate company and role-specific question banks so you can practice with questions relevant to your target positions. Whether you're preparing for a tech interview, consulting case, or behavioral round, we've got you covered.",
  },
  {
    question: "Is my practice data private and secure?",
    answer:
      "Absolutely. Your interview recordings and practice sessions are private and encrypted. We take data security seriously and never share your information with third parties.",
  },
  {
    question: "How do I get started?",
    answer:
      "Simply sign up, select the company and role you're preparing for, and start your first practice session. You'll receive immediate feedback after each interview to track your progress and improve continuously.",
  },
];

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="flex w-full items-start justify-center" id="faqs">
      <div className="flex flex-1 flex-col items-start justify-start gap-6 px-4 py-16 md:px-12 md:py-20 lg:flex-row lg:gap-12">
        {/* Left Column - Header */}
        <div className="flex w-full flex-col items-start justify-center gap-4 lg:flex-1 lg:py-5">
          <div className="flex w-full flex-col justify-center font-sans font-semibold text-2xl text-[#49423D] leading-tight tracking-tight md:text-3xl md:leading-tight lg:text-4xl lg:leading-tight">
            Frequently Asked Questions
          </div>
          <div className="w-full font-normal font-sans text-[#605A57] text-sm leading-7 md:text-base">
            Everything you need to know about practicing
            <br className="hidden md:block" />
            interviews with AI-powered feedback.
          </div>
        </div>

        {/* Right Column - FAQ Items */}
        <div className="flex w-full flex-col items-center justify-center lg:flex-1">
          <div className="flex w-full flex-col">
            {faqData.map((item, index) => {
              const isOpen = openItems.includes(index);

              return (
                <div
                  className="w-full overflow-hidden border-[rgba(73,66,61,0.16)] border-b"
                  key={index as number}
                >
                  <button
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-5 px-5 py-[18px] text-left transition-colors duration-200 hover:bg-[rgba(73,66,61,0.02)]"
                    onClick={() => toggleItem(index)}
                    type="button"
                  >
                    <div className="flex-1 font-medium font-sans text-[#49423D] text-base leading-6 md:text-lg">
                      {item.question}
                    </div>
                    <div className="flex items-center justify-center">
                      <ChevronDownIcon
                        className={`h-6 w-6 text-[rgba(73,66,61,0.60)] transition-transform duration-300 ease-in-out ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-5 pb-[18px] font-normal font-sans text-[#605A57] text-sm leading-6 md:text-base">
                      {item.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
