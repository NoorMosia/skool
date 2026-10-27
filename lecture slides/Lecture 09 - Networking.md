# Lecture 09: Networking

## Socket Communication

### Connection-oriented

- Stream Sockets use TCP/IP (Transmission Control Protocol/Internet Protocol)
- Stream IO works like file IO
- Sets up a reliable connection between end-points
- All data flows through the same path
- TCP is lossless & reliable as lost packets are detected & resubmitted

### Connectionless

- Datagram Sockets use UDP (User Datagram Protocol)
- Data packets may follow different paths
- UDP is faster (no connection overhead), but is not lossless
- No guaranteed packet order
- Low-level: byte array data, FIFO

### Trade-offs

**TCP/IP**

- End-to-end connection
- Lossless communication
- In-order transmission
- Not as fast

**UDP**

- Faster
- No guarantee on delivery
- No ordering
- Specific data type

So, why use one vs the other?

- TCP/IP: chat messages & working with documents
- UDP: live audio/video call

## Client/Server computing

- Client requests a connection; server accepts/rejects the connection
- Client makes requests; server provides responses

## Android & communication

- An app needs permission to access the internet:
  - `<uses-permission android:name="android.permission.INTERNET"/>`
  - No permission → no communication
- Communication must occur on a Thread
  - Running on the UI thread will cause problems
- UI updates from another thread must be posted back to the UI thread:

```java
runOnUiThread(new Runnable() {
    @Override
    public void run() {
        activity.addMessage(message);
    }
});

// Or with a lambda expression:
protected void displayMessage(String message) {
    activity.runOnUiThread(() -> activity.addMessage(message));
}
```

## Streams recap

Output:

- `PrintWriter(OutputStream out)`
- `DataOutputStream(OutputStream out)`
- `ObjectOutputStream(OutputStream out)`

Input:

- `InputStreamReader(InputStream in)`
- `BufferedReader(InputStreamReader isr)`
- `DataInputStream(InputStream in)`
- `ObjectInputStream(InputStream in)`

## Stream sockets: Server

1. Create a new server socket & attach it to a port:

```java
ServerSocket s = new ServerSocket(port, numUsers);
```

2. Server listens (blocks) for a client connection:

```java
Socket conn = s.accept();
```

3. Obtain I/O streams:

```java
InputStream is = conn.getInputStream();
OutputStream os = conn.getOutputStream();
```

4. Communicate with the client (like file I/O).

   NB!! Reading from an input stream is a blocking operation.

5. Close the connection:

```java
is.close();
os.close();
conn.close();
```

## Stream sockets: Client

1. Connect to the server:

```java
Socket conn = new Socket(servername, port);
```

2. Obtain I/O streams:

```java
InputStream is = conn.getInputStream();
OutputStream os = conn.getOutputStream();
```

3. Communicate with the server (like file I/O).

   NB!! Reading from an input stream is a blocking operation.

4. Close the connection:

```java
is.close();
os.close();
conn.close();
```

Note: ALL read operations on an input stream are blocking. A reference for port numbers: https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers

## Datagram sockets

1. Create a Datagram socket:

```java
DatagramSocket sock = new DatagramSocket(port);
```

2. Create a Data-In Datagram packet:

```java
DatagramPacket dataIn = new DatagramPacket(new byte[X], X);
```

3. Create a Data-Out Datagram packet:

```java
DatagramPacket dataOut = new DatagramPacket(new byte[X], X, target, port);
```

4. Do the communication:

```java
sock.receive(dataIn);
sock.send(dataOut);
```
