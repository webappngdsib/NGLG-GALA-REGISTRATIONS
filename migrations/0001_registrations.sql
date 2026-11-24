CREATE TABLE IF NOT EXISTS registrations (
  id INTEGER PRIMARY KEY,
  assembly TEXT NOT NULL,
  mobile TEXT NOT NULL,
  created TEXT NOT NULL,
  payload TEXT NOT NULL,
  UNIQUE (assembly, mobile)
);
