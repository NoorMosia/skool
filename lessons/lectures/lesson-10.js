registerGuide({
  id: "10",
  title: "L10: Multi-client Networking",
  blurb: "Turn the single-client server into a concurrent one: a thread per client, separate read and write threads for full duplex, and a text protocol they all speak.",

  recipes: [
    // ============================================================
    {
      name: "Accept many clients, one thread each",
      goal: "A server that serves several clients at the same time instead of one at a time.",
      tags: ["Multi-client", "Threads"],
      steps: [
        {
          do: "Loop forever, accepting clients and handing each to its own handler thread.",
          body: [
            { code:
"ServerSocket server = new ServerSocket(5050);\n" +
"int clientNum = 0;\n" +
"while (true) {\n" +
"    Socket socket = server.accept(); // blocks for the next client\n" +
"    clientNum++;\n" +
"    System.out.println(\"Client #\" + clientNum + \" connected\");\n" +
"    new ClientHandler(socket, clientNum).start();\n" +
"}", lang: "java" },
            { note: "Because `accept()` and reads block, one shared thread could only serve one client. A thread per connection lets clients run concurrently." }
          ]
        },
        {
          do: "Make the handler a Thread that owns one client's socket.",
          body: [
            { code:
"public class ClientHandler extends Thread {\n" +
"    private final Socket socket;\n" +
"    private final int clientNum;\n" +
"    public ClientHandler(Socket socket, int clientNum) {\n" +
"        this.socket = socket;\n" +
"        this.clientNum = clientNum;\n" +
"    }\n" +
"    @Override public void run() { /* streams + loops, below */ }\n" +
"}", lang: "java" }
          ]
        }
      ]
    },

    // ============================================================
    {
      name: "Full duplex with read and write threads",
      goal: "Let the server send and receive at the same time, instead of strict request then response.",
      tags: ["Multi-client", "BlockingQueue"],
      steps: [
        {
          do: "Use a BlockingQueue to hold outgoing messages.",
          body: [
            { code:
"import java.util.concurrent.BlockingQueue;\n" +
"import java.util.concurrent.LinkedBlockingQueue;\n" +
"\n" +
"private final BlockingQueue<String> outgoing = new LinkedBlockingQueue<>();", lang: "java" },
            { note: "The queue is a thread-safe hand-off: the read side drops replies on it, the write side takes them off. One blocked read never stops writing." }
          ]
        },
        {
          do: "Read thread: read requests, enqueue replies.",
          body: [
            { code:
"// in run(), after setting up 'in' and 'out'\n" +
"String line;\n" +
"while ((line = in.readLine()) != null) {\n" +
"    outgoing.put(handle(line)); // handle() builds the reply string\n" +
"}", lang: "java" },
            { note: "`in.readLine()` returns null when the client disconnects, which ends the loop naturally." }
          ]
        },
        {
          do: "Write thread: drain the queue to the socket.",
          body: [
            { code:
"new Thread(() -> {\n" +
"    try {\n" +
"        while (running) {\n" +
"            out.println(outgoing.take()); // blocks until a message is queued\n" +
"        }\n" +
"    } catch (InterruptedException ignored) { }\n" +
"}).start();", lang: "java" },
            { note: "`take()` blocks when the queue is empty, so the write thread uses no CPU while idle. Separate read and write threads is what makes it full duplex." }
          ]
        }
      ]
    },

    // ============================================================
    {
      name: "Speak a simple text protocol",
      goal: "Agree on commands and responses so any client and server can understand each other.",
      tags: ["Multi-client", "Protocol"],
      steps: [
        {
          do: "Define the commands and replies.",
          body: [
            { list: [
              "`LIST` returns items, one per line, ending with `END`.",
              "`SEARCH:pattern` returns matching items, ending with `END`.",
              "`RESERVE:code:member` returns `SUCCESS` or `FULL`.",
              "`QUIT` returns `GOODBYE`."
            ]},
            { note: "A protocol is just the agreed rules for messages. If both sides follow it, any compliant client works with any compliant server." }
          ]
        },
        {
          do: "Parse the command in handle() and build the reply.",
          body: [
            { code:
"private String handle(String line) {\n" +
"    if (line.equals(\"LIST\")) {\n" +
"        return buildList(); // CODE|TITLE|VALUE lines then END\n" +
"    } else if (line.startsWith(\"SEARCH:\")) {\n" +
"        return doSearch(line.substring(7));\n" +
"    } else if (line.startsWith(\"RESERVE:\")) {\n" +
"        String[] p = line.split(\":\");\n" +
"        return reserve(p[1], p[2]); // SUCCESS or FULL\n" +
"    } else if (line.equals(\"QUIT\")) {\n" +
"        return \"GOODBYE\";\n" +
"    }\n" +
"    return \"ERROR:Unknown command\";\n" +
"}", lang: "java" },
            { note: "Parsing is plain string work: startsWith to identify the command, substring or split to pull out arguments." }
          ]
        }
      ]
    },

    // ============================================================
    {
      name: "Protect shared server data",
      goal: "Keep the central data correct while many client threads read and write it.",
      tags: ["Multi-client", "Locks"],
      steps: [
        {
          do: "Guard the shared structure with a lock (from L08).",
          body: [
            { code:
"private final Map<String, Integer> stock = new HashMap<>();\n" +
"private final Lock lock = new ReentrantLock();\n" +
"\n" +
"String reserve(String code, String member) {\n" +
"    lock.lock();\n" +
"    try {\n" +
"        Integer n = stock.get(code);\n" +
"        if (n == null) return \"ERROR:Unknown code\";\n" +
"        if (n <= 0) return \"FULL\";\n" +
"        stock.put(code, n - 1);\n" +
"        return \"SUCCESS\";\n" +
"    } finally {\n" +
"        lock.unlock();\n" +
"    }\n" +
"}", lang: "java" },
            { note: "Many threads plus one shared structure equals possible race conditions. The lock around every access is the fix, and unlock stays in finally." }
          ]
        }
      ]
    }
  ]
});
