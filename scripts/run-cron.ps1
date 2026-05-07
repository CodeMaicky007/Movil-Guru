# Dispara los workers de automatización contra el server local.
# Uso:
#   .\scripts\run-cron.ps1
#
# Lee CRON_SECRET de .env.local automáticamente.

$ErrorActionPreference = 'Stop'

# --- Cargar CRON_SECRET de .env.local ---------------------------------------
$envFile = Join-Path $PSScriptRoot '..\.env.local'
if (-not (Test-Path $envFile)) {
  Write-Error "No encuentro .env.local en $envFile"
  exit 1
}

$secret = $null
Get-Content $envFile | ForEach-Object {
  if ($_ -match '^\s*CRON_SECRET\s*=\s*(.+?)\s*$') {
    $secret = $Matches[1].Trim('"').Trim("'")
  }
}
if (-not $secret) {
  Write-Error "CRON_SECRET no está definido en .env.local"
  exit 1
}

$base    = 'http://localhost:3000'
$headers = @{ Authorization = "Bearer $secret" }

function Tick($name, $path) {
  Write-Host "→ $name" -ForegroundColor Cyan
  try {
    $r = Invoke-RestMethod -Uri "$base$path" -Headers $headers -TimeoutSec 30
    $r | ConvertTo-Json -Compress | Write-Host -ForegroundColor Green
  } catch {
    Write-Host "  ERROR: $($_.Exception.Message)" -ForegroundColor Red
  }
}

Tick 'events       ' '/api/cron/process-events'
Tick 'notifications' '/api/cron/process-notifications'
