registerWalkthrough({
  id: "0-recap",
  title: "Lecture Recap",
  blurb: "Short, standalone patterns to rehearse one muscle at a time. Each recap is a self-contained snippet you can type from memory. Grouped by lecture, L2 to L10.",

  sections: [
    // ============================================================ L02
    {
      id: "l02",
      title: "L02: Basic UI Views",
      intro: "The RecyclerView triad is the one that reappears constantly in the practical.",
      steps: [
        {
          title: "RecyclerView: adapter, ViewHolder, wiring",
          tags: ["L02 RecyclerView"],
          body: [
            { p: "The minimum to show a list of strings. Remember the three parts: data, the ViewHolder that holds the row's views, and the Adapter that maps data to rows." },
            { code:
"class MyAdapter extends RecyclerView.Adapter<MyAdapter.VH> {\n" +
"    private final List<String> items;\n" +
"    MyAdapter(List<String> items) { this.items = items; }\n" +
"\n" +
"    @NonNull @Override public VH onCreateViewHolder(@NonNull ViewGroup p, int t) {\n" +
"        View v = LayoutInflater.from(p.getContext())\n" +
"                .inflate(android.R.layout.simple_list_item_1, p, false);\n" +
"        return new VH(v);\n" +
"    }\n" +
"    @Override public void onBindViewHolder(@NonNull VH h, int i) {\n" +
"        h.text.setText(items.get(i));\n" +
"    }\n" +
"    @Override public int getItemCount() { return items.size(); }\n" +
"\n" +
"    static class VH extends RecyclerView.ViewHolder {\n" +
"        TextView text;\n" +
"        VH(View v) { super(v); text = v.findViewById(android.R.id.text1); }\n" +
"    }\n" +
"}\n" +
"\n" +
"// Wiring:\n" +
"recycler.setLayoutManager(new LinearLayoutManager(this));\n" +
"recycler.setAdapter(new MyAdapter(items));", lang: "java" },
            { note: "You must set a LayoutManager or the list renders blank. `simple_list_item_1` is a built-in row layout, so you avoid writing a custom row under time pressure." }
          ]
        },
        {
          title: "View sizing values",
          tags: ["L02 Views"],
          body: [
            { list: [
              "`wrap_content`: size to the content",
              "`match_parent`: fill the parent",
              "`10dp`: a fixed density-independent size"
            ]}
          ]
        }
      ]
    },

    // ============================================================ L03
    {
      id: "l03",
      title: "L03: Permissions, Files, Styles, Exceptions",
      intro: "Four small patterns that each show up as sub-parts.",
      steps: [
        {
          title: "SharedPreferences: save and load",
          tags: ["L03 Persistence"],
          body: [
            { code:
"// Save\n" +
"SharedPreferences prefs = getSharedPreferences(\"my_prefs\", MODE_PRIVATE);\n" +
"SharedPreferences.Editor editor = prefs.edit();\n" +
"editor.putString(\"name\", s);\n" +
"editor.putInt(\"count\", i);\n" +
"editor.apply();\n" +
"\n" +
"// Load. The 2nd arg is the default if missing.\n" +
"String name = prefs.getString(\"name\", \"nothing\");\n" +
"int count = prefs.getInt(\"count\", 0);", lang: "java" },
            { note: "`apply()` writes asynchronously, while `commit()` is the synchronous alternative. The second argument to each getter is the default when the key is absent." }
          ]
        },
        {
          title: "App file: write and read",
          tags: ["L03 Persistence"],
          body: [
            { code:
"// Write an app-private file\n" +
"FileOutputStream fos = openFileOutput(\"data.txt\", Context.MODE_PRIVATE);\n" +
"fos.write(text.getBytes());\n" +
"fos.close();\n" +
"\n" +
"// Read\n" +
"FileInputStream fis = openFileInput(\"data.txt\");", lang: "java" }
          ]
        },
        {
          title: "Runtime permission request",
          tags: ["L03 Permissions"],
          body: [
            { code:
"if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)\n" +
"        != PackageManager.PERMISSION_GRANTED) {\n" +
"    ActivityCompat.requestPermissions(this,\n" +
"            new String[]{ Manifest.permission.CAMERA }, 1);\n" +
"}", lang: "java" },
            { note: "Dangerous permissions such as camera, location and storage need this runtime check since Android 6.0. INTERNET is a normal permission and granted at install, so it needs no runtime prompt." }
          ]
        },
        {
          title: "Custom exception with try/catch/finally",
          tags: ["L03 Exceptions"],
          body: [
            { code:
"class ReservationException extends Exception {\n" +
"    ReservationException(String msg) { super(msg); }\n" +
"}\n" +
"\n" +
"try {\n" +
"    if (available <= 0) throw new ReservationException(\"No copies\");\n" +
"    // ... work ...\n" +
"} catch (ReservationException e) {\n" +
"    System.out.println(\"Handled: \" + e.getMessage());\n" +
"} finally {\n" +
"    // always runs\n" +
"}", lang: "java" },
            { note: "finally ALWAYS runs, which is why lock release goes there as shown in L08. A method that throws a checked exception must declare `throws`." }
          ]
        },
        {
          title: "Style and theme",
          tags: ["L03 Styles"],
          body: [
            { code:
"<!-- res/values/styles.xml -->\n" +
"<style name=\"MyButton\" parent=\"@android:style/Widget.Button\">\n" +
"    <item name=\"android:textColor\">#FF0000</item>\n" +
"</style>\n" +
"\n" +
"<!-- apply to a view -->\n" +
"<Button style=\"@style/MyButton\" android:text=\"Hi\" />", lang: "xml" },
            { note: "A Style is a set of attribute/value pairs on a view. A Theme is a Style applied to a whole Activity or Application. Presentation is separated from logic, like CSS." }
          ]
        }
      ]
    },

    // ============================================================ L04
    {
      id: "l04",
      title: "L04: Multiple strings, layouts, activities",
      intro: "Resource qualifiers and the two inter-activity patterns.",
      steps: [
        {
          title: "Resource qualifiers for string and layout variants",
          tags: ["L04 Resources"],
          body: [
            { list: [
              "Default strings live in `res/values/strings.xml`; Afrikaans in `res/values-af/strings.xml`",
              "Default layout lives in `res/layout/`; landscape in `res/layout-land/` with the same file name and same ids",
              "Android picks the most-specific match at runtime, and a layout change recreates the Activity"
            ]},
            { note: "Reference a string as `@string/strHello` in XML and `R.string.strHello` in code. Variant layouts MUST keep the same View ids or code breaks." }
          ]
        },
        {
          title: "Pass data to another Activity with extras",
          tags: ["L04 Intents"],
          body: [
            { code:
"// Sender\n" +
"Intent intent = new Intent(this, DetailActivity.class);\n" +
"intent.putExtra(\"code\", \"WRPV301\");\n" +
"startActivity(intent);\n" +
"\n" +
"// Receiver, inside onCreate\n" +
"String code = getIntent().getStringExtra(\"code\");", lang: "java" },
            { note: "Objects need to implement Serializable or Parcelable to travel as extras. Serializable is simpler, while Parcelable is faster but more code." }
          ]
        },
        {
          title: "Start an Activity for a result",
          tags: ["L04 Intents"],
          body: [
            { code:
"// Caller: register a launcher in onCreate\n" +
"ActivityResultLauncher<Intent> launcher = registerForActivityResult(\n" +
"    new ActivityResultContracts.StartActivityForResult(),\n" +
"    result -> {\n" +
"        if (result.getResultCode() == RESULT_OK) {\n" +
"            int sum = result.getData().getIntExtra(\"sum\", 0);\n" +
"        }\n" +
"    });\n" +
"launcher.launch(new Intent(this, SumActivity.class));\n" +
"\n" +
"// Responder\n" +
"Intent out = new Intent();\n" +
"out.putExtra(\"sum\", 42);\n" +
"setResult(RESULT_OK, out);\n" +
"finish();", lang: "java" }
          ]
        }
      ]
    },

    // ============================================================ L05
    {
      id: "l05",
      title: "L05: Fragments",
      intro: "Lifecycle gotchas and the communication patterns.",
      steps: [
        {
          title: "Add or replace a fragment in code",
          tags: ["L05 Fragments"],
          body: [
            { code:
"getSupportFragmentManager().beginTransaction()\n" +
"    .replace(R.id.fragmentContainer, new MyFragment())\n" +
"    .addToBackStack(null)   // Back returns to the previous fragment\n" +
"    .commit();", lang: "java" },
            { note: "Adding in code rather than as a static <fragment> in XML is what lets you swap fragments at runtime. `addToBackStack` makes the Back button pop it." }
          ]
        },
        {
          title: "Fragment factory with a Bundle",
          tags: ["L05 Fragments"],
          body: [
            { code:
"public static MyFragment newInstance(String code) {\n" +
"    MyFragment f = new MyFragment();\n" +
"    Bundle args = new Bundle();\n" +
"    args.putString(\"code\", code);\n" +
"    f.setArguments(args);\n" +
"    return f;\n" +
"}\n" +
"// read later: getArguments().getString(\"code\")", lang: "java" },
            { note: "Pass data via setArguments and a Bundle, never a custom constructor. The system recreates fragments with the no-arg constructor and would lose constructor data." }
          ]
        },
        {
          title: "Inflate UI in onCreateView, not onCreate",
          tags: ["L05 Fragments"],
          body: [
            { code:
"@Nullable @Override\n" +
"public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,\n" +
"                         @Nullable Bundle savedInstanceState) {\n" +
"    return inflater.inflate(R.layout.fragment_my, container, false);\n" +
"}", lang: "java" },
            { note: "onCreate initialises the fragment but not the UI. onCreateView creates the UI. Mixing these up is a classic mistake." }
          ]
        },
        {
          title: "Fragment to Activity via a listener interface",
          tags: ["L05 Fragments"],
          body: [
            { code:
"// In the fragment\n" +
"public interface Listener { void onPicked(String code); }\n" +
"private Listener listener;\n" +
"@Override public void onAttach(@NonNull Context c) {\n" +
"    super.onAttach(c);\n" +
"    listener = (Listener) c; // the Activity implements Listener\n" +
"}\n" +
"// call listener.onPicked(code) when something happens", lang: "java" },
            { note: "The decoupled pattern: the fragment notifies through an interface the Activity implements, and the Activity then coordinates other fragments. Fragments should not call each other directly." }
          ]
        }
      ]
    },

    // ============================================================ L06
    {
      id: "l06",
      title: "L06: Collections & RegEx",
      intro: "Collections choice, a stream pipeline, and the regex patterns the exam favours.",
      steps: [
        {
          title: "Pick the right collection",
          tags: ["L06 Collections"],
          body: [
            { list: [
              "`List`, e.g. ArrayList: ordered, indexable, duplicates allowed",
              "`Set`, e.g. HashSet: no duplicates, unordered",
              "`Map`, e.g. HashMap: key to value, unique keys",
              "`Queue`, e.g. LinkedList or PriorityQueue: FIFO or priority order"
            ]}
          ]
        },
        {
          title: "Stream pipeline: filter, map, collect",
          tags: ["L06 Collections"],
          body: [
            { code:
"List<String> names = people.stream()\n" +
"    .filter(p -> p.getAge() >= 18)\n" +
"    .map(p -> p.getName())\n" +
"    .collect(Collectors.toList());\n" +
"\n" +
"int total = nums.stream().reduce(0, (a, b) -> a + b); // reduce to one value", lang: "java" },
            { note: "filter keeps elements, map transforms the type, collect gathers the result, and reduce folds to a single value. Use parallelStream for parallel processing." }
          ]
        },
        {
          title: "Compile a pattern and match",
          tags: ["L06 RegEx"],
          body: [
            { code:
"Pattern p = Pattern.compile(\"WRPV3.*\");\n" +
"boolean hit = p.matcher(\"WRPV301\").matches();  // whole string must match\n" +
"\n" +
"// shortcut when used once:\n" +
"boolean ok = \"206008384\".matches(\"\\\\d{9}\");", lang: "java" },
            { note: "Reuse a compiled Pattern when matching many strings, since compiling is expensive. `String.matches` compiles on each call, which is fine for one-offs like validation." }
          ]
        },
        {
          title: "The exam's go-to patterns",
          tags: ["L06 RegEx"],
          body: [
            { list: [
              "`\\d{9}`: exactly 9 digits, e.g. a student or membership number",
              "`WRPV3.*`: starts with WRPV3, then anything",
              "`^[A-Z]{4}3\\d{2}$`: 4 letters, a 3, then 2 digits, i.e. all third-year codes",
              "`a{3,8}`: 3 to 8 a's. `a+`: one or more. `a*`: zero or more"
            ]},
            { note: "`matches` anchors to the whole string, so `^` and `$` are implicit. Escape `\\` as `\\\\` in Java string literals, e.g. `\"\\\\d{9}\"`." }
          ]
        }
      ]
    },

    // ============================================================ L07
    {
      id: "l07",
      title: "L07: Multithreading",
      intro: "Starting threads correctly and keeping the UI alive.",
      steps: [
        {
          title: "Runnable vs Thread, and start not run",
          tags: ["L07 Threads"],
          body: [
            { code:
"// A Runnable lambda wrapped in a Thread\n" +
"Thread t = new Thread(() -> doWork());\n" +
"t.start();   // NEW thread\n" +
"// t.run();  // WRONG: runs on the current thread, no concurrency", lang: "java" },
            { note: "start spawns a new thread and calls run on it. Calling run directly is just a normal method call on the current thread." }
          ]
        },
        {
          title: "Background work, then update the UI",
          tags: ["L07 Threads"],
          body: [
            { code:
"new Thread(() -> {\n" +
"    String data = fetchFromNetwork();      // heavy, off the UI thread\n" +
"    runOnUiThread(() -> textView.setText(data)); // UI touch back on main\n" +
"}).start();", lang: "java" },
            { note: "You may ONLY touch Views on the UI thread. On Android use runOnUiThread. The JavaFX equivalent is Platform.runLater." }
          ]
        },
        {
          title: "ExecutorService for many short tasks",
          tags: ["L07 Threads"],
          body: [
            { code:
"ExecutorService pool = Executors.newFixedThreadPool(4);\n" +
"pool.submit(() -> doTask());\n" +
"pool.shutdown();", lang: "java" },
            { note: "Reuses a pool of threads instead of creating and destroying one per task, which is costly. Use it when you need many short-lived tasks." }
          ]
        }
      ]
    },

    // ============================================================ L08
    {
      id: "l08",
      title: "L08: Multithreading Part 2, locks",
      intro: "The lock pattern, deadlock avoidance, and condition objects.",
      steps: [
        {
          title: "ReentrantLock with unlock in finally",
          tags: ["L08 Locks"],
          body: [
            { code:
"private final Lock lock = new ReentrantLock();\n" +
"\n" +
"lock.lock();\n" +
"try {\n" +
"    // critical section: read, decide, write on shared data\n" +
"} finally {\n" +
"    lock.unlock();   // ALWAYS release, even on exception\n" +
"}", lang: "java" },
            { note: "unlock in finally is non-negotiable. If the critical section throws and you unlock inside try, the lock is never released and every other thread hangs." }
          ]
        },
        {
          title: "Avoid deadlock with lock ordering",
          tags: ["L08 Locks"],
          body: [
            { p: "Deadlock happens when T1 holds A and wants B while T2 holds B and wants A. Avoid it by always acquiring multiple locks in the same order and releasing in reverse." },
            { list: [
              "Need A, B, C: lock A, B, C; unlock C, B, A",
              "Never let two threads grab the same locks in opposite orders"
            ]}
          ]
        },
        {
          title: "Condition with await and signalAll for producer-consumer",
          tags: ["L08 Locks"],
          body: [
            { code:
"Lock lock = new ReentrantLock();\n" +
"Condition notEmpty = lock.newCondition();\n" +
"\n" +
"// consumer\n" +
"lock.lock();\n" +
"try {\n" +
"    while (queue.isEmpty()) notEmpty.await(); // releases lock, blocks\n" +
"    item = queue.remove();\n" +
"} finally { lock.unlock(); }\n" +
"\n" +
"// producer, after adding:\n" +
"lock.lock();\n" +
"try { queue.add(x); notEmpty.signalAll(); }\n" +
"finally { lock.unlock(); }", lang: "java" },
            { note: "await temporarily releases the lock and blocks, while signalAll wakes all waiters to re-check their condition. Always await in a while loop so the condition is re-checked after waking." }
          ]
        }
      ]
    },

    // ============================================================ L09
    {
      id: "l09",
      title: "L09: Networking",
      intro: "TCP server and client steps, UDP, plus TCP vs UDP recall.",
      steps: [
        {
          title: "TCP stream server",
          tags: ["L09 Networking"],
          body: [
            { code:
"ServerSocket server = new ServerSocket(5050);\n" +
"Socket conn = server.accept();           // blocks for a client\n" +
"BufferedReader in = new BufferedReader(\n" +
"        new InputStreamReader(conn.getInputStream()));\n" +
"PrintWriter out = new PrintWriter(conn.getOutputStream(), true);\n" +
"// ... communicate ...\n" +
"conn.close();", lang: "java" }
          ]
        },
        {
          title: "TCP stream client",
          tags: ["L09 Networking"],
          body: [
            { code:
"Socket conn = new Socket(\"127.0.0.1\", 5050);\n" +
"BufferedReader in = new BufferedReader(\n" +
"        new InputStreamReader(conn.getInputStream()));\n" +
"PrintWriter out = new PrintWriter(conn.getOutputStream(), true);\n" +
"out.println(\"LIST\");\n" +
"String reply = in.readLine();   // blocking read\n" +
"conn.close();", lang: "java" },
            { note: "Reading from an input stream BLOCKS. That single fact drives the whole multi-threaded design, because a blocked read must not stall the rest of the app." }
          ]
        },
        {
          title: "UDP datagram socket",
          tags: ["L09 Networking"],
          body: [
            { code:
"DatagramSocket sock = new DatagramSocket(5050);\n" +
"DatagramPacket in = new DatagramPacket(new byte[256], 256);\n" +
"sock.receive(in);                              // blocks\n" +
"DatagramPacket out = new DatagramPacket(data, data.length, addr, 5050);\n" +
"sock.send(out);", lang: "java" }
          ]
        },
        {
          title: "TCP vs UDP recall",
          tags: ["L09 Networking"],
          body: [
            { list: [
              "TCP: connection-oriented, lossless, in-order, reliable, slower. Good for chat and documents.",
              "UDP: connectionless, faster, may lose or reorder packets. Good for live audio and video."
            ]}
          ]
        }
      ]
    },

    // ============================================================ L10
    {
      id: "l10",
      title: "L10: Multi-client Networking",
      intro: "The patterns that turn a single-client server into a concurrent, full-duplex one.",
      steps: [
        {
          title: "Thread-per-connection server loop",
          tags: ["L10 Multi-client"],
          body: [
            { code:
"int clientNum = 0;\n" +
"while (true) {\n" +
"    Socket socket = server.accept();\n" +
"    clientNum++;\n" +
"    new ClientHandler(socket, clientNum, manager).start();\n" +
"}", lang: "java" },
            { note: "Each client gets its own handler thread, so multiple clients are served concurrently instead of one at a time." }
          ]
        },
        {
          title: "Full duplex with separate read and write threads plus a queue",
          tags: ["L10 Multi-client"],
          body: [
            { code:
"BlockingQueue<String> outgoing = new LinkedBlockingQueue<>();\n" +
"\n" +
"// read thread: parse commands, enqueue replies\n" +
"while ((line = in.readLine()) != null) { outgoing.put(handle(line)); }\n" +
"\n" +
"// write thread: drain the queue\n" +
"while (running) { out.println(outgoing.take()); }", lang: "java" },
            { note: "One thread blocks on reading and another blocks on the queue for writing. Together they allow sending and receiving at the same time, which is full duplex. The BlockingQueue is the thread-safe hand-off between them." }
          ]
        },
        {
          title: "Protect shared server state",
          tags: ["L10 Multi-client", "L08 Locks"],
          body: [
            { p: "Many handler threads touch one shared data structure. Guard it with a ReentrantLock, as in L08, so concurrent reads and writes do not corrupt it or cause race conditions." },
            { note: "Centralised data plus many threads means potential race conditions. The lock around the shared map or collection is the fix, and reads on blocking streams are why the threads exist." }
          ]
        }
      ]
    }
  ]
});
