registerGuide({
  id: "05",
  title: "L05: Fragments",
  blurb: "Build a one-Activity app that swaps reusable fragments: show a fragment, replace it at runtime, pass it data, and let it talk back to the Activity.",

  recipes: [
    // ============================================================
    {
      name: "Create a fragment and show it in an Activity",
      goal: "A reusable piece of UI, a fragment, hosted inside a container in your Activity.",
      tags: ["Fragments"],
      steps: [
        {
          do: "Create the fragment.",
          body: [
            { path: "Right-click your package > New > Fragment > Fragment (Blank) > name it `ListFragment`" },
            { note: "This generates `ListFragment.java` and `fragment_list.xml`. Fragments are reusable UI with their own lifecycle, hosted by an Activity." }
          ]
        },
        {
          do: "Inflate the fragment's UI in `onCreateView`, not onCreate.",
          body: [
            { code:
"@Nullable @Override\n" +
"public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,\n" +
"                         @Nullable Bundle savedInstanceState) {\n" +
"    return inflater.inflate(R.layout.fragment_list, container, false);\n" +
"}", lang: "java" },
            { note: "onCreate initialises the fragment but NOT its UI. The UI is created in onCreateView. Mixing these up is a classic mistake." }
          ]
        },
        {
          do: "Add a container to the Activity layout.",
          body: [
            { p: "In `activity_main.xml`, use a FrameLayout as the slot the fragment goes into." },
            { code:
"<FrameLayout\n" +
"    android:id=\"@+id/fragmentContainer\"\n" +
"    android:layout_width=\"match_parent\"\n" +
"    android:layout_height=\"match_parent\" />", lang: "xml" },
            { note: "Use a container you fill from code (not a static <fragment> tag) so you can swap fragments later. Fragments do not appear in the manifest." }
          ]
        },
        {
          do: "Add the fragment to the container in `MainActivity.onCreate`.",
          body: [
            { code:
"getSupportFragmentManager().beginTransaction()\n" +
"        .replace(R.id.fragmentContainer, new ListFragment())\n" +
"        .commit();", lang: "java" }
          ]
        },
        {
          do: "Run. The fragment's UI appears inside the Activity.",
          body: []
        }
      ]
    },

    // ============================================================
    {
      name: "Swap fragments at runtime",
      goal: "Replace one fragment with another, e.g. list to detail, with Back returning to the first.",
      tags: ["Fragments", "FragmentManager"],
      steps: [
        {
          do: "Create a second fragment the same way.",
          body: [
            { path: "Right-click your package > New > Fragment > Fragment (Blank) > name it `DetailFragment`" }
          ]
        },
        {
          do: "Replace the current fragment and add the swap to the back stack.",
          body: [
            { code:
"getSupportFragmentManager().beginTransaction()\n" +
"        .replace(R.id.fragmentContainer, new DetailFragment())\n" +
"        .addToBackStack(null)\n" +
"        .commit();", lang: "java" },
            { note: "`addToBackStack(null)` makes the Back button pop the detail fragment and return to the list. Omit it and Back leaves the screen instead." }
          ]
        },
        {
          do: "Run, trigger the swap, then press Back to confirm the first fragment returns.",
          body: []
        }
      ]
    },

    // ============================================================
    {
      name: "Pass data into a fragment",
      goal: "Hand a fragment its starting data safely, through a Bundle.",
      tags: ["Fragments", "Bundle"],
      steps: [
        {
          do: "Add a newInstance factory that stores arguments in a Bundle.",
          body: [
            { code:
"public static DetailFragment newInstance(String code) {\n" +
"    DetailFragment f = new DetailFragment();\n" +
"    Bundle args = new Bundle();\n" +
"    args.putString(\"code\", code);\n" +
"    f.setArguments(args);\n" +
"    return f;\n" +
"}", lang: "java" },
            { note: "Pass data via setArguments and a Bundle, never a custom constructor. The system recreates fragments with the no-arg constructor and would lose constructor data." }
          ]
        },
        {
          do: "Read the argument inside the fragment.",
          body: [
            { code:
"String code = getArguments().getString(\"code\");", lang: "java" }
          ]
        },
        {
          do: "Create the fragment through the factory when swapping.",
          body: [
            { code:
"getSupportFragmentManager().beginTransaction()\n" +
"        .replace(R.id.fragmentContainer, DetailFragment.newInstance(\"WRPV301\"))\n" +
"        .addToBackStack(null)\n" +
"        .commit();", lang: "java" }
          ]
        }
      ]
    },

    // ============================================================
    {
      name: "Let a fragment talk back to the Activity",
      goal: "A fragment notifies its host Activity when something happens, using a listener interface.",
      tags: ["Fragments", "Listener"],
      steps: [
        {
          do: "Declare a listener interface in the fragment and grab it in onAttach.",
          body: [
            { code:
"public interface Listener { void onPicked(String code); }\n" +
"private Listener listener;\n" +
"\n" +
"@Override\n" +
"public void onAttach(@NonNull Context context) {\n" +
"    super.onAttach(context);\n" +
"    listener = (Listener) context; // the Activity implements Listener\n" +
"}", lang: "java" },
            { note: "onAttach is where you safely get a reference to the host Activity. Fragments should not call each other directly; they go through the Activity." }
          ]
        },
        {
          do: "Call the listener when the fragment has news.",
          body: [
            { code:
"// e.g. in a row click inside the fragment\n" +
"listener.onPicked(\"WRPV301\");", lang: "java" }
          ]
        },
        {
          do: "Implement the interface in the Activity and react.",
          body: [
            { code:
"public class MainActivity extends AppCompatActivity implements ListFragment.Listener {\n" +
"    @Override public void onPicked(String code) {\n" +
"        // e.g. swap in DetailFragment.newInstance(code)\n" +
"    }\n" +
"}", lang: "java" },
            { note: "The Activity is the coordinator: a fragment reports an event, and the Activity decides what happens, such as swapping in another fragment." }
          ]
        }
      ]
    }
  ]
});
