registerGuide({
  id: "03",
  title: "L03: Permissions, Files & Styles",
  blurb: "Build a notes screen that remembers its state: save a preference, write and read a file, ask for a permission, apply a theme, and handle errors.",

  recipes: [
    // ============================================================
    {
      name: "Save & restore with SharedPreferences",
      goal: "A screen that remembers a value between app launches, e.g. the user's name in a text field.",
      tags: ["SharedPreferences"],
      steps: [
        {
          do: "Add an EditText and a Save button to a screen layout.",
          body: [
            { code:
"<EditText\n" +
"    android:id=\"@+id/editName\"\n" +
"    android:layout_width=\"match_parent\"\n" +
"    android:layout_height=\"wrap_content\"\n" +
"    android:hint=\"Your name\" />\n" +
"\n" +
"<Button\n" +
"    android:id=\"@+id/btnSave\"\n" +
"    android:layout_width=\"wrap_content\"\n" +
"    android:layout_height=\"wrap_content\"\n" +
"    android:text=\"Save\" />", lang: "xml" }
          ]
        },
        {
          do: "Save the text when the button is tapped.",
          body: [
            { code:
"import android.content.SharedPreferences;\n" +
"import android.widget.Button;\n" +
"import android.widget.EditText;\n" +
"\n" +
"EditText editName = findViewById(R.id.editName);\n" +
"Button btnSave = findViewById(R.id.btnSave);\n" +
"\n" +
"btnSave.setOnClickListener(v -> {\n" +
"    SharedPreferences prefs = getSharedPreferences(\"my_prefs\", MODE_PRIVATE);\n" +
"    SharedPreferences.Editor editor = prefs.edit();\n" +
"    editor.putString(\"name\", editName.getText().toString());\n" +
"    editor.apply();\n" +
"});", lang: "java" },
            { note: "`apply()` writes in the background. `commit()` does the same synchronously and returns a boolean. Prefer apply for UI code." }
          ]
        },
        {
          do: "Load the saved value in `onCreate` so it reappears on next launch.",
          body: [
            { code:
"SharedPreferences prefs = getSharedPreferences(\"my_prefs\", MODE_PRIVATE);\n" +
"String savedName = prefs.getString(\"name\", \"\"); // \"\" is the default if missing\n" +
"editName.setText(savedName);", lang: "java" },
            { note: "The second argument to each getter is the default returned when the key does not exist yet." }
          ]
        },
        {
          do: "Run, type a name, Save, close and reopen the app. The name is still there.",
          body: []
        }
      ]
    },

    // ============================================================
    {
      name: "Write & read an app file",
      goal: "Persist longer text to a private file and read it back.",
      tags: ["Files"],
      steps: [
        {
          do: "Write text to a private file.",
          body: [
            { code:
"import android.content.Context;\n" +
"import java.io.FileOutputStream;\n" +
"\n" +
"try {\n" +
"    FileOutputStream fos = openFileOutput(\"notes.txt\", Context.MODE_PRIVATE);\n" +
"    fos.write(editName.getText().toString().getBytes());\n" +
"    fos.close();\n" +
"} catch (Exception e) {\n" +
"    e.printStackTrace();\n" +
"}", lang: "java" },
            { note: "`openFileOutput` writes to app-private storage, so no permission is needed. The file lives under the app's own files directory." }
          ]
        },
        {
          do: "Read the file back.",
          body: [
            { code:
"import java.io.BufferedReader;\n" +
"import java.io.FileInputStream;\n" +
"import java.io.InputStreamReader;\n" +
"\n" +
"try {\n" +
"    FileInputStream fis = openFileInput(\"notes.txt\");\n" +
"    BufferedReader reader = new BufferedReader(new InputStreamReader(fis));\n" +
"    StringBuilder sb = new StringBuilder();\n" +
"    String line;\n" +
"    while ((line = reader.readLine()) != null) sb.append(line);\n" +
"    reader.close();\n" +
"    editName.setText(sb.toString());\n" +
"} catch (Exception e) {\n" +
"    e.printStackTrace();\n" +
"}", lang: "java" }
          ]
        },
        {
          do: "Run to confirm the text survives a write then read.",
          body: [
            { note: "Most of java.io works as in desktop Java. Convenience methods: `deleteFile`, `fileList`, `getFilesDir`." }
          ]
        }
      ]
    },

    // ============================================================
    {
      name: "Ask for a runtime permission",
      goal: "Request a dangerous permission (e.g. camera) at runtime, the modern Android way.",
      tags: ["Permissions"],
      steps: [
        {
          do: "Declare the permission in the manifest.",
          body: [
            { code:
"<uses-permission android:name=\"android.permission.CAMERA\" />", lang: "xml" },
            { note: "Normal permissions like INTERNET are granted at install. Dangerous ones like CAMERA, location and storage must also be requested at runtime." }
          ]
        },
        {
          do: "Check and request the permission before using the feature.",
          body: [
            { code:
"import android.Manifest;\n" +
"import android.content.pm.PackageManager;\n" +
"import androidx.core.app.ActivityCompat;\n" +
"import androidx.core.content.ContextCompat;\n" +
"\n" +
"if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)\n" +
"        != PackageManager.PERMISSION_GRANTED) {\n" +
"    ActivityCompat.requestPermissions(this,\n" +
"            new String[]{ Manifest.permission.CAMERA }, 1);\n" +
"}", lang: "java" },
            { note: "Always check first, because the user can revoke a permission at any time. The last argument (1) is a request code you choose." }
          ]
        },
        {
          do: "Handle the user's answer.",
          body: [
            { code:
"@Override\n" +
"public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] results) {\n" +
"    super.onRequestPermissionsResult(requestCode, permissions, results);\n" +
"    if (requestCode == 1 && results.length > 0\n" +
"            && results[0] == PackageManager.PERMISSION_GRANTED) {\n" +
"        // permission granted: use the camera\n" +
"    }\n" +
"}", lang: "java" }
          ]
        },
        {
          do: "Run. The first time, a permission dialog appears.",
          body: []
        }
      ]
    },

    // ============================================================
    {
      name: "Apply a style and theme",
      goal: "A reusable style for buttons, applied app-wide via the theme.",
      tags: ["Styles", "Themes"],
      steps: [
        {
          do: "Define a style in the styles resource.",
          body: [
            { p: "Open `res/values/themes.xml` (or styles.xml) and add a style." },
            { code:
"<style name=\"MyButton\" parent=\"@android:style/Widget.Button\">\n" +
"    <item name=\"android:textColor\">#FFFFFF</item>\n" +
"    <item name=\"android:background\">#4C8DFF</item>\n" +
"</style>", lang: "xml" },
            { note: "A Style is a set of attribute/value pairs. A Theme is a style applied to a whole Activity or the Application. Presentation is kept separate from logic, like CSS." }
          ]
        },
        {
          do: "Apply the style to a single view.",
          body: [
            { code:
"<Button\n" +
"    style=\"@style/MyButton\"\n" +
"    android:layout_width=\"wrap_content\"\n" +
"    android:layout_height=\"wrap_content\"\n" +
"    android:text=\"Styled\" />", lang: "xml" }
          ]
        },
        {
          do: "Apply a theme to the whole app via the manifest.",
          body: [
            { code:
"<application\n" +
"    android:theme=\"@style/Theme.MyApp\" ... >", lang: "xml" },
            { note: "Android Studio can extract a style for you: select a view, then Refactor > Extract Style." }
          ]
        }
      ]
    },

    // ============================================================
    {
      name: "Handle errors with try/catch/finally",
      goal: "Wrap risky work so a failure is handled cleanly instead of crashing.",
      tags: ["Exceptions"],
      steps: [
        {
          do: "Wrap the risky code in try, catch the problem, clean up in finally.",
          body: [
            { code:
"try {\n" +
"    int x = Integer.parseInt(editName.getText().toString()); // may throw\n" +
"    // use x\n" +
"} catch (NumberFormatException e) {\n" +
"    // handle the bad input, e.g. show a message\n" +
"} finally {\n" +
"    // always runs, success or failure\n" +
"}", lang: "java" },
            { note: "`finally` always runs. That is why resource cleanup, and lock release in L08, belong there." }
          ]
        },
        {
          do: "Optionally define your own exception type.",
          body: [
            { code:
"class InvalidNameException extends Exception {\n" +
"    InvalidNameException(String msg) { super(msg); }\n" +
"}\n" +
"\n" +
"// throw it when a rule is broken:\n" +
"if (name.isEmpty()) throw new InvalidNameException(\"Name is required\");", lang: "java" },
            { note: "A method that throws a checked exception must declare `throws`. An exception rethrown inside a catch is not caught by the other catch blocks of the same try." }
          ]
        }
      ]
    }
  ]
});
