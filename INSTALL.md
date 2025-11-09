# Elite XSS Framework Installation Guide

## Prerequisites

1. **Tampermonkey Extension**: Install Tampermonkey for your browser:
   - [Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)

2. **Web Browser**: Any modern browser (Chrome, Firefox, Edge, Safari)

## Installation Steps

### Method 1: Direct Installation (Recommended)

1. **Navigate to the GitHub Repository**:
   - Go to: https://github.com/Nevrkin/My-XSS

2. **Copy the Loader Script**:
   - Open `loader.user.js` file
   - Click "Raw" button to view the raw code
   - Copy the entire content (Ctrl+A, Ctrl+C)

3. **Create New Tampermonkey Script**:
   - Click on Tampermonkey icon in your browser
   - Select "Create a new script..."
   - Delete all existing content
   - Paste the copied content (Ctrl+V)

4. **Save the Script**:
   - Press `Ctrl+S` or click File → Save
   - The script will be automatically enabled

### Method 2: Local Development

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Nevrkin/My-XSS.git
   cd My-XSS
   ```

2. **Load Local Files**:
   - In Tampermonkey dashboard, create a new script
   - Replace the `@require` metadata with local file paths
   - Or modify the loader to load local files

## Usage Instructions

1. **Access the Framework**:
   - Navigate to any website
   - Press `Ctrl+Shift+X` to open the dashboard
   - The Elite XSS Framework interface will appear

2. **Configure Settings**:
   - Click on "Settings" to configure scan parameters
   - Adjust testing profiles, payloads, and detection methods
   - Enable/disable specific modules as needed

3. **Run Tests**:
   - Use "Quick Test" (Ctrl+Shift+T) for immediate testing
   - Or configure a full scan in the dashboard
   - Monitor results in real-time

## Keyboard Shortcuts

- `Ctrl+Shift+X` - Toggle Dashboard
- `Ctrl+Shift+T` - Quick Test
- `Ctrl+Shift+S` - Toggle Safe Mode

## Troubleshooting

### Common Issues

1. **Framework Not Loading**:
   - Check Tampermonkey is enabled
   - Verify all `@grant` permissions are allowed
   - Refresh the page

2. **Modules Not Loading**:
   - Check internet connection
   - Verify GitHub repository is accessible
   - Clear Tampermonkey cache

3. **UI Not Appearing**:
   - Check for JavaScript errors in console (F12)
   - Ensure no ad blockers are interfering
   - Try disabling other userscripts

### Debugging

1. **Enable Debug Mode**:
   - Open browser console (F12)
   - Look for `[Elite XSS]` log messages
   - Check for error messages

2. **Check Module Loading**:
   - Console will show loading progress
   - Each module will report initialization status

## Updating

### Automatic Updates

The framework automatically checks for updates and caches modules for 1 hour.

### Manual Update

1. **Update from GitHub**:
   - Tampermonkey will automatically check for updates
   - Or manually update by reinstalling the loader script

2. **Clear Cache**:
   - In Tampermonkey dashboard, clear storage
   - Or set `hotReload: true` in CONFIG for development

## Security Considerations

⚠️ **Important**: This tool is for authorized security testing only.

1. **Authorized Testing Only**:
   - Only test websites you own or have explicit permission to test
   - Comply with all applicable laws and regulations

2. **Safe Mode**:
   - Enable Safe Mode for non-intrusive testing
   - Use appropriate testing profiles for different scenarios

3. **Data Privacy**:
   - Results are stored locally in browser storage
   - No data is sent to external servers unless configured

## Support

For issues, questions, or feature requests:
1. Check existing GitHub issues
2. Open a new issue with detailed information
3. Include browser version and error messages