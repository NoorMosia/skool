registerLecture({
  id: "01",
  title: "L01: Intro to Android",
  blurb: "Platform architecture, lifecycle, manifest, activities, resources, intents, deployment.",
  questions: [
    // ---- MCQ ----
    {
      type: "mcq",
      prompt: "Which component sits at the very bottom of the Android platform architecture, interfacing directly with hardware?",
      options: ["Android Runtime (ART)", "The Linux kernel", "The Hardware Abstraction Layer (HAL)", "The Java API Framework"],
      answer: 1,
      explanation: "The Linux kernel interfaces with hardware and provides security, threading and low-level memory management."
    },
    {
      type: "mcq",
      prompt: "What does the Hardware Abstraction Layer (HAL) provide?",
      options: ["A virtual machine to run apps", "Hardware independence", "The UI framework", "Permission management"],
      answer: 1,
      explanation: "The HAL exists for hardware independence."
    },
    {
      type: "mcq",
      prompt: "In the ART model (Android 5.0+), when is an app compiled to the device's machine code?",
      options: ["Every time it is launched", "At installation time", "When the source is written", "Never — it stays as Dalvik bytecode"],
      answer: 1,
      explanation: "With ART, an app is compiled directly to the device's machine code at installation time: slower install, more storage, but faster running."
    },
    {
      type: "mcq",
      prompt: "An Activity is best described as:",
      options: ["A background service with no UI", "A single \"task\" of an application", "The manifest entry point", "A reusable UI fragment"],
      answer: 1,
      explanation: "An Activity is a single \"task\" of an application, e.g. select a contact, type an SMS, perform a search."
    },
    {
      type: "mcq",
      prompt: "How would you retrieve the app name string resource in code?",
      options: ["`getString(R.string.app_name)`", "`@string/app_name`", "`R.layout.app_name`", "`findViewById(R.string.app_name)`"],
      answer: 0,
      explanation: "In code: `String s = getString(R.string.app_name);`. The `@string/app_name` form is used in XML."
    },
    {
      type: "mcq",
      prompt: "With an explicit Intent, how is the Activity that handles it determined?",
      options: ["Android decides the best app and Activity", "The Activity class is explicitly given", "The user is always prompted to choose", "By the intent category only"],
      answer: 1,
      explanation: "Explicit: the Activity class to handle the Intent is explicitly given and must be registered in the manifest. Implicit lets Android decide."
    },

    // ---- Multi-select ----
    {
      type: "multi",
      prompt: "Which of the following are part of the Android ecosystem as described in the lecture?",
      options: [
        "A free, open source OS for embedded systems",
        "An open source development platform for creating applications",
        "Devices that run Android OS & applications",
        "A proprietary, closed-source kernel"
      ],
      answers: [0, 1, 2],
      explanation: "Android is an ecosystem of a free open-source OS, an open-source development platform, and devices that run it. The kernel is not proprietary/closed."
    },
    {
      type: "multi",
      prompt: "What can Intents be used to do?",
      options: [
        "Change to other Activities (screens) in the same application",
        "Call Activities from other applications (e.g. initiate a phone call)",
        "Obtain results from other applications (e.g. get a photo from the camera)",
        "Compile the app to machine code"
      ],
      answers: [0, 1, 2],
      explanation: "Intents switch screens, call other apps' activities, obtain results, override default intents, and expose activities. Compilation is unrelated."
    },
    {
      type: "multi",
      prompt: "The AndroidManifest.xml describes which of the following?",
      options: [
        "Where the entry point of the application is",
        "What is required by the application to function (permissions, hardware, versions)",
        "What intents the application can respond to",
        "The exact pixel colours of each button"
      ],
      answers: [0, 1, 2],
      explanation: "The manifest describes the entry point, requirements, and intents handled. Visual styling lives in resources, not the manifest."
    },
    {
      type: "multi",
      prompt: "Which are listed as hints for using Activities?",
      options: [
        "Should be self-contained",
        "Use layout managers",
        "Split into Fragments if you want to reuse in another Activity's UI",
        "Always create Views in code rather than XML"
      ],
      answers: [0, 1, 2],
      explanation: "Hints: self-contained, use layout managers, split into Fragments for reuse, use resources. Views are typically NOT created in code."
    },

    // ---- True / False ----
    {
      type: "tf",
      prompt: "Prior to Android 5.0, apps ran on a virtual machine called Dalvik.",
      answer: true,
      explanation: "Correct. Dalvik was the VM used before ART was introduced officially in Android 5.0."
    },
    {
      type: "tf",
      prompt: "Resources such as images, strings and GUI layouts are stored in the /src folder.",
      answer: false,
      explanation: "They are stored under the /res folder, in external files."
    },
    {
      type: "tf",
      prompt: "Views are typically created in code rather than described in an XML layout.",
      answer: false,
      explanation: "Views are typically NOT created in code; they are described in an XML layout (like FXML)."
    },
    {
      type: "tf",
      prompt: "A slow-responding application can be terminated by Android after a short period of time (around 5 seconds).",
      answer: true,
      explanation: "Correct. The application is responsible for remembering the state of variables/GUI, etc."
    },

    // ---- Fill in the blank ----
    {
      type: "fill",
      prompt: "The runtime that runs apps from Android 5.0 onwards is abbreviated {{blank}}.",
      blanks: [["ART", "Android Runtime"]],
      explanation: "ART = Android Runtime, introduced officially in Android 5.0."
    },
    {
      type: "fill",
      prompt: "Starting an Activity with an Intent can be done two ways: an {{blank}} intent names the target Activity directly, while an {{blank}} intent lets Android decide who handles it.",
      blanks: [["explicit"], ["implicit"]],
      explanation: "Explicit = target given directly; Implicit = Android chooses the handler based on the intent type."
    }
  ]
});
