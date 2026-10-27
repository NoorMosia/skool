registerLecture({
  id: "04",
  title: "L04: Multiple strings, layouts & activities",
  blurb: "Resource qualifiers, string & layout variants, multiple activities, passing data via Intents, results.",
  questions: [
    // ---- MCQ ----
    {
      type: "mcq",
      prompt: "Where would the Afrikaans version of strings.xml go, given the default is res/values?",
      options: ["res/values-af", "res/af-values", "res/strings-af", "res/values/af"],
      answer: 0,
      explanation: "Context is specified by a postfix on the folder name, e.g. res/values-af."
    },
    {
      type: "mcq",
      prompt: "When Android looks up a context-specific resource value, in what order does it search?",
      options: [
        "Least specific to most specific",
        "Most specific to least specific, taking the first match",
        "Alphabetical by folder name",
        "Random order"
      ],
      answer: 1,
      explanation: "It searches from most specific to least specific and takes the first value that matches the context."
    },
    {
      type: "mcq",
      prompt: "What happens to an Activity when its layout changes at runtime (e.g. on rotation)?",
      options: [
        "Only the changed View is redrawn",
        "The entire Activity is recreated",
        "Nothing — the layout updates in place",
        "The app crashes"
      ],
      answer: 1,
      explanation: "When a layout changes for any reason, the entire Activity is recreated."
    },
    {
      type: "mcq",
      prompt: "How do you reference a string resource strHello from Java code?",
      options: ["`@strings/strHello`", "`R.string.strHello`", "`R.layout.strHello`", "`getString(\"strHello\")`"],
      answer: 1,
      explanation: "In code it is R.string.strHello; in layout XML it is @strings/strHello."
    },
    {
      type: "mcq",
      prompt: "Between Serializable and Parcelable, which is simpler to implement?",
      options: ["Serializable", "Parcelable", "They are equally simple", "Neither can be implemented"],
      answer: 0,
      explanation: "Serializable is simpler to implement; Parcelable is faster and language-neutral but requires more code."
    },
    {
      type: "mcq",
      prompt: "Where is the default layout for an Activity found?",
      options: ["res/layout-default", "res/layout", "res/values", "res/raw"],
      answer: 1,
      explanation: "The first (default) layout is found in res/layout; variants go in context-postfixed folders like res/layout-land."
    },
    {
      type: "mcq",
      prompt: "When starting an implicit Intent, what do you specify instead of the target class?",
      options: ["The layout id", "The action name", "The package version", "The string resource id"],
      answer: 1,
      explanation: "For implicit intents you specify the action name (from android:name), not the class directly."
    },
    {
      type: "mcq",
      prompt: "In the result pattern, what does the caller register in onCreate?",
      options: [
        "An `ActivityResultLauncher`",
        "A `BroadcastReceiver`",
        "A `FragmentManager`",
        "A `SharedPreferences.Editor`"
      ],
      answer: 0,
      explanation: "The caller registers an ActivityResultLauncher with registerForActivityResult, specifying code to run when a result returns."
    },

    // ---- Multi-select ----
    {
      type: "multi",
      prompt: "Why should Activities be self-contained?",
      options: [
        "They should not depend on other Activities",
        "They should not assume objects exist",
        "They can be started by another app, so you don't know what ran before",
        "Because the manifest forbids more than one Activity"
      ],
      answers: [0, 1, 2],
      explanation: "Self-contained: no dependence on other Activities, no assuming objects exist, can be started from another app. The manifest does not forbid multiple Activities."
    },
    {
      type: "multi",
      prompt: "Which approaches can send data objects between Activities?",
      options: [
        "Implement Serializable, use putExtra and getSerializable",
        "Implement Parcelable, use putExtra and getParcelable",
        "Attach the object as an extra to the Intent",
        "Store the object in the AndroidManifest.xml"
      ],
      answers: [0, 1, 2],
      explanation: "Serializable or Parcelable objects are attached as extras to the Intent. The manifest does not store runtime data."
    },
    {
      type: "multi",
      prompt: "For another app to handle an Intent, what must be set up in the AndroidManifest.xml?",
      options: [
        "An intent-filter",
        "An action name in the android:name field",
        "A category (often android.intent.category.DEFAULT)",
        "The exact screen resolution of the device"
      ],
      answers: [0, 1, 2],
      explanation: "Add an intent-filter with an action name, a category, and the data type. Resolution is irrelevant."
    },
    {
      type: "multi",
      prompt: "What does the responder do to return a result to the caller?",
      options: [
        "Receives the Intent as normal",
        "Calls setResult with a result Intent",
        "Calls finish()",
        "Calls startActivity on itself again"
      ],
      answers: [0, 1, 2],
      explanation: "The responder receives the Intent, calls setResult(RESULT_OK, result), then finish()."
    },

    // ---- True / False ----
    {
      type: "tf",
      prompt: "Different layout XML files for the same layout in different contexts must use the same ids for important Views.",
      answer: true,
      explanation: "Correct. NB: matching ids are required so code can find the expected Views in all versions."
    },
    {
      type: "tf",
      prompt: "A string should be hard-coded directly in the layout XML for best practice.",
      answer: false,
      explanation: "Strings are not hard-coded in code or layout; they are looked up by id from context-specific XML files."
    },
    {
      type: "tf",
      prompt: "If multiple activities in different apps can handle the same action, the user can choose (or be allowed to choose from code) which one handles it.",
      answer: true,
      explanation: "Correct. When several activities can handle the same action, the user chooses or can be allowed to choose."
    },
    {
      type: "tf",
      prompt: "An Activity should perform multiple unrelated tasks, such as managing both student info and lecturer info.",
      answer: false,
      explanation: "An Activity is 'a single focused thing the user can do' and should perform a single task."
    },

    // ---- Fill in the blank ----
    {
      type: "fill",
      prompt: "In the result pattern, the responder returns data by calling `{{blank}}(Activity.RESULT_OK, result)` followed by `{{blank}}()`.",
      blanks: [["setResult"], ["finish"]],
      explanation: "The responder calls setResult then finish to hand the result back to the caller's ActivityResultLauncher."
    },
    {
      type: "fill",
      prompt: "Extras added to an Intent are stored as {{blank}}, value pairs.",
      blanks: [["key"]],
      explanation: "Extras are (key, value) pairs; you can send basic types such as strings, numbers and Booleans."
    }
  ]
});
