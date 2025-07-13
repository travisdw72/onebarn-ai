import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Demo videos to include in production build
const DEMO_VIDEOS = [
  'Horse with colic. Common behavior.mp4',
  'LAMENESS  LAB - CASE 2 - ASSESSMENT.mp4',
  'Mare & Foal Stall Cast Scare (Both are OK)!.mp4',
  'Black Tennessee Walking Horse Walking Tall.mp4'
]

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0', // Enable external access (equivalent to --host flag)
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    },
    fs: {
      allow: ['..'],
    }
  },
  build: {
    // Skip TypeScript checking during build for deployment
    rollupOptions: {
      external: [],
      onwarn(warning, warn) {
        // Skip TypeScript warnings during build
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
        if (warning.code === 'CIRCULAR_DEPENDENCY') return;
        warn(warning);
      },
      output: {
        assetFileNames: (assetInfo) => {
          // Keep original names for demo videos
          if (assetInfo.name && DEMO_VIDEOS.includes(assetInfo.name)) {
            return `assets/videos/[name].[ext]`;
          }
          return `assets/[name]-[hash].[ext]`;
        },
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@ant-design/icons', 'antd'],
          refine: ['@refinedev/core', '@refinedev/antd'],
        },
      },
    },
    // Production optimizations
    minify: 'terser',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    // Exclude test images and development files from build
    assetsInlineLimit: 0, // Don't inline any assets
    copyPublicDir: true,
    assetsDir: 'assets',
    // Custom function to exclude test data
    target: 'esnext'
  },
  // Exclude test images from build processing
  publicDir: 'public',
  assetsInclude: [
    // Essential assets
    '**/*.png',
    '**/*.jpg', 
    '**/*.jpeg',
    '**/*.svg',
    '**/*.gif',
    '**/*.ico',
    '**/*.webp',
    
    // Only include the 4 demo videos
    'Horse with colic. Common behavior.mp4',
    'LAMENESS  LAB - CASE 2 - ASSESSMENT.mp4',
    'Mare & Foal Stall Cast Scare (Both are OK)!.mp4',
    'Black Tennessee Walking Horse Walking Tall.mp4'
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  // Development server configuration
  optimizeDeps: {
    exclude: ['docs', 'scripts', 'tools']
  },
  esbuild: {
    // Disable TypeScript checking in esbuild
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  define: {
    // Production environment variables
    'process.env': {}
  }
})
