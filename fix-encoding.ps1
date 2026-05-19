# Fix double-encoded UTF-8 characters in HTML files
# All strings built from char codes - no special chars in source

$enc = [System.Text.Encoding]::UTF8

# Each entry: From (broken Unicode codepoints) -> To (correct codepoint)
# Broken sequences arise from: UTF-8 bytes read as cp1252, then re-saved as UTF-8

# --- 3-byte UTF-8 sequences starting with E2 (U+0800..U+FFFF range) ---
# en dash U+2013 (E2 80 93): cp1252 E2=U+00E2, 80=U+20AC, 93=U+201C
$bEnDash  = [string][char]0x00E2 + [char]0x20AC + [char]0x201C
$fEnDash  = [string][char]0x2013

# euro U+20AC (E2 82 AC): cp1252 E2=U+00E2, 82=U+201A, AC=U+00AC
$bEuro    = [string][char]0x00E2 + [char]0x201A + [char]0x00AC
$fEuro    = [string][char]0x20AC

# right single angle U+203A (E2 80 BA): cp1252 E2=U+00E2, 80=U+20AC, BA=U+00BA
$bRsaq    = [string][char]0x00E2 + [char]0x20AC + [char]0x00BA
$fRsaq    = [string][char]0x203A

# right single quote U+2019 (E2 80 99): cp1252 E2=U+00E2, 80=U+20AC, 99=U+2122
$bRsquo   = [string][char]0x00E2 + [char]0x20AC + [char]0x2122
$fRsquo   = [string][char]0x2019

# left double quote U+201C (E2 80 9C): cp1252 E2=U+00E2, 80=U+20AC, 9C=U+0153
$bLdquo   = [string][char]0x00E2 + [char]0x20AC + [char]0x0153
$fLdquo   = [string][char]0x201C

# black star U+2605 (E2 98 85): cp1252 E2=U+00E2, 98=U+02DC, 85=U+2026
$bStar    = [string][char]0x00E2 + [char]0x02DC + [char]0x2026
$fStar    = [string][char]0x2605

# --- 2-byte UTF-8 sequences starting with C2 or C3 ---
# superscript 2 U+00B2 (C2 B2): cp1252 C2=U+00C2, B2=U+00B2
$bSup2    = [string][char]0x00C2 + [char]0x00B2
$fSup2    = [string][char]0x00B2

# e-acute U+00E9 (C3 A9): cp1252 C3=U+00C3, A9=U+00A9
$bEAcute  = [string][char]0x00C3 + [char]0x00A9
$fEAcute  = [string][char]0x00E9

# e-diaeresis U+00EB (C3 AB): cp1252 C3=U+00C3, AB=U+00AB
$bEDia    = [string][char]0x00C3 + [char]0x00AB
$fEDia    = [string][char]0x00EB

# i-diaeresis U+00EF (C3 AF): cp1252 C3=U+00C3, AF=U+00AF
$bIDia    = [string][char]0x00C3 + [char]0x00AF
$fIDia    = [string][char]0x00EF

$htmlFiles = Get-ChildItem -Path "c:\Users\fatim\cleaning-company-website" -Filter "*.html"

foreach ($file in $htmlFiles) {
    $content = [System.IO.File]::ReadAllText($file.FullName, $enc)
    $original = $content

    $content = $content.Replace($bEnDash,  $fEnDash)
    $content = $content.Replace($bEuro,    $fEuro)
    $content = $content.Replace($bRsaq,    $fRsaq)
    $content = $content.Replace($bRsquo,   $fRsquo)
    $content = $content.Replace($bLdquo,   $fLdquo)
    $content = $content.Replace($bStar,    $fStar)
    $content = $content.Replace($bSup2,    $fSup2)
    $content = $content.Replace($bEAcute,  $fEAcute)
    $content = $content.Replace($bEDia,    $fEDia)
    $content = $content.Replace($bIDia,    $fIDia)

    if ($content -ne $original) {
        [System.IO.File]::WriteAllText($file.FullName, $content, $enc)
        Write-Host "Fixed: $($file.Name)"
    } else {
        Write-Host "No changes: $($file.Name)"
    }
}

Write-Host "Done."
