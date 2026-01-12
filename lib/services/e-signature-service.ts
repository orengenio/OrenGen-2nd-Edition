// OrenSign - E-Signature Service
// Built on OpenSign open-source e-signature platform
// Provides document signing, templates, and audit trails

export interface Signer {
  id: string;
  name: string;
  email: string;
  role: 'signer' | 'viewer' | 'approver' | 'cc';
  order: number; // For sequential signing
  status: 'pending' | 'sent' | 'viewed' | 'signed' | 'declined' | 'expired';
  signedAt?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface SignatureField {
  id: string;
  type: 'signature' | 'initials' | 'date' | 'text' | 'checkbox' | 'dropdown' | 'attachment';
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  required: boolean;
  assignedTo: string; // Signer ID
  value?: string;
  placeholder?: string;
  options?: string[]; // For dropdown
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description?: string;
  category: 'contract' | 'nda' | 'proposal' | 'agreement' | 'invoice' | 'custom';
  fileUrl: string;
  fileType: 'pdf' | 'docx' | 'doc';
  fields: SignatureField[];
  defaultSigners: Partial<Signer>[];
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  isPublic: boolean;
  tags: string[];
}

export interface SigningDocument {
  id: string;
  name: string;
  templateId?: string;
  fileUrl: string;
  fileType: 'pdf' | 'docx' | 'doc';
  status: 'draft' | 'pending' | 'in_progress' | 'completed' | 'declined' | 'expired' | 'voided';
  signers: Signer[];
  fields: SignatureField[];
  signingOrder: 'sequential' | 'parallel';
  expiresAt?: string;
  reminderFrequency?: 'daily' | 'weekly' | 'none';
  lastReminderSent?: string;
  message?: string; // Custom message to signers
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  metadata?: Record<string, string>;
}

export interface AuditLogEntry {
  id: string;
  documentId: string;
  action: 'created' | 'sent' | 'viewed' | 'signed' | 'declined' | 'voided' | 'expired' | 'reminder_sent' | 'downloaded' | 'field_filled';
  performedBy: string;
  performedByEmail?: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
  geoLocation?: {
    country?: string;
    city?: string;
    region?: string;
  };
}

export interface SigningStats {
  totalDocuments: number;
  pendingDocuments: number;
  completedDocuments: number;
  declinedDocuments: number;
  expiredDocuments: number;
  averageCompletionTime: number; // in hours
  completionRate: number;
  documentsByCategory: Record<string, number>;
  signingTrend: { date: string; count: number }[];
}

export interface BulkSendConfig {
  templateId: string;
  recipients: {
    name: string;
    email: string;
    customFields?: Record<string, string>;
  }[];
  message?: string;
  expiresInDays?: number;
  reminderFrequency?: 'daily' | 'weekly' | 'none';
}

export interface WebhookConfig {
  id: string;
  url: string;
  events: ('document.created' | 'document.sent' | 'document.viewed' | 'document.signed' | 'document.completed' | 'document.declined' | 'document.expired')[];
  secret: string;
  isActive: boolean;
  createdAt: string;
  lastTriggered?: string;
  failureCount: number;
}

class ESignatureService {
  private baseUrl: string;
  private apiKey: string;
  private documents: Map<string, SigningDocument> = new Map();
  private templates: Map<string, DocumentTemplate> = new Map();
  private auditLogs: Map<string, AuditLogEntry[]> = new Map();
  private webhooks: Map<string, WebhookConfig> = new Map();

  constructor() {
    // OpenSign self-hosted instance
    this.baseUrl = process.env.OPENSIGN_URL || 'https://sign.orengen.io/api';
    this.apiKey = process.env.OPENSIGN_API_KEY || '';
    this.initializeDefaultTemplates();
  }

  private initializeDefaultTemplates(): void {
    const defaultTemplates: DocumentTemplate[] = [
      {
        id: 'tpl_nda_standard',
        name: 'Standard NDA',
        description: 'Non-disclosure agreement for business partnerships',
        category: 'nda',
        fileUrl: '/templates/nda-standard.pdf',
        fileType: 'pdf',
        fields: [
          { id: 'f1', type: 'text', page: 1, x: 100, y: 200, width: 200, height: 20, required: true, assignedTo: 'signer_1', placeholder: 'Company Name' },
          { id: 'f2', type: 'date', page: 1, x: 100, y: 250, width: 120, height: 20, required: true, assignedTo: 'signer_1' },
          { id: 'f3', type: 'signature', page: 2, x: 100, y: 600, width: 200, height: 60, required: true, assignedTo: 'signer_1' },
          { id: 'f4', type: 'signature', page: 2, x: 350, y: 600, width: 200, height: 60, required: true, assignedTo: 'signer_2' },
        ],
        defaultSigners: [
          { role: 'signer', order: 1 },
          { role: 'signer', order: 2 },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0,
        isPublic: true,
        tags: ['nda', 'confidentiality', 'partnership'],
      },
      {
        id: 'tpl_contract_freelance',
        name: 'Freelance Contract',
        description: 'Standard contract for freelance work engagements',
        category: 'contract',
        fileUrl: '/templates/freelance-contract.pdf',
        fileType: 'pdf',
        fields: [
          { id: 'f1', type: 'text', page: 1, x: 100, y: 150, width: 200, height: 20, required: true, assignedTo: 'signer_1', placeholder: 'Client Name' },
          { id: 'f2', type: 'text', page: 1, x: 100, y: 180, width: 200, height: 20, required: true, assignedTo: 'signer_2', placeholder: 'Contractor Name' },
          { id: 'f3', type: 'text', page: 1, x: 100, y: 300, width: 100, height: 20, required: true, assignedTo: 'signer_1', placeholder: 'Project Fee' },
          { id: 'f4', type: 'date', page: 1, x: 100, y: 330, width: 120, height: 20, required: true, assignedTo: 'signer_1' },
          { id: 'f5', type: 'signature', page: 3, x: 100, y: 500, width: 200, height: 60, required: true, assignedTo: 'signer_1' },
          { id: 'f6', type: 'signature', page: 3, x: 350, y: 500, width: 200, height: 60, required: true, assignedTo: 'signer_2' },
        ],
        defaultSigners: [
          { role: 'signer', order: 1 },
          { role: 'signer', order: 2 },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0,
        isPublic: true,
        tags: ['contract', 'freelance', 'services'],
      },
      {
        id: 'tpl_proposal_sales',
        name: 'Sales Proposal',
        description: 'Sales proposal with signature acceptance',
        category: 'proposal',
        fileUrl: '/templates/sales-proposal.pdf',
        fileType: 'pdf',
        fields: [
          { id: 'f1', type: 'checkbox', page: 1, x: 50, y: 400, width: 20, height: 20, required: true, assignedTo: 'signer_1' },
          { id: 'f2', type: 'date', page: 1, x: 100, y: 450, width: 120, height: 20, required: true, assignedTo: 'signer_1' },
          { id: 'f3', type: 'signature', page: 1, x: 100, y: 500, width: 200, height: 60, required: true, assignedTo: 'signer_1' },
        ],
        defaultSigners: [
          { role: 'signer', order: 1 },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0,
        isPublic: true,
        tags: ['proposal', 'sales', 'quote'],
      },
      {
        id: 'tpl_agreement_partnership',
        name: 'Partnership Agreement',
        description: 'Business partnership formation agreement',
        category: 'agreement',
        fileUrl: '/templates/partnership-agreement.pdf',
        fileType: 'pdf',
        fields: [
          { id: 'f1', type: 'text', page: 1, x: 100, y: 150, width: 200, height: 20, required: true, assignedTo: 'signer_1', placeholder: 'Partner 1 Name' },
          { id: 'f2', type: 'text', page: 1, x: 100, y: 180, width: 200, height: 20, required: true, assignedTo: 'signer_2', placeholder: 'Partner 2 Name' },
          { id: 'f3', type: 'text', page: 2, x: 100, y: 200, width: 100, height: 20, required: true, assignedTo: 'signer_1', placeholder: 'Ownership %' },
          { id: 'f4', type: 'text', page: 2, x: 250, y: 200, width: 100, height: 20, required: true, assignedTo: 'signer_2', placeholder: 'Ownership %' },
          { id: 'f5', type: 'initials', page: 3, x: 500, y: 700, width: 60, height: 30, required: true, assignedTo: 'signer_1' },
          { id: 'f6', type: 'initials', page: 3, x: 500, y: 700, width: 60, height: 30, required: true, assignedTo: 'signer_2' },
          { id: 'f7', type: 'signature', page: 5, x: 100, y: 500, width: 200, height: 60, required: true, assignedTo: 'signer_1' },
          { id: 'f8', type: 'signature', page: 5, x: 350, y: 500, width: 200, height: 60, required: true, assignedTo: 'signer_2' },
          { id: 'f9', type: 'date', page: 5, x: 100, y: 580, width: 120, height: 20, required: true, assignedTo: 'signer_1' },
        ],
        defaultSigners: [
          { role: 'signer', order: 1 },
          { role: 'signer', order: 2 },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0,
        isPublic: true,
        tags: ['partnership', 'business', 'formation'],
      },
      {
        id: 'tpl_invoice_payment',
        name: 'Invoice Acknowledgment',
        description: 'Invoice with payment terms acknowledgment',
        category: 'invoice',
        fileUrl: '/templates/invoice-ack.pdf',
        fileType: 'pdf',
        fields: [
          { id: 'f1', type: 'checkbox', page: 1, x: 50, y: 500, width: 20, height: 20, required: true, assignedTo: 'signer_1' },
          { id: 'f2', type: 'signature', page: 1, x: 100, y: 550, width: 200, height: 60, required: true, assignedTo: 'signer_1' },
          { id: 'f3', type: 'date', page: 1, x: 100, y: 630, width: 120, height: 20, required: true, assignedTo: 'signer_1' },
        ],
        defaultSigners: [
          { role: 'signer', order: 1 },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        usageCount: 0,
        isPublic: true,
        tags: ['invoice', 'payment', 'billing'],
      },
    ];

    defaultTemplates.forEach(t => this.templates.set(t.id, t));
  }

  // ==================== Document Management ====================

  async createDocument(config: {
    name: string;
    templateId?: string;
    fileUrl?: string;
    fileType?: 'pdf' | 'docx' | 'doc';
    signers: Omit<Signer, 'id' | 'status' | 'signedAt'>[];
    signingOrder?: 'sequential' | 'parallel';
    expiresInDays?: number;
    message?: string;
    reminderFrequency?: 'daily' | 'weekly' | 'none';
    metadata?: Record<string, string>;
  }): Promise<SigningDocument> {
    const id = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    let fields: SignatureField[] = [];
    let fileUrl = config.fileUrl || '';
    let fileType = config.fileType || 'pdf';

    // If using a template, copy its fields and file
    if (config.templateId) {
      const template = this.templates.get(config.templateId);
      if (template) {
        fields = JSON.parse(JSON.stringify(template.fields));
        fileUrl = template.fileUrl;
        fileType = template.fileType;
        template.usageCount++;
      }
    }

    const signers: Signer[] = config.signers.map((s, index) => ({
      ...s,
      id: `signer_${index + 1}`,
      status: 'pending' as const,
    }));

    // Assign fields to signers
    fields = fields.map(f => {
      const signerIndex = parseInt(f.assignedTo.split('_')[1]) - 1;
      if (signers[signerIndex]) {
        return { ...f, assignedTo: signers[signerIndex].id };
      }
      return f;
    });

    const document: SigningDocument = {
      id,
      name: config.name,
      templateId: config.templateId,
      fileUrl,
      fileType,
      status: 'draft',
      signers,
      fields,
      signingOrder: config.signingOrder || 'parallel',
      expiresAt: config.expiresInDays
        ? new Date(Date.now() + config.expiresInDays * 24 * 60 * 60 * 1000).toISOString()
        : undefined,
      reminderFrequency: config.reminderFrequency || 'none',
      message: config.message,
      createdBy: 'current_user', // Would come from auth context
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: config.metadata,
    };

    this.documents.set(id, document);
    this.auditLogs.set(id, []);
    await this.addAuditLog(id, 'created', 'current_user');

    return document;
  }

  async sendDocument(documentId: string): Promise<SigningDocument> {
    const document = this.documents.get(documentId);
    if (!document) {
      throw new Error('Document not found');
    }

    if (document.status !== 'draft') {
      throw new Error('Document has already been sent');
    }

    // Update status
    document.status = 'pending';
    document.updatedAt = new Date().toISOString();

    // Update signers based on signing order
    if (document.signingOrder === 'sequential') {
      // Only first signer gets notification
      const firstSigner = document.signers.find(s => s.order === 1);
      if (firstSigner) {
        firstSigner.status = 'sent';
        await this.sendSignerNotification(document, firstSigner);
      }
    } else {
      // All signers get notification at once
      for (const signer of document.signers) {
        if (signer.role !== 'cc') {
          signer.status = 'sent';
          await this.sendSignerNotification(document, signer);
        }
      }
    }

    await this.addAuditLog(documentId, 'sent', 'current_user');
    await this.triggerWebhook('document.sent', document);

    return document;
  }

  async getDocument(documentId: string): Promise<SigningDocument | null> {
    return this.documents.get(documentId) || null;
  }

  async listDocuments(filters?: {
    status?: SigningDocument['status'];
    createdAfter?: string;
    createdBefore?: string;
    search?: string;
  }): Promise<SigningDocument[]> {
    let docs = Array.from(this.documents.values());

    if (filters?.status) {
      docs = docs.filter(d => d.status === filters.status);
    }
    if (filters?.createdAfter) {
      docs = docs.filter(d => d.createdAt >= filters.createdAfter!);
    }
    if (filters?.createdBefore) {
      docs = docs.filter(d => d.createdAt <= filters.createdBefore!);
    }
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      docs = docs.filter(d =>
        d.name.toLowerCase().includes(searchLower) ||
        d.signers.some(s => s.name.toLowerCase().includes(searchLower) || s.email.toLowerCase().includes(searchLower))
      );
    }

    return docs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async voidDocument(documentId: string, reason?: string): Promise<SigningDocument> {
    const document = this.documents.get(documentId);
    if (!document) {
      throw new Error('Document not found');
    }

    if (document.status === 'completed' || document.status === 'voided') {
      throw new Error('Cannot void a completed or already voided document');
    }

    document.status = 'voided';
    document.updatedAt = new Date().toISOString();

    await this.addAuditLog(documentId, 'voided', 'current_user', { reason });

    // Notify signers
    for (const signer of document.signers) {
      await this.sendVoidNotification(document, signer, reason);
    }

    return document;
  }

  // ==================== Signing Operations ====================

  async recordSignerView(documentId: string, signerId: string, ipAddress?: string, userAgent?: string): Promise<void> {
    const document = this.documents.get(documentId);
    if (!document) {
      throw new Error('Document not found');
    }

    const signer = document.signers.find(s => s.id === signerId);
    if (!signer) {
      throw new Error('Signer not found');
    }

    if (signer.status === 'sent') {
      signer.status = 'viewed';
      signer.ipAddress = ipAddress;
      signer.userAgent = userAgent;
      document.status = 'in_progress';
      document.updatedAt = new Date().toISOString();

      await this.addAuditLog(documentId, 'viewed', signer.email, { signerId }, ipAddress, userAgent);
      await this.triggerWebhook('document.viewed', document);
    }
  }

  async signDocument(
    documentId: string,
    signerId: string,
    fieldValues: Record<string, string>,
    signatureData: string, // Base64 encoded signature image
    ipAddress?: string,
    userAgent?: string
  ): Promise<SigningDocument> {
    const document = this.documents.get(documentId);
    if (!document) {
      throw new Error('Document not found');
    }

    const signer = document.signers.find(s => s.id === signerId);
    if (!signer) {
      throw new Error('Signer not found');
    }

    if (signer.status === 'signed') {
      throw new Error('Document already signed by this signer');
    }

    // Validate all required fields for this signer are filled
    const signerFields = document.fields.filter(f => f.assignedTo === signerId && f.required);
    for (const field of signerFields) {
      if (field.type === 'signature' || field.type === 'initials') {
        if (!signatureData) {
          throw new Error(`Signature required for field ${field.id}`);
        }
        field.value = signatureData;
      } else if (!fieldValues[field.id]) {
        throw new Error(`Required field ${field.id} is missing`);
      } else {
        field.value = fieldValues[field.id];
      }
    }

    // Update signer status
    signer.status = 'signed';
    signer.signedAt = new Date().toISOString();
    signer.ipAddress = ipAddress;
    signer.userAgent = userAgent;

    await this.addAuditLog(documentId, 'signed', signer.email, { signerId, fieldCount: Object.keys(fieldValues).length }, ipAddress, userAgent);
    await this.triggerWebhook('document.signed', document);

    // Check if all signers have signed
    const allSigned = document.signers
      .filter(s => s.role === 'signer' || s.role === 'approver')
      .every(s => s.status === 'signed');

    if (allSigned) {
      document.status = 'completed';
      document.completedAt = new Date().toISOString();
      await this.addAuditLog(documentId, 'signed', 'system', { allSignersComplete: true });
      await this.triggerWebhook('document.completed', document);

      // Send completion notifications
      for (const s of document.signers) {
        await this.sendCompletionNotification(document, s);
      }
    } else if (document.signingOrder === 'sequential') {
      // Send to next signer in sequence
      const nextSigner = document.signers
        .filter(s => s.status === 'pending' && (s.role === 'signer' || s.role === 'approver'))
        .sort((a, b) => a.order - b.order)[0];

      if (nextSigner) {
        nextSigner.status = 'sent';
        await this.sendSignerNotification(document, nextSigner);
      }
    }

    document.updatedAt = new Date().toISOString();
    return document;
  }

  async declineDocument(documentId: string, signerId: string, reason: string): Promise<SigningDocument> {
    const document = this.documents.get(documentId);
    if (!document) {
      throw new Error('Document not found');
    }

    const signer = document.signers.find(s => s.id === signerId);
    if (!signer) {
      throw new Error('Signer not found');
    }

    signer.status = 'declined';
    document.status = 'declined';
    document.updatedAt = new Date().toISOString();

    await this.addAuditLog(documentId, 'declined', signer.email, { signerId, reason });
    await this.triggerWebhook('document.declined', document);

    // Notify document owner
    await this.sendDeclineNotification(document, signer, reason);

    return document;
  }

  // ==================== Template Management ====================

  async createTemplate(config: {
    name: string;
    description?: string;
    category: DocumentTemplate['category'];
    fileUrl: string;
    fileType: 'pdf' | 'docx' | 'doc';
    fields: Omit<SignatureField, 'id'>[];
    defaultSigners: Partial<Signer>[];
    tags?: string[];
    isPublic?: boolean;
  }): Promise<DocumentTemplate> {
    const id = `tpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const template: DocumentTemplate = {
      id,
      name: config.name,
      description: config.description,
      category: config.category,
      fileUrl: config.fileUrl,
      fileType: config.fileType,
      fields: config.fields.map((f, i) => ({ ...f, id: `f${i + 1}` })),
      defaultSigners: config.defaultSigners,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0,
      isPublic: config.isPublic ?? false,
      tags: config.tags || [],
    };

    this.templates.set(id, template);
    return template;
  }

  async getTemplate(templateId: string): Promise<DocumentTemplate | null> {
    return this.templates.get(templateId) || null;
  }

  async listTemplates(filters?: {
    category?: DocumentTemplate['category'];
    search?: string;
    isPublic?: boolean;
  }): Promise<DocumentTemplate[]> {
    let templates = Array.from(this.templates.values());

    if (filters?.category) {
      templates = templates.filter(t => t.category === filters.category);
    }
    if (filters?.isPublic !== undefined) {
      templates = templates.filter(t => t.isPublic === filters.isPublic);
    }
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      templates = templates.filter(t =>
        t.name.toLowerCase().includes(searchLower) ||
        t.description?.toLowerCase().includes(searchLower) ||
        t.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    return templates.sort((a, b) => b.usageCount - a.usageCount);
  }

  async deleteTemplate(templateId: string): Promise<void> {
    if (!this.templates.has(templateId)) {
      throw new Error('Template not found');
    }
    this.templates.delete(templateId);
  }

  // ==================== Bulk Operations ====================

  async bulkSend(config: BulkSendConfig): Promise<SigningDocument[]> {
    const template = this.templates.get(config.templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    const documents: SigningDocument[] = [];

    for (const recipient of config.recipients) {
      const doc = await this.createDocument({
        name: `${template.name} - ${recipient.name}`,
        templateId: config.templateId,
        signers: [{
          name: recipient.name,
          email: recipient.email,
          role: 'signer',
          order: 1,
        }],
        message: config.message,
        expiresInDays: config.expiresInDays,
        reminderFrequency: config.reminderFrequency,
        metadata: recipient.customFields,
      });

      await this.sendDocument(doc.id);
      documents.push(doc);
    }

    return documents;
  }

  // ==================== Audit & Reporting ====================

  async getAuditLog(documentId: string): Promise<AuditLogEntry[]> {
    return this.auditLogs.get(documentId) || [];
  }

  async getStats(): Promise<SigningStats> {
    const docs = Array.from(this.documents.values());

    const completed = docs.filter(d => d.status === 'completed');
    const completionTimes = completed
      .filter(d => d.completedAt)
      .map(d => {
        const start = new Date(d.createdAt).getTime();
        const end = new Date(d.completedAt!).getTime();
        return (end - start) / (1000 * 60 * 60); // hours
      });

    const documentsByCategory: Record<string, number> = {};
    docs.forEach(d => {
      if (d.templateId) {
        const template = this.templates.get(d.templateId);
        if (template) {
          documentsByCategory[template.category] = (documentsByCategory[template.category] || 0) + 1;
        }
      }
    });

    // Generate trend data for last 30 days
    const trend: { date: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = completed.filter(d => d.completedAt?.startsWith(dateStr)).length;
      trend.push({ date: dateStr, count });
    }

    return {
      totalDocuments: docs.length,
      pendingDocuments: docs.filter(d => d.status === 'pending' || d.status === 'in_progress').length,
      completedDocuments: completed.length,
      declinedDocuments: docs.filter(d => d.status === 'declined').length,
      expiredDocuments: docs.filter(d => d.status === 'expired').length,
      averageCompletionTime: completionTimes.length > 0
        ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
        : 0,
      completionRate: docs.length > 0 ? (completed.length / docs.length) * 100 : 0,
      documentsByCategory,
      signingTrend: trend,
    };
  }

  // ==================== Webhooks ====================

  async registerWebhook(config: Omit<WebhookConfig, 'id' | 'createdAt' | 'lastTriggered' | 'failureCount'>): Promise<WebhookConfig> {
    const id = `wh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const webhook: WebhookConfig = {
      ...config,
      id,
      createdAt: new Date().toISOString(),
      failureCount: 0,
    };

    this.webhooks.set(id, webhook);
    return webhook;
  }

  async listWebhooks(): Promise<WebhookConfig[]> {
    return Array.from(this.webhooks.values());
  }

  async deleteWebhook(webhookId: string): Promise<void> {
    this.webhooks.delete(webhookId);
  }

  // ==================== Private Helpers ====================

  private async addAuditLog(
    documentId: string,
    action: AuditLogEntry['action'],
    performedBy: string,
    details?: Record<string, unknown>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    const logs = this.auditLogs.get(documentId) || [];

    logs.push({
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      documentId,
      action,
      performedBy,
      timestamp: new Date().toISOString(),
      ipAddress,
      userAgent,
      details,
    });

    this.auditLogs.set(documentId, logs);
  }

  private async triggerWebhook(event: WebhookConfig['events'][number], document: SigningDocument): Promise<void> {
    const webhooks = Array.from(this.webhooks.values())
      .filter(w => w.isActive && w.events.includes(event));

    for (const webhook of webhooks) {
      try {
        // In production, this would make an actual HTTP request
        console.log(`Triggering webhook ${webhook.id} for event ${event}`, {
          url: webhook.url,
          documentId: document.id,
        });
        webhook.lastTriggered = new Date().toISOString();
      } catch (error) {
        webhook.failureCount++;
        console.error(`Webhook ${webhook.id} failed:`, error);
      }
    }
  }

  private async sendSignerNotification(document: SigningDocument, signer: Signer): Promise<void> {
    // In production, this would send an email via email service
    console.log(`Sending signing request to ${signer.email} for document ${document.name}`);
  }

  private async sendVoidNotification(document: SigningDocument, signer: Signer, reason?: string): Promise<void> {
    console.log(`Notifying ${signer.email} that document ${document.name} was voided. Reason: ${reason}`);
  }

  private async sendCompletionNotification(document: SigningDocument, signer: Signer): Promise<void> {
    console.log(`Sending completion notification to ${signer.email} for document ${document.name}`);
  }

  private async sendDeclineNotification(document: SigningDocument, signer: Signer, reason: string): Promise<void> {
    console.log(`Document ${document.name} was declined by ${signer.email}. Reason: ${reason}`);
  }

  // ==================== Reminder System ====================

  async sendReminders(): Promise<number> {
    let remindersSent = 0;
    const now = new Date();

    for (const document of this.documents.values()) {
      if (document.status !== 'pending' && document.status !== 'in_progress') continue;
      if (document.reminderFrequency === 'none') continue;

      const daysSinceLastReminder = document.lastReminderSent
        ? Math.floor((now.getTime() - new Date(document.lastReminderSent).getTime()) / (1000 * 60 * 60 * 24))
        : Infinity;

      const shouldSend =
        (document.reminderFrequency === 'daily' && daysSinceLastReminder >= 1) ||
        (document.reminderFrequency === 'weekly' && daysSinceLastReminder >= 7);

      if (shouldSend) {
        for (const signer of document.signers) {
          if (signer.status === 'sent' || signer.status === 'viewed') {
            await this.sendReminderNotification(document, signer);
            remindersSent++;
          }
        }
        document.lastReminderSent = now.toISOString();
        await this.addAuditLog(document.id, 'reminder_sent', 'system');
      }
    }

    return remindersSent;
  }

  private async sendReminderNotification(document: SigningDocument, signer: Signer): Promise<void> {
    console.log(`Sending reminder to ${signer.email} for document ${document.name}`);
  }

  // ==================== Expiration Check ====================

  async checkExpirations(): Promise<number> {
    let expiredCount = 0;
    const now = new Date();

    for (const document of this.documents.values()) {
      if (document.status === 'completed' || document.status === 'voided' || document.status === 'expired') continue;
      if (!document.expiresAt) continue;

      if (new Date(document.expiresAt) < now) {
        document.status = 'expired';
        document.updatedAt = now.toISOString();

        for (const signer of document.signers) {
          if (signer.status !== 'signed') {
            signer.status = 'expired';
          }
        }

        await this.addAuditLog(document.id, 'expired', 'system');
        await this.triggerWebhook('document.expired', document);
        expiredCount++;
      }
    }

    return expiredCount;
  }
}

export const eSignatureService = new ESignatureService();
