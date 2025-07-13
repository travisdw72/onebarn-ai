const fs = require('fs');
const path = require('path');

// Videos to preserve in production build - The 4 core demo videos
const PRESERVE_VIDEOS = [
  'Horse_colic_common_behavior.mp4',
  'Lameness_Lab_2.mp4',
  'horse_casting_scare.mp4',
  'Black_Tennessee_Walking_Horse.mp4'
];

console.log('🧹 Post-build cleanup: Removing test images and preserving selected videos...');

const distDir = path.join(__dirname, '../dist');
const testImagesDir = path.join(distDir, 'images/frames');
const randomizeTestDir = path.join(distDir, 'images/randomize-test');

// Function to remove directory and log results
function removeDirectory(dirPath, name) {
  if (fs.existsSync(dirPath)) {
    const fileCount = countFilesRecursive(dirPath);
    const sizeInMB = getDirSizeInMB(dirPath);
    
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`✅ Removed ${name}: ${fileCount} files (~${sizeInMB}MB)`);
    return { files: fileCount, sizeMB: sizeInMB };
  } else {
    console.log(`⏭️  ${name} not found - already excluded`);
    return { files: 0, sizeMB: 0 };
  }
}

// Function to selectively remove video files while preserving specified ones
function cleanupVideos(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log('📁 No dist directory found');
    return { removed: 0, totalSize: 0, preserved: 0, preservedSize: 0 };
  }

  const videoExtensions = ['.mp4', '.avi', '.mov', '.mkv', '.wmv', '.flv', '.webm'];
  
  let removedCount = 0;
  let removedSize = 0;
  let preservedCount = 0;
  let preservedSize = 0;

  function processVideosRecursive(currentDir) {
    const items = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const item of items) {
      const itemPath = path.join(currentDir, item.name);
      
      if (item.isDirectory()) {
        processVideosRecursive(itemPath);
      } else {
        const ext = path.extname(item.name).toLowerCase();
        if (videoExtensions.includes(ext)) {
          const fileSize = fs.statSync(itemPath).size;
          const sizeInMB = (fileSize / (1024 * 1024)).toFixed(2);
          
          if (PRESERVE_VIDEOS.includes(item.name)) {
            preservedCount++;
            preservedSize += fileSize;
            console.log(`📹 Preserved: ${item.name} (${sizeInMB}MB)`);
          } else {
            fs.unlinkSync(itemPath);
            removedCount++;
            removedSize += fileSize;
            console.log(`🗑️  Removed: ${item.name} (${sizeInMB}MB)`);
          }
        }
      }
    }
  }
  
  processVideosRecursive(dirPath);
  
  return { 
    removed: removedCount, 
    totalSize: removedSize,
    preserved: preservedCount,
    preservedSize: preservedSize
  };
}

// Function to count files recursively
function countFilesRecursive(dir) {
  let count = 0;
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      if (item.isDirectory()) {
        count += countFilesRecursive(path.join(dir, item.name));
      } else {
        count++;
      }
    }
  } catch (err) {
    // Directory doesn't exist or can't be read
  }
  return count;
}

// Function to get directory size in MB
function getDirSizeInMB(dir) {
  let size = 0;
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const itemPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        size += getDirSizeInMB(itemPath);
      } else {
        size += fs.statSync(itemPath).size;
      }
    }
  } catch (err) {
    // Directory doesn't exist or can't be read
  }
  return Math.round(size / (1024 * 1024));
}

// Get initial dist size
const initialSize = getDirSizeInMB(distDir);
const initialFiles = countFilesRecursive(distDir);

console.log(`📊 Initial dist size: ${initialFiles} files (~${initialSize}MB)`);

// Remove test directories
const framesRemoved = removeDirectory(testImagesDir, 'Test frames');
const randomizeRemoved = removeDirectory(randomizeTestDir, 'Randomize test images');

// Process videos (remove unwanted, preserve selected)
const videoResults = cleanupVideos(distDir);
console.log(`\n📊 Video cleanup summary:`);
console.log(`   • Preserved: ${videoResults.preserved} videos (${(videoResults.preservedSize / (1024 * 1024)).toFixed(2)}MB)`);
console.log(`   • Removed: ${videoResults.removed} videos (${(videoResults.totalSize / (1024 * 1024)).toFixed(2)}MB)`);

// Calculate final stats
const finalSize = getDirSizeInMB(distDir);
const finalFiles = countFilesRecursive(distDir);
const savedSize = initialSize - finalSize;
const savedFiles = initialFiles - finalFiles;

console.log('\n🎉 Cleanup complete!');
console.log(`📊 Final dist size: ${finalFiles} files (~${finalSize}MB)`);
console.log(`💾 Space saved: ${savedFiles} files (~${savedSize}MB)`);
console.log(`📈 Size reduction: ${Math.round((savedSize/initialSize)*100)}%`);

if (savedSize > 50) {
  console.log('🚀 Build is now optimized for fast deployment!');
} else {
  console.log('ℹ️  No significant test data found in build');
}

// List the preserved videos for confirmation
if (videoResults.preserved > 0) {
  console.log(`\n📹 Demo videos included in build:`);
  console.log(`   • Colic: Horse_colic_common_behavior.mp4`);
  console.log(`   • Lameness: Lameness_Lab_2.mp4`);
  console.log(`   • Casting: horse_casting_scare.mp4`);
  console.log(`   • Gait: Black_Tennessee_Walking_Horse.mp4`);
} 