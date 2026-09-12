$ErrorActionPreference = 'Continue'
$p = Start-Process -FilePath 'python' -ArgumentList '-m','http.server','8932','--bind','127.0.0.1' -WorkingDirectory 'C:\Users\HOME\Documents\happy-birthday-nathalie-main' -PassThru -WindowStyle Hidden
Write-Output ("PID=" + $p.Id)
Start-Sleep -Milliseconds 900
try {
  $r = Invoke-WebRequest -Uri 'http://127.0.0.1:8932/index.html' -UseBasicParsing -TimeoutSec 4
  Write-Output ("HTTP " + [int]$r.StatusCode + " len=" + $r.Content.Length)
} catch {
  Write-Output ("ERR " + $_.Exception.Message)
}