$components = Get-ChildItem -Path "source\components" -Directory
$needsReadme = @()
$hasReadme = @()

foreach ($component in $components) {
    $readmePath = Join-Path -Path $component.FullName -ChildPath "README.md"
    if (Test-Path $readmePath) {
        $hasReadme += $component.Name
    } else {
        $needsReadme += $component.Name
    }
}

Write-Host "Components with README.md ($($hasReadme.Count)):"
$hasReadme | ForEach-Object { Write-Host "- $_" }

Write-Host "`nComponents needing README.md ($($needsReadme.Count)):"
$needsReadme | ForEach-Object { Write-Host "- $_" }