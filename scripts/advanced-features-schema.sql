-- Advanced Features Schema
-- Speed-to-Lead, Referrals, Webhooks, Notifications

-- ==================== SPEED-TO-LEAD ====================

-- Speed-to-Lead Configuration
CREATE TABLE IF NOT EXISTS speed_to_lead_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    enabled BOOLEAN DEFAULT true,

    -- Auto-assignment
    auto_assign_enabled BOOLEAN DEFAULT true,
    assignment_strategy VARCHAR(50) DEFAULT 'round_robin'
        CHECK (assignment_strategy IN ('round_robin', 'least_loaded', 'by_score', 'by_territory')),
    assignable_users UUID[] DEFAULT '{}',

    -- SLA
    sla_enabled BOOLEAN DEFAULT true,
    sla_first_response_minutes INTEGER DEFAULT 30,
    sla_follow_up_minutes INTEGER DEFAULT 1440, -- 24 hours

    -- Notifications
    notify_on_new_lead BOOLEAN DEFAULT true,
    notify_on_high_score BOOLEAN DEFAULT true,
    high_score_threshold INTEGER DEFAULT 70,
    notification_channels TEXT[] DEFAULT '{"email"}',

    -- Escalation
    escalation_enabled BOOLEAN DEFAULT false,
    escalation_after_minutes INTEGER DEFAULT 60,
    escalation_to UUID[] DEFAULT '{}',

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(tenant_id)
);

-- Lead Assignments (tracking assignments and SLA)
CREATE TABLE IF NOT EXISTS lead_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL,
    assigned_to UUID NOT NULL,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    assigned_by UUID,
    assignment_reason VARCHAR(50) DEFAULT 'manual'
        CHECK (assignment_reason IN ('auto_round_robin', 'auto_least_loaded', 'auto_score', 'auto_territory', 'manual')),

    -- SLA tracking
    sla_deadline TIMESTAMPTZ,
    first_response_at TIMESTAMPTZ,
    sla_met BOOLEAN,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lead_assignments_lead ON lead_assignments(lead_id);
CREATE INDEX idx_lead_assignments_user ON lead_assignments(assigned_to);
CREATE INDEX idx_lead_assignments_sla ON lead_assignments(sla_deadline) WHERE sla_met IS NULL;

-- Lead Notifications
CREATE TABLE IF NOT EXISTS lead_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL
        CHECK (type IN ('new_lead', 'high_score', 'sla_warning', 'sla_breach', 'escalation')),
    channel VARCHAR(20) NOT NULL
        CHECK (channel IN ('email', 'sms', 'webhook', 'slack')),
    recipient VARCHAR(255) NOT NULL,
    data JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending', 'sent', 'failed')),
    sent_at TIMESTAMPTZ,
    error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lead_notifications_status ON lead_notifications(status) WHERE status = 'pending';

-- ==================== REFERRAL SYSTEM ====================

-- Referral Programs
CREATE TABLE IF NOT EXISTS referral_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'active'
        CHECK (status IN ('active', 'paused', 'ended')),

    -- Rewards
    reward_type VARCHAR(20) DEFAULT 'fixed'
        CHECK (reward_type IN ('fixed', 'percentage', 'tiered')),
    reward_amount DECIMAL(10, 2) DEFAULT 0,
    reward_currency VARCHAR(3) DEFAULT 'USD',
    tiers JSONB, -- For tiered rewards

    -- Rules
    minimum_deal_value DECIMAL(10, 2),
    require_deal_closed BOOLEAN DEFAULT true,
    reward_both_parties BOOLEAN DEFAULT false,
    referrer_reward DECIMAL(10, 2),
    referee_reward DECIMAL(10, 2),

    -- Limits
    max_rewards_per_referrer INTEGER,
    max_total_rewards DECIMAL(10, 2),

    -- Dates
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_referral_programs_tenant ON referral_programs(tenant_id);
CREATE INDEX idx_referral_programs_status ON referral_programs(status);

-- Referral Codes (for tracking referral links)
CREATE TABLE IF NOT EXISTS referral_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE NOT NULL,
    referrer_id UUID NOT NULL,
    referrer_type VARCHAR(20) DEFAULT 'user'
        CHECK (referrer_type IN ('user', 'contact', 'partner')),
    program_id UUID REFERENCES referral_programs(id),
    tenant_id UUID NOT NULL,
    clicks INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_referral_codes_code ON referral_codes(code);
CREATE INDEX idx_referral_codes_referrer ON referral_codes(referrer_id);

-- Referrals
CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    program_id UUID REFERENCES referral_programs(id),
    referrer_id UUID NOT NULL,
    referrer_type VARCHAR(20) DEFAULT 'user'
        CHECK (referrer_type IN ('user', 'contact', 'partner')),

    -- Referee info
    referee_email VARCHAR(255) NOT NULL,
    referee_name VARCHAR(255),
    referral_code VARCHAR(20),

    -- Status
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending', 'signed_up', 'qualified', 'converted', 'rewarded', 'expired')),

    -- Tracking
    signup_at TIMESTAMPTZ,
    qualified_at TIMESTAMPTZ,
    converted_at TIMESTAMPTZ,
    deal_id UUID,
    deal_value DECIMAL(10, 2),

    -- Rewards
    reward_amount DECIMAL(10, 2),
    reward_status VARCHAR(20) DEFAULT 'pending'
        CHECK (reward_status IN ('pending', 'approved', 'paid', 'rejected')),
    reward_paid_at TIMESTAMPTZ,

    -- Metadata
    source VARCHAR(50),
    utm_campaign VARCHAR(255),
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    notes TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_referrals_tenant ON referrals(tenant_id);
CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_status ON referrals(status);
CREATE INDEX idx_referrals_email ON referrals(referee_email);

-- Referral Rewards
CREATE TABLE IF NOT EXISTS referral_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referral_id UUID REFERENCES referrals(id),
    recipient_id VARCHAR(255) NOT NULL,
    recipient_type VARCHAR(20) DEFAULT 'referrer'
        CHECK (recipient_type IN ('referrer', 'referee')),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending', 'approved', 'paid', 'rejected')),
    payment_method VARCHAR(50),
    payment_reference VARCHAR(255),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_referral_rewards_status ON referral_rewards(status);

-- ==================== WEBHOOKS ====================

-- Webhook Endpoints
CREATE TABLE IF NOT EXISTS webhook_endpoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    secret VARCHAR(64) NOT NULL,
    events TEXT[] NOT NULL,
    headers JSONB DEFAULT '{}',
    enabled BOOLEAN DEFAULT true,
    retry_count INTEGER DEFAULT 3,
    retry_delay_seconds INTEGER DEFAULT 60,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_webhook_endpoints_tenant ON webhook_endpoints(tenant_id);
CREATE INDEX idx_webhook_endpoints_enabled ON webhook_endpoints(enabled) WHERE enabled = true;

-- Webhook Deliveries
CREATE TABLE IF NOT EXISTS webhook_deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    endpoint_id UUID REFERENCES webhook_endpoints(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending', 'success', 'failed', 'retrying')),
    attempts INTEGER DEFAULT 0,
    last_attempt_at TIMESTAMPTZ,
    response_status INTEGER,
    response_body TEXT,
    error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX idx_webhook_deliveries_endpoint ON webhook_deliveries(endpoint_id);
CREATE INDEX idx_webhook_deliveries_status ON webhook_deliveries(status) WHERE status IN ('pending', 'retrying');
CREATE INDEX idx_webhook_deliveries_created ON webhook_deliveries(created_at);

-- ==================== SCHEDULED JOBS ====================

CREATE TABLE IF NOT EXISTS scheduled_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL,
    payload JSONB DEFAULT '{}',
    run_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    attempts INTEGER DEFAULT 0,
    last_error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX idx_scheduled_jobs_run ON scheduled_jobs(run_at) WHERE status = 'pending';

-- ==================== EMAIL TRACKING ====================

CREATE TABLE IF NOT EXISTS email_sends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    provider VARCHAR(20) NOT NULL,
    message_id VARCHAR(255),

    -- Recipients
    to_email VARCHAR(255) NOT NULL,
    from_email VARCHAR(255) NOT NULL,
    subject TEXT,

    -- Tracking
    status VARCHAR(20) DEFAULT 'sent'
        CHECK (status IN ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained', 'unsubscribed')),
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    bounced_at TIMESTAMPTZ,

    -- Context
    lead_id UUID,
    contact_id UUID,
    campaign_id UUID,
    sequence_step INTEGER,

    -- Metadata
    tags TEXT[],
    metadata JSONB DEFAULT '{}',

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_email_sends_tenant ON email_sends(tenant_id);
CREATE INDEX idx_email_sends_lead ON email_sends(lead_id);
CREATE INDEX idx_email_sends_contact ON email_sends(contact_id);

-- ==================== SMS TRACKING ====================

CREATE TABLE IF NOT EXISTS sms_sends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    provider VARCHAR(20) DEFAULT 'twilio',
    message_sid VARCHAR(255),

    -- Recipients
    to_number VARCHAR(20) NOT NULL,
    from_number VARCHAR(20) NOT NULL,
    body TEXT,

    -- Tracking
    status VARCHAR(20) DEFAULT 'sent'
        CHECK (status IN ('queued', 'sent', 'delivered', 'failed', 'undelivered')),
    segments INTEGER DEFAULT 1,
    error_code VARCHAR(20),
    error_message TEXT,

    -- Context
    lead_id UUID,
    contact_id UUID,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sms_sends_tenant ON sms_sends(tenant_id);
CREATE INDEX idx_sms_sends_lead ON sms_sends(lead_id);

-- ==================== PIPELINE BOARD ====================

-- Custom pipeline stages (user-defined)
CREATE TABLE IF NOT EXISTS pipeline_stages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#6366f1',
    position INTEGER NOT NULL,
    probability INTEGER DEFAULT 0,
    is_won BOOLEAN DEFAULT false,
    is_lost BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pipeline_stages_tenant ON pipeline_stages(tenant_id);

-- ==================== REPORTING ====================

-- Daily metrics snapshots
CREATE TABLE IF NOT EXISTS daily_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    date DATE NOT NULL,

    -- Lead metrics
    leads_new INTEGER DEFAULT 0,
    leads_enriched INTEGER DEFAULT 0,
    leads_qualified INTEGER DEFAULT 0,
    leads_converted INTEGER DEFAULT 0,
    leads_avg_score DECIMAL(5, 2),

    -- CRM metrics
    contacts_new INTEGER DEFAULT 0,
    companies_new INTEGER DEFAULT 0,
    deals_created INTEGER DEFAULT 0,
    deals_won INTEGER DEFAULT 0,
    deals_lost INTEGER DEFAULT 0,
    deals_value_won DECIMAL(12, 2) DEFAULT 0,

    -- Activity metrics
    activities_logged INTEGER DEFAULT 0,
    emails_sent INTEGER DEFAULT 0,
    calls_made INTEGER DEFAULT 0,
    meetings_held INTEGER DEFAULT 0,

    -- SLA metrics
    sla_total INTEGER DEFAULT 0,
    sla_met INTEGER DEFAULT 0,
    sla_breached INTEGER DEFAULT 0,
    avg_response_minutes INTEGER,

    -- Referral metrics
    referrals_new INTEGER DEFAULT 0,
    referrals_converted INTEGER DEFAULT 0,
    referral_rewards_paid DECIMAL(10, 2) DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(tenant_id, date)
);

CREATE INDEX idx_daily_metrics_tenant_date ON daily_metrics(tenant_id, date);

-- ==================== CSV IMPORTS ====================

CREATE TABLE IF NOT EXISTS csv_imports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    user_id UUID NOT NULL,
    filename VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL
        CHECK (type IN ('leads', 'contacts', 'companies')),
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending', 'processing', 'completed', 'failed')),

    -- Results
    total_rows INTEGER DEFAULT 0,
    processed_rows INTEGER DEFAULT 0,
    imported_rows INTEGER DEFAULT 0,
    skipped_rows INTEGER DEFAULT 0,
    error_rows INTEGER DEFAULT 0,
    errors JSONB DEFAULT '[]',

    -- Mapping
    column_mapping JSONB DEFAULT '{}',

    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX idx_csv_imports_tenant ON csv_imports(tenant_id);
CREATE INDEX idx_csv_imports_status ON csv_imports(status);

-- ==================== Enable RLS ====================

ALTER TABLE speed_to_lead_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE csv_imports ENABLE ROW LEVEL SECURITY;

-- Note: Add appropriate RLS policies based on your auth setup
