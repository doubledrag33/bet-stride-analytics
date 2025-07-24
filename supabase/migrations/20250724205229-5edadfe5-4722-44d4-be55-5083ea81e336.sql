-- Create enum for bet status
CREATE TYPE bet_status AS ENUM ('PENDING', 'WON', 'LOST');

-- Create users profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  stripe_customer_id TEXT,
  referral_code TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  invited_by TEXT, -- referral code of inviter
  subscription_active BOOLEAN DEFAULT false,
  subscription_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create bankrolls table
CREATE TABLE public.bankrolls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  share_token TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create bets table
CREATE TABLE public.bets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bankroll_id UUID NOT NULL REFERENCES public.bankrolls(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sport TEXT,
  event TEXT,
  odds DECIMAL(10,2),
  stake DECIMAL(10,2),
  adm_ref TEXT,
  bookmaker TEXT,
  placed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status bet_status DEFAULT 'PENDING',
  result_at TIMESTAMPTZ,
  confidence_score INTEGER DEFAULT 50, -- OCR confidence 0-100
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bankrolls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bets ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS policies for bankrolls
CREATE POLICY "Users can view own bankrolls" ON public.bankrolls
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bankrolls" ON public.bankrolls
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bankrolls" ON public.bankrolls
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bankrolls" ON public.bankrolls
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for bets
CREATE POLICY "Users can view own bets" ON public.bets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bets" ON public.bets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bets" ON public.bets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bets" ON public.bets
  FOR DELETE USING (auth.uid() = user_id);

-- Public access policy for shared bankrolls (read-only)
CREATE POLICY "Public can view shared bankrolls" ON public.bankrolls
  FOR SELECT USING (true);

CREATE POLICY "Public can view shared bets" ON public.bets
  FOR SELECT USING (true);

-- Function to create default bankroll for new users
CREATE OR REPLACE FUNCTION create_user_bankroll()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, referral_code)
  VALUES (NEW.id, NEW.email, gen_random_uuid()::text);
  
  INSERT INTO public.bankrolls (user_id, name)
  VALUES (NEW.id, 'Bankroll Principale');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-creating profile and bankroll
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_bankroll();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updating timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bankrolls_updated_at
  BEFORE UPDATE ON public.bankrolls
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bets_updated_at
  BEFORE UPDATE ON public.bets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_bets_user_id ON public.bets(user_id);
CREATE INDEX idx_bets_bankroll_id ON public.bets(bankroll_id);
CREATE INDEX idx_bets_status ON public.bets(status);
CREATE INDEX idx_bets_placed_at ON public.bets(placed_at);
CREATE INDEX idx_bankrolls_share_token ON public.bankrolls(share_token);
CREATE INDEX idx_profiles_referral_code ON public.profiles(referral_code);