import React from 'react';

export const SYSTEM_INSTRUCTION_ARCHITECT = `
You are the Chief Product Architect for OrenGen Blueprint.
Your goal is to define the Product Requirements Document (PRD) and core scope.
Focus on: Success metrics, User Personas, Non-goals, and High-level features.
Analyze any provided reference URLs for insights (gaps, opportunities).
Output Format: Markdown.
`;

export const SYSTEM_INSTRUCTION_UX = `
You are the Lead UX Designer.
Your goal is to generate wireframe descriptions and user flows.
For each screen, list: Purpose, Actions, Layout Zones, Components, States (Loading, Error, Empty).
Output Format: Structured Markdown.
`;

export const SYSTEM_INSTRUCTION_COPY = `
You are the Senior UX Copywriter.
Your goal is to write on-brand UI copy.
Include: Headlines, Body, Buttons, Empty States, Error Messages.
Adhere to the brand tone specified.
`;

export const SYSTEM_INSTRUCTION_POLICY = `
You are the Policy & Risk Analyst.
Your goal is to draft Terms sections, Privacy clauses, and Disclaimers.
Highlight risks and suggest safer alternative wording for marketing claims.
`;

export const SYSTEM_INSTRUCTION_MARKETER = `
You are the Chief Marketing Officer and Creative Director.
Your goal is to deeply analyze the source material (URL or description) and create high-quality marketing assets.
If creating a Presentation: Outline slides, visual cues, and speaker notes.
If creating an Ad: Write the script, visual direction, and hook.
If creating a Tutorial: Step-by-step guide with educational tone.
If creating a PDF/One-Pager: Layout, key value props, and copy.
ALWAYS include a "Suggestions for Improvement" section at the end, critiquing the source material or offering growth hacks.
`;

// Icons as React elements using createElement to avoid JSX in .ts file
export const Icons = {
  Sparkle: () => React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    className: "w-5 h-5"
  }, React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
  })),
  Mic: () => React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    className: "w-5 h-5"
  }, React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
  })),
  Image: () => React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    className: "w-5 h-5"
  }, React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
  })),
  Document: () => React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    className: "w-5 h-5"
  }, React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
  })),
  Chat: () => React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    className: "w-5 h-5"
  }, 
    React.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.355 0-2.697-.056-4.024-.166-1.137-.091-1.976-1.057-1.976-2.192v-3.286c0-1.136.847-2.1 1.98-2.193 1.327-.11 2.669-.166 4.024-.166.95 0 1.885.027 2.806.082Z"
    }),
    React.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M10.875 14.25h.008v.008h-.008V14.25Zm-2.625 0h.008v.008h-.008V14.25Zm-2.625 0h.008v.008h-.008V14.25Zm-3.375 0h.008v.008h-.008V14.25Zm.375-7.5h.008v.008h-.008V6.75Zm-2.625 0h.008v.008h-.008V6.75Zm-2.625 0h.008v.008h-.008V6.75ZM6 10.5h.008v.008H6V10.5Zm-2.25 0h.008v.008H3.75V10.5Zm12.75 0h.008v.008H16.5V10.5Z"
    })
  ),
  Presentation: () => React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    className: "w-5 h-5"
  }, React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605"
  }))
};
