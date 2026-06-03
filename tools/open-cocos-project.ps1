$ErrorActionPreference = "Stop"

$creator = "D:\CocosCreator\3.8.6\CocosCreator.exe"
$project = Split-Path -Parent $PSScriptRoot
$userData = "D:\CocosCreator\UserData"

if (-not (Test-Path -LiteralPath $creator)) {
  throw "Cocos Creator was not found at: $creator"
}

New-Item -ItemType Directory -Force -Path $userData | Out-Null

Start-Process -FilePath $creator -ArgumentList @("--user-data-dir=$userData", "--project", $project)
