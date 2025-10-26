CREATE TABLE IF NOT EXISTS simulation_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  challenge text NOT NULL,
  time_achieved numeric NOT NULL,
  grade text NOT NULL,
  timestamp bigint NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE simulation_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own results"
  ON simulation_results
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own results"
  ON simulation_results
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_simulation_results_user_id 
  ON simulation_results(user_id);

CREATE INDEX IF NOT EXISTS idx_simulation_results_timestamp 
  ON simulation_results(timestamp DESC);
