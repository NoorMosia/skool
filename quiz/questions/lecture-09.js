registerLecture({
  id: "09",
  title: "L09: Networking",
  blurb: "TCP vs UDP, client/server, internet permission & threading, stream & datagram sockets.",
  questions: [
    // ---- MCQ ----
    {
      type: "mcq",
      prompt: "Stream Sockets use which protocol?",
      options: ["UDP", "TCP/IP", "HTTP", "FTP"],
      answer: 1,
      explanation: "Stream Sockets use TCP/IP: a reliable, connection-oriented protocol where all data flows through the same path."
    },
    {
      type: "mcq",
      prompt: "Datagram Sockets use which protocol?",
      options: ["TCP/IP", "UDP", "SMTP", "SSH"],
      answer: 1,
      explanation: "Datagram Sockets use UDP (User Datagram Protocol): connectionless, faster, but not lossless and no guaranteed order."
    },
    {
      type: "mcq",
      prompt: "Which is a key property of TCP?",
      options: [
        "Lossless and reliable (lost packets detected & resubmitted)",
        "No guarantee on delivery",
        "No ordering of packets",
        "Fastest with no connection overhead"
      ],
      answer: 0,
      explanation: "TCP is lossless and reliable; lost packets are detected and resubmitted, and transmission is in order."
    },
    {
      type: "mcq",
      prompt: "Which example use is suggested for UDP?",
      options: ["Chat messages", "Working with documents", "Live audio/video call", "Database transactions"],
      answer: 2,
      explanation: "UDP suits a live audio/video call (speed over reliability); TCP suits chat messages and documents."
    },
    {
      type: "mcq",
      prompt: "On the server, which call blocks while listening for a client connection?",
      options: ["`new ServerSocket(port)`", "`s.accept()`", "`conn.getInputStream()`", "`conn.close()`"],
      answer: 1,
      explanation: "`Socket conn = s.accept();` blocks until a client connects."
    },
    {
      type: "mcq",
      prompt: "Reading from an input stream is what kind of operation?",
      options: ["Non-blocking", "Blocking", "Asynchronous by default", "UI-thread only"],
      answer: 1,
      explanation: "NB!! All read operations on an input stream are blocking."
    },
    {
      type: "mcq",
      prompt: "Why must communication occur on a (non-UI) Thread?",
      options: [
        "Running on the UI thread will cause problems",
        "The UI thread cannot create sockets",
        "Threads are faster than the UI",
        "The manifest requires it"
      ],
      answer: 0,
      explanation: "Communication must occur on a Thread; running network I/O on the UI thread will cause problems."
    },
    {
      type: "mcq",
      prompt: "Which method posts a UI update back onto the UI thread from a background thread?",
      options: ["`runOnUiThread`", "`accept`", "`openFileInput`", "`newCondition`"],
      answer: 0,
      explanation: "`activity.runOnUiThread(() -> activity.addMessage(message));` posts work to the UI thread."
    },

    // ---- Multi-select ----
    {
      type: "multi",
      prompt: "Which are listed trade-offs/characteristics of UDP?",
      options: [
        "Faster",
        "No guarantee on delivery",
        "No ordering",
        "End-to-end reliable connection"
      ],
      answers: [0, 1, 2],
      explanation: "UDP is faster but has no delivery guarantee and no ordering. An end-to-end reliable connection is TCP."
    },
    {
      type: "multi",
      prompt: "Which are output stream classes in the streams recap?",
      options: [
        "PrintWriter",
        "DataOutputStream",
        "ObjectOutputStream",
        "BufferedReader"
      ],
      answers: [0, 1, 2],
      explanation: "PrintWriter, DataOutputStream, ObjectOutputStream are output. BufferedReader is input."
    },
    {
      type: "multi",
      prompt: "Which steps are part of setting up a stream socket SERVER?",
      options: [
        "Create a ServerSocket attached to a port",
        "Call accept() to listen (block) for a client connection",
        "Obtain I/O streams from the connection",
        "Call new Socket(servername, port) to connect out"
      ],
      answers: [0, 1, 2],
      explanation: "Server: create ServerSocket, accept(), obtain I/O streams, communicate, close. new Socket(servername, port) is the CLIENT step."
    },
    {
      type: "multi",
      prompt: "Which steps are part of using a datagram socket?",
      options: [
        "Create a DatagramSocket",
        "Create a Data-In DatagramPacket",
        "Create a Data-Out DatagramPacket",
        "Call accept() to block for a connection"
      ],
      answers: [0, 1, 2],
      explanation: "Datagram: create socket, create in/out packets, then receive()/send(). accept() belongs to stream (TCP) sockets."
    },

    // ---- True / False ----
    {
      type: "tf",
      prompt: "An app needs no special permission to access the internet.",
      answer: false,
      explanation: "It needs `<uses-permission android:name=\"android.permission.INTERNET\"/>` — no permission, no communication."
    },
    {
      type: "tf",
      prompt: "With UDP, data packets may follow different paths and arrive out of order.",
      answer: true,
      explanation: "Correct. UDP packets may follow different paths with no guaranteed order."
    },
    {
      type: "tf",
      prompt: "Stream IO over a socket works in a similar way to file IO.",
      answer: true,
      explanation: "Correct. Stream IO works like file IO, and you communicate with the client/server like file I/O."
    },

    // ---- Fill in the blank ----
    {
      type: "fill",
      prompt: "The client connects to a server by creating `new {{blank}}(servername, port)`.",
      blanks: [["Socket", "Socket()"]],
      explanation: "`Socket conn = new Socket(servername, port);` connects the client to the server."
    }
  ]
});
