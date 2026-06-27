$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (-not (Test-Path "node_modules")) {
  Write-Host "Устанавливаю зависимости..."
  npm install
}

node convert.mjs @args
