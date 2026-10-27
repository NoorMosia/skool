registerWalkthrough({
  id: "1-server",
  title: "Part 1: Java Server in IntelliJ",
  blurb: "Build LibraryServer, a multi-threaded console TCP server on port 5050. It mirrors the exam's Question 1 (server setup, shared data structure with locks, per-client handler with read/write threads).",

  sections: [
    // ============================================================
    {
      id: "scenario",
      title: "The scenario & protocol",
      intro: "Before any code, understand the shape of the system. The exam gives you a scenario and a text protocol, and the whole build hangs off these. Our domain is a Library book-reservation system whose structure is identical to the exam's course registration.",
      steps: [
        {
          title: "Understand what you are building",
          tags: ["L09 Networking", "L10 Multi-client"],
          body: [
            { p: "A **console Java TCP server** that holds a central list of books and serves **many Android clients at once**. Each client can list books, search by regex, and reserve a book, which decreases its available copies." },
            { list: [
              "The server listens on **port 5050**.",
              "One **ClientHandler** per connected client, i.e. thread-per-connection.",
              "A single shared **LibraryManager** holds the books, and it must be thread-safe.",
              "Communication is **text-based**, line by line, over the socket."
            ]},
            { note: "This is the same architecture as the exam's Course Registration server. If you can build this, you can rebuild theirs by renaming Book to Course and RESERVE to REGISTER." }
          ]
        },
        {
          title: "Memorise the text protocol",
          tags: ["L10 Multi-client"],
          body: [
            { p: "The client sends one-line **commands**, and the server replies with one or more lines, where list replies end in `END`." },
            { p: "**Client to Server commands:**" },
            { list: [
              "`LIST` requests all books",
              "`SEARCH:pattern` returns books whose code matches the regex `pattern`",
              "`RESERVE:bookCode:membershipNumber` reserves a book for a member",
              "`QUIT` closes the connection"
            ]},
            { p: "**Server to Client responses:**" },
            { list: [
              "List or Search: one `CODE|TITLE|AVAILABLE` per line, then a final line `END`",
              "`SUCCESS` means the reservation is done",
              "`FULL` means no copies are left",
              "`GOODBYE` is the reply to QUIT"
            ]},
            { p: "Example session, showing what the server sees and sends:" },
            { code:
"Client:  LIST\n" +
"Server:  WRPV301|Advanced Programming|100\n" +
"         WRPV302|Advanced Programming|80\n" +
"         WRAV201|Data Structures|120\n" +
"         END\n" +
"Client:  SEARCH:WRPV3.*\n" +
"Server:  WRPV301|Advanced Programming|100\n" +
"         WRPV302|Advanced Programming|80\n" +
"         END\n" +
"Client:  RESERVE:WRPV301:206008384\n" +
"Server:  SUCCESS\n" +
"Client:  QUIT\n" +
"Server:  GOODBYE", lang: "text" },
            { note: "Design the protocol handling once and reuse it on both sides. The client builds these exact command strings, and the server parses them and produces these exact replies." }
          ]
        }
      ]
    },

    // ============================================================
    {
      id: "setup",
      title: "Q1.1: Project & server setup",
      intro: "Create the IntelliJ project and the entry point: a ServerSocket on 5050, an accept loop, and a ClientHandler per client with an incrementing client number.",
      steps: [
        {
          title: "Create the IntelliJ Java project",
          tags: ["setup"],
          body: [
            { scaffold: "In IntelliJ choose New Project, then Java, and name it with your student number, e.g. `LibraryServer_206008384`. JDK 17+ is fine. This naming matters in the exam, because projects must include your student number." },
            { p: "Create a package such as `za.ac.library.server` and put all server classes in it. The walkthrough omits the `package` line from snippets, so add it at the top of each file." }
          ]
        },
        {
          title: "Create the Book model class",
          tags: ["L06 Collections"],
          body: [
            { p: "A plain data holder for one book. `available` is mutable because reserving decreases it." },
            { file: "Book.java" },
            { code:
"public class Book {\n" +
"    private final String code;\n" +
"    private final String title;\n" +
"    private int available;\n" +
"\n" +
"    public Book(String code, String title, int available) {\n" +
"        this.code = code;\n" +
"        this.title = title;\n" +
"        this.available = available;\n" +
"    }\n" +
"\n" +
"    public String getCode()      { return code; }\n" +
"    public String getTitle()     { return title; }\n" +
"    public int getAvailable()    { return available; }\n" +
"    public void setAvailable(int a) { available = a; }\n" +
"\n" +
"    // Protocol line format: CODE|TITLE|AVAILABLE\n" +
"    public String toProtocolLine() {\n" +
"        return code + \"|\" + title + \"|\" + available;\n" +
"    }\n" +
"}", lang: "java" },
            { note: "The `toProtocolLine` method centralises the `CODE|TITLE|AVAILABLE` format in one place, so LIST and SEARCH both produce identical output and you can't get the delimiters wrong under pressure." }
          ]
        },
        {
          title: "Write the main server class with the accept loop",
          tags: ["L09 Networking", "L10 Multi-client", "L07 Threads"],
          body: [
            { p: "`main` creates the `ServerSocket`, prints the server IP, then loops forever: it **blocks on `accept`**, and for each new socket it starts a `ClientHandler` thread with an incrementing client number." },
            { file: "LibraryServer.java" },
            { code:
"import java.net.InetAddress;\n" +
"import java.net.ServerSocket;\n" +
"import java.net.Socket;\n" +
"\n" +
"public class LibraryServer {\n" +
"    private static final int PORT = 5050;\n" +
"\n" +
"    public static void main(String[] args) {\n" +
"        // One shared manager for ALL clients: the central database.\n" +
"        LibraryManager manager = new LibraryManager();\n" +
"        manager.addSampleBooks();\n" +
"\n" +
"        int clientNum = 0;\n" +
"\n" +
"        try (ServerSocket serverSocket = new ServerSocket(PORT)) {\n" +
"            System.out.println(\"Server IP: \" + InetAddress.getLocalHost().getHostAddress());\n" +
"            System.out.println(\"Library server listening on port \" + PORT + \"...\");\n" +
"\n" +
"            // Accept clients forever.\n" +
"            while (true) {\n" +
"                Socket socket = serverSocket.accept(); // blocks until a client connects\n" +
"                clientNum++;\n" +
"                System.out.println(\"Client #\" + clientNum + \" connected from \"\n" +
"                        + socket.getInetAddress().getHostAddress());\n" +
"\n" +
"                // Hand this client to its own handler thread.\n" +
"                ClientHandler handler = new ClientHandler(socket, clientNum, manager);\n" +
"                handler.start();\n" +
"            }\n" +
"        } catch (Exception e) {\n" +
"            System.out.println(\"Server error: \" + e.getMessage());\n" +
"        }\n" +
"    }\n" +
"}", lang: "java" },
            { note: "`accept` **blocks** until a client connects, and that is why the whole server cannot live on one thread serving many clients. Each accepted socket gets its own handler so clients run concurrently." },
            { note: "The `clientNum` increments per connection so you can print `Client #1`, `Client #2`, matching the exam requirement to track and display client numbers." },
            { scaffold: "`ServerSocket` is opened in a try-with-resources so it closes automatically. `InetAddress.getLocalHost().getHostAddress()` prints the server's IP so a client knows where to connect." }
          ]
        }
      ]
    },

    // ============================================================
    {
      id: "manager",
      title: "Q1.2: Shared data structure, LibraryManager",
      intro: "The central database. A HashMap of books guarded by a ReentrantLock so concurrent client threads cannot corrupt it. This is where L06 collections and regex, L08 locks, and L03 try/finally come together.",
      steps: [
        {
          title: "Declare the map and the lock",
          tags: ["L06 Collections", "L08 Locks"],
          body: [
            { p: "Keys are book codes, values are `Book` objects. One `ReentrantLock` protects every access to the map." },
            { file: "LibraryManager.java" },
            { code:
"import java.util.HashMap;\n" +
"import java.util.Map;\n" +
"import java.util.concurrent.locks.Lock;\n" +
"import java.util.concurrent.locks.ReentrantLock;\n" +
"import java.util.regex.Pattern;\n" +
"\n" +
"public class LibraryManager {\n" +
"    private final Map<String, Book> books = new HashMap<>();\n" +
"    private final Lock lock = new ReentrantLock();\n" +
"\n" +
"    // ... methods added in the next steps ...\n" +
"}", lang: "java" },
            { note: "Many client threads share this one object. Without the lock, two threads reserving at the same time could both read `available = 1` and both succeed, which is a race condition from L08. The lock makes each operation atomic." }
          ]
        },
        {
          title: "Add sample books",
          tags: ["L06 Collections"],
          body: [
            { p: "Seed the map so there is data to serve. Use the same books as the protocol example so your output matches." },
            { code:
"    public void addSampleBooks() {\n" +
"        lock.lock();\n" +
"        try {\n" +
"            books.put(\"WRPV301\", new Book(\"WRPV301\", \"Advanced Programming\", 100));\n" +
"            books.put(\"WRPV302\", new Book(\"WRPV302\", \"Advanced Programming\", 80));\n" +
"            books.put(\"WRAV201\", new Book(\"WRAV201\", \"Data Structures\", 120));\n" +
"        } finally {\n" +
"            lock.unlock();\n" +
"        }\n" +
"    }", lang: "java" },
            { note: "Even seeding goes through the lock. It keeps the pattern consistent: every touch of `books` is lock, then try, then finally unlock." }
          ]
        },
        {
          title: "getList to build the LIST reply",
          tags: ["L06 Collections", "L08 Locks", "L03 Exceptions"],
          body: [
            { p: "Return the whole catalogue as the protocol string: one `CODE|TITLE|AVAILABLE` line per book, then `END`." },
            { code:
"    public String getList() {\n" +
"        StringBuilder sb = new StringBuilder();\n" +
"        lock.lock();\n" +
"        try {\n" +
"            for (Book b : books.values()) {\n" +
"                sb.append(b.toProtocolLine()).append(\"\\n\");\n" +
"            }\n" +
"        } finally {\n" +
"            lock.unlock();\n" +
"        }\n" +
"        sb.append(\"END\");\n" +
"        return sb.toString();\n" +
"    }", lang: "java" },
            { note: "The `unlock` is in `finally` so the lock is released even if something throws while building the string, which combines L03 and L08. A lock that is never released means every other client hangs forever." }
          ]
        },
        {
          title: "doSearch for a regex match on book codes",
          tags: ["L06 RegEx", "L08 Locks"],
          body: [
            { p: "Compile the client's pattern and keep only books whose **code** matches. Return the same `...END` format as LIST." },
            { code:
"    public String doSearch(String patternStr) {\n" +
"        StringBuilder sb = new StringBuilder();\n" +
"        lock.lock();\n" +
"        try {\n" +
"            Pattern pattern = Pattern.compile(patternStr);\n" +
"            for (Book b : books.values()) {\n" +
"                if (pattern.matcher(b.getCode()).matches()) {\n" +
"                    sb.append(b.toProtocolLine()).append(\"\\n\");\n" +
"                }\n" +
"            }\n" +
"        } catch (Exception e) {\n" +
"            // Bad regex from the client: return just END, an empty result.\n" +
"            System.out.println(\"Search error: \" + e.getMessage());\n" +
"        } finally {\n" +
"            lock.unlock();\n" +
"        }\n" +
"        sb.append(\"END\");\n" +
"        return sb.toString();\n" +
"    }", lang: "java" },
            { note: "`matcher(...).matches()` requires the WHOLE code to match the pattern. So `WRPV3.*` matches WRPV301 and WRPV302, and `^[A-Z]{4}3\\d{2}$` matches all third-year codes. This is exactly the regex skill from L06 the exam tests." },
            { note: "Compiling a bad pattern throws `PatternSyntaxException`. Catching it means one client's typo cannot crash the handler thread, which is L03 graceful handling." }
          ]
        },
        {
          title: "reserveBook to decrement under lock",
          tags: ["L08 Locks", "L03 Exceptions"],
          body: [
            { p: "The critical operation. Look up the book, and if it exists and has copies, decrement and return `SUCCESS`. If it is full, return `FULL`, and if the code is unknown, return a clear error." },
            { code:
"    public String reserveBook(String code, String membershipNumber) {\n" +
"        lock.lock();\n" +
"        try {\n" +
"            Book book = books.get(code);\n" +
"            if (book == null) {\n" +
"                return \"ERROR:Unknown book code\";\n" +
"            }\n" +
"            if (book.getAvailable() <= 0) {\n" +
"                return \"FULL\";\n" +
"            }\n" +
"            book.setAvailable(book.getAvailable() - 1);\n" +
"            System.out.println(\"Reserved \" + code + \" for \" + membershipNumber\n" +
"                    + \" (\" + book.getAvailable() + \" left)\");\n" +
"            return \"SUCCESS\";\n" +
"        } finally {\n" +
"            lock.unlock();\n" +
"        }\n" +
"    }", lang: "java" },
            { note: "The read via `getAvailable`, the decision, and the write via `setAvailable` all happen inside ONE lock. That is what prevents the classic race where two members reserve the last copy. This single method is the heart of the L08 marks." }
          ]
        }
      ]
    },

    // ============================================================
    {
      id: "handler",
      title: "Q1.3: ClientHandler with read/write threads",
      intro: "One handler per client, giving full-duplex communication. A ReadThread only reads client commands and enqueues outgoing replies, and a WriteThread drains the queue to the socket. This is the L10 multi-client pattern.",
      steps: [
        {
          title: "Set up the handler, socket and streams",
          tags: ["L09 Networking", "L07 Threads"],
          body: [
            { p: "`ClientHandler extends Thread`. It takes the client's `Socket`, its client number, and the shared `LibraryManager`. It owns a text reader and writer over the socket and a queue of outgoing messages." },
            { file: "ClientHandler.java" },
            { code:
"import java.io.BufferedReader;\n" +
"import java.io.InputStreamReader;\n" +
"import java.io.PrintWriter;\n" +
"import java.net.Socket;\n" +
"import java.util.concurrent.BlockingQueue;\n" +
"import java.util.concurrent.LinkedBlockingQueue;\n" +
"\n" +
"public class ClientHandler extends Thread {\n" +
"    private final Socket socket;\n" +
"    private final int clientNum;\n" +
"    private final LibraryManager manager;\n" +
"\n" +
"    private BufferedReader in;\n" +
"    private PrintWriter out;\n" +
"\n" +
"    // Messages waiting to be written back to this client.\n" +
"    private final BlockingQueue<String> outgoing = new LinkedBlockingQueue<>();\n" +
"    private volatile boolean running = true;\n" +
"\n" +
"    public ClientHandler(Socket socket, int clientNum, LibraryManager manager) {\n" +
"        this.socket = socket;\n" +
"        this.clientNum = clientNum;\n" +
"        this.manager = manager;\n" +
"    }\n" +
"\n" +
"    // run, threads and helpers added below ...\n" +
"}", lang: "java" },
            { note: "A `BlockingQueue` decouples deciding what to say from actually sending it. The read side just drops replies on the queue, and the write side sends them. `take` on the queue blocks when empty, so the write thread sleeps instead of busy-waiting, which is an L07 idea." },
            { scaffold: "`volatile boolean running` lets one thread signal the other to stop, and `volatile` ensures the change is visible across threads." }
          ]
        },
        {
          title: "run to open streams and launch the two threads",
          tags: ["L07 Threads", "L10 Multi-client", "L03 Exceptions"],
          body: [
            { p: "`run` initialises the streams, then starts a **WriteThread** and runs the read loop. Wrapping stream setup in try/catch handles initialisation failures." },
            { code:
"    @Override\n" +
"    public void run() {\n" +
"        try {\n" +
"            in = new BufferedReader(new InputStreamReader(socket.getInputStream()));\n" +
"            out = new PrintWriter(socket.getOutputStream(), true); // auto-flush\n" +
"        } catch (Exception e) {\n" +
"            System.out.println(\"Client #\" + clientNum + \" stream init failed: \" + e.getMessage());\n" +
"            return;\n" +
"        }\n" +
"\n" +
"        // Writer thread: drains the outgoing queue to the socket.\n" +
"        Thread writeThread = new WriteThread();\n" +
"        writeThread.start();\n" +
"\n" +
"        // This thread becomes the reader.\n" +
"        readLoop();\n" +
"\n" +
"        // Reader finished because the client quit or disconnected: stop the writer and close.\n" +
"        running = false;\n" +
"        writeThread.interrupt();\n" +
"        closeQuietly();\n" +
"    }", lang: "java" },
            { note: "Separate read and write threads give **full-duplex** communication, an L10 idea: the server can push a reply while still able to read the next command. One thread doing both would be half-duplex because reads block." },
            { note: "`PrintWriter` with the auto-flush flag true flushes on `println`, so replies are sent immediately instead of sitting in a buffer." }
          ]
        },
        {
          title: "readLoop to parse commands and enqueue replies",
          tags: ["L09 Networking", "L10 Multi-client", "L06 RegEx"],
          body: [
            { p: "Read one line at a time. Reads block, which is fine on this dedicated thread. Parse the command, call the right `LibraryManager` method, and **enqueue** the reply for the write thread." },
            { code:
"    private void readLoop() {\n" +
"        try {\n" +
"            String line;\n" +
"            while (running && (line = in.readLine()) != null) {\n" +
"                System.out.println(\"Client #\" + clientNum + \" -> \" + line);\n" +
"\n" +
"                if (line.equals(\"LIST\")) {\n" +
"                    outgoing.put(manager.getList());\n" +
"\n" +
"                } else if (line.startsWith(\"SEARCH:\")) {\n" +
"                    String pattern = line.substring(\"SEARCH:\".length());\n" +
"                    outgoing.put(manager.doSearch(pattern));\n" +
"\n" +
"                } else if (line.startsWith(\"RESERVE:\")) {\n" +
"                    // RESERVE:bookCode:membershipNumber\n" +
"                    String[] parts = line.split(\":\");\n" +
"                    if (parts.length == 3) {\n" +
"                        outgoing.put(manager.reserveBook(parts[1], parts[2]));\n" +
"                    } else {\n" +
"                        outgoing.put(\"ERROR:Bad RESERVE format\");\n" +
"                    }\n" +
"\n" +
"                } else if (line.equals(\"QUIT\")) {\n" +
"                    outgoing.put(\"GOODBYE\");\n" +
"                    break; // stop reading; run will clean up\n" +
"\n" +
"                } else {\n" +
"                    outgoing.put(\"ERROR:Unknown command\");\n" +
"                }\n" +
"            }\n" +
"        } catch (Exception e) {\n" +
"            System.out.println(\"Client #\" + clientNum + \" read error: \" + e.getMessage());\n" +
"        }\n" +
"    }", lang: "java" },
            { note: "`in.readLine()` returns `null` when the client disconnects, and that ends the loop naturally. Reads blocking here is exactly why reading lives on its own thread, an L10 point." },
            { note: "Parsing is just string work: `startsWith` to identify the command, then `substring` or `split` to pull arguments. The server does NOT validate the membership number, because that is the client's job via L06 regex in Part 2." }
          ]
        },
        {
          title: "WriteThread to drain the queue to the socket",
          tags: ["L07 Threads", "L10 Multi-client"],
          body: [
            { p: "An inner `Thread` that blocks on `outgoing.take()` and writes each message with `println`. Interrupting it from `run` breaks the loop." },
            { code:
"    private class WriteThread extends Thread {\n" +
"        @Override\n" +
"        public void run() {\n" +
"            try {\n" +
"                while (running) {\n" +
"                    String msg = outgoing.take(); // blocks until a message is queued\n" +
"                    out.println(msg);\n" +
"                }\n" +
"            } catch (InterruptedException e) {\n" +
"                // Normal shutdown signal from run.\n" +
"            }\n" +
"        }\n" +
"    }", lang: "java" },
            { note: "`take` blocks when the queue is empty, so the write thread consumes no CPU while idle. When `readLoop` enqueues a reply, `take` wakes and sends it. When `run` calls `interrupt`, `take` throws `InterruptedException` and the thread exits cleanly, which is L07 stopping threads." }
          ]
        },
        {
          title: "closeQuietly for a tidy shutdown",
          tags: ["L03 Exceptions", "L09 Networking"],
          body: [
            { p: "Close the socket and streams, swallowing exceptions, because there is nothing useful to do if a close fails during teardown." },
            { code:
"    private void closeQuietly() {\n" +
"        try { if (in != null) in.close(); } catch (Exception ignored) {}\n" +
"        if (out != null) out.close();\n" +
"        try { socket.close(); } catch (Exception ignored) {}\n" +
"        System.out.println(\"Client #\" + clientNum + \" disconnected.\");\n" +
"    }", lang: "java" },
            { note: "Graceful error handling from L03: teardown should never throw its way out and take down the server. Each close is guarded independently." }
          ]
        },
        {
          title: "Run it and test with telnet",
          tags: ["L09 Networking"],
          body: [
            { p: "Run `LibraryServer`. You should see the server IP and the listening message. Then test the protocol by hand before the Android client even exists." },
            { scaffold: "In a terminal, connect with a raw TCP client and type commands. On Windows you may need to enable the Telnet client, or use PuTTY in Raw mode to host 127.0.0.1 port 5050." },
            { code:
"telnet 127.0.0.1 5050\n" +
"LIST\n" +
"SEARCH:WRPV3.*\n" +
"RESERVE:WRPV301:206008384\n" +
"QUIT", lang: "text" },
            { p: "Expected results: LIST and SEARCH return `...|...|...` lines ending in `END`. RESERVE returns `SUCCESS`, then `FULL` once copies hit 0. QUIT returns `GOODBYE`. Open a second telnet at the same time to prove multiple clients work concurrently." },
            { note: "Testing the server standalone first means that when the Android client misbehaves later, you already KNOW the server is correct, so you can isolate the bug to the client." }
          ]
        }
      ]
    },

    // ============================================================
    {
      id: "checklist",
      title: "Mark-grab checklist for the server",
      intro: "Quick self-check that you hit every graded requirement before moving to the client.",
      steps: [
        {
          title: "Confirm each requirement is present",
          tags: ["exam"],
          body: [
            { list: [
              "**ServerSocket on 5050** and server IP printed on startup",
              "**Infinite accept loop** creating a **ClientHandler per client**",
              "**clientNum** incremented and displayed, e.g. Client #1, #2",
              "**HashMap<String, Book>** keyed by code",
              "**ReentrantLock** guarding every map access, unlocked in **finally**",
              "**getList, doSearch, reserveBook** implemented per protocol",
              "**Regex** search using `Pattern` and `matcher().matches()`",
              "**BlockingQueue** plus **ReadThread** plus **WriteThread** for full duplex",
              "**Exception handling** for stream init, bad regex, unknown codes, and network errors"
            ]},
            { note: "If every box is ticked, the server half is complete. It is worth 30 marks in the real paper. Next, the Android client consumes exactly this protocol." }
          ]
        }
      ]
    }
  ]
});
