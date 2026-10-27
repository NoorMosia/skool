registerLecture({
  id: "07",
  title: "L07: Multithreading",
  blurb: "Thread definition, run vs start, JVM scheduling, priorities, stopping threads, lifecycle, animation, custom views.",
  questions: [
    // ---- MCQ ----
    {
      type: "mcq",
      prompt: "A thread is best described as:",
      options: [
        "A program unit that executes independently of other parts of a program",
        "A compiled binary of the application",
        "A UI component the user interacts with",
        "A type of exception"
      ],
      answer: 0,
      explanation: "A thread is a program unit that executes independently; the JVM/Android run each for a short time then switch."
    },
    {
      type: "mcq",
      prompt: "What are the two ways to define a thread's work?",
      options: [
        "Implement Runnable or extend Thread",
        "Extend Activity or implement Parcelable",
        "Implement Comparable or extend View",
        "Override onCreate or onDraw"
      ],
      answer: 0,
      explanation: "Implement the Runnable interface or extend the Thread class; either way write a run() method."
    },
    {
      type: "mcq",
      prompt: "What does calling run() directly (instead of start()) do?",
      options: [
        "Starts a new thread",
        "Simply calls the method on the current thread — no new thread",
        "Throws an InterruptedException",
        "Schedules the thread at MAX_PRIORITY"
      ],
      answer: 1,
      explanation: "Calling run() does NOT start a new thread; it calls the method like a normal method on the current thread. Use start()."
    },
    {
      type: "mcq",
      prompt: "Under which scheduling scheme does each thread run on its own processor?",
      options: ["Co-operative", "Pre-emptive", "Time-slicing", "Multiprocessor"],
      answer: 3,
      explanation: "Multiprocessor: each thread runs on its own processor. Time-slicing gives each thread some resource time."
    },
    {
      type: "mcq",
      prompt: "What should you use if you need many short-lived threads?",
      options: ["A single Thread subclass", "The ExecutorService to reuse threads", "runOnUiThread", "A PriorityQueue"],
      answer: 1,
      explanation: "Creating/switching/destroying threads costs time; use the ExecutorService to reuse threads."
    },
    {
      type: "mcq",
      prompt: "If a sleeping thread is interrupted, what happens?",
      options: [
        "Nothing — it keeps sleeping",
        "It throws an InterruptedException",
        "It is destroyed immediately",
        "Its priority is lowered"
      ],
      answer: 1,
      explanation: "Interrupting a sleeping thread throws an InterruptedException. The run method should also check Thread.interrupted()."
    },
    {
      type: "mcq",
      prompt: "On which thread can you draw the UI?",
      options: ["Any thread", "Only the UI thread", "Only a background thread", "The garbage collection thread"],
      answer: 1,
      explanation: "You can only draw on the UI thread; use Platform.runLater() to run drawing code on it."
    },
    {
      type: "mcq",
      prompt: "To build a custom view, which method do you override to draw?",
      options: ["onCreate", "onDraw", "onResume", "run"],
      answer: 1,
      explanation: "Extend View and override onDraw to draw text, lines, circles & images (uses a Canvas)."
    },

    // ---- Multi-select ----
    {
      type: "multi",
      prompt: "Which threads are listed as typical in a Java application?",
      options: [
        "Main program thread",
        "Garbage collection thread",
        "Screen updating thread",
        "Event dispatching thread"
      ],
      answers: [0, 1, 2, 3],
      explanation: "All four are listed: main, garbage collection, screen updating, and event dispatching threads."
    },
    {
      type: "multi",
      prompt: "Which are ways to stop a running thread?",
      options: [
        "Reach the end of the run method",
        "Interrupt it using t.interrupt()",
        "Stop it using t.stop()",
        "Call t.destroy() on the UI thread"
      ],
      answers: [0, 1, 2],
      explanation: "Reaching the end of run, t.interrupt(), and t.stop() are the three listed ways."
    },
    {
      type: "multi",
      prompt: "What can threads be used for?",
      options: [
        "Timers & animation",
        "Separating time-consuming calculations from the UI to keep it responsive",
        "Performing complicated calculations on different CPUs",
        "Communication (network, database, etc.)"
      ],
      answers: [0, 1, 2, 3],
      explanation: "All four uses are listed in the lecture."
    },
    {
      type: "multi",
      prompt: "In the 'single object controls all' animation approach, what are the benefits?",
      options: [
        "More efficient resource usage",
        "Can control when background clearing occurs",
        "Timing is synchronised",
        "Each object manages its own separate thread"
      ],
      answers: [0, 1, 2],
      explanation: "Single controller: efficient resources, controlled background clearing, synchronised timing. Separate per-object threads is the OTHER approach."
    },

    // ---- True / False ----
    {
      type: "tf",
      prompt: "A higher priority thread always completely prevents lower priority threads from ever executing.",
      answer: false,
      explanation: "A higher priority thread has preference, BUT the VM will still give all (even lower priority) threads a chance to execute."
    },
    {
      type: "tf",
      prompt: "Creating, switching between, and destroying threads all take time, so you should not have too many threads.",
      answer: true,
      explanation: "Correct. All three cost time; too many threads drops efficiency."
    },
    {
      type: "tf",
      prompt: "Threads of the same priority are picked 'randomly' to be executed.",
      answer: true,
      explanation: "Correct. Threads of the same priority are 'randomly' picked to execute."
    },
    {
      type: "tf",
      prompt: "In the 'each object animates itself' approach, objects can get out of sync and resource usage can be excessive.",
      answer: true,
      explanation: "Correct — that approach risks excessive resource usage and objects getting out of sync (e.g. clearing the background)."
    },

    // ---- Fill in the blank ----
    {
      type: "fill",
      prompt: "You begin a new thread by calling `{{blank}}()` on the thread object, not run().",
      blanks: [["start"]],
      explanation: "Call start() on the thread object to begin a new thread; run() alone just executes on the current thread."
    },
    {
      type: "fill",
      prompt: "A custom view must extend the `{{blank}}` class and provide 1-, 2- and 3-parameter constructors.",
      blanks: [["View"]],
      explanation: "Extend View; override onDraw; provide View(Context), View(Context, AttributeSet) and View(Context, AttributeSet, int) constructors."
    }
  ]
});
