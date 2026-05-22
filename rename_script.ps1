param (
    [string]$path = "."
)

# 1. Rename Solution File
$slnFile = Get-Item (Join-Path $path "PhucCMS_Solution.sln") -ErrorAction SilentlyContinue
if ($slnFile) {
    Rename-Item $slnFile.FullName -NewName "DoanCMS_Solution.sln"
    Write-Host "Renamed Solution file to DoanCMS_Solution.sln"
}

# 2. Find and Replace strings in files
$files = Get-ChildItem -Path $path -Recurse -Include *.cs,*.cshtml,*.json,*.csproj,*.sln -File | Where-Object { 
    $_.FullName -notmatch "\\bin\\" -and 
    $_.FullName -notmatch "\\obj\\" -and 
    $_.FullName -notmatch "\\.vs\\" -and
    $_.FullName -notmatch "\\asp-net-main\\"
}

$changedFiles = @()

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content

    # Order is important.
    # First replace exact full name
    $content = $content -replace "Phạm Văn Quỳnh Phúc", "Trần Văn Đoàn"
    $content = $content -replace "Phạm Văn Quỳnh Phúc".ToUpper(), "Trần Văn Đoàn".ToUpper()
    
    # Then PhucCMS
    $content = $content -creplace "PhucCMS", "DoanCMS"
    $content = $content -creplace "phuccms", "doancms"
    $content = $content -creplace "PHUCCMS", "DOANCMS"

    # Then Phuc
    $content = $content -creplace "Phuc", "Doan"
    $content = $content -creplace "phuc", "doan"
    $content = $content -creplace "PHUC", "DOAN"

    if ($content -cne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $changedFiles += $file.FullName
    }
}

$changedFiles | ConvertTo-Json
