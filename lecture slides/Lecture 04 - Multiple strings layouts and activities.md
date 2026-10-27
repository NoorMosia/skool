# Lecture 04: Multiple strings, layouts & activities

## Recap: View vs ViewGroup vs Layout

- **View:** anything that displays on the screen & the user interacts with, e.g., TextView, Button, ImageView, etc.
- **ViewGroup:** a type of View that can contain other Views (including other ViewGroups), e.g., LinearLayout & ConstraintLayout
- **Layout:** usually XML files that define ViewGroups & the Views inside them

## Introduction

- Multiple Layouts per Activity
  - Different devices, resolutions, orientations, languages, docking modes, etc.
  - Need to ensure that Views with specific ids expected in code appear in all versions of a layout
- Multiple Activities
  - Want more than one "screen" for an application
- Fragments
  - A way of re-using (a layout & functionality) in multiple Layouts & Activities
  - Basically plug-and-play UI components

## Multiple Strings & Layouts

- Many different devices, orientations, languages, etc.
- Need an easy, scalable way to accommodate this
  - Same named file in different folders, where context is specified by postfixes on the default name, e.g., default `res/values`, then for Afrikaans it will be `res/values-af`
  - When you need a specific value, look from most specific to least specific
    - Takes the first value found that matches the context

### For Strings

- String is not hard-coded in code or layout
- Strings are looked up by id
- Different XML files contain the string in different contexts

Steps:

- Add a string resource, e.g., `strHello`
- Identified in layout as `@strings/strHello`
- Identified in code using `R.string.strHello`
- Add translations using the translation editor (e.g., `values-af`)
- A new `strings.xml` file is created per language added

### For Layouts

- Layout is not hard-coded, instead a layout is an XML document
- Different XML files for the same layout in different contexts
- Same ids for important Views

**Important!** When a layout changes (for whatever reason), then the entire Activity is recreated.

Setting up multiple layouts:

- The first layout created is the default layout — found in `res/layout`
- Create another: right-click → Create Other & pick a context
- New layout (same name) in a different folder that describes the context
  - NB!! Must have matching ids
  - Android picks the appropriate one at run-time, e.g., `/res/layout-land/layoutname.xml` for a landscape layout

## Multiple Activities

- An Activity is defined as "a single focused thing that the user can do"
- An Activity should perform a single task, e.g., manage student info, not manage student info & lecturer info
- Activities can be started by the same or other applications using an Intent
- So:
  - Android needs to know that the Activity can be started with an Intent
    - Defined in `AndroidManifest.xml`
  - Activities should be self-contained (obtain data from the Intent that started it)

Activities are supposed to be self-contained:

- Do not depend on other Activities
- Do not assume objects exist
- Can be started by Android as an Intent from another app, i.e., don't know which other activity has run already
- Therefore should not share objects (references) if it can be started by other apps
- BUT can send data & data objects between Activities
  - Gets attached as an extra to the Intent
  - The receiver of the Intent needs to get the data when started

Sending Data Objects:

- Implementing `Serializable` & using `putExtra` and `getSerializable`
- Implementing `Parcelable` & methods, and using `putExtra` and `getParcelable`
- `Serializable` is simpler to implement, but `Parcelable` is faster & language neutral (but requires more code)

### Passing information with an Intent

- Can add extras to an Intent
  - (key, value) pairs
  - Can send basic types, such as strings, numbers, Booleans, etc.
  - If you want to send objects, they need to implement `Serializable` (or `Parcelable`)

### Starting Activities from another app

- Android decides the app & Activity to handle the Intent
- Who should handle an Intent request? In `AndroidManifest.xml`:
  - Add an intent-filter
  - Each Activity will have a (potentially unique) action name, specified in the `android:name` field
  - Creating an Intent with the name will select the Activity as a potential target Activity to handle the Intent
  - A category for the Intent needs to be specified, often `android.intent.category.DEFAULT`
  - Need to indicate the type of data that can be sent

Example manifest:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="nmmu.wrap302.l03.Example01b"
    android:versionCode="1"
    android:versionName="1.0">
    <uses-sdk android:minSdkVersion="15"/>
    <application
        android:label="Example01b"
        android:icon="@drawable/ic_launcher">
        <activity
            android:name="Example01b"
            android:label="Example01b">
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
            <intent-filter>
                <action android:name="nmmu.wrap302.l03.Example01b"/>
                <category android:name="android.intent.category.DEFAULT"/>
                <data android:mimeType="text/plain"/>
            </intent-filter>
        </activity>
    </application>
</manifest>
```

Creating the Intent (implicit):

```java
// Create Intent and attach extra parameters. Sending IMPLICITLY to
// another activity. The action string is used by Android to decide which
// App and which Activity will respond to the intent.
Intent intent = new Intent();
intent.setAction("za.nmu.wrpv.intentreceiver");
intent.putExtra("message", "Hello Receiver Activity from another App :)");
intent.putExtra("person", person);
intent.setType("text/plain");
// is there another activity that can handle the intent?
if (intent.resolveActivity(getPackageManager()) != null) {
    startActivity(intent);
}
```

- Do not specify the class to be called directly
- Instead, specify the action name of the Intent (from the `android:name` field)
- Note: if there are multiple activities (in different apps) that can handle the same action, then the user chooses or can be allowed to choose (from code)

### Starting an Intent that requires a Result

Caller:

- In `onCreate`, registers an `ActivityResultLauncher`
  - Specifies code to be called when the activity that was called returns a result
- Use the created launcher to `launch` & manage the `Intent`

```java
@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_wait_for_result);
    // ...
    calculationLauncher = registerForActivityResult(
        new ActivityResultContracts.StartActivityForResult(),
        result -> {
            // Not ok, so don't continue.
            if (result.getResultCode() != Activity.RESULT_OK) return;
            // Ok, so retrieve data and do something with it.
            Intent data = result.getData();
            int sum = data.getExtras().getInt("sum");
            TextView txtReceived = findViewById(R.id.txtOutput);
            txtReceived.setText("Calculated Sum = " + sum);
        });
}
```

Launching the Intent:

```java
Intent intent = new Intent(this, ReturnResultActivity.class);
intent.putExtra("x", x);
intent.putExtra("y", y);
calculationLauncher.launch(intent);
```

Responder:

- Receives the Intent as normal
- Returns `setResult` followed by `finish`

```java
public void onReturnClicked(View view) {
    // Return an answer, so create an intent to deliver the response
    Intent result = new Intent();
    result.putExtra("sum", sum);
    setResult(Activity.RESULT_OK, result);
    finish();
}
```
