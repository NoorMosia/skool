registerGuide({
  id: "09",
  title: "L09: Networking",
  blurb: "Connect two programs over the network: a TCP server and client exchanging text, doing it off the UI thread on Android, plus a UDP alternative.",

  recipes: [
    // ============================================================
    {
      name: "Write a TCP server",
      goal: "A console server that waits for a client and exchanges text over a socket.",
      tags: ["TCP", "ServerSocket"],
      steps: [
        {
          do: "Create a ServerSocket on a port and wait for a client.",
          body: [
            { code:
"import java.net.ServerSocket;\n" +
"import java.net.Socket;\n" +
"\n" +
"ServerSocket server = new ServerSocket(5050);\n" +
"System.out.println(\"Waiting for a client...\");\n" +
"Socket conn = server.accept(); // blocks until a client connects", lang: "java" },
            { note: "`accept()` blocks: it pauses the thread until a client connects. That blocking is the reason real servers give each client its own thread (see L10)." }
          ]
        },
        {
          do: "Get the input and output streams.",
          body: [
            { code:
"import java.io.BufferedReader;\n" +
"import java.io.InputStreamReader;\n" +
"import java.io.PrintWriter;\n" +
"\n" +
"BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));\n" +
"PrintWriter out = new PrintWriter(conn.getOutputStream(), true); // true = auto-flush", lang: "java" }
          ]
        },
        {
          do: "Read a line and reply.",
          body: [
            { code:
"String request = in.readLine(); // blocking read\n" +
"out.println(\"You said: \" + request);", lang: "java" },
            { note: "Every read on an input stream blocks until data arrives. `PrintWriter(..., true)` auto-flushes so the reply is sent immediately." }
          ]
        },
        {
          do: "Close the connection when done.",
          body: [
            { code:
"in.close();\n" +
"out.close();\n" +
"conn.close();", lang: "java" }
          ]
        }
      ]
    },

    // ============================================================
    {
      name: "Write a TCP client",
      goal: "A program that connects to the server and talks to it.",
      tags: ["TCP", "Socket"],
      steps: [
        {
          do: "Connect to the server by host and port.",
          body: [
            { code:
"import java.net.Socket;\n" +
"\n" +
"Socket conn = new Socket(\"127.0.0.1\", 5050);", lang: "java" },
            { note: "On the Android emulator, the host PC is `10.0.2.2`, not `127.0.0.1`. On a real device use the server's LAN IP." }
          ]
        },
        {
          do: "Get the same two streams and exchange text.",
          body: [
            { code:
"BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));\n" +
"PrintWriter out = new PrintWriter(conn.getOutputStream(), true);\n" +
"\n" +
"out.println(\"LIST\");            // send\n" +
"String reply = in.readLine();   // receive (blocks)\n" +
"conn.close();", lang: "java" },
            { note: "Socket stream IO works like file IO: read and write lines. The client and server must agree on the message format." }
          ]
        }
      ]
    },

    // ============================================================
    {
      name: "Do networking off the UI thread (Android)",
      goal: "Talk to the server from an Android app without freezing or crashing.",
      tags: ["TCP", "Threads"],
      steps: [
        {
          do: "Add the INTERNET permission to the manifest.",
          body: [
            { code:
"<uses-permission android:name=\"android.permission.INTERNET\" />", lang: "xml" },
            { note: "No permission means no networking. INTERNET is a normal permission, granted at install, so no runtime prompt is needed." }
          ]
        },
        {
          do: "Run all socket work on a background thread.",
          body: [
            { code:
"new Thread(() -> {\n" +
"    try {\n" +
"        Socket conn = new Socket(\"10.0.2.2\", 5050);\n" +
"        PrintWriter out = new PrintWriter(conn.getOutputStream(), true);\n" +
"        BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));\n" +
"        out.println(\"LIST\");\n" +
"        String reply = in.readLine();\n" +
"        runOnUiThread(() -> textView.setText(reply)); // UI update back on main\n" +
"    } catch (Exception e) {\n" +
"        e.printStackTrace();\n" +
"    }\n" +
"}).start();", lang: "java" },
            { note: "Opening a socket on the UI thread throws NetworkOnMainThreadException. Do the network work on a thread, then post UI updates with runOnUiThread." }
          ]
        }
      ]
    },

    // ============================================================
    {
      name: "Send with UDP datagrams",
      goal: "The connectionless alternative: fast, but no delivery or ordering guarantee.",
      tags: ["UDP", "DatagramSocket"],
      steps: [
        {
          do: "Create a datagram socket and packets.",
          body: [
            { code:
"import java.net.DatagramSocket;\n" +
"import java.net.DatagramPacket;\n" +
"import java.net.InetAddress;\n" +
"\n" +
"DatagramSocket sock = new DatagramSocket(5050);\n" +
"byte[] buf = new byte[256];\n" +
"DatagramPacket in = new DatagramPacket(buf, buf.length);\n" +
"sock.receive(in); // blocks", lang: "java" }
          ]
        },
        {
          do: "Send a packet to a target.",
          body: [
            { code:
"byte[] data = \"hello\".getBytes();\n" +
"InetAddress addr = InetAddress.getByName(\"127.0.0.1\");\n" +
"DatagramPacket out = new DatagramPacket(data, data.length, addr, 5050);\n" +
"sock.send(out);", lang: "java" },
            { note: "TCP vs UDP: TCP is connection-oriented, lossless, in-order, slower, good for chat or documents. UDP is connectionless, faster, may lose or reorder packets, good for live audio or video." }
          ]
        }
      ]
    }
  ]
});
