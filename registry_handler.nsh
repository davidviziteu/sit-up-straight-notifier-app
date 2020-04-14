Section "install"
    WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Run" "sit.up.straight.notifier.app" '"$InstDir\dont break your back.exe" --hidden'
SectionEnd
Section "Uninstall"
    DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Run" "sit.up.straight.notifier.app"
SectionEnd