/**
 * Referral System Service
 * Track referrals, manage rewards, and handle affiliate partnerships
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Types
export interface ReferralProgram {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  status: 'active' | 'paused' | 'ended';
  // Rewards
  reward_type: 'fixed' | 'percentage' | 'tiered';
  reward_amount: number; // Fixed amount or percentage
  reward_currency: string;
  // Tiers for tiered rewards
  tiers?: {
    min_referrals: number;
    reward_amount: number;
  }[];
  // Rules
  minimum_deal_value?: number;
  require_deal_closed: boolean;
  reward_both_parties: boolean;
  referrer_reward?: number;
  referee_reward?: number;
  // Limits
  max_rewards_per_referrer?: number;
  max_total_rewards?: number;
  // Dates
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Referral {
  id: string;
  tenant_id: string;
  program_id: string;
  referrer_id: string; // User or Contact who referred
  referrer_type: 'user' | 'contact' | 'partner';
  referee_email: string;
  referee_name?: string;
  referral_code: string;
  status: 'pending' | 'signed_up' | 'qualified' | 'converted' | 'rewarded' | 'expired';
  // Tracking
  signup_at?: string;
  qualified_at?: string;
  converted_at?: string;
  deal_id?: string;
  deal_value?: number;
  // Rewards
  reward_amount?: number;
  reward_status: 'pending' | 'approved' | 'paid' | 'rejected';
  reward_paid_at?: string;
  // Metadata
  source?: string;
  utm_campaign?: string;
  utm_source?: string;
  utm_medium?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ReferralReward {
  id: string;
  referral_id: string;
  recipient_id: string;
  recipient_type: 'referrer' | 'referee';
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  payment_method?: string;
  payment_reference?: string;
  paid_at?: string;
  created_at: string;
}

export interface ReferralStats {
  total_referrals: number;
  pending: number;
  signed_up: number;
  qualified: number;
  converted: number;
  rewarded: number;
  total_rewards_paid: number;
  conversion_rate: number;
  avg_deal_value: number;
  top_referrers: {
    id: string;
    name: string;
    referrals: number;
    conversions: number;
    rewards_earned: number;
  }[];
}

export interface ReferralLink {
  url: string;
  code: string;
  qrCode?: string;
}

export class ReferralService {
  private tenantId: string;

  constructor(tenantId: string) {
    this.tenantId = tenantId;
  }

  // ==================== PROGRAM MANAGEMENT ====================

  async createProgram(program: Partial<ReferralProgram>): Promise<ReferralProgram> {
    const { data, error } = await supabase
      .from('referral_programs')
      .insert({
        ...program,
        tenant_id: this.tenantId,
        status: program.status || 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create program: ${error.message}`);
    return data;
  }

  async getProgram(id: string): Promise<ReferralProgram | null> {
    const { data } = await supabase
      .from('referral_programs')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', this.tenantId)
      .single();

    return data;
  }

  async getActiveProgram(): Promise<ReferralProgram | null> {
    const { data } = await supabase
      .from('referral_programs')
      .select('*')
      .eq('tenant_id', this.tenantId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    return data;
  }

  async updateProgram(id: string, updates: Partial<ReferralProgram>): Promise<ReferralProgram> {
    const { data, error } = await supabase
      .from('referral_programs')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('tenant_id', this.tenantId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update program: ${error.message}`);
    return data;
  }

  // ==================== REFERRAL MANAGEMENT ====================

  // Generate unique referral code
  generateReferralCode(referrerId: string): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  // Create referral link for a user/partner
  async createReferralLink(
    referrerId: string,
    referrerType: Referral['referrer_type'],
    programId?: string
  ): Promise<ReferralLink> {
    const program = programId
      ? await this.getProgram(programId)
      : await this.getActiveProgram();

    if (!program) throw new Error('No active referral program');

    const code = this.generateReferralCode(referrerId);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.example.com';
    const url = `${baseUrl}/signup?ref=${code}`;

    // Store the referral code mapping
    await supabase.from('referral_codes').insert({
      code,
      referrer_id: referrerId,
      referrer_type: referrerType,
      program_id: program.id,
      tenant_id: this.tenantId,
      created_at: new Date().toISOString(),
    });

    return { url, code };
  }

  // Create referral when someone is referred
  async createReferral(data: {
    programId: string;
    referrerId: string;
    referrerType: Referral['referrer_type'];
    refereeEmail: string;
    refereeName?: string;
    source?: string;
    utmCampaign?: string;
    utmSource?: string;
    utmMedium?: string;
  }): Promise<Referral> {
    const code = this.generateReferralCode(data.referrerId);

    const { data: referral, error } = await supabase
      .from('referrals')
      .insert({
        tenant_id: this.tenantId,
        program_id: data.programId,
        referrer_id: data.referrerId,
        referrer_type: data.referrerType,
        referee_email: data.refereeEmail,
        referee_name: data.refereeName,
        referral_code: code,
        status: 'pending',
        reward_status: 'pending',
        source: data.source,
        utm_campaign: data.utmCampaign,
        utm_source: data.utmSource,
        utm_medium: data.utmMedium,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create referral: ${error.message}`);
    return referral;
  }

  // Track referral from code
  async trackReferralSignup(referralCode: string, refereeEmail: string): Promise<Referral | null> {
    // Find the referral code
    const { data: codeData } = await supabase
      .from('referral_codes')
      .select('*')
      .eq('code', referralCode)
      .single();

    if (!codeData) return null;

    // Create or update referral
    const { data: existingReferral } = await supabase
      .from('referrals')
      .select('*')
      .eq('referee_email', refereeEmail)
      .eq('tenant_id', this.tenantId)
      .single();

    if (existingReferral) {
      // Update existing referral
      const { data } = await supabase
        .from('referrals')
        .update({
          status: 'signed_up',
          signup_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingReferral.id)
        .select()
        .single();

      return data;
    }

    // Create new referral
    return this.createReferral({
      programId: codeData.program_id,
      referrerId: codeData.referrer_id,
      referrerType: codeData.referrer_type,
      refereeEmail,
      source: 'referral_link',
    });
  }

  // Update referral status
  async updateReferralStatus(
    referralId: string,
    status: Referral['status'],
    additionalData?: Partial<Referral>
  ): Promise<Referral> {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
      ...additionalData,
    };

    // Set timestamp based on status
    if (status === 'signed_up' && !additionalData?.signup_at) {
      updateData.signup_at = new Date().toISOString();
    } else if (status === 'qualified' && !additionalData?.qualified_at) {
      updateData.qualified_at = new Date().toISOString();
    } else if (status === 'converted' && !additionalData?.converted_at) {
      updateData.converted_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('referrals')
      .update(updateData)
      .eq('id', referralId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update referral: ${error.message}`);

    // Check if we should process rewards
    if (status === 'converted') {
      await this.processReward(referralId);
    }

    return data;
  }

  // Process and create reward
  async processReward(referralId: string): Promise<ReferralReward[]> {
    const { data: referral } = await supabase
      .from('referrals')
      .select('*, program:referral_programs(*)')
      .eq('id', referralId)
      .single();

    if (!referral || referral.reward_status !== 'pending') {
      return [];
    }

    const program = referral.program as ReferralProgram;
    const rewards: ReferralReward[] = [];

    // Calculate reward amount
    let rewardAmount = 0;

    switch (program.reward_type) {
      case 'fixed':
        rewardAmount = program.reward_amount;
        break;
      case 'percentage':
        rewardAmount = (referral.deal_value || 0) * (program.reward_amount / 100);
        break;
      case 'tiered':
        // Get referrer's total referrals
        const { count } = await supabase
          .from('referrals')
          .select('*', { count: 'exact', head: true })
          .eq('referrer_id', referral.referrer_id)
          .eq('status', 'converted');

        const totalReferrals = count || 0;
        const tier = program.tiers
          ?.sort((a, b) => b.min_referrals - a.min_referrals)
          .find(t => totalReferrals >= t.min_referrals);

        rewardAmount = tier?.reward_amount || program.reward_amount;
        break;
    }

    // Check minimum deal value
    if (program.minimum_deal_value && (referral.deal_value || 0) < program.minimum_deal_value) {
      return [];
    }

    // Create referrer reward
    const referrerReward = await supabase
      .from('referral_rewards')
      .insert({
        referral_id: referralId,
        recipient_id: referral.referrer_id,
        recipient_type: 'referrer',
        amount: program.referrer_reward || rewardAmount,
        currency: program.reward_currency,
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (referrerReward.data) rewards.push(referrerReward.data);

    // Create referee reward if applicable
    if (program.reward_both_parties && program.referee_reward) {
      const refereeReward = await supabase
        .from('referral_rewards')
        .insert({
          referral_id: referralId,
          recipient_id: referral.referee_email,
          recipient_type: 'referee',
          amount: program.referee_reward,
          currency: program.reward_currency,
          status: 'pending',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (refereeReward.data) rewards.push(refereeReward.data);
    }

    // Update referral reward status
    await supabase
      .from('referrals')
      .update({
        reward_amount: rewardAmount,
        reward_status: 'approved',
        status: 'rewarded',
        updated_at: new Date().toISOString(),
      })
      .eq('id', referralId);

    return rewards;
  }

  // Mark reward as paid
  async markRewardPaid(
    rewardId: string,
    paymentMethod: string,
    paymentReference: string
  ): Promise<ReferralReward> {
    const { data, error } = await supabase
      .from('referral_rewards')
      .update({
        status: 'paid',
        payment_method: paymentMethod,
        payment_reference: paymentReference,
        paid_at: new Date().toISOString(),
      })
      .eq('id', rewardId)
      .select()
      .single();

    if (error) throw new Error(`Failed to mark reward as paid: ${error.message}`);
    return data;
  }

  // ==================== QUERIES ====================

  async getReferrals(options?: {
    status?: Referral['status'];
    referrerId?: string;
    programId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ referrals: Referral[]; total: number }> {
    let query = supabase
      .from('referrals')
      .select('*', { count: 'exact' })
      .eq('tenant_id', this.tenantId)
      .order('created_at', { ascending: false });

    if (options?.status) query = query.eq('status', options.status);
    if (options?.referrerId) query = query.eq('referrer_id', options.referrerId);
    if (options?.programId) query = query.eq('program_id', options.programId);

    const page = options?.page || 1;
    const limit = options?.limit || 20;
    query = query.range((page - 1) * limit, page * limit - 1);

    const { data, count, error } = await query;

    if (error) throw new Error(`Failed to get referrals: ${error.message}`);

    return {
      referrals: data || [],
      total: count || 0,
    };
  }

  async getReferralsByReferrer(referrerId: string): Promise<Referral[]> {
    const { data } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', referrerId)
      .order('created_at', { ascending: false });

    return data || [];
  }

  async getPendingRewards(): Promise<ReferralReward[]> {
    const { data } = await supabase
      .from('referral_rewards')
      .select('*, referral:referrals(*)')
      .eq('status', 'pending');

    return data || [];
  }

  // ==================== STATISTICS ====================

  async getStats(programId?: string): Promise<ReferralStats> {
    let query = supabase
      .from('referrals')
      .select('*')
      .eq('tenant_id', this.tenantId);

    if (programId) query = query.eq('program_id', programId);

    const { data: referrals } = await query;

    if (!referrals || referrals.length === 0) {
      return {
        total_referrals: 0,
        pending: 0,
        signed_up: 0,
        qualified: 0,
        converted: 0,
        rewarded: 0,
        total_rewards_paid: 0,
        conversion_rate: 0,
        avg_deal_value: 0,
        top_referrers: [],
      };
    }

    const statusCounts = {
      pending: 0,
      signed_up: 0,
      qualified: 0,
      converted: 0,
      rewarded: 0,
      expired: 0,
    };

    let totalDealValue = 0;
    let dealsCount = 0;

    referrals.forEach(r => {
      statusCounts[r.status as keyof typeof statusCounts]++;
      if (r.deal_value) {
        totalDealValue += r.deal_value;
        dealsCount++;
      }
    });

    // Get total rewards paid
    const { data: rewards } = await supabase
      .from('referral_rewards')
      .select('amount')
      .eq('status', 'paid');

    const totalRewardsPaid = rewards?.reduce((sum, r) => sum + r.amount, 0) || 0;

    // Get top referrers
    const referrerStats: Record<string, { referrals: number; conversions: number; rewards: number }> = {};

    referrals.forEach(r => {
      if (!referrerStats[r.referrer_id]) {
        referrerStats[r.referrer_id] = { referrals: 0, conversions: 0, rewards: 0 };
      }
      referrerStats[r.referrer_id].referrals++;
      if (r.status === 'converted' || r.status === 'rewarded') {
        referrerStats[r.referrer_id].conversions++;
        referrerStats[r.referrer_id].rewards += r.reward_amount || 0;
      }
    });

    const topReferrers = Object.entries(referrerStats)
      .sort((a, b) => b[1].conversions - a[1].conversions)
      .slice(0, 10)
      .map(([id, stats]) => ({
        id,
        name: id, // Would join with users table in real implementation
        referrals: stats.referrals,
        conversions: stats.conversions,
        rewards_earned: stats.rewards,
      }));

    return {
      total_referrals: referrals.length,
      ...statusCounts,
      total_rewards_paid: totalRewardsPaid,
      conversion_rate: referrals.length > 0
        ? ((statusCounts.converted + statusCounts.rewarded) / referrals.length) * 100
        : 0,
      avg_deal_value: dealsCount > 0 ? totalDealValue / dealsCount : 0,
      top_referrers: topReferrers,
    };
  }

  // Get referrer leaderboard
  async getLeaderboard(limit: number = 10): Promise<{
    rank: number;
    referrer_id: string;
    referrer_name: string;
    total_referrals: number;
    conversions: number;
    total_rewards: number;
  }[]> {
    const { data } = await supabase
      .from('referrals')
      .select('referrer_id, status, reward_amount')
      .eq('tenant_id', this.tenantId);

    if (!data) return [];

    const stats: Record<string, { referrals: number; conversions: number; rewards: number }> = {};

    data.forEach(r => {
      if (!stats[r.referrer_id]) {
        stats[r.referrer_id] = { referrals: 0, conversions: 0, rewards: 0 };
      }
      stats[r.referrer_id].referrals++;
      if (r.status === 'converted' || r.status === 'rewarded') {
        stats[r.referrer_id].conversions++;
        stats[r.referrer_id].rewards += r.reward_amount || 0;
      }
    });

    return Object.entries(stats)
      .sort((a, b) => b[1].conversions - a[1].conversions)
      .slice(0, limit)
      .map(([id, s], index) => ({
        rank: index + 1,
        referrer_id: id,
        referrer_name: id, // Would join with users
        total_referrals: s.referrals,
        conversions: s.conversions,
        total_rewards: s.rewards,
      }));
  }
}

// Factory
export function createReferralService(tenantId: string): ReferralService {
  return new ReferralService(tenantId);
}
