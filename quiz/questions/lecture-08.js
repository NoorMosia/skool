registerLecture({
  id: "08",
  title: "L08: Multithreading Part 2",
  blurb: "Race conditions, locks, synchronising access, exceptions with locks, deadlock, condition objects.",
  questions: [
    // ---- MCQ ----
    {
      type: "mcq",
      prompt: "When multiple threads access the same object/field and conflict, causing data inconsistency, this is called a:",
      options: ["Deadlock", "Race condition", "Context switch", "Starvation"],
      answer: 1,
      explanation: "This is a race condition — the outcome depends on the unpredictable interleaving of threads."
    },
    {
      type: "mcq",
      prompt: "A thread may proceed with locked code only if it:",
      options: [
        "Has the highest priority",
        "Has obtained the lock for that code",
        "Is the UI thread",
        "Is running on its own CPU"
      ],
      answer: 1,
      explanation: "A thread must own the lock before it is allowed to continue; otherwise it blocks and waits for the lock."
    },
    {
      type: "mcq",
      prompt: "Which concrete Lock implementation is used in the lecture examples?",
      options: ["`ReentrantLock`", "`SpinLock`", "`MutexLock`", "`ReadWriteLock`"],
      answer: 0,
      explanation: "`headLock = new ReentrantLock();` — ReentrantLock is used."
    },
    {
      type: "mcq",
      prompt: "When locking inside a try/catch, where should lock.unlock() go?",
      options: ["Inside the try block", "Inside the catch block", "Inside the finally block", "Before lock.lock()"],
      answer: 2,
      explanation: "Release the lock in the finally block; otherwise an exception could skip the unlock and the lock is never released."
    },
    {
      type: "mcq",
      prompt: "Two or more threads each waiting on a lock the other holds is called:",
      options: ["A race condition", "Deadlock (deadly embrace)", "Livelock", "A context switch"],
      answer: 1,
      explanation: "Deadlock (or deadly embrace): e.g. Thread 1 has Lock A wants B, Thread 2 has Lock B wants A."
    },
    {
      type: "mcq",
      prompt: "To avoid deadlock when a thread needs multiple locks A, B, C, you should:",
      options: [
        "Obtain them in a random order",
        "Always obtain in the same order & release in reverse order",
        "Never use more than one lock",
        "Obtain them in reverse and release in the same order"
      ],
      answer: 1,
      explanation: "Always acquire in the same order and release in reverse: e.g. lock A,B,C then unlock C,B,A."
    },
    {
      type: "mcq",
      prompt: "Which method of a condition object releases the lock and blocks the thread?",
      options: ["`signalAll`", "`await`", "`unlock`", "`notify`"],
      answer: 1,
      explanation: "await() temporarily releases the lock and blocks the thread until signalled."
    },
    {
      type: "mcq",
      prompt: "When a method changes an awaited condition, which call wakes up the waiting threads?",
      options: ["`await`", "`signalAll`", "`lock`", "`interrupt`"],
      answer: 1,
      explanation: "signalAll() on the same condition object makes all awaiting threads re-evaluate whether to continue."
    },

    // ---- Multi-select ----
    {
      type: "multi",
      prompt: "Which are stated issues with threading?",
      options: [
        "No guarantee when a thread will be suspended",
        "Cannot be sure if a statement is completed",
        "Multiple threads accessing the same field may conflict",
        "Threads cannot share any data at all"
      ],
      answers: [0, 1, 2],
      explanation: "The issues: unpredictable suspension, uncertainty about statement/field completion, and conflicting shared access. Threads CAN share data (that's the risk)."
    },
    {
      type: "multi",
      prompt: "To synchronise object access with locks, an object needs to:",
      options: [
        "Create one or more Lock objects",
        "Lock a specific lock before using a field",
        "Unlock the same lock when finished with the field",
        "Register the lock in the manifest"
      ],
      answers: [0, 1, 2],
      explanation: "Create locks, lock before use, unlock after. There is no manifest registration for locks."
    },
    {
      type: "multi",
      prompt: "Which statements about condition objects are correct?",
      options: [
        "A condition is created attached to a specific lock (newCondition())",
        "await() temporarily releases the lock so another thread can proceed",
        "The lock is regained later",
        "signalAll() permanently destroys the lock"
      ],
      answers: [0, 1, 2],
      explanation: "Conditions are created from a lock, await() releases then later regains the lock, signalAll() wakes waiters. signalAll does not destroy the lock."
    },
    {
      type: "multi",
      prompt: "After signalAll() is called, which is true of the awaiting threads?",
      options: [
        "All awaiting threads re-evaluate whether they should continue",
        "Of those deciding to proceed, a random thread is selected to obtain the lock",
        "Every awaiting thread proceeds simultaneously with the lock",
        "They all re-check the awaited condition"
      ],
      answers: [0, 1, 3],
      explanation: "All re-evaluate the condition; a random one of those proceeding gets the lock. They cannot all hold the lock at once."
    },

    // ---- True / False ----
    {
      type: "tf",
      prompt: "If another thread owns the lock a thread requires, the thread blocks and waits for the lock to become available.",
      answer: true,
      explanation: "Correct. It blocks, waits, then tries to obtain the lock again."
    },
    {
      type: "tf",
      prompt: "The Lock object has been available since Java 5.0; before that you needed to use synchronized.",
      answer: true,
      explanation: "Correct. Java provides a Lock object since Java 5.0; previously synchronisation was needed."
    },
    {
      type: "tf",
      prompt: "Putting lock.unlock() inside the try block (not finally) is the safest place for it.",
      answer: false,
      explanation: "No — if an exception is thrown, unlock in the try could be skipped and the lock never released. Use finally."
    },
    {
      type: "tf",
      prompt: "In the bank account example, withdraw() awaits the sufficientFundsCondition while the balance is less than the amount.",
      answer: true,
      explanation: "Correct. withdraw() loops `while (balance < amount) sufficientFundsCondition.await();`."
    },

    // ---- Fill in the blank ----
    {
      type: "fill",
      prompt: "In the deadlock example, Thread 1 holds Lock A and wants Lock {{blank}}, while Thread 2 holds Lock B and wants Lock {{blank}}.",
      blanks: [["B"], ["A"]],
      explanation: "Classic deadlock: T1 has A wants B; T2 has B wants A — each waits on the lock the other holds."
    },
    {
      type: "fill",
      prompt: "A condition object is created from a lock by calling `lock.{{blank}}()`.",
      blanks: [["newCondition", "newCondition()"]],
      explanation: "`sufficientFundsCondition = balanceChangeLock.newCondition();`"
    }
  ]
});
