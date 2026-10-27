registerGuide({
  id: "07",
  title: "L07: Multithreading",
  blurb: "Keep the app responsive: run work on a background thread, update the UI safely from it, reuse threads with a pool, and stop a thread cleanly.",

  recipes: [
    // ============================================================
    {
      name: "Run work on a background thread",
      goal: "Do slow work off the main thread so the UI never freezes.",
      tags: ["Threads"],
      steps: [
        {
          do: "Wrap the work in a Thread and start it.",
          body: [
            { code:
"Thread t = new Thread(() -> {\n" +
"    // slow work here, e.g. a long calculation\n" +
"    doHeavyWork();\n" +
"});\n" +
"t.start();", lang: "java" },
            { note: "Call `start()` to run on a NEW thread. Calling `run()` directly just executes on the current thread with no concurrency." }
          ]
        },
        {
          do: "Understand the two ways to define the work.",
          body: [
            { list: [
              "Implement `Runnable` (as the lambda above), the flexible option.",
              "Or extend `Thread` and override `run()`."
            ]},
            { note: "Either way you write a `run()` method. The lambda form is implementing Runnable." }
          ]
        }
      ]
    },

    // ============================================================
    {
      name: "Update the UI from a background thread",
      goal: "Show a background result on screen without crashing, by hopping back to the UI thread.",
      tags: ["Threads", "UI"],
      steps: [
        {
          do: "Do the work on a thread, then post the UI update with runOnUiThread.",
          body: [
            { code:
"new Thread(() -> {\n" +
"    String result = fetchData();             // background\n" +
"    runOnUiThread(() -> textView.setText(result)); // back on UI thread\n" +
"}).start();", lang: "java" },
            { note: "You may ONLY touch Views on the UI thread. Touching a View from a background thread crashes the app. `runOnUiThread` posts the update to the main thread." }
          ]
        },
        {
          do: "Remember the JavaFX equivalent, in case a question uses it.",
          body: [
            { code:
"// JavaFX version of the same idea:\n" +
"Platform.runLater(() -> label.setText(result));", lang: "java" }
          ]
        }
      ]
    },

    // ============================================================
    {
      name: "Reuse threads with an ExecutorService",
      goal: "Handle many short tasks efficiently without creating a thread per task.",
      tags: ["Threads", "ExecutorService"],
      steps: [
        {
          do: "Create a pool, submit tasks, shut it down.",
          body: [
            { code:
"import java.util.concurrent.ExecutorService;\n" +
"import java.util.concurrent.Executors;\n" +
"\n" +
"ExecutorService pool = Executors.newFixedThreadPool(4);\n" +
"for (int i = 0; i < 20; i++) {\n" +
"    pool.submit(() -> doTask());\n" +
"}\n" +
"pool.shutdown();", lang: "java" },
            { note: "Creating, switching and destroying threads all cost time. A pool reuses a fixed set of threads, which is why it suits many short-lived tasks." }
          ]
        }
      ]
    },

    // ============================================================
    {
      name: "Stop a running thread cleanly",
      goal: "End a long-running background loop in a controlled way.",
      tags: ["Threads"],
      steps: [
        {
          do: "Let the run loop check a flag or the interrupt status.",
          body: [
            { code:
"private volatile boolean running = true;\n" +
"\n" +
"Thread worker = new Thread(() -> {\n" +
"    while (running && !Thread.interrupted()) {\n" +
"        // do a unit of work\n" +
"    }\n" +
"});\n" +
"worker.start();", lang: "java" },
            { note: "`volatile` makes the flag's change visible across threads. Three ways a thread ends: reach the end of run, interrupt it, or set a flag it checks." }
          ]
        },
        {
          do: "Signal it to stop.",
          body: [
            { code:
"running = false;\n" +
"worker.interrupt(); // also wakes it if it is sleeping/waiting", lang: "java" },
            { note: "Interrupting a sleeping or waiting thread throws InterruptedException, which you catch to exit the loop." }
          ]
        }
      ]
    }
  ]
});
