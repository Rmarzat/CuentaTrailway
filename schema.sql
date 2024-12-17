-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) CHECK(role IN ('admin', 'user', 'pending')) DEFAULT 'pending',
  status VARCHAR(50) CHECK(status IN ('active', 'suspended')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Master Exchange Rates table
CREATE TABLE IF NOT EXISTS master_exchange_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  currency VARCHAR(10) NOT NULL,
  rate DECIMAL(10, 4) NOT NULL,
  source VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on date for better performance
CREATE INDEX IF NOT EXISTS idx_master_exchange_rates_date ON master_exchange_rates(date);

-- Insert default admin if not exists
INSERT INTO users (name, email, password, role)
SELECT 'Administrador', 'admin@sistema.com', '$2b$10$XKrHRPJhKvCdkNXhxK6Pz.4.6JVZQkH8V8KjzQQzxz7YzGQ6.Kj2q', 'admin'
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'admin@sistema.com'
);