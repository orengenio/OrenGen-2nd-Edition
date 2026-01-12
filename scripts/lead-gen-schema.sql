-- Lead Generation Database Schema
-- Run this after the main schema to add lead generation tables

-- Lead Sources
CREATE TABLE IF NOT EXISTS lead_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('domain_scrape', 'manual', 'referral', 'inbound', 'purchased')),
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Domain Leads (main lead generation table)
CREATE TABLE IF NOT EXISTS domain_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain VARCHAR(255) NOT NULL UNIQUE,
    registered_date TIMESTAMP WITH TIME ZONE,
    scraped_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    whois_data JSONB,
    tech_stack JSONB,
    enrichment_data JSONB,
    lead_score INTEGER DEFAULT 0 CHECK (lead_score >= 0 AND lead_score <= 100),
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'enriched', 'qualified', 'contacted', 'converted', 'rejected')),
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    campaign_id UUID REFERENCES lead_gen_campaigns(id) ON DELETE SET NULL,
    company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead Generation Campaigns
CREATE TABLE IF NOT EXISTS lead_gen_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    filters JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
    leads_generated INTEGER DEFAULT 0,
    leads_qualified INTEGER DEFAULT 0,
    leads_contacted INTEGER DEFAULT 0,
    leads_converted INTEGER DEFAULT 0,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead Generation Configuration
CREATE TABLE IF NOT EXISTS lead_gen_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    icann_czds_enabled BOOLEAN DEFAULT false,
    icann_czds_username VARCHAR(255),
    icann_czds_password_encrypted TEXT,
    whoxy_api_key_encrypted TEXT,
    hunter_api_key_encrypted TEXT,
    snov_api_key_encrypted TEXT,
    scan_frequency VARCHAR(50) DEFAULT 'daily' CHECK (scan_frequency IN ('hourly', 'daily', 'weekly')),
    max_domains_per_run INTEGER DEFAULT 1000,
    auto_enrichment BOOLEAN DEFAULT false,
    auto_scoring BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_domain_leads_domain ON domain_leads(domain);
CREATE INDEX IF NOT EXISTS idx_domain_leads_status ON domain_leads(status);
CREATE INDEX IF NOT EXISTS idx_domain_leads_lead_score ON domain_leads(lead_score DESC);
CREATE INDEX IF NOT EXISTS idx_domain_leads_assigned_to ON domain_leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_domain_leads_campaign_id ON domain_leads(campaign_id);
CREATE INDEX IF NOT EXISTS idx_domain_leads_scraped_date ON domain_leads(scraped_date DESC);
CREATE INDEX IF NOT EXISTS idx_domain_leads_tech_stack ON domain_leads USING GIN (tech_stack);
CREATE INDEX IF NOT EXISTS idx_domain_leads_enrichment_data ON domain_leads USING GIN (enrichment_data);

CREATE INDEX IF NOT EXISTS idx_lead_gen_campaigns_status ON lead_gen_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_lead_gen_campaigns_created_by ON lead_gen_campaigns(created_by);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_domain_leads_updated_at ON domain_leads;
CREATE TRIGGER update_domain_leads_updated_at
    BEFORE UPDATE ON domain_leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_lead_gen_campaigns_updated_at ON lead_gen_campaigns;
CREATE TRIGGER update_lead_gen_campaigns_updated_at
    BEFORE UPDATE ON lead_gen_campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing
INSERT INTO lead_sources (type, name) VALUES
    ('domain_scrape', 'ICANN CZDS Daily'),
    ('domain_scrape', 'Whoxy New Domains'),
    ('manual', 'Manual Entry'),
    ('referral', 'Partner Referrals'),
    ('inbound', 'Website Leads')
ON CONFLICT DO NOTHING;

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL ON domain_leads TO your_app_user;
-- GRANT ALL ON lead_gen_campaigns TO your_app_user;
-- GRANT ALL ON lead_sources TO your_app_user;
-- GRANT ALL ON lead_gen_config TO your_app_user;

COMMENT ON TABLE domain_leads IS 'Stores domain leads for lead generation system';
COMMENT ON TABLE lead_gen_campaigns IS 'Campaign management for organizing lead generation efforts';
COMMENT ON TABLE lead_sources IS 'Sources from which leads are generated';
COMMENT ON TABLE lead_gen_config IS 'Configuration for lead generation system (API keys, settings)';
