registerLecture({
  id: "11",
  title: "L11: Multimedia",
  blurb: "Supported formats, the media player, VideoView, and frame-based animation.",
  questions: [
    // ---- MCQ ----
    {
      type: "mcq",
      prompt: "What does the media player play back?",
      options: ["Only audio", "Only video", "Audio & video", "Only images"],
      answer: 2,
      explanation: "The media player plays back both audio & video."
    },
    {
      type: "mcq",
      prompt: "Because there is a limited number of simultaneous media players, what MUST you call when done?",
      options: ["`stop()`", "`release()`", "`finish()`", "`close()`"],
      answer: 1,
      explanation: "You MUST call release() when done, since only a limited number of simultaneous media players exist."
    },
    {
      type: "mcq",
      prompt: "What is frame-based animation?",
      options: [
        "Playing a sequence of images one after another to produce the illusion of motion",
        "Streaming video from a server",
        "Rendering 3D models in real time",
        "Compressing audio into frames"
      ],
      answer: 0,
      explanation: "Frame-based animation plays a sequence of images one after the other, producing the illusion of motion."
    },
    {
      type: "mcq",
      prompt: "Which component has built-in stop/play/pause buttons for a VideoView?",
      options: ["MediaController", "MediaPlayer", "SurfaceView", "Canvas"],
      answer: 0,
      explanation: "A MediaController (optional) provides stop, play, pause, etc. buttons for a VideoView."
    },

    // ---- Multi-select ----
    {
      type: "multi",
      prompt: "Which audio formats are listed as supported (Android 4.0.3+)?",
      options: ["MP3", "MIDI", "Ogg Vorbis", "H.264 AVC"],
      answers: [0, 1, 2],
      explanation: "Audio: MP3, MIDI, Ogg Vorbis, PCM/Wave. H.264 AVC is a video format."
    },
    {
      type: "multi",
      prompt: "Which video formats are listed as supported?",
      options: ["H.263", "H.264 AVC", "MPEG-4 SP", "PNG"],
      answers: [0, 1, 2],
      explanation: "Video: H.263, H.264 AVC, MPEG-4 SP. PNG is an image format."
    },
    {
      type: "multi",
      prompt: "The typical media player procedure includes which of the following?",
      options: [
        "Initialise the media player with media to play",
        "Prepare the media player for playback",
        "Start playback",
        "Compile the media into machine code"
      ],
      answers: [0, 1, 2],
      explanation: "Initialise, prepare, start playback (then pause/stop or complete). There is no compilation step."
    },

    // ---- True / False ----
    {
      type: "tf",
      prompt: "If streaming media, the app needs the INTERNET permission.",
      answer: true,
      explanation: "Correct. Streaming requires `<uses-permission android:name=\"android.permission.INTERNET\"/>`."
    },
    {
      type: "tf",
      prompt: "JPEG, PNG, GIF and BMP are listed as supported image formats.",
      answer: true,
      explanation: "Correct. The supported image formats are JPEG, PNG, GIF and BMP."
    },

    // ---- Fill in the blank ----
    {
      type: "fill",
      prompt: "To play video, you set up a `{{blank}}` on the layout and attach it so it knows what to play.",
      blanks: [["VideoView"]],
      explanation: "A VideoView is placed on the layout and attached to the media source, optionally with a MediaController."
    }
  ]
});
