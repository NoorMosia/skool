registerGuide({
  id: "08",
  title: "L08: Multithreading Part 2 (locks)",
  blurb: "Make shared data safe when many threads touch it: guard it with a lock, release reliably, avoid deadlock, and coordinate with a condition.",

  recipes: [
    // ============================================================
    {
      name: "See the race condition first",
      goal: "Understand the bug before fixing it: unsynchronised shared state goes wrong.",
      tags: ["Race condition"],
      steps: [
        {
          do: "Picture two threads reserving the last copy at once.",
          body: [
            { p: "Both threads read `available = 1`, both decide there is a copy, both decrement. You just handed out two copies when only one existed." },
            { note: "A race condition is when the result depends on the unpredictable interleaving of threads. The fix is to make the read-decide-write happen as one atomic step." }
          ]
        }
      ]
    },

    // ============================================================
    {
      name: "Guard shared data with a ReentrantLock",
      goal: "A shared counter or map that stays correct under many threads.",
      tags: ["Locks", "ReentrantLock"],
      steps: [
        {
          do: "Create a lock next to the shared data.",
          body: [
            { code:
"import java.util.concurrent.locks.Lock;\n" +
"import java.util.concurrent.locks.ReentrantLock;\n" +
"\n" +
"private final Lock lock = new ReentrantLock();\n" +
"private int available = 1;", lang: "java" },
            { note: "The Lock object exists since Java 5. Before that you used the `synchronized` keyword." }
          ]
        },
        {
          do: "Lock, do the critical section, unlock in finally.",
          body: [
            { code:
"public boolean reserve() {\n" +
"    lock.lock();\n" +
"    try {\n" +
"        if (available <= 0) return false;\n" +
"        available--;          // read, decide and write are now atomic\n" +
"        return true;\n" +
"    } finally {\n" +
"        lock.unlock();\n" +
"    }\n" +
"}", lang: "java" },
            { note: "unlock() MUST go in finally. If the critical section throws and unlock sits in the try, the lock is never released and every other thread hangs forever." }
          ]
        },
        {
          do: "Note how a blocked thread behaves.",
          body: [
            { p: "If another thread already holds the lock, `lock.lock()` blocks and waits until it is free, then proceeds." }
          ]
        }
      ]
    },

    // ============================================================
    {
      name: "Avoid deadlock with lock ordering",
      goal: "Prevent two threads freezing while each waits for a lock the other holds.",
      tags: ["Locks", "Deadlock"],
      steps: [
        {
          do: "Recognise the deadlock shape.",
          body: [
            { p: "Thread 1 holds lock A and wants B. Thread 2 holds B and wants A. Neither can proceed. This is deadlock, or deadly embrace." }
          ]
        },
        {
          do: "Always acquire multiple locks in the same order, release in reverse.",
          body: [
            { list: [
              "Need A, B, C: lock A, then B, then C; unlock C, then B, then A.",
              "Never let one thread take A then B while another takes B then A."
            ]},
            { note: "A single consistent ordering across all threads makes the deadlock cycle impossible." }
          ]
        }
      ]
    },

    // ============================================================
    {
      name: "Coordinate threads with a Condition",
      goal: "A consumer waits until a producer makes data available, releasing the lock while it waits.",
      tags: ["Locks", "Condition"],
      steps: [
        {
          do: "Create a condition from the lock.",
          body: [
            { code:
"import java.util.concurrent.locks.Condition;\n" +
"\n" +
"private final Lock lock = new ReentrantLock();\n" +
"private final Condition notEmpty = lock.newCondition();", lang: "java" }
          ]
        },
        {
          do: "Consumer: await in a while loop until the condition holds.",
          body: [
            { code:
"lock.lock();\n" +
"try {\n" +
"    while (queue.isEmpty()) {\n" +
"        notEmpty.await();   // releases the lock and blocks\n" +
"    }\n" +
"    item = queue.remove();\n" +
"} finally {\n" +
"    lock.unlock();\n" +
"}", lang: "java" },
            { note: "await() temporarily releases the lock so another thread can proceed, then re-acquires it when woken. Always await in a while loop, so the condition is re-checked after waking." }
          ]
        },
        {
          do: "Producer: add data, then signal the waiters.",
          body: [
            { code:
"lock.lock();\n" +
"try {\n" +
"    queue.add(x);\n" +
"    notEmpty.signalAll();   // wake everyone awaiting this condition\n" +
"} finally {\n" +
"    lock.unlock();\n" +
"}", lang: "java" },
            { note: "signalAll wakes all awaiting threads to re-check their condition. Of those that proceed, one at a time re-acquires the lock." }
          ]
        }
      ]
    }
  ]
});
