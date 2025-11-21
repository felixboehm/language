  1. Add progress tracking UI to lesson pages (useProgress is ready)
  2. Add ProgressIndicator to LessonsOverview
  3. Update tests to TypeScript
  4. add unit tests for new services


  iOS Lock Screen Support: The current implementation uses Web Speech API directly, which doesn't provide true background audio on iOS. For full iOS
  lock screen support with media controls, you would need to:
  - Use MediaRecorder API to capture Web Speech API output as blobs
  - Feed those blobs to an <audio> element
  - Set proper MediaSession API metadata

  This is a more complex implementation that requires additional testing on iOS devices. The current implementation will work on desktop and will read
  audio on mobile, but may pause when the screen locks.



fix audio: when pressing pause, and then play again, it starts from lesson beginning instead of where we paused. should continue where we paused

