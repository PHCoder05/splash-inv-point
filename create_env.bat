@echo off
echo Creating .env file with Supabase credentials...
(
echo # Supabase Configuration for AquaManager
echo # These are the actual values for the application
echo.
echo VITE_SUPABASE_URL=https://fxtmosoldtnzvtrntdjj.supabase.co
echo VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4dG1vc29sZHRuenZ0cm50ZGpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDA5MzYsImV4cCI6MjA2OTIxNjkzNn0.v3s7MyySzHCEeMc7pJ5CIaVBlPe_W-jq_MIvltpj8f4
echo.
echo # Database Information:
echo # Project: fun-world-park
echo # Region: ap-southeast-1
echo # Database Host: db.fxtmosoldtnzvtrntdjj.supabase.co
) > .env
echo .env file created successfully!
pause
