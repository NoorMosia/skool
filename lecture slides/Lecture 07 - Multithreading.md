# Lecture 07: Multithreading

## Threads

### What is a thread?

- A program unit that executes independently of other parts of a program
- The JVM & Android execute each thread for a short period of time, then switch to another thread

### How are threads defined?

- Implement the `Runnable` interface or extend the `Thread` class
- Either way, you need to write code for a `run()` method
  - Code in the `run()` method will be run in parallel (using a Thread) once a thread has been started
- If using the first option of implementing the `Runnable` interface:
  - Allows you to use lambdas & other classes that do not extend the Thread class directly, but it is a bit more work to set up

```java
public interface Runnable {
    void run();
}
```

### How are threads started?

- Implemented `Runnable`:
  - wrap it in a thread object, then call `start()` on the thread object
- Extended `Thread`:
  - implement the run method, instantiate it, then call `start()` on the thread object
- Don't do this: calling `run()` does NOT start a new thread, it simply calls the method (like a normal method) on the current thread

### Threads in a typical Java application

- Main program thread
- Garbage collection thread
- Screen updating thread
- Event dispatching thread

### How does the JVM decide which thread to execute?

- Co-operative: no sharing of resources
- Pre-emptive: threads have priority
- Time-slicing: every thread gets some resource time
- Multiprocessor: each thread runs on its own processor

Priorities:

- Can set a priority, which indicates how important a thread is
  - Using `t.setPriority(Thread.MIN_PRIORITY);`
- A higher priority thread has preference over a lower priority thread
  - BUT the VM will still give all (even lower priority) threads a chance to execute
- Threads of the same priority are "randomly" picked to be executed

### Are threads efficient?

- Creating new threads takes time
  - i.e., create threads when timing is not important
- Switching between threads takes time
  - i.e., don't have too many threads or the efficiency drops
- Destroying threads also takes time
- If you need many, short-lived threads, use the `ExecutorService` to reuse threads

### How do we stop a running thread?

1. Reach the end of the `run` method
2. Interrupt it using `t.interrupt()`
3. Stop it using `t.stop()`

- The run method should check if interrupted, using `Thread.interrupted();`
- If a thread is sleeping, interrupting it throws an exception: `InterruptedException`

### run() vs start()

```java
public class DebugThreads {
    public static void main(String[] args) {
        Thread worker = new Thread(() -> {
            System.out.println("Worker running on: "
                               + Thread.currentThread().getName());
        });
        worker.run();   // ❌ runs on the "main" thread
        worker.start(); // ✓ runs on a new thread, e.g. "Thread-0"
    }
}
```

- `worker.run()` → `Thread.currentThread().getName()` returns `main`
- `worker.start()` → returns `Thread-0`

### Thread lifecycle

- New → Runnable (Ready to Run) → Running → Terminated
- From Running:
  - `run()` exits → Terminated
  - suspended → waiting for a lock → Blocked → (acquired lock) → Runnable
  - waiting for notification → Waiting → (notified / time up) → Runnable
- Dashed states are not actual states (cannot be retrieved by the `getState()` method), but help explanation

## Timers & Animations using Threads

### What can threads be used for?

- Timers & animation
- Separating time-consuming calculations from the UI to keep the UI responsive
- Performing complicated calculations on different CPUs
- Communication (network, database, etc.)
  - Dealing with multiple clients simply (& as needed)

### Timers

- Definition: a thread that executes code at regular intervals

### Using threads for animation

- Use a thread's `run()` method to make changes to an animated object
  - Usually use an infinite loop (pause, modification, draw, etc.)
- Can only draw on the UI thread
  - So need to call `Platform.runLater()` so this can happen
  - Pass through drawing code that will be called later on the UI thread, when the UI thread is running
  - Only seems to be necessary if many threads are trying to draw on the UI at the same time

### Two ways to animate multiple objects

**1. Each object animates itself**

- Each object contains their own thread
- Use a thread in the main class to control updating & drawing
- But:
  - Excessive resource usage
  - Objects can get out of sync, so how do we clear the background once per frame?

**2. Single object controls all**

- Single thread, updates all objects
- Why use this method?
  - More efficient resource usage
  - Can control when background clearing occurs
  - Timing synchronised

## Custom views

- Extend the View class
- Override the `onDraw` method to draw text, lines, circles & images (uses a Canvas class)
- Provide 1-, 2- & 3-param constructors (inherited from the View class):
  - `public View(Context context)`
  - `public View(Context context, AttributeSet attrs)`
  - `public View(Context context, AttributeSet attrs, int defStyle)`
- Once done, can drag & drop onto the layout from the Custom View tab (select the CustomView control)

## Where can you use threads?

- Background data loading in a GUI (e.g., a recipe app fetching ingredients from a db while the user browses)
- Network requests (fetching chat app messages)
- Periodic tasks / timers (autosaving progress every 5 min)
- Real-time updates / monitoring (stock prices or game scores in real-time)
- File I/O operations (exporting large CSV files)
- Computationally intensive tasks (large datasets or simulations)
- Handling multiple user requests (multiplayer games or chat servers)
- Parallel processing for efficiency (rendering parts of a graphic scene concurrently)
