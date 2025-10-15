-- RLS Policies for projects table
CREATE POLICY "Users can view their own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for analysis_results table
CREATE POLICY "Users can view analysis results for their projects"
  ON public.analysis_results FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = analysis_results.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert analysis results for their projects"
  ON public.analysis_results FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = analysis_results.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- RLS Policies for conversion_results table
CREATE POLICY "Users can view conversion results for their projects"
  ON public.conversion_results FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = conversion_results.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert conversion results for their projects"
  ON public.conversion_results FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = conversion_results.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- RLS Policies for test_results table
CREATE POLICY "Users can view test results for their projects"
  ON public.test_results FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = test_results.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert test results for their projects"
  ON public.test_results FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = test_results.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update test results for their projects"
  ON public.test_results FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = test_results.project_id
      AND projects.user_id = auth.uid()
    )
  );
