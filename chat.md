# chat.md

## AI Interaction Overview

During the development of **Ovoxa**, our GenAI-powered interview platform, we leveraged multiple AI tools, including perplexity to fuel brainstorming, and GitHub Copilot (GPT-4.1, GPT-5 mini, Grok Code Fast 1, Claude Haiku 4.5, Claude Sonnet 4.5, Gemini 2.5 Pro) for code generation, particularly for modularizing large chunks of code, and customizing templates to our project.

## Prompting Details

Below are a selection of prompts and a summary of how AI responses impacted our work:

### Prompt 1: Landing Page Ideation

**Prompt:**  
_"I have a business idea about creating an GenAI role-play platform for training university students for job/ interviews. The up-to-date questions from big companies can be found from reddit forums or GitHub pages. The platform will try you on a virtual call with an AI voice agent, it will then stimulate an interview by asking questions. The user's input will be transcribed and analyzed so that we can provide feedback later. It will catch the number of filler words like "ugh"/"umm", long pauses, too speedy/jumpy pace, inadequate answers, "not answering the question", getting the facts wrong, and other points which can determine the user's preparedness for the interview. There will also be a checklist / grading criteria to determine whether the candidate meet the job requirements and is capable to handle the job responsibilities. let's draft the markdown content for a landing page for this project, including sections like hero, features, pricing, faq, etc"_

**Summary of AI Response:**  
The AI generated a comprehensive landing page structure with clear sections such as Hero, Problem, Features, How It Works, Pricing, Testimonials, FAQ, and CTA. We adapted some of this structure directly into our README.md and website content, ensuring clarity in our value proposition and technical details.

### Prompt 2: Copywriting for UI Components

**Prompt:**  
_"Customize the content of the `Features`, `PricingSection`, and `FAQ` components to better align with our project, see the `Readme.md` file."_

**Summary of AI Response:**  
The AI provided tailored content for each of the specified components. This helped us quickly refine our UI text to resonate with potential users.

### Prompt 3: Customizing Logo Cloud Component

**Prompt:**  
_"for `ScrollVelocityContainer` in logo-cloud.tsx, let's display the company logos using `getCompanyLogo` from `@/lib/company-logos.ts`"_

**Summary of AI Response:**
The AI provided a code snippet that integrated the `getCompanyLogo` function to render company logos within the `ScrollVelocityContainer`.

## Project Evolution

Our AI-assisted approach drove several breakthroughs and refinements:

- **Faster Prototyping:** Brainstorming sessions with AI revealed alternate UIs and feature prioritizations, allowing us to pivot quickly and improve user flows.
- **Quality & Scale:** Leveraging AI-generated questions and code templates let us scale interview content and UI components rapidly while maintaining quality.
- **Debugging Support:** Copilot and ChatGPT helped resolve Next.js/Tailwind bugs and guided Supabase integration, reducing friction and developer time spent on troubleshooting.

AI was a critical collaborator at every stage of our landing page and platform development.
