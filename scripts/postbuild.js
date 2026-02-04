#!/usr/bin/env node

/**
 * Post-build script to run react-snap for prerendering
 * Skips react-snap if SKIP_REACT_SNAP environment variable is set to "true"
 */

const { spawn } = require('child_process');
const path = require('path');

// Check if react-snap should be skipped
if (process.env.SKIP_REACT_SNAP === 'true') {
  console.log('Skipping react-snap prerendering (SKIP_REACT_SNAP=true)');
  process.exit(0);
}

// Run react-snap
console.log('Running react-snap for prerendering...');
const reactSnapPath = path.join(__dirname, '..', 'node_modules', '.bin', 'react-snap');

const reactSnap = spawn(reactSnapPath, [], {
  stdio: 'inherit',
  shell: true
});

reactSnap.on('error', (error) => {
  console.error('Failed to start react-snap:', error);
  process.exit(1);
});

reactSnap.on('close', (code) => {
  if (code !== 0) {
    console.error(`react-snap exited with code ${code}`);
    process.exit(code);
  }
  console.log('react-snap completed successfully');
  process.exit(0);
});
