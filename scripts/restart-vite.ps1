$ErrorActionPreference = 'Continue'
$root = 'c:\Users\hp187\CodeBuddy\20260919134636'
Set-Location $root
# Kill anything on 5173 or 8443
foreach ($p in 5173, 8443) {
  Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue |
    Where-Object { $_.LocalPort -eq $p } |
    ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
}
Start-Sleep -Seconds 1
$logOut = Join-Path $root 'vite-dev.out'
$logErr = Join-Path $root 'vite-dev.err'
if (Test-Path $logOut) { Remove-Item $logOut -Force -ErrorAction SilentlyContinue }
if (Test-Path $logErr) { Remove-Item $logErr -Force -ErrorAction SilentlyContinue }
# Start vite on default port 5173, bound to all interfaces so LAN phones can hit it too
$cmd = 'npm run dev -- --host 0.0.0.0 --port 5173 --strictPort > "vite-dev.out" 2> "vite-dev.err"'
Start-Process -FilePath 'cmd.exe' -ArgumentList '/c', $cmd -WorkingDirectory $root -WindowStyle Hidden
Start-Sleep -Seconds 10
Write-Host '=== stdout ==='
if (Test-Path $logOut) { Get-Content $logOut -Tail 15 } else { Write-Host '(no stdout file)' }
Write-Host '=== stderr ==='
if (Test-Path $logErr) { Get-Content $logErr -Tail 10 } else { Write-Host '(no stderr file)' }
Write-Host '=== listening ==='
Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue |
  Where-Object { $_.LocalPort -eq 5173 } |
  Format-Table LocalAddress,LocalPort,OwningProcess -AutoSize
Write-Host '=== test 127.0.0.1:5173 ==='
Test-NetConnection 127.0.0.1 -Port 5173 -InformationLevel Quiet