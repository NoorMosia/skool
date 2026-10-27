registerWalkthrough({
  id: "2-client",
  title: "Part 2: Android Client in Android Studio",
  blurb: "Build the Android client for the Library Reservation system. It is a fragment-based UI that connects to the server, lists and searches books, and reserves a book with a validated membership number. It mirrors the exam's Question 2.",

  sections: [
    // ============================================================
    {
      id: "setup",
      title: "Q2 setup: project, manifest, MainActivity",
      intro: "Scaffold the Android project and the single Activity that will host two fragments. The server is already running on port 5050 from Part 1.",
      steps: [
        {
          title: "Create the Android Studio project",
          tags: ["setup", "L04 Activities"],
          body: [
            { scaffold: "Choose New Project, then Empty Views Activity, Java. Name it with your student number, e.g. `LibraryClient_206008384`. Minimum SDK 24+ is fine. Follow any setup instructions the exam provides exactly." },
            { p: "You get a `MainActivity` and `activity_main.xml`. We will turn the activity layout into a **fragment container** and drive two fragments from code." }
          ]
        },
        {
          title: "Add the INTERNET permission",
          tags: ["L03 Permissions", "L09 Networking"],
          body: [
            { p: "Network access needs the INTERNET permission. Without it, every socket call fails." },
            { file: "AndroidManifest.xml" },
            { code:
"<manifest xmlns:android=\"http://schemas.android.com/apk/res/android\">\n" +
"\n" +
"    <uses-permission android:name=\"android.permission.INTERNET\" />\n" +
"\n" +
"    <application ... >\n" +
"        <activity android:name=\".MainActivity\" android:exported=\"true\">\n" +
"            <intent-filter>\n" +
"                <action android:name=\"android.intent.action.MAIN\" />\n" +
"                <category android:name=\"android.intent.category.LAUNCHER\" />\n" +
"            </intent-filter>\n" +
"        </activity>\n" +
"    </application>\n" +
"</manifest>", lang: "xml" },
            { note: "INTERNET is a normal permission rather than a dangerous one, so it is granted at install time and you do NOT need a runtime request for it, which is an L03 point. Only dangerous permissions such as location need the runtime prompt." }
          ]
        },
        {
          title: "Make the activity layout a fragment container",
          tags: ["L05 Fragments", "L04 Layouts"],
          body: [
            { p: "Replace the default layout with a single `FrameLayout` that fragments will be swapped into." },
            { file: "res/layout/activity_main.xml" },
            { code:
"<?xml version=\"1.0\" encoding=\"utf-8\"?>\n" +
"<FrameLayout xmlns:android=\"http://schemas.android.com/apk/res/android\"\n" +
"    android:id=\"@+id/fragmentContainer\"\n" +
"    android:layout_width=\"match_parent\"\n" +
"    android:layout_height=\"match_parent\" />", lang: "xml" },
            { note: "A container rather than a static `<fragment>` is used so we can swap the list fragment for the detail fragment at runtime via the FragmentManager, which is an L05 idea. A static fragment in XML cannot be swapped." }
          ]
        },
        {
          title: "The Book model, a shared shape with the server",
          tags: ["L06 Collections"],
          body: [
            { p: "A small data class the client uses to hold a parsed book line. The protocol line `CODE|TITLE|AVAILABLE` maps straight onto it." },
            { file: "Book.java" },
            { code:
"public class Book {\n" +
"    public final String code;\n" +
"    public final String title;\n" +
"    public int available;\n" +
"\n" +
"    public Book(String code, String title, int available) {\n" +
"        this.code = code;\n" +
"        this.title = title;\n" +
"        this.available = available;\n" +
"    }\n" +
"\n" +
"    // Parse one protocol line: CODE|TITLE|AVAILABLE\n" +
"    public static Book fromLine(String line) {\n" +
"        String[] p = line.split(\"\\\\|\");\n" +
"        return new Book(p[0], p[1], Integer.parseInt(p[2]));\n" +
"    }\n" +
"\n" +
"    @Override public String toString() {\n" +
"        return code + \" - \" + title + \" (\" + available + \" available)\";\n" +
"    }\n" +
"}", lang: "java" },
            { note: "`split(\"\\\\|\")` escapes the pipe because `|` is a regex metacharacter, which is an L06 detail. `fromLine` keeps parsing in one place so the list and detail screens stay consistent." }
          ]
        }
      ]
    },

    // ============================================================
    {
      id: "communicator",
      title: "Q2.3: ServerCommunicator, the network layer",
      intro: "The heart of the client: read and write threads, a send queue, and the protocol methods. Build this BEFORE the fragments so the UI has something to call. Every network call runs OFF the UI thread.",
      steps: [
        {
          title: "Define a listener for incoming server messages",
          tags: ["L05 Fragments", "L07 Threads"],
          body: [
            { p: "The read thread runs in the background, so it can't touch the UI. It reports results through a listener that MainActivity implements and then marshals onto the UI thread." },
            { file: "MessageListener.java" },
            { code:
"import java.util.List;\n" +
"\n" +
"public interface MessageListener {\n" +
"    void onBooksReceived(List<Book> books); // reply to LIST / SEARCH\n" +
"    void onReserveResult(String result);    // SUCCESS / FULL / ERROR\n" +
"    void onError(String message);\n" +
"}", lang: "java" },
            { note: "This is the listener and callback pattern from L05 fragment communication, applied to threads. The background worker notifies an interested party without knowing about or touching the UI itself." }
          ]
        },
        {
          title: "Set up the ServerCommunicator and connect on a background thread",
          tags: ["L07 Threads", "L09 Networking", "L03 Exceptions"],
          body: [
            { p: "Fields: the socket, the reader and writer, an outgoing `BlockingQueue`, and the listener. `connect` opens the socket on a background thread, never the UI thread, and starts the read and write threads." },
            { file: "ServerCommunicator.java" },
            { code:
"import java.io.BufferedReader;\n" +
"import java.io.InputStreamReader;\n" +
"import java.io.PrintWriter;\n" +
"import java.net.Socket;\n" +
"import java.util.ArrayList;\n" +
"import java.util.List;\n" +
"import java.util.concurrent.BlockingQueue;\n" +
"import java.util.concurrent.LinkedBlockingQueue;\n" +
"\n" +
"public class ServerCommunicator {\n" +
"    private final String host;\n" +
"    private final int port;\n" +
"    private final MessageListener listener;\n" +
"\n" +
"    private Socket socket;\n" +
"    private BufferedReader in;\n" +
"    private PrintWriter out;\n" +
"    private final BlockingQueue<String> outgoing = new LinkedBlockingQueue<>();\n" +
"    private volatile boolean running = false;\n" +
"\n" +
"    public ServerCommunicator(String host, int port, MessageListener listener) {\n" +
"        this.host = host;\n" +
"        this.port = port;\n" +
"        this.listener = listener;\n" +
"    }\n" +
"\n" +
"    public void connect() {\n" +
"        // Network setup MUST be off the UI thread.\n" +
"        new Thread(() -> {\n" +
"            try {\n" +
"                socket = new Socket(host, port);\n" +
"                in = new BufferedReader(new InputStreamReader(socket.getInputStream()));\n" +
"                out = new PrintWriter(socket.getOutputStream(), true);\n" +
"                running = true;\n" +
"                new ReadThread().start();\n" +
"                new WriteThread().start();\n" +
"            } catch (Exception e) {\n" +
"                listener.onError(\"Connect failed: \" + e.getMessage());\n" +
"            }\n" +
"        }).start();\n" +
"    }\n" +
"\n" +
"    // threads, protocol methods and disconnect added below ...\n" +
"}", lang: "java" },
            { note: "Opening a `Socket` is a blocking network call. Doing it on the UI thread throws `NetworkOnMainThreadException` and freezes the app, which is an L07 and L09 point. That is why `connect` spawns a thread." }
          ]
        },
        {
          title: "WriteThread to drain the queue to the server",
          tags: ["L07 Threads", "L10 Multi-client"],
          body: [
            { p: "Identical pattern to the server's write thread: block on `take`, send with `println`." },
            { code:
"    private class WriteThread extends Thread {\n" +
"        @Override public void run() {\n" +
"            try {\n" +
"                while (running) {\n" +
"                    String msg = outgoing.take(); // blocks until something to send\n" +
"                    out.println(msg);\n" +
"                }\n" +
"            } catch (InterruptedException ignored) { }\n" +
"        }\n" +
"    }", lang: "java" },
            { note: "Separate read and write threads give full-duplex comms on the client too, an L10 idea. The UI can queue a RESERVE while the read thread is still waiting on the previous reply." }
          ]
        },
        {
          title: "ReadThread to read replies and report to the listener",
          tags: ["L07 Threads", "L09 Networking", "L10 Multi-client"],
          body: [
            { p: "Reads line by line. List and Search replies accumulate until `END`, while single-word replies such as `SUCCESS`, `FULL` and `GOODBYE` report immediately." },
            { code:
"    private class ReadThread extends Thread {\n" +
"        @Override public void run() {\n" +
"            try {\n" +
"                List<Book> buffer = new ArrayList<>();\n" +
"                boolean collecting = false;\n" +
"                String line;\n" +
"                while (running && (line = in.readLine()) != null) {\n" +
"                    if (line.equals(\"END\")) {\n" +
"                        listener.onBooksReceived(new ArrayList<>(buffer));\n" +
"                        buffer.clear();\n" +
"                        collecting = false;\n" +
"                    } else if (line.equals(\"SUCCESS\") || line.equals(\"FULL\")) {\n" +
"                        listener.onReserveResult(line);\n" +
"                    } else if (line.equals(\"GOODBYE\")) {\n" +
"                        running = false;\n" +
"                    } else if (line.startsWith(\"ERROR\")) {\n" +
"                        listener.onError(line);\n" +
"                    } else if (line.contains(\"|\")) {\n" +
"                        buffer.add(Book.fromLine(line)); // a CODE|TITLE|AVAILABLE line\n" +
"                        collecting = true;\n" +
"                    }\n" +
"                }\n" +
"            } catch (Exception e) {\n" +
"                listener.onError(\"Read error: \" + e.getMessage());\n" +
"            }\n" +
"        }\n" +
"    }", lang: "java" },
            { note: "The read thread understands the SAME protocol the server speaks: lines with `|` are books, `END` terminates a list, and single words are status replies. Keeping both sides in sync with the protocol table is what makes them interoperable, an L10 point." }
          ]
        },
        {
          title: "Protocol methods: getBooks, searchBooks, reserveBook",
          tags: ["L10 Multi-client", "L07 Threads"],
          body: [
            { p: "Thin methods that build the exact command strings and enqueue them. They return instantly, and the reply arrives later via the listener." },
            { code:
"    public void getBooks() {\n" +
"        outgoing.offer(\"LIST\");\n" +
"    }\n" +
"\n" +
"    public void searchBooks(String pattern) {\n" +
"        outgoing.offer(\"SEARCH:\" + pattern);\n" +
"    }\n" +
"\n" +
"    public void reserveBook(String bookCode, String membershipNumber) {\n" +
"        outgoing.offer(\"RESERVE:\" + bookCode + \":\" + membershipNumber);\n" +
"    }", lang: "java" },
            { note: "`offer` is non-blocking, so these are safe to call straight from a button click on the UI thread. They just drop a string on the queue, and the WriteThread does the actual blocking send. This clean split is what keeps the UI responsive, an L07 point." }
          ]
        },
        {
          title: "disconnect to send QUIT and tidy up",
          tags: ["L09 Networking", "L03 Exceptions"],
          body: [
            { code:
"    public void disconnect() {\n" +
"        outgoing.offer(\"QUIT\");\n" +
"        new Thread(() -> {\n" +
"            try { Thread.sleep(150); } catch (InterruptedException ignored) {}\n" +
"            running = false;\n" +
"            try { if (socket != null) socket.close(); } catch (Exception ignored) {}\n" +
"        }).start();\n" +
"    }", lang: "java" },
            { note: "QUIT is queued first so the server gets it and replies GOODBYE, then the socket is closed on a background thread. Guarding close in try/catch is graceful teardown, an L03 point." }
          ]
        }
      ]
    },

    // ============================================================
    {
      id: "mainactivity",
      title: "MainActivity: host fragments & marshal to the UI thread",
      intro: "The Activity owns the ServerCommunicator, implements MessageListener, and switches between the two fragments. Crucially, every listener callback hops back onto the UI thread.",
      steps: [
        {
          title: "Wire up the Activity, connect, show the list fragment",
          tags: ["L04 Activities", "L05 Fragments", "L07 Threads"],
          body: [
            { file: "MainActivity.java" },
            { code:
"import android.os.Bundle;\n" +
"import androidx.appcompat.app.AppCompatActivity;\n" +
"import java.util.List;\n" +
"\n" +
"public class MainActivity extends AppCompatActivity implements MessageListener {\n" +
"    private ServerCommunicator communicator;\n" +
"    private BookListFragment listFragment;\n" +
"\n" +
"    @Override\n" +
"    protected void onCreate(Bundle savedInstanceState) {\n" +
"        super.onCreate(savedInstanceState);\n" +
"        setContentView(R.layout.activity_main);\n" +
"\n" +
"        // Emulator reaches the host PC via 10.0.2.2, not 127.0.0.1.\n" +
"        communicator = new ServerCommunicator(\"10.0.2.2\", 5050, this);\n" +
"        communicator.connect();\n" +
"\n" +
"        listFragment = new BookListFragment();\n" +
"        getSupportFragmentManager().beginTransaction()\n" +
"                .replace(R.id.fragmentContainer, listFragment)\n" +
"                .commit();\n" +
"\n" +
"        communicator.getBooks(); // ask the server for the catalogue\n" +
"    }\n" +
"\n" +
"    public ServerCommunicator getCommunicator() { return communicator; }\n" +
"\n" +
"    // listener callbacks + fragment switching added below ...\n" +
"}", lang: "java" },
            { scaffold: "From the Android emulator, the host machine's `127.0.0.1` is reached as `10.0.2.2`. On a physical device, use the server PC's LAN IP, which is the one LibraryServer prints on startup." }
          ]
        },
        {
          title: "Marshal listener callbacks onto the UI thread",
          tags: ["L07 Threads", "L05 Fragments"],
          body: [
            { p: "These callbacks arrive on the ReadThread. Any UI update must be posted with `runOnUiThread`, then forwarded to whichever fragment is showing." },
            { code:
"    @Override\n" +
"    public void onBooksReceived(List<Book> books) {\n" +
"        runOnUiThread(() -> {\n" +
"            if (listFragment != null && listFragment.isAdded()) {\n" +
"                listFragment.showBooks(books);\n" +
"            }\n" +
"        });\n" +
"    }\n" +
"\n" +
"    @Override\n" +
"    public void onReserveResult(String result) {\n" +
"        runOnUiThread(() -> {\n" +
"            BookDetailFragment detail = (BookDetailFragment)\n" +
"                getSupportFragmentManager().findFragmentById(R.id.fragmentContainer);\n" +
"            if (detail != null && detail.isAdded()) detail.showResult(result);\n" +
"        });\n" +
"    }\n" +
"\n" +
"    @Override\n" +
"    public void onError(String message) {\n" +
"        runOnUiThread(() ->\n" +
"            android.widget.Toast.makeText(this, message, android.widget.Toast.LENGTH_LONG).show());\n" +
"    }", lang: "java" },
            { note: "This is THE rule that earns the Q2.4 considerations marks: network work on a background thread, but UI touches such as updating the list or showing a Toast wrapped in `runOnUiThread`, an L07 point. Touching a View off the UI thread crashes the app." }
          ]
        },
        {
          title: "Switch to the detail fragment when a book is selected",
          tags: ["L05 Fragments", "L04 Activities"],
          body: [
            { p: "The Activity is the intermediary. The list fragment tells it a book was chosen, and it swaps in the detail fragment, passing the book. `addToBackStack` lets Back return to the list." },
            { code:
"    public void onBookSelected(Book book) {\n" +
"        BookDetailFragment detail = BookDetailFragment.newInstance(book);\n" +
"        getSupportFragmentManager().beginTransaction()\n" +
"                .replace(R.id.fragmentContainer, detail)\n" +
"                .addToBackStack(null)\n" +
"                .commit();\n" +
"    }\n" +
"\n" +
"    @Override\n" +
"    protected void onDestroy() {\n" +
"        super.onDestroy();\n" +
"        if (communicator != null) communicator.disconnect();\n" +
"    }", lang: "java" },
            { note: "Fragments do not talk to each other directly. The list fragment calls back to the Activity via `onBookSelected`, and the Activity drives the transaction. This is the L05 fragment to activity to fragment communication pattern." }
          ]
        }
      ]
    },

    // ============================================================
    {
      id: "listfragment",
      title: "Q2.1: BookListFragment with a RecyclerView",
      intro: "Displays the catalogue in a selectable list and reports the selection to the Activity.",
      steps: [
        {
          title: "Fragment layout with a RecyclerView",
          tags: ["L02 Views", "L05 Fragments"],
          body: [
            { file: "res/layout/fragment_book_list.xml" },
            { code:
"<?xml version=\"1.0\" encoding=\"utf-8\"?>\n" +
"<androidx.recyclerview.widget.RecyclerView\n" +
"    xmlns:android=\"http://schemas.android.com/apk/res/android\"\n" +
"    android:id=\"@+id/recyclerBooks\"\n" +
"    android:layout_width=\"match_parent\"\n" +
"    android:layout_height=\"match_parent\" />", lang: "xml" },
            { scaffold: "Ensure the RecyclerView dependency is in the module `build.gradle`, for example `implementation 'androidx.recyclerview:recyclerview:1.3.2'`. Newer AGP projects include it automatically." }
          ]
        },
        {
          title: "A simple adapter with click selection",
          tags: ["L02 RecyclerView"],
          body: [
            { p: "A minimal `RecyclerView.Adapter` plus `ViewHolder` using the built-in `simple_list_item_1` row. Clicking a row fires a callback." },
            { file: "BookAdapter.java" },
            { code:
"import android.view.LayoutInflater;\n" +
"import android.view.View;\n" +
"import android.view.ViewGroup;\n" +
"import android.widget.TextView;\n" +
"import androidx.annotation.NonNull;\n" +
"import androidx.recyclerview.widget.RecyclerView;\n" +
"import java.util.List;\n" +
"\n" +
"public class BookAdapter extends RecyclerView.Adapter<BookAdapter.VH> {\n" +
"    public interface OnBookClick { void click(Book book); }\n" +
"\n" +
"    private final List<Book> books;\n" +
"    private final OnBookClick clickListener;\n" +
"\n" +
"    public BookAdapter(List<Book> books, OnBookClick clickListener) {\n" +
"        this.books = books;\n" +
"        this.clickListener = clickListener;\n" +
"    }\n" +
"\n" +
"    @NonNull @Override\n" +
"    public VH onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {\n" +
"        View v = LayoutInflater.from(parent.getContext())\n" +
"                .inflate(android.R.layout.simple_list_item_1, parent, false);\n" +
"        return new VH(v);\n" +
"    }\n" +
"\n" +
"    @Override\n" +
"    public void onBindViewHolder(@NonNull VH holder, int position) {\n" +
"        Book book = books.get(position);\n" +
"        holder.text.setText(book.toString());\n" +
"        holder.itemView.setOnClickListener(v -> clickListener.click(book));\n" +
"    }\n" +
"\n" +
"    @Override public int getItemCount() { return books.size(); }\n" +
"\n" +
"    static class VH extends RecyclerView.ViewHolder {\n" +
"        TextView text;\n" +
"        VH(View itemView) {\n" +
"            super(itemView);\n" +
"            text = itemView.findViewById(android.R.id.text1);\n" +
"        }\n" +
"    }\n" +
"}", lang: "java" },
            { note: "This is the full L02 adapter triad: the data list, a ViewHolder holding the row's View, and the Adapter mapping data to a row and wiring the click. Using the built-in `simple_list_item_1` saves writing a custom row layout under time pressure." }
          ]
        },
        {
          title: "The fragment: show books, report selection",
          tags: ["L05 Fragments", "L02 RecyclerView"],
          body: [
            { p: "`onCreateView` inflates the layout, never `onCreate`. `showBooks` is called by the Activity when a reply arrives. Row clicks are forwarded to the Activity." },
            { file: "BookListFragment.java" },
            { code:
"import android.os.Bundle;\n" +
"import android.view.LayoutInflater;\n" +
"import android.view.View;\n" +
"import android.view.ViewGroup;\n" +
"import androidx.annotation.NonNull;\n" +
"import androidx.annotation.Nullable;\n" +
"import androidx.fragment.app.Fragment;\n" +
"import androidx.recyclerview.widget.LinearLayoutManager;\n" +
"import androidx.recyclerview.widget.RecyclerView;\n" +
"import java.util.ArrayList;\n" +
"import java.util.List;\n" +
"\n" +
"public class BookListFragment extends Fragment {\n" +
"    private RecyclerView recycler;\n" +
"    private final List<Book> books = new ArrayList<>();\n" +
"    private BookAdapter adapter;\n" +
"\n" +
"    @Nullable @Override\n" +
"    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,\n" +
"                             @Nullable Bundle savedInstanceState) {\n" +
"        View root = inflater.inflate(R.layout.fragment_book_list, container, false);\n" +
"        recycler = root.findViewById(R.id.recyclerBooks);\n" +
"        recycler.setLayoutManager(new LinearLayoutManager(getContext()));\n" +
"        adapter = new BookAdapter(books, book -> {\n" +
"            // Report the selection to the host Activity. L05 comms.\n" +
"            ((MainActivity) requireActivity()).onBookSelected(book);\n" +
"        });\n" +
"        recycler.setAdapter(adapter);\n" +
"        return root;\n" +
"    }\n" +
"\n" +
"    // Called by MainActivity on the UI thread when LIST/SEARCH returns.\n" +
"    public void showBooks(List<Book> newBooks) {\n" +
"        books.clear();\n" +
"        books.addAll(newBooks);\n" +
"        if (adapter != null) adapter.notifyDataSetChanged();\n" +
"    }\n" +
"}", lang: "java" },
            { note: "The fragment inflates its UI in `onCreateView`, not `onCreate`, an L05 point. Casting `requireActivity()` to MainActivity is the direct-call style of fragment to activity communication, and a listener interface is the more decoupled alternative." }
          ]
        }
      ]
    },

    // ============================================================
    {
      id: "detailfragment",
      title: "Q2.2: BookDetailFragment, reserve & validation",
      intro: "Shows the selected book, takes a membership number validated by regex to be exactly 9 digits, and sends the RESERVE request.",
      steps: [
        {
          title: "Pass the selected book in via a Bundle",
          tags: ["L05 Fragments", "L04 Intents"],
          body: [
            { p: "A fragment receives arguments through a `Bundle`, set in a `newInstance` factory. We pass the book's fields." },
            { file: "BookDetailFragment.java, factory & fields" },
            { code:
"public static BookDetailFragment newInstance(Book book) {\n" +
"    BookDetailFragment f = new BookDetailFragment();\n" +
"    Bundle args = new Bundle();\n" +
"    args.putString(\"code\", book.code);\n" +
"    args.putString(\"title\", book.title);\n" +
"    args.putInt(\"available\", book.available);\n" +
"    f.setArguments(args);\n" +
"    return f;\n" +
"}", lang: "java" },
            { note: "Passing data via a Bundle in `newInstance` is the standard fragment idiom, and it is the counterpart to Intent extras between Activities from L04 and L05. It survives fragment recreation, unlike a constructor argument." }
          ]
        },
        {
          title: "Fragment layout: details, input, button, result",
          tags: ["L02 Views", "L05 Fragments"],
          body: [
            { file: "res/layout/fragment_book_detail.xml" },
            { code:
"<?xml version=\"1.0\" encoding=\"utf-8\"?>\n" +
"<LinearLayout xmlns:android=\"http://schemas.android.com/apk/res/android\"\n" +
"    android:orientation=\"vertical\"\n" +
"    android:padding=\"16dp\"\n" +
"    android:layout_width=\"match_parent\"\n" +
"    android:layout_height=\"match_parent\">\n" +
"\n" +
"    <TextView android:id=\"@+id/txtDetails\"\n" +
"        android:layout_width=\"match_parent\" android:layout_height=\"wrap_content\"\n" +
"        android:textSize=\"18sp\" />\n" +
"\n" +
"    <EditText android:id=\"@+id/editMembership\"\n" +
"        android:layout_width=\"match_parent\" android:layout_height=\"wrap_content\"\n" +
"        android:hint=\"Membership number, 9 digits\"\n" +
"        android:inputType=\"number\" />\n" +
"\n" +
"    <Button android:id=\"@+id/btnReserve\"\n" +
"        android:layout_width=\"wrap_content\" android:layout_height=\"wrap_content\"\n" +
"        android:text=\"Reserve\" />\n" +
"\n" +
"    <TextView android:id=\"@+id/txtResult\"\n" +
"        android:layout_width=\"match_parent\" android:layout_height=\"wrap_content\"\n" +
"        android:paddingTop=\"12dp\" />\n" +
"</LinearLayout>", lang: "xml" }
          ]
        },
        {
          title: "Validate with regex, then send RESERVE",
          tags: ["L06 RegEx", "L05 Fragments", "L07 Threads"],
          body: [
            { p: "On button click, check the membership number is **exactly 9 digits** with a regex. Only if valid do we enqueue the RESERVE command." },
            { file: "BookDetailFragment.java, onCreateView" },
            { code:
"@Nullable @Override\n" +
"public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,\n" +
"                         @Nullable Bundle savedInstanceState) {\n" +
"    View root = inflater.inflate(R.layout.fragment_book_detail, container, false);\n" +
"\n" +
"    String code = getArguments().getString(\"code\");\n" +
"    String title = getArguments().getString(\"title\");\n" +
"    int available = getArguments().getInt(\"available\");\n" +
"\n" +
"    TextView details = root.findViewById(R.id.txtDetails);\n" +
"    details.setText(code + \"\\n\" + title + \"\\nAvailable: \" + available);\n" +
"\n" +
"    EditText membership = root.findViewById(R.id.editMembership);\n" +
"    TextView result = root.findViewById(R.id.txtResult);\n" +
"\n" +
"    root.findViewById(R.id.btnReserve).setOnClickListener(v -> {\n" +
"        String member = membership.getText().toString().trim();\n" +
"        // Exactly 9 digits.\n" +
"        if (!member.matches(\"\\\\d{9}\")) {\n" +
"            result.setText(\"Invalid membership number. Must be exactly 9 digits.\");\n" +
"            return;\n" +
"        }\n" +
"        ServerCommunicator comm = ((MainActivity) requireActivity()).getCommunicator();\n" +
"        comm.reserveBook(code, member); // queued; reply comes back via showResult\n" +
"    });\n" +
"\n" +
"    return root;\n" +
"}\n" +
"\n" +
"// Called by MainActivity on the UI thread when SUCCESS/FULL arrives.\n" +
"public void showResult(String serverResult) {\n" +
"    TextView result = requireView().findViewById(R.id.txtResult);\n" +
"    if (serverResult.equals(\"SUCCESS\")) result.setText(\"Reserved successfully!\");\n" +
"    else if (serverResult.equals(\"FULL\")) result.setText(\"Sorry, no copies available.\");\n" +
"    else result.setText(serverResult);\n" +
"}", lang: "java" },
            { note: "`member.matches(\"\\\\d{9}\")` is the L06 skill in action: `matches` requires the WHOLE string to be 9 digits. Validation happens on the CLIENT before sending, and the server trusts the format. The exam awards marks for client-side validation." },
            { note: "The click handler only queues the request and returns. The SUCCESS or FULL reply arrives asynchronously via the listener into `showResult`. The UI never blocks waiting for the network, an L07 point." }
          ]
        }
      ]
    },

    // ============================================================
    {
      id: "considerations",
      title: "Q2.4: Considerations, the easy marks",
      intro: "A dedicated band of marks for doing the threading, validation and errors correctly. Verify each one is demonstrably true in your code.",
      steps: [
        {
          title: "Tick off every consideration",
          tags: ["L07 Threads", "L06 RegEx", "L03 Exceptions", "exam"],
          body: [
            { list: [
              "**All network ops on background threads.** connect, read and write all run off the UI thread, and button handlers only `offer` to the queue.",
              "**UI updates on the main thread.** Every listener callback is wrapped in `runOnUiThread` before touching a View.",
              "**Graceful errors.** try/catch around socket setup, reads and close, with failures reported via `onError` into a Toast, never a crash.",
              "**Membership validated before registration.** `matches(\"\\\\d{9}\")`, where invalid input shows a message and does NOT send RESERVE.",
              "**Regex searches.** `searchBooks(pattern)` sends patterns like `WRPV.*` or `^[A-Z]{4}3\\d{2}$` straight to the server's `doSearch`."
            ]},
            { note: "These five are the Q2.4-equivalent marks. They cost almost nothing to get right if you build the structure above, but they are the first marks lost if you do network work on the UI thread or skip validation." }
          ]
        },
        {
          title: "End-to-end test",
          tags: ["L09 Networking", "L10 Multi-client"],
          body: [
            { p: "Run the server from Part 1, then run the client. Confirm the full loop:" },
            { list: [
              "The app launches, connects, and the list of books appears via the LIST round-trip.",
              "Tap a book, and the detail screen shows code, title and available.",
              "Enter 8 digits and it is rejected with a message. Enter 9 digits and RESERVE is sent.",
              "SUCCESS shows a confirmation. Reserve until copies hit 0 to see FULL.",
              "Run two emulators or clients at once, and the server logs Client #1 and #2 concurrently."
            ]},
            { note: "Running two clients proves the whole multi-threaded, multi-client chain end to end, which is the thing the exam is really assessing." }
          ]
        }
      ]
    }
  ]
});
