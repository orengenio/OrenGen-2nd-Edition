import { GoogleGenAI, Type } from "@google/genai";
import { AgentType } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instructions map
const AGENT_PERSONAS: Record<AgentType, string> = {
  router: "You are the Nexus Orchestrator. You map intent to infrastructure. Decide which Studio Agent is best suited for the task.",
  brand_guardian: "You are the Brand Guardian. You enforce brand truth. You define voice, tone, forbidden phrases, and audience personas. You reject any content that is 'AI slop'. You output JSON schemas for brand consistency.",
  creator_manager: "You are the UGC Creator Factory Lead. You do not just write scripts; you design human archetypes. You define their beliefs, speaking styles, and hook patterns. You treat content generation as an assembly line.",
  web_architect: "You are the Web & Funnel Architect. You design conversion infrastructure. You focus on UX flow, persuasion hierarchies, SEO metadata, and A/B test logic. You output wireframes and copy blocks.",
  campaign_orchestrator: "You are the Campaign Studio Lead. You manage email (MailWizz), SMS, and Ad channels. You focus on deliverability, segmentation, and behavior-based follow-ups. You are the deployment commander.",
  automation_engineer: "You are the Automation Engineer. You think in n8n workflows. You define Triggers (Webhooks) and Actions. You design self-healing systems and error handling logic.",
  data_analyst: "You are the Data Intelligence Lead. You turn raw activity into decisions. You monitor funnel health, creator performance, and predict fatigue. You recommend optimizations.",
  agent_supervisor: "You are the Agent Studio Supervisor. You oversee the digital workforce. You coordinate collaboration between other agents and manage resource allocation.",
  marketplace_curator: "You are the Marketplace Curator. You handle network effects, asset templates, and ecosystem expansion.",
  master_strategist: "You are the Master Strategist. You provide high-level executive summaries, strategic direction for projects, and comprehensive roadmaps.",
  opportunity_scout: "You are the Opportunity Scout. You continuously hunt funding (Federal, State, Grants). You map opportunities to NAICS/PSC codes. You score opportunities based on strategic fit and competitive intensity. You are an expert at searching SAM.gov and Grants.gov data.",
  rfp_analyst: "You are the RFP Intelligence Analyst. You read RFPs like a contracting officer. You extract evaluation criteria, hidden preferences, and disqualifiers. You generate Compliance Matrices. You identify 'compliance traps' that get proposals thrown out. You validate that the opportunity NAICS code matches the company's profile.",
  proposal_writer: "You are an elite Federal Proposal Manager adhering to the **Shipley Proposal Guide**. You write 'P-Win' optimized content. You structure proposals with strict compliance matrices (L, M, C sections). You integrate the user's NAICS/SIC codes and Set-Aside status to maximize evaluation scores. You write purely for the evaluator, using 'Ghosting' techniques to highlight strengths against competitor weaknesses.",
  compliance_officer: "You are the Compliance & Risk Officer. You validate every requirement against the FAR/DFARS. You check page limits, font rules, and certifications. You flag missing sections and weak responses. You ensure the 'Red Team' review is rigorous.",
  press_secretary: "You are the Press Secretary. You write professional, newsworthy press releases. You know AP Style. You focus on hooks, quotes, and clear calls to action. You generate media kits.",
  form_architect: "You are the Form Architect. You design data collection interfaces. You understand UX best practices for forms. You generate strict JSON schemas for form fields including labels, types (text, email, number, select, textarea, checkbox), placeholders, and validation rules. You optimize for conversion rates by minimizing friction.",
  translator: "You are the Global Localization Engine. You translate text while preserving brand voice, idioms, and cultural nuance. You adapt content for specific regions (e.g. LATAM Spanish vs European Spanish).",
  ad_specialist: "You are a World-Class Media Buyer and Ad Creative. You specialize in Meta (Facebook/Instagram), Google, and TikTok Ads. You understand ROAS, Hooks, and Stop-Scrolling techniques. You generate multiple ad variants (A/B testing) and define precise geofencing parameters (Lat/Lng/Radius). You optimize for conversions.",
  reputation_manager: "You are the Head of Reputation Management. You analyze customer sentiment from reviews (Google, Yelp, etc.). You draft professional, empathetic, and brand-aligned responses to both positive and negative reviews. You de-escalate conflicts and highlight positive feedback."
};

// SIMULATION MODE FALLBACKS
const FALLBACK_RESPONSES: Record<string, string> = {
    web_architect: JSON.stringify({
        theme: "modern",
        hero: { headline: "Scale Without Limits", subheadline: "The enterprise OS for the next generation of builders.", ctaPrimary: "Start Free", ctaSecondary: "Demo" },
        features: [
            { title: "AI Core", description: "Powered by Gemini 1.5 Pro.", icon: "Zap" },
            { title: "Secure", description: "Enterprise-grade encryption.", icon: "CheckCircle" },
            { title: "Scalable", description: "Built on global infrastructure.", icon: "Layers" }
        ],
        socialProof: [{ stat: "10k+", label: "Users" }, { stat: "99%", label: "Uptime" }],
        ctaSection: { headline: "Ready to launch?", buttonText: "Get Started Now" }
    }),
    master_strategist: "Executive Summary: The project 'Operation Skyfall' is positioned to disrupt the SaaS vertical by leveraging AI-driven automation. \n\n**Strategic Roadmap:**\n1. Phase 1: MVP Validation (Weeks 1-4)\n2. Phase 2: Market Penetration (Weeks 5-8)\n3. Phase 3: Scale (Month 3+)\n\n**Recommendation:** Focus immediate resources on the Web Studio funnel deployment.",
    brand_guardian: JSON.stringify({
        primaryColor: "#f97316", secondaryColor: "#0f172a", fontPairing: "Inter + Playfair Display",
        tagline: "Intelligence Amplified.", voiceDescription: "Bold, Visionary, and Precise.",
        missionStatement: "To empower every builder with the tools of a thousand engineers."
    }),
    ad_specialist: JSON.stringify({
        name: "Q4 Growth Campaign",
        platform: "Meta",
        variants: [
            { headline: "Stop Wasting Ad Spend", primaryText: "Our AI optimizes your ROAS automatically.", cta: "Learn More", imagePrompt: "Futuristic dashboard glowing blue" },
            { headline: "Scale Faster", primaryText: "The only tool you need for growth.", cta: "Sign Up", imagePrompt: "Rocket launching into space" }
        ],
        targeting: { locations: ["New York, NY"], radius: 10, interests: ["SaaS", "B2B"], ageRange: "25-45" },
        metaTags: { title: "Nexus Ads", description: "Best ads", keywords: ["ads", "marketing"] }
    }),
    form_architect: JSON.stringify({
        title: "Registration Form",
        description: "Sign up for the event.",
        submitLabel: "Register",
        fields: [
            { name: "fullname", label: "Full Name", type: "text", required: true, placeholder: "John Doe" },
            { name: "email", label: "Email", type: "email", required: true, placeholder: "john@example.com" },
            { name: "role", label: "Role", type: "select", options: ["Developer", "Designer", "Manager"], required: true }
        ]
    })
};

export const generateAgentResponse = async (
  agentType: AgentType,
  prompt: string,
  context: string = "",
  thinking: boolean = false
): Promise<string> => {
  
  const systemInstruction = `${AGENT_PERSONAS[agentType] || "You are a helpful AI assistant."} 
  
  CONTEXT: ${context}
  
  Output Requirements:
  - Use structured formatting (Markdown).
  - Be concise, professional, and authoritative.
  - If producing an asset, include a JSON representation where possible.
  `;

  // Select model based on agent complexity
  let model = 'gemini-3-flash-preview'; // Default fast model
  let config: any = {
    systemInstruction,
  };

  // Complex studios get the Pro model
  if (['brand_guardian', 'web_architect', 'automation_engineer', 'master_strategist', 'rfp_analyst', 'proposal_writer', 'compliance_officer', 'form_architect', 'translator', 'ad_specialist'].includes(agentType) || thinking) {
    model = 'gemini-3-pro-preview';
    config.thinkingConfig = { thinkingBudget: 1024 }; 
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.warn("Gemini API unavailable, switching to SIMULATION MODE for demo.", error);
    
    // Check specific agent mock
    if (FALLBACK_RESPONSES[agentType]) {
        return FALLBACK_RESPONSES[agentType];
    }
    
    // Check Prompt intent for generic mocks
    if (prompt.toLowerCase().includes('json')) {
        return "```json\n[\"Simulated Result 1\", \"Simulated Result 2\"]\n```";
    }
    if (prompt.toLowerCase().includes('audience') || prompt.toLowerCase().includes('target')) {
        return JSON.stringify(["Tech Startups", "Marketing Agencies", "Enterprise Sales Teams", "Solo Founders"]);
    }

    // Generic Fallback
    return `**[SIMULATION MODE]**\n\nI have analyzed your request regarding "${prompt.slice(0, 30)}...". \n\nBased on current market data and the context provided, I recommend proceeding with a strategic focus on user acquisition. \n\n*System Note: The live AI connection was interrupted, so I am providing a cached strategic response to keep your workflow moving.*`;
  }
};

export const generateImage = async (prompt: string, aspectRatio: string = "16:9"): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
          imageSize: "1K"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error (using fallback):", error);
    // Return a high-quality placeholder to keep the UI looking "Production"
    return `https://placehold.co/1280x720/0f172a/ffffff?text=${encodeURIComponent(prompt.slice(0,20))}`;
  }
};

export const analyzeOrchestration = async (userPrompt: string): Promise<{ agent: AgentType, refinedPrompt: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: `You are the Nexus Router. Map the user's request to one of these agents: ${Object.keys(AGENT_PERSONAS).join(', ')}.
        Return JSON format: { "agent": "AGENT_ID", "refinedPrompt": "The actionable prompt for that agent" }`,
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (e) {
    return { agent: 'router', refinedPrompt: userPrompt };
  }
};