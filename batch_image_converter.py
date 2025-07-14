#!/usr/bin/env python3
"""
Batch Image Converter - TIFF to High-Quality JPEG
Preserves original files while creating JPEG copies
"""

import os
import sys
from PIL import Image
from pathlib import Path
import argparse

def convert_tiff_to_jpeg(input_folder, output_folder=None, quality=95):
    """
    Convert all TIFF files in a folder to high-quality JPEG copies
    
    Args:
        input_folder (str): Path to folder containing TIFF files
        output_folder (str): Path to output folder (optional, defaults to input_folder/jpeg_copies)
        quality (int): JPEG quality (1-100, default 95 for high quality)
    """
    
    # Setup paths
    input_path = Path(input_folder)
    if not input_path.exists():
        print(f"Error: Input folder '{input_folder}' does not exist")
        return
    
    # Default output folder
    if output_folder is None:
        output_path = input_path / "jpeg_copies"
    else:
        output_path = Path(output_folder)
    
    # Create output folder if it doesn't exist
    output_path.mkdir(parents=True, exist_ok=True)
    
    # Find all TIFF files
    tiff_extensions = ['.tif', '.tiff', '.TIF', '.TIFF']
    tiff_files = []
    
    for ext in tiff_extensions:
        tiff_files.extend(input_path.glob(f"*{ext}"))
    
    if not tiff_files:
        print(f"No TIFF files found in '{input_folder}'")
        return
    
    print(f"Found {len(tiff_files)} TIFF files")
    print(f"Converting to JPEG with quality {quality}")
    print(f"Output folder: {output_path}")
    print("-" * 50)
    
    # Convert each file
    converted_count = 0
    error_count = 0
    
    for i, tiff_file in enumerate(tiff_files, 1):
        try:
            # Open the TIFF image
            with Image.open(tiff_file) as img:
                # Convert to RGB if necessary (JPEG doesn't support transparency)
                if img.mode in ('RGBA', 'LA', 'P'):
                    # Create white background for transparent images
                    rgb_img = Image.new('RGB', img.size, (255, 255, 255))
                    if img.mode == 'P':
                        img = img.convert('RGBA')
                    rgb_img.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
                    img = rgb_img
                elif img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Create output filename
                output_filename = output_path / f"{tiff_file.stem}.jpg"
                
                # Save as high-quality JPEG
                img.save(
                    output_filename,
                    'JPEG',
                    quality=quality,
                    optimize=True,
                    progressive=True
                )
                
                converted_count += 1
                print(f"[{i}/{len(tiff_files)}] ✅ {tiff_file.name} → {output_filename.name}")
                
        except Exception as e:
            error_count += 1
            print(f"[{i}/{len(tiff_files)}] ❌ Error converting {tiff_file.name}: {str(e)}")
    
    print("-" * 50)
    print(f"Conversion complete!")
    print(f"✅ Successfully converted: {converted_count} files")
    if error_count > 0:
        print(f"❌ Errors encountered: {error_count} files")
    print(f"📁 Output location: {output_path}")
    print(f"📂 Original TIFF files remain untouched in: {input_path}")

def main():
    parser = argparse.ArgumentParser(description="Convert TIFF files to high-quality JPEG copies")
    parser.add_argument("input_folder", help="Folder containing TIFF files")
    parser.add_argument("-o", "--output", help="Output folder (default: input_folder/jpeg_copies)")
    parser.add_argument("-q", "--quality", type=int, default=95, choices=range(1, 101),
                       help="JPEG quality 1-100 (default: 95)")
    
    args = parser.parse_args()
    
    convert_tiff_to_jpeg(args.input_folder, args.output, args.quality)

if __name__ == "__main__":
    main() 