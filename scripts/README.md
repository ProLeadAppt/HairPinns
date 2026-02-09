# Image Conversion Script

## Overview
This script converts all JPG/PNG images in `src/assets/` to WebP format for better performance and smaller file sizes.

## Setup

First, install the required dependency:

```bash
npm install -D sharp
```

## Usage

Run the conversion script:

```bash
npm run convert-images
```

## What it does

- **Scans** all JPG/PNG files in `src/assets/` (including subdirectories)
- **Converts** images to WebP format with 85% quality
- **Generates multiple sizes** for hero images (640w, 1280w, 1920w)
- **Skips** files that already have WebP versions
- **Reports** file size savings

## Output

- Original images are preserved
- WebP versions are created alongside originals
- Hero images get multiple size variants: `hero-name-640w.webp`, `hero-name-1280w.webp`, `hero-name-1920w.webp`
- Other images get single WebP version: `image-name.webp`

## Next Steps

After running the script:

1. Update component imports to use `.webp` files where appropriate
2. Test images in development to ensure they display correctly
3. Consider using the `OptimizedImage` component for responsive images
4. Commit converted images to version control

## Notes

- The script preserves the original file structure
- Images are optimized for web with quality set to 85%
- Hero images automatically get responsive size variants
- Existing WebP files are skipped to avoid re-processing

