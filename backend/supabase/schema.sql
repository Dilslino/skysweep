-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fid BIGINT UNIQUE NOT NULL,
  username VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  avatar_url TEXT,
  primary_address VARCHAR(255),
  points INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  rank INTEGER DEFAULT 0,
  accuracy DECIMAL(5,2) DEFAULT 0,
  best_location VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on fid for faster lookups
CREATE INDEX idx_users_fid ON users(fid);
CREATE INDEX idx_users_points ON users(points DESC);
CREATE INDEX idx_users_rank ON users(rank);

-- Badges table
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  icon VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  tier VARCHAR(50) NOT NULL CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  requirement_type VARCHAR(50) NOT NULL,
  requirement_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User badges junction table
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);

-- Predictions table
CREATE TABLE predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  location_name VARCHAR(255) NOT NULL,
  location_lat DECIMAL(10, 6) NOT NULL,
  location_lng DECIMAL(10, 6) NOT NULL,
  location_country VARCHAR(255) NOT NULL,
  predicted_temp DECIMAL(5,2) NOT NULL,
  predicted_condition VARCHAR(50) NOT NULL,
  prediction_date DATE NOT NULL,
  target_date DATE NOT NULL,
  actual_temp DECIMAL(5,2),
  actual_condition VARCHAR(50),
  score INTEGER,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'scored')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  scored_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_predictions_user_id ON predictions(user_id);
CREATE INDEX idx_predictions_status ON predictions(status);
CREATE INDEX idx_predictions_target_date ON predictions(target_date);
CREATE INDEX idx_predictions_created_at ON predictions(created_at DESC);

-- Leaderboard view (materialized for performance)
CREATE MATERIALIZED VIEW leaderboard AS
SELECT 
  u.id,
  u.fid,
  u.username,
  u.display_name,
  u.avatar_url,
  u.points,
  u.accuracy,
  u.streak,
  RANK() OVER (ORDER BY u.points DESC, u.accuracy DESC) as rank,
  0 as change
FROM users u
WHERE u.points > 0
ORDER BY rank;

CREATE UNIQUE INDEX idx_leaderboard_id ON leaderboard(id);

-- Function to refresh leaderboard
CREATE OR REPLACE FUNCTION refresh_leaderboard()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY leaderboard;
END;
$$ LANGUAGE plpgsql;

-- Function to update user rank
CREATE OR REPLACE FUNCTION update_user_ranks()
RETURNS void AS $$
BEGIN
  WITH ranked_users AS (
    SELECT 
      id,
      RANK() OVER (ORDER BY points DESC, accuracy DESC) as new_rank
    FROM users
  )
  UPDATE users
  SET rank = ranked_users.new_rank
  FROM ranked_users
  WHERE users.id = ranked_users.id;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default badges
INSERT INTO badges (name, icon, description, tier, requirement_type, requirement_value) VALUES
  ('First Forecast', '🌤️', 'Make your first weather prediction', 'bronze', 'predictions', 1),
  ('Weather Watcher', '👀', 'Make 10 weather predictions', 'bronze', 'predictions', 10),
  ('Storm Chaser', '⛈️', 'Make 50 weather predictions', 'silver', 'predictions', 50),
  ('Climate Expert', '🌍', 'Make 100 weather predictions', 'gold', 'predictions', 100),
  ('Weather Master', '🏆', 'Make 500 weather predictions', 'platinum', 'predictions', 500),
  
  ('Point Collector', '⭐', 'Earn 100 points', 'bronze', 'points', 100),
  ('Point Hoarder', '💰', 'Earn 500 points', 'silver', 'points', 500),
  ('Point Legend', '👑', 'Earn 1000 points', 'gold', 'points', 1000),
  
  ('Streak Starter', '🔥', 'Achieve a 3-day streak', 'bronze', 'streak', 3),
  ('Streak Builder', '⚡', 'Achieve a 7-day streak', 'silver', 'streak', 7),
  ('Streak Master', '💫', 'Achieve a 30-day streak', 'gold', 'streak', 30),
  
  ('Accuracy Pro', '🎯', 'Achieve 80% accuracy', 'silver', 'accuracy', 80),
  ('Accuracy Legend', '🏅', 'Achieve 90% accuracy', 'gold', 'accuracy', 90),
  ('Perfect Predictor', '💎', 'Achieve 95% accuracy', 'platinum', 'accuracy', 95);
