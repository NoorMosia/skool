registerLecture({
  id: "05",
  title: "L05: Fragments",
  blurb: "Fragments, activity stack & states, activity/fragment lifecycle callbacks, communication patterns.",
  questions: [
    // ---- MCQ ----
    {
      type: "mcq",
      prompt: "A Fragment:",
      options: [
        "Can live on its own without a host",
        "Must be hosted by an Activity (or another fragment)",
        "Is declared in the AndroidManifest.xml",
        "Replaces the need for an Activity entirely"
      ],
      answer: 1,
      explanation: "A Fragment can't live on its own — it must be hosted by an Activity (or another fragment)."
    },
    {
      type: "mcq",
      prompt: "The Activity stack is a:",
      options: ["FIFO queue", "LIFO stack", "Priority queue", "Circular buffer"],
      answer: 1,
      explanation: "It is a LIFO stack of Activities; the top-most is the active Activity."
    },
    {
      type: "mcq",
      prompt: "Which Activity state describes one that is visible, focused and in the foreground?",
      options: ["Paused", "Stopped", "Active", "Inactive"],
      answer: 2,
      explanation: "Active is at the top of the stack: visible, focused, foreground."
    },
    {
      type: "mcq",
      prompt: "A Paused Activity is best described as:",
      options: [
        "Not visible and removed from the stack",
        "Treated as active but receiving no user input events",
        "Destroyed and needing a restart",
        "At the top of the stack and focused"
      ],
      answer: 1,
      explanation: "Paused: normally not visible, always not focused, treated as active but receives no user input events."
    },
    {
      type: "mcq",
      prompt: "In which callback should a Fragment inflate its UI?",
      options: ["onCreate", "onCreateView", "onAttach", "onResume"],
      answer: 1,
      explanation: "Inflate the UI in onCreateView (not onCreate, which initialises the Fragment but NOT the UI)."
    },
    {
      type: "mcq",
      prompt: "In which Fragment callback do you get a reference to the parent Activity?",
      options: ["onAttach", "onDestroyView", "onResume", "onStop"],
      answer: 0,
      explanation: "onAttach is called when the Fragment is attached to the parent Activity — get the reference there."
    },
    {
      type: "mcq",
      prompt: "Which object does the parent Activity provide for managing contained Fragments?",
      options: ["FragmentManager", "ActivityManager", "LayoutInflater", "IntentResolver"],
      answer: 0,
      explanation: "The parent Activity provides a FragmentManager for managing contained Fragments."
    },
    {
      type: "mcq",
      prompt: "If a Fragment is added via XML in the Activity's layout, what limitation applies?",
      options: [
        "It cannot be swapped in/out",
        "It cannot have its own lifecycle",
        "It must appear in the manifest",
        "It cannot receive input events"
      ],
      answer: 0,
      explanation: "Added in XML, it is loaded during inflation but cannot be swapped in/out. Adding in code allows dynamic swapping."
    },

    // ---- Multi-select ----
    {
      type: "multi",
      prompt: "Why use Fragments?",
      options: [
        "To support different devices (resolutions & physical sizes)",
        "To write as little code as possible while supporting multiple devices",
        "To break the UI into reusable parts",
        "Because Fragments must be declared in the manifest"
      ],
      answers: [0, 1, 2],
      explanation: "Fragments support different devices, minimise code, and provide reusable parts. They do NOT appear in the manifest."
    },
    {
      type: "multi",
      prompt: "Which are characteristics of Fragments?",
      options: [
        "Encapsulated, independent, reusable components",
        "Have their own lifetime & UI",
        "Tightly bound to the Activity they are placed in",
        "Always outlive their parent Activity"
      ],
      answers: [0, 1, 2],
      explanation: "Fragments are reusable, have own lifetime/UI, and are tightly bound to their Activity. They typically follow the parent's lifetime, not outlive it."
    },
    {
      type: "multi",
      prompt: "Which are valid Fragment → Activity (or Fragment ↔ Fragment) communication approaches?",
      options: [
        "Define an interface the Activity implements (listeners)",
        "Pass parameters when creating the Fragment in a Bundle",
        "Use a publish-subscribe pattern for de-coupling",
        "Use a ViewModel"
      ],
      answers: [0, 1, 2, 3],
      explanation: "All four are mentioned: listener interfaces, Bundle parameters (Activity→Fragment), publish-subscribe, and ViewModel."
    },
    {
      type: "multi",
      prompt: "Which steps are part of including a Fragment?",
      options: [
        "Create the Fragment layout",
        "Create the Fragment class and inflate the layout in onCreateView",
        "Create the Activity layout (add the Fragment or a container)",
        "Register the Fragment in AndroidManifest.xml"
      ],
      answers: [0, 1, 2],
      explanation: "Create layout, create class (inflate in onCreateView), create Activity layout, create Activity class. Fragments are NOT registered in the manifest."
    },

    // ---- True / False ----
    {
      type: "tf",
      prompt: "A Stopped Activity is removed from memory immediately and cannot retain its state.",
      answer: false,
      explanation: "A Stopped Activity is not visible but remains in memory and retains state memory, though it is a candidate for termination."
    },
    {
      type: "tf",
      prompt: "onSaveInstanceState is called to save UI state changes at the end of the active lifecycle.",
      answer: true,
      explanation: "Correct — it is called to save UI state changes at the end of the active lifecycle."
    },
    {
      type: "tf",
      prompt: "Fragments appear in the AndroidManifest.xml just like Activities.",
      answer: false,
      explanation: "Fragments do not appear in the manifest."
    },
    {
      type: "tf",
      prompt: "onCreate (in a Fragment) is where you should initialise the Fragment but NOT its UI.",
      answer: true,
      explanation: "Correct. onCreate initialises the Fragment (not UI!); the UI is created in onCreateView."
    },

    // ---- Fill in the blank ----
    {
      type: "fill",
      prompt: "The three Activity lifetimes referenced by the callbacks are the full lifetime, the {{blank}} lifetime, and the {{blank}} lifetime.",
      blanks: [["visible"], ["active"]],
      explanation: "Full lifetime (onCreate→onDestroy), visible lifetime (onStart→onStop), active lifetime (onResume→onPause)."
    },
    {
      type: "fill",
      prompt: "When a Fragment's view is being detached, the `{{blank}}` callback is called to clean up resources related to the Fragment's View.",
      blanks: [["onDestroyView"]],
      explanation: "onDestroyView is called when the view is being detached; onDetach follows once detached from the parent Activity."
    }
  ]
});
