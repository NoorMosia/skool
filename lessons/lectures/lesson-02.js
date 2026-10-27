registerGuide({
  id: "02",
  title: "L02: Basic UI Views",
  blurb: "Click-by-click recipes that build a small phone app flow: a list screen, tap an item to open a detail screen, type input, and get feedback. Covers the core UI views along the way.",

  recipes: [
    // ============================================================
    {
      name: "Create an Empty Views project",
      goal: "A fresh Android project with a MainActivity and activity_main.xml. Every recipe below builds on this one app.",
      tags: ["setup"],
      steps: [
        {
          do: "Open Android Studio and start a new project.",
          body: [
            { path: "Android Studio > File > New > New Project" }
          ]
        },
        {
          do: "Pick the **Empty Views Activity** template, then click Next.",
          body: [
            { note: "Choose 'Empty Views Activity' (XML layouts), not 'Empty Activity' (which is Compose). This module uses XML views." }
          ]
        },
        {
          do: "Set name, language and minimum SDK, then click Finish.",
          body: [
            { list: [
              "Name: include your student number, e.g. `MyApp_206008384`.",
              "Language: **Java**.",
              "Minimum SDK: API 24 or similar is fine."
            ]}
          ]
        },
        {
          do: "Let Gradle finish syncing, then press the green Run arrow.",
          body: [
            { p: "You should see a blank 'Hello World' screen. That confirms the toolchain works before you add anything." },
            { note: "If symbols show as unresolved right after creating the project, it usually just means Gradle sync has not finished yet." }
          ]
        }
      ]
    },

    // ============================================================
    {
      name: "Screen 1 - show a list with RecyclerView",
      goal: "The app's first screen: a scrolling list of items, which is how most Android apps open.",
      tags: ["RecyclerView", "Adapter", "ViewHolder"],
      steps: [
        {
          do: "Put a RecyclerView in the main screen layout.",
          body: [
            { p: "Open `res/layout/activity_main.xml`, switch to Code view, and make the RecyclerView fill the screen." },
            { code:
"<?xml version=\"1.0\" encoding=\"utf-8\"?>\n" +
"<androidx.recyclerview.widget.RecyclerView\n" +
"    xmlns:android=\"http://schemas.android.com/apk/res/android\"\n" +
"    android:id=\"@+id/recyclerItems\"\n" +
"    android:layout_width=\"match_parent\"\n" +
"    android:layout_height=\"match_parent\" />", lang: "xml" },
            { note: "If the RecyclerView tag is red, add `implementation 'androidx.recyclerview:recyclerview:1.3.2'` to the module build.gradle dependencies and sync. Newer projects already include it." }
          ]
        },
        {
          do: "Create a layout for a single row.",
          body: [
            { path: "Right-click `res/layout` > New > Layout Resource File > name it `item_row`" },
            { code:
"<?xml version=\"1.0\" encoding=\"utf-8\"?>\n" +
"<TextView xmlns:android=\"http://schemas.android.com/apk/res/android\"\n" +
"    android:id=\"@+id/txtRow\"\n" +
"    android:layout_width=\"match_parent\"\n" +
"    android:layout_height=\"wrap_content\"\n" +
"    android:padding=\"16dp\"\n" +
"    android:textSize=\"16sp\" />", lang: "xml" }
          ]
        },
        {
          do: "Create the Adapter + ViewHolder.",
          body: [
            { path: "Right-click your package > New > Java Class > name it `ItemAdapter`" },
            { p: "The ViewHolder holds one row's views so they are reused while scrolling. The Adapter creates rows and fills them with data." },
            { code:
"import android.view.LayoutInflater;\n" +
"import android.view.View;\n" +
"import android.view.ViewGroup;\n" +
"import android.widget.TextView;\n" +
"import androidx.annotation.NonNull;\n" +
"import androidx.recyclerview.widget.RecyclerView;\n" +
"import java.util.List;\n" +
"\n" +
"public class ItemAdapter extends RecyclerView.Adapter<ItemAdapter.VH> {\n" +
"    private final List<String> items;\n" +
"\n" +
"    public ItemAdapter(List<String> items) { this.items = items; }\n" +
"\n" +
"    @NonNull @Override\n" +
"    public VH onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {\n" +
"        View row = LayoutInflater.from(parent.getContext())\n" +
"                .inflate(R.layout.item_row, parent, false);\n" +
"        return new VH(row);\n" +
"    }\n" +
"\n" +
"    @Override\n" +
"    public void onBindViewHolder(@NonNull VH holder, int position) {\n" +
"        holder.txt.setText(items.get(position));\n" +
"    }\n" +
"\n" +
"    @Override public int getItemCount() { return items.size(); }\n" +
"\n" +
"    static class VH extends RecyclerView.ViewHolder {\n" +
"        TextView txt;\n" +
"        VH(View itemView) {\n" +
"            super(itemView);\n" +
"            txt = itemView.findViewById(R.id.txtRow);\n" +
"        }\n" +
"    }\n" +
"}", lang: "java" }
          ]
        },
        {
          do: "Wire the RecyclerView in `MainActivity.onCreate`.",
          body: [
            { code:
"import androidx.recyclerview.widget.LinearLayoutManager;\n" +
"import androidx.recyclerview.widget.RecyclerView;\n" +
"import java.util.Arrays;\n" +
"\n" +
"// inside onCreate, after setContentView:\n" +
"RecyclerView recycler = findViewById(R.id.recyclerItems);\n" +
"recycler.setLayoutManager(new LinearLayoutManager(this));\n" +
"recycler.setAdapter(new ItemAdapter(Arrays.asList(\"Apples\", \"Bananas\", \"Cherries\")));", lang: "java" },
            { note: "Forgetting `setLayoutManager` leaves the list blank with no error. A RecyclerView needs a layout manager to position rows." }
          ]
        },
        {
          do: "Run. The app opens on a scrollable list of items.",
          body: []
        }
      ]
    },

    // ============================================================
    {
      name: "Make list items tappable",
      goal: "Tapping a row does something, the first step toward opening a detail screen.",
      tags: ["RecyclerView", "onClick"],
      steps: [
        {
          do: "Add a click callback interface to the Adapter.",
          body: [
            { p: "Let whoever creates the adapter decide what a tap does, instead of hard-coding it inside the adapter." },
            { code:
"// add near the top of ItemAdapter\n" +
"public interface OnItemClick { void click(String item); }\n" +
"\n" +
"private final List<String> items;\n" +
"private final OnItemClick clickListener;\n" +
"\n" +
"public ItemAdapter(List<String> items, OnItemClick clickListener) {\n" +
"    this.items = items;\n" +
"    this.clickListener = clickListener;\n" +
"}", lang: "java" }
          ]
        },
        {
          do: "Fire the callback when a row is tapped, in `onBindViewHolder`.",
          body: [
            { code:
"@Override\n" +
"public void onBindViewHolder(@NonNull VH holder, int position) {\n" +
"    String item = items.get(position);\n" +
"    holder.txt.setText(item);\n" +
"    holder.itemView.setOnClickListener(v -> clickListener.click(item));\n" +
"}", lang: "java" }
          ]
        },
        {
          do: "Pass a click action when you build the adapter in MainActivity.",
          body: [
            { code:
"import android.widget.Toast;\n" +
"\n" +
"recycler.setAdapter(new ItemAdapter(\n" +
"        Arrays.asList(\"Apples\", \"Bananas\", \"Cherries\"),\n" +
"        item -> Toast.makeText(this, \"Tapped \" + item, Toast.LENGTH_SHORT).show()));", lang: "java" },
            { note: "A Toast just proves the tap works. In the next recipe we replace it with opening a detail screen." }
          ]
        },
        {
          do: "Run and tap a row. A short 'Tapped ...' message confirms it works.",
          body: []
        }
      ]
    },

    // ============================================================
    {
      name: "Screen 2 - open a detail screen on tap",
      goal: "A second Activity that opens when a row is tapped, receiving the tapped item. This is the core app flow: list to detail.",
      tags: ["Activity", "Intent"],
      steps: [
        {
          do: "Create a second Activity.",
          body: [
            { path: "Right-click your package > New > Activity > Empty Views Activity > name it `DetailActivity`" },
            { note: "Android Studio adds `DetailActivity` to the manifest and creates `activity_detail.xml` for you. Creating it this way avoids wiring the manifest by hand." }
          ]
        },
        {
          do: "Put a TextView in the detail layout to show the item.",
          body: [
            { p: "In `res/layout/activity_detail.xml`, add a TextView with an id, inside the existing root layout." },
            { code:
"<TextView\n" +
"    android:id=\"@+id/txtDetail\"\n" +
"    android:layout_width=\"wrap_content\"\n" +
"    android:layout_height=\"wrap_content\"\n" +
"    android:textSize=\"20sp\" />", lang: "xml" }
          ]
        },
        {
          do: "Open DetailActivity on tap, sending the item as an Intent extra.",
          body: [
            { p: "Replace the Toast from the previous recipe with starting the second screen." },
            { code:
"import android.content.Intent;\n" +
"\n" +
"recycler.setAdapter(new ItemAdapter(\n" +
"        Arrays.asList(\"Apples\", \"Bananas\", \"Cherries\"),\n" +
"        item -> {\n" +
"            Intent intent = new Intent(this, DetailActivity.class);\n" +
"            intent.putExtra(\"itemName\", item);\n" +
"            startActivity(intent);\n" +
"        }));", lang: "java" },
            { note: "An extra is a (key, value) pair carried by the Intent. The key here is `itemName`; the detail screen reads it back with the same key." }
          ]
        },
        {
          do: "Read the extra in `DetailActivity.onCreate` and show it.",
          body: [
            { code:
"import android.widget.TextView;\n" +
"\n" +
"// inside DetailActivity.onCreate, after setContentView:\n" +
"String item = getIntent().getStringExtra(\"itemName\");\n" +
"TextView txtDetail = findViewById(R.id.txtDetail);\n" +
"txtDetail.setText(\"You picked: \" + item);", lang: "java" }
          ]
        },
        {
          do: "Run. Tap a row and the detail screen opens showing that item. Back returns to the list.",
          body: [
            { note: "The Back button returning to the list comes for free: Android keeps a back stack of Activities." }
          ]
        }
      ]
    },

    // ============================================================
    {
      name: "Add input on the detail screen",
      goal: "An EditText and a button on the detail screen, reading what the user typed. This is how forms work in a phone app.",
      tags: ["EditText", "Button"],
      steps: [
        {
          do: "Add an EditText and a Button under the detail TextView.",
          body: [
            { p: "Make sure the detail layout root is a vertical LinearLayout so the views stack. Then add:" },
            { code:
"<EditText\n" +
"    android:id=\"@+id/editNote\"\n" +
"    android:layout_width=\"match_parent\"\n" +
"    android:layout_height=\"wrap_content\"\n" +
"    android:hint=\"Add a note\" />\n" +
"\n" +
"<Button\n" +
"    android:id=\"@+id/btnSave\"\n" +
"    android:layout_width=\"wrap_content\"\n" +
"    android:layout_height=\"wrap_content\"\n" +
"    android:text=\"Save\" />", lang: "xml" },
            { note: "EditText is editable input; TextView is read-only display. Keep the two straight." }
          ]
        },
        {
          do: "Read the EditText when the button is tapped.",
          body: [
            { code:
"import android.widget.Button;\n" +
"import android.widget.EditText;\n" +
"import android.widget.Toast;\n" +
"\n" +
"EditText editNote = findViewById(R.id.editNote);\n" +
"Button btnSave = findViewById(R.id.btnSave);\n" +
"\n" +
"btnSave.setOnClickListener(v -> {\n" +
"    String note = editNote.getText().toString().trim();\n" +
"    Toast.makeText(this, \"Saved: \" + note, Toast.LENGTH_SHORT).show();\n" +
"});", lang: "java" },
            { note: "`editNote.getText().toString()` pulls the typed text out. `.trim()` removes stray spaces, which matters when you validate input later." }
          ]
        },
        {
          do: "Run. On the detail screen, type a note, tap Save, and see it echoed back.",
          body: []
        }
      ]
    },

    // ============================================================
    {
      name: "Polish - an image and a toggle",
      goal: "Finish the screen with an image header and a toggle, the last common basic views.",
      tags: ["ImageView", "Switch"],
      steps: [
        {
          do: "Drop an image into drawables and show it with an ImageView.",
          body: [
            { path: "Right-click `res/drawable` > add a PNG/JPG (lowercase name, no spaces), e.g. `header.png`" },
            { code:
"<ImageView\n" +
"    android:id=\"@+id/imgHeader\"\n" +
"    android:layout_width=\"match_parent\"\n" +
"    android:layout_height=\"120dp\"\n" +
"    android:scaleType=\"centerCrop\"\n" +
"    android:src=\"@drawable/header\" />", lang: "xml" },
            { note: "Reference the file by name without the extension. Keep images reasonably sized so they do not waste memory." }
          ]
        },
        {
          do: "Add a Switch and react to it being toggled.",
          body: [
            { code:
"<Switch\n" +
"    android:id=\"@+id/switchFav\"\n" +
"    android:layout_width=\"wrap_content\"\n" +
"    android:layout_height=\"wrap_content\"\n" +
"    android:text=\"Favourite\" />", lang: "xml" },
            { code:
"import android.widget.Switch;\n" +
"\n" +
"Switch switchFav = findViewById(R.id.switchFav);\n" +
"switchFav.setOnCheckedChangeListener((button, isChecked) -> {\n" +
"    Toast.makeText(this, isChecked ? \"Favourited\" : \"Un-favourited\",\n" +
"            Toast.LENGTH_SHORT).show();\n" +
"});", lang: "java" },
            { note: "Toggles and grouped buttons use `onCheckedChange`, not `onClick`. Plain buttons use `onClick`." }
          ]
        },
        {
          do: "Run and confirm the image shows and the switch reports its state.",
          body: [
            { p: "You now have a two-screen app: a list that opens a detail screen with input, an image and a toggle. That exercises the core L02 views inside a realistic flow." }
          ]
        }
      ]
    }
  ]
});
