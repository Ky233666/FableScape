param(
  [string]$CocosCreatorRoot = "D:\CocosCreator\3.8.6",
  [string]$TsConfig = "temp\tsconfig.check.json"
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$typescriptEntry = Join-Path $CocosCreatorRoot "resources\app.asar.unpacked\node_modules\typescript\lib\tsc.js"
$resolvedTsConfig = Join-Path $projectRoot $TsConfig

if (-not (Test-Path -LiteralPath $typescriptEntry)) {
  throw "Cannot find Cocos-bundled TypeScript at: $typescriptEntry"
}

if (-not (Test-Path -LiteralPath $resolvedTsConfig)) {
  throw "Cannot find TypeScript config at: $resolvedTsConfig"
}

Push-Location $projectRoot
try {
  node $typescriptEntry -p $resolvedTsConfig --noEmit
} finally {
  Pop-Location
}
