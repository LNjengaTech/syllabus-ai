// Utility functions for subscription and usage tracking
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
);

const FREE_UPLOAD_LIMIT = 3;

/**
 * Check if a user has premium access
 */
export async function checkPremiumStatus(userId: string): Promise<boolean> {
    const { data, error } = await supabase
        .from('user_profiles')
        .select('is_premium, subscription_end_date')
        .eq('user_id', userId)
        .single();

    if (error || !data) {
        // User doesn't have a profile yet - they're free tier
        return false;
    }

    // Check if subscription is still active
    if (data.is_premium && data.subscription_end_date) {
        const endDate = new Date(data.subscription_end_date);
        return endDate > new Date();
    }

    return data.is_premium;
}

/**
 * Check if user can upload (based on limit)
 */
export async function canUserUpload(userId: string): Promise<{
    allowed: boolean;
    uploadCount: number;
    isPremium: boolean;
}> {
    // Check premium status first
    const isPremium = await checkPremiumStatus(userId);

    if (isPremium) {
        return { allowed: true, uploadCount: 0, isPremium: true };
    }

    // Count existing uploads
    const { data, error } = await supabase
        .from('course_files')
        .select('id', { count: 'exact' })
        .eq('user_id', userId);

    if (error) {
        console.error('Error counting uploads:', error);
        throw new Error('Failed to check upload limit');
    }

    const uploadCount = data?.length || 0;
    const allowed = uploadCount < FREE_UPLOAD_LIMIT;

    return { allowed, uploadCount, isPremium: false };
}

/**
 * Create or update user profile
 */
export async function upsertUserProfile(
    userId: string,
    updates: {
        is_premium?: boolean;
        subscription_end_date?: string;
    }
) {
    const { error } = await supabase
        .from('user_profiles')
        .upsert({
            user_id: userId,
            ...updates,
        }, {
            onConflict: 'user_id'
        });

    if (error) {
        console.error('Error upserting user profile:', error);
        throw error;
    }
}
