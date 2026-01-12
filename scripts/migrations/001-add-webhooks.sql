-- Migration: Add webhooks table for integrations
-- This enables Zapier, Make.com, and custom webhook integrations

CREATE TABLE IF NOT EXISTS webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    events TEXT[] NOT NULL,
    secret VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    headers JSONB DEFAULT '{}'::jsonb,
    retry_count INTEGER DEFAULT 3,
    timeout_seconds INTEGER DEFAULT 30,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_triggered TIMESTAMP,
    last_success TIMESTAMP,
    last_failure TIMESTAMP,
    total_triggers INTEGER DEFAULT 0,
    total_successes INTEGER DEFAULT 0,
    total_failures INTEGER DEFAULT 0
);

-- Webhook logs for debugging
CREATE TABLE IF NOT EXISTS webhook_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webhook_id UUID REFERENCES webhooks(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    response_status INTEGER,
    response_body TEXT,
    error_message TEXT,
    triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duration_ms INTEGER
);

-- Lead assignment history for tracking and analytics
CREATE TABLE IF NOT EXISTS lead_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES domain_leads(id) ON DELETE CASCADE,
    assigned_from UUID REFERENCES users(id),
    assigned_to UUID REFERENCES users(id) NOT NULL,
    assignment_method VARCHAR(50) NOT NULL CHECK (assignment_method IN ('manual', 'round_robin', 'workload', 'territory', 'score_based')),
    assigned_by UUID REFERENCES users(id) NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Indexes
CREATE INDEX idx_webhooks_active ON webhooks(is_active);
CREATE INDEX idx_webhooks_created_by ON webhooks(created_by);
CREATE INDEX idx_webhook_logs_webhook_id ON webhook_logs(webhook_id);
CREATE INDEX idx_webhook_logs_triggered_at ON webhook_logs(triggered_at DESC);
CREATE INDEX idx_lead_assignments_lead_id ON lead_assignments(lead_id);
CREATE INDEX idx_lead_assignments_assigned_to ON lead_assignments(assigned_to);
CREATE INDEX idx_lead_assignments_assigned_at ON lead_assignments(assigned_at DESC);

-- Triggers
CREATE TRIGGER update_webhooks_updated_at BEFORE UPDATE ON webhooks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON webhooks TO PUBLIC;
GRANT SELECT, INSERT ON webhook_logs TO PUBLIC;
GRANT SELECT, INSERT ON lead_assignments TO PUBLIC;
