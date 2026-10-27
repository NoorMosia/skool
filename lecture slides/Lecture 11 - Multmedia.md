# Lecture 11: Multimedia

Topics: playing sound, playing video, frame-based animation.

## Formats (Android 4.0.3+)

- **Audio:** MP3, MIDI, Ogg Vorbis, PCM/Wave
- **Images:** JPEG, PNG, GIF, BMP
- **Video:** H.263, H.264 AVC, MPEG-4 SP
- **Streaming media:** RTSP, HTTP/HTTPS progressive & live streaming

## Media player

- Plays back audio & video
- Typical procedure:
  - Initialise the media player with media to play
  - Prepare the media player for playback
  - Start playback
  - Pause/stop prior to completing, or playback completes
- If streaming, then permission is needed:
  - `<uses-permission android:name="android.permission.INTERNET"/>`
- There is a limited number of simultaneous media players, so you MUST call `release()` when done

## Playing video using VideoView

- [Optional] Set up the VideoView on the layout
- Attach the VideoView to know what to play
- [Optional] Place a MediaController (has stop, play, pause, etc. buttons)
- Start playing the video automatically
- [Optional] Attach event listeners

## Frame-based animation

- Play a sequence of images one after the other
- Produces the illusion of motion
- Reference: https://developer.android.com/develop/ui/views/animations/overview
