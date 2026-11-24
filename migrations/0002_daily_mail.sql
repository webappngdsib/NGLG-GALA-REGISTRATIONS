CREATE TABLE IF NOT EXISTS daily_mail (
  day TEXT PRIMARY KEY,
  state TEXT NOT NULL CHECK (state IN ('pending', 'sent', 'failed'))
);
