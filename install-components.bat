@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

REM Components
set components=accordion alert alert-dialog aspect-ratio avatar badge button breadcrumb card chart checkbox collapsible command context-menu dialog drawer dropdown-menu form hover-card input input-otp label menubar navigation-menu popover progress radio-group scroll-area switch sonner select separator sheet skeleton slider switch table tabs textarea toggle toggle-group tooltip

REM Loop through each component and install it
for %%c in (%components%) do (
    echo Installing %%c...
    echo yes | bunx --bun shadcn@latest add %%c
    echo %%c installed!
)

echo All components installed successfully!
@REM Run this script using the command:
@REM install-components.bat

@REM Better to do the following for faster installs:
@REM bunx --bun shadcn@latest add accordion alert alert-dialog aspect-ratio avatar badge button breadcrumb card chart checkbox collapsible command context-menu dialog drawer dropdown-menu form hover-card input input-otp label menubar navigation-menu popover progress radio-group scroll-area switch sonner select separator sheet skeleton slider switch table tabs textarea toggle toggle-group tooltip