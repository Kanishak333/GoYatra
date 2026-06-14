export interface TripMember {
  id: string;
  name: string;
  sharePercentage?: number; // Optional custom share percentage. If undefined, split equally.
  amountOwed: number;
  amountPaid: number;
  paymentStatus: 'pending' | 'partial' | 'completed';
}

export interface TripExpenses {
  tripId: string;
  totalCost: number;
  currency: string;
  members: TripMember[];
}

/**
 * 1. Generate a unique shareable invite link for a trip ID.
 * Generates a cryptographically secure token and base64 encodes the trip ID for clean URLs.
 */
export function generateInviteLink(tripId: string, baseUrl: string = typeof window !== 'undefined' ? window.location.origin : 'https://goyatra.com'): string {
  // Use crypto.randomUUID() for secure token generation, with a fallback for older environments
  const uniqueToken = typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID() 
    : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
  // Base64 encode the tripId for a cleaner URL payload
  const encodedTripId = btoa(tripId);
  return `${baseUrl}/trip-setu/invite?trip=${encodedTripId}&token=${uniqueToken}`;
}

/**
 * 2. Calculate proportional costs for individual members.
 * Supports both strict equal splits and custom percentage-based splits.
 */
export function calculateProportionalCosts(
  totalCost: number, 
  members: Omit<TripMember, 'amountOwed' | 'paymentStatus'>[]
): TripMember[] {
  if (members.length === 0) return [];

  // Determine if we are doing an equal split or a custom percentage split
  const hasCustomShares = members.some(m => m.sharePercentage !== undefined);
  
  let processedMembers: TripMember[] = [];

  if (!hasCustomShares) {
    // Equal split logic
    const splitAmount = parseFloat((totalCost / members.length).toFixed(2));
    
    // Handle floating point rounding errors by giving the remainder to the first member
    const remainder = parseFloat((totalCost - (splitAmount * members.length)).toFixed(2));
    
    processedMembers = members.map((m, index) => {
      const amountOwed = index === 0 ? splitAmount + remainder : splitAmount;
      return {
        ...m,
        amountOwed,
        paymentStatus: determinePaymentStatus(amountOwed, m.amountPaid)
      };
    });
  } else {
    // Custom percentage split logic
    const totalPercentage = members.reduce((sum, m) => sum + (m.sharePercentage || 0), 0);
    
    if (Math.abs(totalPercentage - 100) > 0.01) {
      console.warn(`TripSetu Warning: Total share percentage is ${totalPercentage}%. Normalizing to 100%.`);
    }

    processedMembers = members.map(m => {
      // Normalize share in case percentages don't add exactly to 100
      const normalizedShare = (m.sharePercentage || 0) / (totalPercentage || 100);
      const amountOwed = parseFloat((totalCost * normalizedShare).toFixed(2));
      return {
        ...m,
        amountOwed,
        paymentStatus: determinePaymentStatus(amountOwed, m.amountPaid)
      };
    });
  }

  return processedMembers;
}

/**
 * 3. Track payment status (pending/partial/completed) per user.
 */
export function determinePaymentStatus(amountOwed: number, amountPaid: number): 'pending' | 'partial' | 'completed' {
  if (amountOwed === 0) return 'completed';
  
  if (amountPaid >= amountOwed) {
    return 'completed';
  } else if (amountPaid > 0 && amountPaid < amountOwed) {
    return 'partial';
  }
  return 'pending';
}

/**
 * Fintech Utility: Process a ledger payment for a member
 */
export function recordPayment(
  trip: TripExpenses, 
  memberId: string, 
  paymentAmount: number
): TripExpenses {
  const updatedMembers = trip.members.map(member => {
    if (member.id === memberId) {
      const newAmountPaid = member.amountPaid + paymentAmount;
      return {
        ...member,
        amountPaid: newAmountPaid,
        paymentStatus: determinePaymentStatus(member.amountOwed, newAmountPaid)
      };
    }
    return member;
  });

  return {
    ...trip,
    members: updatedMembers
  };
}

/**
 * Fintech Utility: Get high-level financial summary of the trip
 */
export function getTripSummary(trip: TripExpenses) {
  const totalPaid = trip.members.reduce((sum, m) => sum + m.amountPaid, 0);
  const totalPending = Math.max(0, trip.totalCost - totalPaid);
  const isFullySettled = totalPending <= 0;

  return {
    totalCost: trip.totalCost,
    totalPaid,
    totalPending,
    isFullySettled,
    completionPercentage: parseFloat(Math.min(100, (totalPaid / trip.totalCost) * 100).toFixed(2))
  };
}
