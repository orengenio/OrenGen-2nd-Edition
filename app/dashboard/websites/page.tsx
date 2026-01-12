'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

export default function WebsitesPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [generating, setGenerating] = useState<{ wireframe?: string; code?: string }>({});
  const [formData, setFormData] = useState({
    projectName: '',
    companyId: '',
    domain: '',
  });

  useEffect(() => {
    loadProjects();
    loadCompanies();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    const response = await apiClient.getWebsiteProjects({ limit: 50 });
    if (response.success) {
      setProjects(response.data.projects || []);
    }
    setLoading(false);
  };

  const loadCompanies = async () => {
    const response = await apiClient.getCompanies({ limit: 100 });
    if (response.success) {
      setCompanies(response.data.companies || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await apiClient.createWebsiteProject(formData);

    if (response.success) {
      setShowModal(false);
      resetForm();
      loadProjects();
    } else {
      alert(response.error);
    }
  };

  const handleGenerateWireframe = async (projectId: string) => {
    if (!confirm('This will use Claude AI to generate a wireframe. Continue?')) return;

    setGenerating({ ...generating, wireframe: projectId });
    const response = await apiClient.generateWireframe(projectId);

    if (response.success) {
      alert('Wireframe generated successfully!');
      loadProjects();
    } else {
      alert(response.error);
    }

    setGenerating({ ...generating, wireframe: undefined });
  };

  const handleGenerateCode = async (projectId: string) => {
    if (!confirm('This will use Claude AI to generate production code. Continue?')) return;

    setGenerating({ ...generating, code: projectId });
    const response = await apiClient.generateCode(projectId, 'react');

    if (response.success) {
      alert('Code generated successfully! Check the project details.');
      loadProjects();
    } else {
      alert(response.error);
    }

    setGenerating({ ...generating, code: undefined });
  };

  const resetForm = () => {
    setFormData({
      projectName: '',
      companyId: '',
      domain: '',
    });
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      questionnaire: 'bg-gray-500/20 text-gray-400',
      wireframing: 'bg-blue-500/20 text-blue-400',
      design: 'bg-purple-500/20 text-purple-400',
      development: 'bg-orange-500/20 text-orange-400',
      review: 'bg-yellow-500/20 text-yellow-400',
      completed: 'bg-green-500/20 text-green-400',
      delivered: 'bg-green-500/20 text-green-400',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">AI Website Builder</h1>
          <p className="text-gray-400 mt-1">Build websites with Claude AI & Gemini</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium"
        >
          + New Project
        </button>
      </div>

      <div className="bg-gradient-to-r from-purple-500/10 to-orange-500/10 border border-purple-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-2">🤖 AI-Powered Website Generation</h3>
        <p className="text-gray-300 text-sm">
          Our AI questionnaire asks all the right questions to generate perfect websites every time,
          including wireframes and production-ready code using Claude and Gemini.
        </p>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No website projects yet. Create your first one!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Progress</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-750 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">{project.project_name}</div>
                        {project.domain && <div className="text-sm text-gray-400">{project.domain}</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{project.company_name || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {project.questions_answered}/{project.total_questions} questions
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {project.status === 'questionnaire' && project.questions_answered === project.total_questions && (
                        <button
                          onClick={() => handleGenerateWireframe(project.id)}
                          disabled={generating.wireframe === project.id}
                          className="text-purple-500 hover:text-purple-400 disabled:opacity-50"
                        >
                          {generating.wireframe === project.id ? 'Generating...' : 'Generate Wireframe'}
                        </button>
                      )}
                      {project.status === 'design' && project.wireframe_data && (
                        <button
                          onClick={() => handleGenerateCode(project.id)}
                          disabled={generating.code === project.id}
                          className="text-orange-500 hover:text-orange-400 disabled:opacity-50"
                        >
                          {generating.code === project.id ? 'Generating...' : 'Generate Code'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-lg w-full border border-gray-700">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">New Website Project</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.projectName}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Client Website Redesign"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                  <select
                    value={formData.companyId}
                    onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select a company (optional)</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>{company.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Domain</label>
                  <input
                    type="text"
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="example.com"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all"
                  >
                    Create Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
