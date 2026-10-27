registerLecture({
  id: "03",
  title: "L03: Permissions, Files & Styles",
  blurb: "Permissions model, shared preferences, file storage, instance state, exception handling, styles & themes.",
  questions: [
    // ---- MCQ ----
    {
      type: "mcq",
      prompt: "Since Android 6.0 (API 23), when are dangerous permissions requested?",
      options: ["At install time only", "At runtime", "At compile time", "Never — they are always granted"],
      answer: 1,
      explanation: "Since Android 6.0, permissions are requested at runtime, giving the user a chance to grant or revoke selectively."
    },
    {
      type: "mcq",
      prompt: "Which method obtains a SharedPreferences object named \"my_prefs\"?",
      options: [
        "`getPreferences(\"my_prefs\")`",
        "`getSharedPreferences(\"my_prefs\", MODE_PRIVATE)`",
        "`openFileInput(\"my_prefs\")`",
        "`getResources(\"my_prefs\")`"
      ],
      answer: 1,
      explanation: "`getSharedPreferences(\"my_prefs\", MODE_PRIVATE)` retrieves a named preferences file."
    },
    {
      type: "mcq",
      prompt: "After using a SharedPreferences.Editor to make changes, which call commits them?",
      options: ["`editor.commit()` or `editor.apply()`", "`editor.save()`", "`editor.flush()`", "`editor.close()`"],
      answer: 0,
      explanation: "The lecture uses `editor.apply()` to commit changes (commit() is the synchronous alternative)."
    },
    {
      type: "mcq",
      prompt: "Where must static files included as resources be placed?",
      options: ["res/values", "res/raw", "res/layout", "res/drawable"],
      answer: 1,
      explanation: "Static files go in res/raw and are read with openRawResource; they are read-only."
    },
    {
      type: "mcq",
      prompt: "Which method returns an input stream for a raw resource?",
      options: ["`openFileInput`", "`openRawResource`", "`getFilesDir`", "`getExternalStoragePublicDirectory`"],
      answer: 1,
      explanation: "`resources.openRawResource(R.raw.myfilename)` returns an InputStream for a read-only raw resource."
    },
    {
      type: "mcq",
      prompt: "In Android, where should you save UI state so it survives Android terminating the Activity?",
      options: [
        "In the `onSaveInstanceState` handler",
        "In the `onDestroy` handler",
        "In the constructor",
        "In the manifest"
      ],
      answer: 0,
      explanation: "Save in onSaveInstanceState; restore in onRestoreInstanceState or onCreate."
    },
    {
      type: "mcq",
      prompt: "In a try/catch/finally structure, which block always runs?",
      options: ["try", "catch", "finally", "None are guaranteed"],
      answer: 2,
      explanation: "The finally block always runs regardless of whether an exception was thrown."
    },
    {
      type: "mcq",
      prompt: "A Style applied to an entire application or Activity is called a:",
      options: ["Layout", "Theme", "Drawable", "Manifest"],
      answer: 1,
      explanation: "A Theme is a style applied to an entire application or Activity."
    },
    {
      type: "mcq",
      prompt: "Where are styles stored as a resource?",
      options: ["/res/raw/styles.xml", "/res/values/styles.xml", "/res/layout/styles.xml", "AndroidManifest.xml"],
      answer: 1,
      explanation: "Styles are a resource found in /res/values/styles.xml."
    },

    // ---- Multi-select ----
    {
      type: "multi",
      prompt: "The permissions model helps Android support which user-privacy goals?",
      options: [
        "Control — the user controls the data they share",
        "Transparency — the user understands what data is used and why",
        "Data minimisation — an app only accesses data it needs for the task",
        "Monetisation — the app earns revenue from the data"
      ],
      answers: [0, 1, 2],
      explanation: "Control, transparency and data minimisation are the three stated privacy goals."
    },
    {
      type: "multi",
      prompt: "Which are reasons given for using error handling in programs?",
      options: ["To create clear programs", "To create robust programs", "To create fault-tolerant programs", "To make programs run faster"],
      answers: [0, 1, 2],
      explanation: "Error handling aims for clear, robust and fault-tolerant programs."
    },
    {
      type: "multi",
      prompt: "Which are valid places to store files in Android?",
      options: [
        "Application-specific preference files",
        "Application-specific regular files (object, text, binary)",
        "Publicly accessible locations (camera, alarms, downloads)",
        "Inside the AndroidManifest.xml"
      ],
      answers: [0, 1, 2],
      explanation: "Files live in app-specific preferences, app-specific regular files, or publicly accessible locations. Not the manifest."
    },
    {
      type: "multi",
      prompt: "Which convenience methods does Android provide for working with the file system?",
      options: ["`deleteFile`", "`fileList`", "`getFilesDir`", "`compileFile`"],
      answers: [0, 1, 2],
      explanation: "deleteFile, fileList and getFilesDir are the convenience methods listed. compileFile is not real."
    },
    {
      type: "multi",
      prompt: "For each try block, how many catch and finally blocks may there be?",
      options: [
        "0..many catch blocks",
        "0..1 finally block",
        "Exactly one catch block always",
        "At least two finally blocks"
      ],
      answers: [0, 1],
      explanation: "0..many catch blocks (depending on whether the try threw) and 0..1 finally block."
    },

    // ---- True / False ----
    {
      type: "tf",
      prompt: "Permissions must still be declared in the manifest even on Android 6.0+, where some may be auto-granted depending on the Protection Level.",
      answer: true,
      explanation: "Correct. You still add to the manifest; depending on the security Protection Level it may be auto-granted, otherwise the app asks at runtime."
    },
    {
      type: "tf",
      prompt: "Once granted, a runtime permission can never be revoked by the user.",
      answer: false,
      explanation: "Permissions can be revoked at any time, so code needs to check before use."
    },
    {
      type: "tf",
      prompt: "If you call finish() to close an Activity, onSaveInstanceState and onRestoreInstanceState are NOT called.",
      answer: true,
      explanation: "Correct. When closed by the user or via finish(), those are not called — so rather use Preferences in onPause/onResume."
    },
    {
      type: "tf",
      prompt: "In Android, presentation (styling) is mixed directly into the logic and cannot be separated.",
      answer: false,
      explanation: "Presentation is separated from logic in Android, like CSS style sheets."
    },
    {
      type: "tf",
      prompt: "An exception rethrown from inside a catch block can still be caught by the other catch blocks of the same try statement.",
      answer: false,
      explanation: "If an exception is thrown from within a catch block, the other catch blocks do not attempt to catch it — it is thrown out of the try-catch and is considered unhandled."
    },

    // ---- Fill in the blank ----
    {
      type: "fill",
      prompt: "The permission string required for an app to access the internet is `android.permission.{{blank}}`.",
      blanks: [["INTERNET"]],
      explanation: "`<uses-permission android:name=\"android.permission.INTERNET\" />`"
    },
    {
      type: "fill",
      prompt: "You open an application file for writing with `openFileOutput` and for reading with `{{blank}}`.",
      blanks: [["openFileInput", "openFileInput()"]],
      explanation: "`FileInputStream fis = openFileInput(\"myFile.dat\");`"
    }
  ]
});
