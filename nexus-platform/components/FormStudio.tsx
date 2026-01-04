import React, { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { generateAgentResponse } from '../services/geminiService';
import { GeneratedFormSchema } from '../types';
import { 
  FormInput, Sparkles, Loader2, Code, Eye, 
  CheckCircle2, Send, Save, RefreshCw 
} from 'lucide-react';

const FormStudio: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [schema, setSchema] = useState<GeneratedFormSchema | null>(null);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');

  // "TanStack AI" Pattern: Wrapping Gemini service in TanStack Query useMutation
  const generateMutation = useMutation({
    mutationFn: async (userPrompt: string) => {
      const response = await generateAgentResponse(
        'form_architect', 
        `Generate a form schema for: "${userPrompt}". 
         Return ONLY JSON with this structure:
         {
           "title": "Form Title",
           "description": "Form Description",
           "submitLabel": "Button Text",
           "fields": [
             { 
               "name": "fieldName", 
               "label": "Field Label", 
               "type": "text|email|number|textarea|select|checkbox", 
               "placeholder": "...", 
               "required": boolean,
               "options": ["Option A", "Option B"] // only for select
             }
           ]
         }`,
        '',
        true // Enable thinking
      );
      
      const cleanJson = response.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson) as GeneratedFormSchema;
    },
    onSuccess: (data) => {
      setSchema(data);
    }
  });

  return (
    <div className="h-full flex flex-col md:flex-row gap-6">
      {/* Left Panel: Controls */}
      <div className="w-full md:w-1/3 flex flex-col gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <FormInput className="text-brand-accent" />
            AI Form Generator
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Describe your form, and the Form Architect will build a type-safe TanStack Form schema for you.
          </p>

          <div className="space-y-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A registration form for a developer conference with dietary restrictions..."
              className="w-full h-32 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg resize-none focus:ring-2 focus:ring-brand-accent outline-none"
            />
            <button
              onClick={() => generateMutation.mutate(prompt)}
              disabled={generateMutation.isPending || !prompt}
              className="w-full py-3 bg-brand-primary text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              {generateMutation.isPending ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
              {generateMutation.isPending ? 'Architecting...' : 'Generate Form'}
            </button>
          </div>
        </div>

        {schema && (
           <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold mb-2">
                  <CheckCircle2 size={18} /> Schema Ready
              </div>
              <div className="text-xs text-green-600 dark:text-green-300 mb-4">
                  Generated {schema.fields.length} fields.
              </div>
              <div className="flex gap-2">
                  <button 
                    onClick={() => setViewMode('preview')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${viewMode === 'preview' ? 'bg-white shadow text-green-700' : 'hover:bg-white/50 text-green-600'}`}
                  >
                      <Eye size={14} className="inline mr-1"/> Preview
                  </button>
                  <button 
                    onClick={() => setViewMode('code')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${viewMode === 'code' ? 'bg-white shadow text-green-700' : 'hover:bg-white/50 text-green-600'}`}
                  >
                      <Code size={14} className="inline mr-1"/> Code
                  </button>
              </div>
           </div>
        )}
      </div>

      {/* Right Panel: Render */}
      <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
        {schema ? (
            viewMode === 'preview' ? (
                <div className="p-8 max-w-2xl mx-auto w-full overflow-y-auto">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold mb-2">{schema.title}</h1>
                        <p className="text-slate-500">{schema.description}</p>
                    </div>
                    
                    {/* Live TanStack Form */}
                    <RenderedTanStackForm schema={schema} />
                </div>
            ) : (
                <div className="flex-1 bg-slate-950 text-slate-300 p-6 font-mono text-sm overflow-auto">
                    <pre>{JSON.stringify(schema, null, 2)}</pre>
                </div>
            )
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <FormInput size={64} className="mb-4 opacity-20" />
                <p>Waiting for instructions...</p>
            </div>
        )}
      </div>
    </div>
  );
};

// Internal component to render the form using @tanstack/react-form
const RenderedTanStackForm: React.FC<{ schema: GeneratedFormSchema }> = ({ schema }) => {
    const form = useForm({
        defaultValues: schema.fields.reduce((acc, field) => ({
            ...acc,
            [field.name]: field.defaultValue || ''
        }), {}),
        onSubmit: async ({ value }) => {
            // Simulate submission
            console.log("Form Submitted:", value);
            alert("Form Data Logged to Console (TanStack Form handled submission)");
        },
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            className="space-y-6"
        >
            {schema.fields.map((field) => (
                <form.Field
                    key={field.name}
                    name={field.name as any}
                    children={(fieldApi) => (
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                {field.label} {field.required && <span className="text-red-500">*</span>}
                            </label>
                            
                            {field.type === 'textarea' ? (
                                <textarea
                                    value={fieldApi.state.value}
                                    onChange={(e) => fieldApi.handleChange(e.target.value)}
                                    placeholder={field.placeholder}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-accent outline-none min-h-[100px]"
                                />
                            ) : field.type === 'select' ? (
                                <select
                                    value={fieldApi.state.value}
                                    onChange={(e) => fieldApi.handleChange(e.target.value)}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-accent outline-none"
                                >
                                    <option value="" disabled>Select an option</option>
                                    {field.options?.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            ) : field.type === 'checkbox' ? (
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="checkbox"
                                        checked={fieldApi.state.value}
                                        onChange={(e) => fieldApi.handleChange(e.target.checked)}
                                        className="w-5 h-5 rounded border-gray-300 text-brand-primary focus:ring-brand-accent"
                                    />
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Yes, I agree</span>
                                </div>
                            ) : (
                                <input
                                    type={field.type}
                                    value={fieldApi.state.value}
                                    onChange={(e) => fieldApi.handleChange(e.target.value)}
                                    placeholder={field.placeholder}
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-accent outline-none"
                                />
                            )}
                        </div>
                    )}
                />
            ))}

            <div className="pt-4">
                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                        <button
                            type="submit"
                            disabled={!canSubmit}
                            className="w-full py-3 bg-brand-primary hover:bg-slate-700 text-white rounded-lg font-bold shadow-lg shadow-brand-primary/20 transition-all transform active:scale-95 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                            {schema.submitLabel}
                        </button>
                    )}
                />
            </div>
        </form>
    );
};

export default FormStudio;