-- Create enums first
CREATE TYPE business_type AS ENUM (
  'hvac', 'solar', 'plumbing', 'electrical', 'siding', 'gutters',
  'landscaping', 'general_contractor', 'real_estate', 'insurance_adjuster'
);

CREATE TYPE project_type AS ENUM (
  'full_replacement', 'repair', 'maintenance', 'inspection',
  'emergency', 'gutter_work', 'siding', 'solar_prep'
);

CREATE TYPE roof_type AS ENUM (
  'asphalt_shingle', 'metal', 'tile', 'slate', 'flat', 'cedar_shake', 'other'
);

CREATE TYPE partner_tier AS ENUM ('bronze', 'silver', 'gold');
CREATE TYPE referral_status AS ENUM ('new', 'contacted', 'quoted', 'scheduled', 'in_progress', 'completed', 'won', 'lost');
CREATE TYPE partner_status AS ENUM ('active', 'inactive', 'pending', 'suspended');
CREATE TYPE urgency_level AS ENUM ('low', 'normal', 'high', 'emergency');
CREATE TYPE payment_method AS ENUM ('check', 'ach', 'stripe', 'manual');
CREATE TYPE payment_status AS ENUM ('pending', 'scheduled', 'paid', 'failed', 'cancelled');

-- Partners table (service businesses that refer to roofing company)
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  business_type business_type NOT NULL,
  address JSONB, -- {street, city, state, zip}
  service_areas TEXT[], -- Geographic areas they serve
  tier partner_tier DEFAULT 'bronze',
  commission_rate DECIMAL(5,2) DEFAULT 5.00, -- Percentage
  referral_count INTEGER DEFAULT 0,
  total_commission_earned DECIMAL(10,2) DEFAULT 0,
  status partner_status DEFAULT 'active',
  portal_slug TEXT UNIQUE, -- For partner portal URL
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referrals table (leads submitted by partners)
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  
  -- Customer Information
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  customer_address JSONB,
  
  -- Project Details
  project_type project_type NOT NULL,
  roof_type roof_type,
  estimated_value DECIMAL(10,2),
  actual_job_value DECIMAL(10,2), -- Filled when job is won
  urgency urgency_level DEFAULT 'normal',
  description TEXT,
  photos TEXT[], -- URLs to uploaded images
  
  -- Status & Tracking
  status referral_status DEFAULT 'new',
  commission_pct DECIMAL(5,2), -- Set from partner tier when created
  commission_due DECIMAL(10,2) DEFAULT 0,
  assigned_to UUID, -- Staff member assigned
  follow_up_date DATE,
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Commission payments tracking
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(id) ON DELETE CASCADE,
  referral_ids UUID[], -- Array of referral IDs included in payment
  amount DECIMAL(10,2) NOT NULL,
  payment_method payment_method DEFAULT 'check',
  status payment_status DEFAULT 'pending',
  scheduled_date DATE,
  paid_date DATE,
  transaction_id TEXT, -- For automated payments
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- System settings and configuration
CREATE TABLE system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_tiers JSONB DEFAULT '[
    {"tier": "bronze", "min_referrals": 0, "commission_pct": 5, "name": "Bronze Partner"},
    {"tier": "silver", "min_referrals": 5, "commission_pct": 6, "name": "Silver Partner"},
    {"tier": "gold", "min_referrals": 15, "commission_pct": 7, "name": "Gold Partner"}
  ]',
  email_templates JSONB DEFAULT '{}',
  notification_settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for partners table
CREATE POLICY "Partners can view own data" ON partners
  FOR SELECT USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Staff can manage all partners" ON partners
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'staff' OR 
    auth.jwt() ->> 'role' = 'admin'
  );

-- RLS Policies for referrals table
CREATE POLICY "Partners can view own referrals" ON referrals
  FOR SELECT USING (
    partner_id IN (
      SELECT id FROM partners WHERE email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "Partners can insert own referrals" ON referrals
  FOR INSERT WITH CHECK (
    partner_id IN (
      SELECT id FROM partners WHERE email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "Staff can manage all referrals" ON referrals
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'staff' OR 
    auth.jwt() ->> 'role' = 'admin'
  );

-- RLS Policies for payments table
CREATE POLICY "Partners can view own payments" ON payments
  FOR SELECT USING (
    partner_id IN (
      SELECT id FROM partners WHERE email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "Staff can manage all payments" ON payments
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'staff' OR 
    auth.jwt() ->> 'role' = 'admin'
  );

-- RLS Policies for system_settings table
CREATE POLICY "Only admins can manage system settings" ON system_settings
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Create indexes for better performance
CREATE INDEX idx_partners_email ON partners(email);
CREATE INDEX idx_partners_portal_slug ON partners(portal_slug);
CREATE INDEX idx_partners_status ON partners(status);
CREATE INDEX idx_referrals_partner_id ON referrals(partner_id);
CREATE INDEX idx_referrals_status ON referrals(status);
CREATE INDEX idx_referrals_created_at ON referrals(created_at);
CREATE INDEX idx_payments_partner_id ON payments(partner_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_referrals_updated_at BEFORE UPDATE ON referrals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate portal slug
CREATE OR REPLACE FUNCTION generate_portal_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.portal_slug IS NULL THEN
    NEW.portal_slug := lower(regexp_replace(NEW.company_name, '[^a-zA-Z0-9]+', '-', 'g'));
    -- Ensure uniqueness
    WHILE EXISTS(SELECT 1 FROM partners WHERE portal_slug = NEW.portal_slug AND id != NEW.id) LOOP
      NEW.portal_slug := NEW.portal_slug || '-' || floor(random() * 1000)::text;
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for portal slug generation
CREATE TRIGGER generate_partners_portal_slug BEFORE INSERT OR UPDATE ON partners
  FOR EACH ROW EXECUTE FUNCTION generate_portal_slug();

-- Function to calculate commission when referral is won
CREATE OR REPLACE FUNCTION calculate_commission()
RETURNS TRIGGER AS $$
DECLARE
  partner_commission_rate DECIMAL(5,2);
BEGIN
  -- Only calculate if status changed to 'won' and actual_job_value is set
  IF NEW.status = 'won' AND OLD.status != 'won' AND NEW.actual_job_value > 0 THEN
    -- Get partner's commission rate
    SELECT commission_rate INTO partner_commission_rate 
    FROM partners WHERE id = NEW.partner_id;
    
    -- Calculate commission
    NEW.commission_pct := partner_commission_rate;
    NEW.commission_due := NEW.actual_job_value * (partner_commission_rate / 100);
    
    -- Update partner totals
    UPDATE partners 
    SET total_commission_earned = total_commission_earned + NEW.commission_due
    WHERE id = NEW.partner_id;
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for commission calculation
CREATE TRIGGER calculate_referral_commission BEFORE UPDATE ON referrals
  FOR EACH ROW EXECUTE FUNCTION calculate_commission();

-- Function to update partner referral count
CREATE OR REPLACE FUNCTION update_partner_referral_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE partners SET referral_count = referral_count + 1 WHERE id = NEW.partner_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE partners SET referral_count = referral_count - 1 WHERE id = OLD.partner_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Create trigger for referral count
CREATE TRIGGER update_partner_referral_count_trigger 
  AFTER INSERT OR DELETE ON referrals
  FOR EACH ROW EXECUTE FUNCTION update_partner_referral_count();

-- Insert default system settings
INSERT INTO system_settings (id, commission_tiers, email_templates, notification_settings) 
VALUES (
  gen_random_uuid(),
  '[
    {"tier": "bronze", "min_referrals": 0, "commission_pct": 5, "name": "Bronze Partner"},
    {"tier": "silver", "min_referrals": 5, "commission_pct": 6, "name": "Silver Partner"},
    {"tier": "gold", "min_referrals": 15, "commission_pct": 7, "name": "Gold Partner"}
  ]',
  '{
    "referral_status_update": {
      "subject": "Referral Status Update - {{customer_name}}",
      "body": "Hi {{partner_name}},<br><br>Your referral for {{customer_name}} has been updated to: {{new_status}}<br><br>Thank you for your partnership!"
    },
    "tier_upgrade": {
      "subject": "Congratulations! Partner Tier Upgrade",
      "body": "Hi {{partner_name}},<br><br>Congratulations! You have been upgraded to {{new_tier}} status.<br><br>Your new commission rate is {{commission_rate}}%."
    }
  }',
  '{
    "email_notifications": true,
    "partner_status_updates": true,
    "tier_upgrades": true
  }'
); 