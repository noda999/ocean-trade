# Pack a build directory into a Xiaohongshu mini-tool zip.
#
# Why this script exists: Windows PowerShell's Compress-Archive writes "\"
# as the entry separator, which the platform rejects with
# "detected unsafe file path ... must not use \ as separator".
# The zips it produces are also non-standard, so other tooling may misread
# them. This script uses .NET ZipArchive and sets every entry name explicitly
# with "/" separators, then verifies the result before declaring success.
#
# Usage: powershell -NoProfile -ExecutionPolicy Bypass -File scripts/pack-xhs.ps1

param(
    [string]$Source = "dist-xhs",
    [string]$Output = "ocean-trade-minitool.zip"
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$root = (Resolve-Path $Source).Path
$outPath = Join-Path (Get-Location).Path $Output

if (Test-Path $outPath) { Remove-Item $outPath -Force }

$fs = [System.IO.File]::Open($outPath, [System.IO.FileMode]::CreateNew)
try {
    $zip = New-Object System.IO.Compression.ZipArchive($fs, [System.IO.Compression.ZipArchiveMode]::Create)
    try {
        Get-ChildItem $root -Recurse -File | Where-Object {
            # 小红书白名单禁止 mp3/音频，打包时剔除 audio/（游戏会自动回落合成器 BGM）
            $_.FullName.Substring($root.Length + 1).Replace('\', '/') -notmatch '^audio/'
        } | Sort-Object FullName | ForEach-Object {
            $relative = $_.FullName.Substring($root.Length + 1).Replace('\', '/')
            $entry = $zip.CreateEntry($relative, [System.IO.Compression.CompressionLevel]::Optimal)
            $stream = $entry.Open()
            try {
                $bytes = [System.IO.File]::ReadAllBytes($_.FullName)
                $stream.Write($bytes, 0, $bytes.Length)
            } finally {
                $stream.Dispose()
            }
        }
    } finally {
        $zip.Dispose()
    }
} finally {
    $fs.Dispose()
}

# Verify: entries must use "/", must not start with "/", must not contain "..".
$verify = [System.IO.Compression.ZipFile]::OpenRead($outPath)
try {
    $unsafe = @()
    foreach ($entry in $verify.Entries) {
        $name = $entry.FullName
        if ($name.Contains('\') -or $name.StartsWith('/') -or $name.Contains('..')) {
            $unsafe += $name
        }
    }
    $listing = $verify.Entries | Select-Object FullName, Length | Format-Table -AutoSize | Out-String
    Write-Host $listing.TrimEnd()
} finally {
    $verify.Dispose()
}

if ($unsafe.Count -gt 0) {
    throw "Unsafe entry path(s) found: $($unsafe -join ', ')"
}

$size = (Get-Item $outPath).Length
Write-Host ("OK: {0} -> {1} ({2:N0} bytes / {3:N1} KiB)" -f $Source, $Output, $size, ($size / 1KB))
