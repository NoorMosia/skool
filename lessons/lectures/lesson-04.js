registerGuide({
  id: "04",
  title: "L04: Multiple strings, layouts & activities",
  blurb: "Make the app adapt and navigate: add a translated string, a landscape layout, pass data to a second screen, and get a result back.",

  recipes: [
    // ============================================================
    {
      name: "Add a string and an Afrikaans translation",
      goal: "Text that is looked up by id and automatically swaps language based on the device locale.",
      tags: ["Resources", "Strings"],
      steps: [
        {
          do: "Add a string to the default strings file.",
          body: [
            { p: "In `res/values/strings.xml`:" },
            { code:
"<string name=\"greeting\">Hello</string>", lang: "xml" },
            { note: "Never hard-code user-facing text in the layout or code. Reference it by id so it can be translated and changed in one place." }
          ]
        },
        {
          do: "Use the string by id in a layout or in code.",
          body: [
            { code:
"<!-- in XML -->\n" +
"android:text=\"@string/greeting\"", lang: "xml" },
            { code:
"// in code\n" +
"String s = getString(R.string.greeting);", lang: "java" }
          ]
        },
        {
          do: "Add the Afrikaans version in a locale-qualified folder.",
          body: [
            { p: "Create `res/values-af/strings.xml` with the same key:" },
            { code:
"<string name=\"greeting\">Hallo</string>", lang: "xml" },
            { note: "Android picks the most specific matching folder for the device. Set the phone to Afrikaans and it shows 'Hallo'; otherwise it falls back to the default 'Hello'." }
          ]
        },
        {
          do: "Use the Translations Editor to manage locales visually (optional).",
          body: [
            { path: "Right-click `strings.xml` > Open Translations Editor" }
          ]
        }
      ]
    },

    // ============================================================
    {
      name: "Add a landscape layout variant",
      goal: "A different layout when the phone is rotated, reusing the same View ids so code keeps working.",
      tags: ["Resources", "Layouts"],
      steps: [
        {
          do: "Create a landscape version of an existing layout.",
          body: [
            { path: "Right-click `res/layout` > New > Layout Resource File" },
            { p: "Name it the SAME as the default, e.g. `activity_main`, and set the Orientation qualifier to Landscape. Android Studio places it in `res/layout-land/`." }
          ]
        },
        {
          do: "Keep the important View ids identical in both layouts.",
          body: [
            { note: "If a View your code looks up with `findViewById` is missing or renamed in one variant, that variant crashes. Matching ids across variants is essential." }
          ]
        },
        {
          do: "Rotate the emulator to see Android swap layouts at runtime.",
          body: [
            { note: "A layout change recreates the entire Activity. Anything not saved in onSaveInstanceState (or restored in onCreate) is lost on rotation." }
          ]
        }
      ]
    },

    // ============================================================
    {
      name: "Pass data to a second screen",
      goal: "Open another Activity and hand it some data using an Intent.",
      tags: ["Activity", "Intent"],
      steps: [
        {
          do: "Create the second Activity.",
          body: [
            { path: "Right-click your package > New > Activity > Empty Views Activity > name it `SecondActivity`" },
            { note: "Creating it this way registers it in the manifest automatically." }
          ]
        },
        {
          do: "Start it, attaching data as extras.",
          body: [
            { code:
"import android.content.Intent;\n" +
"\n" +
"Intent intent = new Intent(this, SecondActivity.class);\n" +
"intent.putExtra(\"message\", \"Hello from screen 1\");\n" +
"intent.putExtra(\"count\", 5);\n" +
"startActivity(intent);", lang: "java" },
            { note: "Extras are (key, value) pairs. Basic types go directly; objects must implement Serializable or Parcelable. Serializable is simpler, Parcelable is faster." }
          ]
        },
        {
          do: "Read the extras in the second Activity's `onCreate`.",
          body: [
            { code:
"String message = getIntent().getStringExtra(\"message\");\n" +
"int count = getIntent().getIntExtra(\"count\", 0);", lang: "java" }
          ]
        },
        {
          do: "Run, trigger the navigation, and confirm the data arrives.",
          body: []
        }
      ]
    },

    // ============================================================
    {
      name: "Get a result back from a screen",
      goal: "Open a screen that returns a value, like a picker that sends back the chosen item.",
      tags: ["Intent", "Result"],
      steps: [
        {
          do: "In the caller, register a launcher in `onCreate`.",
          body: [
            { code:
"import android.content.Intent;\n" +
"import androidx.activity.result.ActivityResultLauncher;\n" +
"import androidx.activity.result.contract.ActivityResultContracts;\n" +
"import static android.app.Activity.RESULT_OK;\n" +
"\n" +
"ActivityResultLauncher<Intent> launcher = registerForActivityResult(\n" +
"    new ActivityResultContracts.StartActivityForResult(),\n" +
"    result -> {\n" +
"        if (result.getResultCode() == RESULT_OK && result.getData() != null) {\n" +
"            String picked = result.getData().getStringExtra(\"picked\");\n" +
"            // use picked\n" +
"        }\n" +
"    });", lang: "java" },
            { note: "Register the launcher at creation time, not inside a click handler. You then launch it whenever you need a result." }
          ]
        },
        {
          do: "Launch the screen when needed.",
          body: [
            { code:
"launcher.launch(new Intent(this, PickerActivity.class));", lang: "java" }
          ]
        },
        {
          do: "In the responder, set a result and finish.",
          body: [
            { code:
"Intent out = new Intent();\n" +
"out.putExtra(\"picked\", \"Bananas\");\n" +
"setResult(RESULT_OK, out);\n" +
"finish();", lang: "java" },
            { note: "setResult hands data back; finish closes the screen and returns to the caller, which then runs the launcher's callback." }
          ]
        },
        {
          do: "Run the full round trip: open the picker, choose, return with the value.",
          body: []
        }
      ]
    }
  ]
});
