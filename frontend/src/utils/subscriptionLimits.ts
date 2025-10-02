// src/utils/subscriptionLimits.ts

export type SubscriptionTier = 'basic' | 'plus' | 'pro';

export interface TierLimits {
  maxProperties: number | null; // null = unlimited
  hasAnalysis: boolean;
  hasFolders: boolean;
  hasDataExport: boolean;
  hasPrioritySupport: boolean;
}

export const TIER_LIMITS: Record<SubscriptionTier, TierLimits> = {
  basic: {
    maxProperties: 2,
    hasAnalysis: false,
    hasFolders: false,
    hasDataExport: false,
    hasPrioritySupport: false,
  },
  plus: {
    maxProperties: 10,
    hasAnalysis: true,
    hasFolders: true,
    hasDataExport: false,
    hasPrioritySupport: false,
  },
  pro: {
    maxProperties: null, // unlimited
    hasAnalysis: true,
    hasFolders: true,
    hasDataExport: true,
    hasPrioritySupport: true,
  },
};

export function getTierLimits(tier: string | undefined): TierLimits {
  const normalizedTier = (tier?.toLowerCase() || 'basic') as SubscriptionTier;
  return TIER_LIMITS[normalizedTier] || TIER_LIMITS.basic;
}

export function canAddProperty(currentCount: number, tier: string | undefined): boolean {
  const limits = getTierLimits(tier);
  if (limits.maxProperties === null) return true; // unlimited
  return currentCount < limits.maxProperties;
}

export function getRemainingProperties(currentCount: number, tier: string | undefined): number | null {
  const limits = getTierLimits(tier);
  if (limits.maxProperties === null) return null; // unlimited
  return Math.max(0, limits.maxProperties - currentCount);
}