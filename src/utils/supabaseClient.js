import { createClient } from '@supabase/supabase-js';

// Fallback configuration if env vars are not set
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://plbohteqchlzhljayqyn.supabase.co';

const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYm9odGVxY2hsemhsamF5cXluIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjczODcxNiwiZXhwIjoyMTA4MzE0NzE2fQ.EJzi4o5xaRtKfOoiITg4NxE3rc6qPgF8VU92Vwh2KJE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

/**
 * Synchronize Clerk authenticated user profile with Supabase public.profiles table
 */
export async function syncUserProfile(user) {
  if (!user || !user.id) return null;

  const email =
    user.primaryEmailAddress?.emailAddress ||
    user.emailAddresses?.[0]?.emailAddress ||
    '';
  const fullName =
    user.fullName ||
    [user.firstName, user.lastName].filter(Boolean).join(' ') ||
    'Trader';
  const avatarUrl = user.imageUrl || null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(
        {
          id: user.id,
          email,
          full_name: fullName,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'id' }
      )
      .select()
      .single();

    if (error) {
      console.warn('Supabase syncUserProfile error:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase syncUserProfile exception:', err);
    return null;
  }
}

/**
 * Fetch all trade journal entries for a specific Clerk user
 */
export async function fetchUserTrades(userId) {
  if (!userId) return [];
  try {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchUserTrades error:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn('Supabase fetchUserTrades exception:', err);
    return [];
  }
}

/**
 * Save a new trade executed by the Auto-Bot or manual paper trade to Supabase
 */
export async function insertUserTrade(userId, tradeData) {
  if (!userId || !tradeData) return null;

  try {
    const payload = {
      user_id: userId,
      symbol: tradeData.symbol || 'BTCUSDT',
      direction: tradeData.direction === 'SHORT' ? 'SHORT' : 'LONG',
      entry_price: Number(tradeData.entryPrice || tradeData.entry_price || 0),
      stop_loss: Number(tradeData.stopLoss || tradeData.stop_loss || 0),
      take_profit: Number(tradeData.takeProfit || tradeData.take_profit || 0),
      status: tradeData.status || 'OPEN',
      exit_price: tradeData.exitPrice ? Number(tradeData.exitPrice) : null,
      pnl: tradeData.pnl !== undefined ? Number(tradeData.pnl) : null,
      notes: tradeData.notes || `Auto-Bot entry (${tradeData.gannDegree || 'Gann Zone'})`,
      created_at: tradeData.created_at || new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('trades')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.warn('Supabase insertUserTrade error:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase insertUserTrade exception:', err);
    return null;
  }
}

/**
 * Update a trade when closed (e.g. hit TP, hit SL, or closed manually)
 */
export async function updateUserTradeStatus(userId, tradeId, { status, exitPrice, pnl, closedAt }) {
  if (!userId || !tradeId) return null;

  try {
    const updatePayload = {
      status,
      exit_price: Number(exitPrice || 0),
      pnl: Number(pnl || 0),
      closed_at: closedAt || new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('trades')
      .update(updatePayload)
      .eq('id', tradeId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.warn('Supabase updateUserTradeStatus error:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase updateUserTradeStatus exception:', err);
    return null;
  }
}

/**
 * Delete a specific trade belonging to the user
 */
export async function deleteUserTrade(userId, tradeId) {
  if (!userId || !tradeId) return false;

  try {
    const { error } = await supabase
      .from('trades')
      .delete()
      .eq('id', tradeId)
      .eq('user_id', userId);

    if (error) {
      console.warn('Supabase deleteUserTrade error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase deleteUserTrade exception:', err);
    return false;
  }
}

/**
 * Clear all trade history for a specific user
 */
export async function clearAllUserTrades(userId) {
  if (!userId) return false;

  try {
    const { error } = await supabase
      .from('trades')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.warn('Supabase clearAllUserTrades error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase clearAllUserTrades exception:', err);
    return false;
  }
}
