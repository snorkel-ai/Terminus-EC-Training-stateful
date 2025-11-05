-- Migration 002: Database Functions and Triggers
-- Creates automated functions for maintaining user state and security

-- Function: Update last_active timestamp automatically
CREATE OR REPLACE FUNCTION update_last_active()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users 
  SET last_active = now() 
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Update last_active when progress changes
CREATE TRIGGER trigger_update_last_active
  AFTER INSERT OR UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_last_active();

-- Function: Prevent users from self-assigning admin status
CREATE OR REPLACE FUNCTION prevent_admin_self_assignment()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    -- Prevent users from modifying is_admin via their own JWT
    IF NEW.is_admin != OLD.is_admin THEN
      -- Only service_role can change admin status
      IF current_setting('request.jwt.claims', true)::json->>'role' != 'service_role' THEN
        RAISE EXCEPTION 'Unauthorized: Cannot modify admin status';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Enforce admin assignment security
CREATE TRIGGER trigger_prevent_admin_self_assignment
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION prevent_admin_self_assignment();

-- Function: Update updated_at timestamp on user_progress changes
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update updated_at field
CREATE TRIGGER trigger_update_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

