# Axium Lovelace Card\n\nA custom Lovelace card for Home Assistant to display and control Axium amplifier zones.

## Installation

1. Download `axium-card.js` from this repository
2. Copy the file to your Home Assistant `/config/www/` directory
3. Add the following to your Lovelace resources:

```yaml
resources:
  - url: /local/axium-card.js?v=20250302
    type: module
```

**Important**: Always include a version parameter (`?v=20250302`) in the resource URL. This prevents Firefox and other browsers from caching the file and ensures you're always using the latest version. Update this version number whenever you update the JS file.

## Configuration

Add to your Lovelace dashboard:

```yaml
type: 'custom:axium-card'
title: 'My Axium Amplifier'
zones:
  - living_room
  - kitchen
  - master_bedroom
```

## Troubleshooting

If the card doesn't update after making changes:

1. Update the version number in your resource URL (e.g., change `?v=20250302` to `?v=20250303`)
2. Perform a hard refresh in your browser (Ctrl+Shift+R in Firefox)
3. Clear your browser cache
4. Try using a different browser (Edge/Chrome) if Firefox continues to use cached files
