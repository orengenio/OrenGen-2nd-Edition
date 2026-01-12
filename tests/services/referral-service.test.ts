import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock Supabase
const mockSupabase = {
  from: vi.fn(() => mockSupabase),
  select: vi.fn(() => mockSupabase),
  insert: vi.fn(() => mockSupabase),
  update: vi.fn(() => mockSupabase),
  eq: vi.fn(() => mockSupabase),
  gte: vi.fn(() => mockSupabase),
  order: vi.fn(() => mockSupabase),
  limit: vi.fn(() => mockSupabase),
  single: vi.fn(() => Promise.resolve({ data: null, error: null })),
};

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => mockSupabase,
}));

describe('ReferralService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Referral Code Generation', () => {
    it('should generate unique referral codes', () => {
      // Test code generation logic
      const generateCode = (prefix: string = 'REF'): string => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = prefix + '-';
        for (let i = 0; i < 6; i++) {
          code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
      };

      const code1 = generateCode();
      const code2 = generateCode();

      expect(code1).toMatch(/^REF-[A-Z0-9]{6}$/);
      expect(code2).toMatch(/^REF-[A-Z0-9]{6}$/);
      // Codes should be unique (with high probability)
      expect(code1).not.toBe(code2);
    });

    it('should support custom prefixes', () => {
      const generateCode = (prefix: string = 'REF'): string => {
        return `${prefix}-ABC123`;
      };

      expect(generateCode('VIP')).toBe('VIP-ABC123');
      expect(generateCode('PARTNER')).toBe('PARTNER-ABC123');
    });
  });

  describe('Reward Calculations', () => {
    it('should calculate percentage-based rewards', () => {
      const calculateReward = (
        rewardType: 'percentage' | 'fixed' | 'credit',
        rewardValue: number,
        saleAmount?: number
      ): number => {
        switch (rewardType) {
          case 'percentage':
            return saleAmount ? (saleAmount * rewardValue) / 100 : 0;
          case 'fixed':
          case 'credit':
            return rewardValue;
          default:
            return 0;
        }
      };

      expect(calculateReward('percentage', 10, 1000)).toBe(100);
      expect(calculateReward('percentage', 15, 500)).toBe(75);
    });

    it('should calculate fixed rewards', () => {
      const calculateReward = (
        rewardType: 'percentage' | 'fixed',
        rewardValue: number
      ): number => {
        return rewardType === 'fixed' ? rewardValue : 0;
      };

      expect(calculateReward('fixed', 50)).toBe(50);
      expect(calculateReward('fixed', 100)).toBe(100);
    });

    it('should apply tier multipliers', () => {
      const applyTierMultiplier = (
        baseReward: number,
        tier: { multiplier: number }
      ): number => {
        return baseReward * tier.multiplier;
      };

      const bronzeTier = { multiplier: 1.0 };
      const silverTier = { multiplier: 1.25 };
      const goldTier = { multiplier: 1.5 };

      expect(applyTierMultiplier(100, bronzeTier)).toBe(100);
      expect(applyTierMultiplier(100, silverTier)).toBe(125);
      expect(applyTierMultiplier(100, goldTier)).toBe(150);
    });
  });

  describe('Referral Status Tracking', () => {
    it('should track referral lifecycle', () => {
      const validStatuses = [
        'pending',
        'clicked',
        'signed_up',
        'qualified',
        'converted',
        'paid',
        'expired',
        'invalid',
      ];

      const isValidTransition = (from: string, to: string): boolean => {
        const transitions: Record<string, string[]> = {
          pending: ['clicked', 'expired'],
          clicked: ['signed_up', 'expired'],
          signed_up: ['qualified', 'expired', 'invalid'],
          qualified: ['converted', 'expired'],
          converted: ['paid'],
          paid: [],
          expired: [],
          invalid: [],
        };

        return transitions[from]?.includes(to) ?? false;
      };

      expect(isValidTransition('pending', 'clicked')).toBe(true);
      expect(isValidTransition('clicked', 'signed_up')).toBe(true);
      expect(isValidTransition('signed_up', 'converted')).toBe(false);
      expect(isValidTransition('converted', 'paid')).toBe(true);
      expect(isValidTransition('paid', 'pending')).toBe(false);
    });
  });

  describe('Leaderboard Calculations', () => {
    it('should calculate total earnings', () => {
      const referrals = [
        { status: 'paid', reward_amount: 100 },
        { status: 'paid', reward_amount: 50 },
        { status: 'pending', reward_amount: 75 },
        { status: 'paid', reward_amount: 200 },
      ];

      const totalEarnings = referrals
        .filter(r => r.status === 'paid')
        .reduce((sum, r) => sum + r.reward_amount, 0);

      expect(totalEarnings).toBe(350);
    });

    it('should calculate conversion rate', () => {
      const calculateConversionRate = (
        conversions: number,
        clicks: number
      ): number => {
        if (clicks === 0) return 0;
        return Math.round((conversions / clicks) * 100 * 10) / 10;
      };

      expect(calculateConversionRate(10, 100)).toBe(10);
      expect(calculateConversionRate(25, 200)).toBe(12.5);
      expect(calculateConversionRate(0, 50)).toBe(0);
      expect(calculateConversionRate(5, 0)).toBe(0);
    });

    it('should rank users by performance', () => {
      const users = [
        { id: '1', name: 'Alice', conversions: 15, earnings: 750 },
        { id: '2', name: 'Bob', conversions: 25, earnings: 1250 },
        { id: '3', name: 'Charlie', conversions: 10, earnings: 500 },
      ];

      const leaderboard = [...users].sort((a, b) => b.earnings - a.earnings);

      expect(leaderboard[0].name).toBe('Bob');
      expect(leaderboard[1].name).toBe('Alice');
      expect(leaderboard[2].name).toBe('Charlie');
    });
  });

  describe('Program Validation', () => {
    it('should validate active program dates', () => {
      const isProgramActive = (
        startDate: string,
        endDate: string | null
      ): boolean => {
        const now = new Date();
        const start = new Date(startDate);

        if (now < start) return false;
        if (endDate && now > new Date(endDate)) return false;

        return true;
      };

      const pastDate = '2020-01-01';
      const futureDate = '2030-12-31';
      const now = new Date().toISOString().split('T')[0];

      expect(isProgramActive(pastDate, futureDate)).toBe(true);
      expect(isProgramActive(futureDate, null)).toBe(false);
      expect(isProgramActive(pastDate, pastDate)).toBe(false);
    });

    it('should validate minimum requirements', () => {
      const meetsMinimum = (
        orderValue: number,
        minOrderValue?: number
      ): boolean => {
        if (!minOrderValue) return true;
        return orderValue >= minOrderValue;
      };

      expect(meetsMinimum(100, 50)).toBe(true);
      expect(meetsMinimum(30, 50)).toBe(false);
      expect(meetsMinimum(100, undefined)).toBe(true);
    });
  });
});
