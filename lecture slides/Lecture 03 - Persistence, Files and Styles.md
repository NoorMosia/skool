# Lecture 03: Permissions, Files & Styles

## Android & permissions

- An app needs to ask the user for permission to access & use specific files & hardware
  - E.g., load/save files, access contacts, use the internet, use the camera, etc.
- Prior to Android 6.0 (API 23):
  - Specify all the permissions needed at install time
  - Permissions appeared in the manifest

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.snazzyapp">
    <uses-permission android:name="android.permission.INTERNET" />
    <!-- other permissions go here -->
    <application ...>
    </application>
</manifest>
```

### Asking for permission

- Since Android 6.0:
  - Still need to add to the manifest – depending on the security Protection Level, may be automatically granted; if not, the app needs to ask the user for permission
  - At runtime, ask the user for permission
  - Gives a chance to explain why specific permissions are needed & the user can selectively give or revoke permissions
- So whenever a specific permission is needed, the code needs to check whether it has access or not
  - If not, can explain why it is needed & ask
  - Permissions can be revoked at any time, so need to check

### Why do we need to ask for permission?

- Helps Android to support goals related to user privacy:
  - Control: the user has control over the data that they share
  - Transparency: the user understands what data an app uses & why it is needed
  - Data minimisation: an app only accesses the data that it needs for a specific task/action initiated by the user

## Data persistence

### Files in Android

- Different places to store files
  - Application specific
    - Preference file
      - Application information
      - Small amounts of information about the application (e.g., user settings & UI settings)
    - Regular files
      - E.g., object files, text files, binary files
      - Related to the application
  - Publicly accessible (e.g., camera, alarms & downloads)

### Shared preferences - saving

```java
// retrieve preferences with the name "my_prefs" - you can have multiple preferences
SharedPreferences preferences = getSharedPreferences("my_prefs", MODE_PRIVATE);
// obtain an editor so that the preferences can be changed
SharedPreferences.Editor editor = preferences.edit();
// use the editor to make changes
editor.putString("aString", s);
editor.putFloat("aFloat", f);
editor.putInt("anInt", i);
editor.putBoolean("aBool", b);
// commit the changes
editor.apply();
```

### Shared preferences - loading

```java
// retrieve preferences with the name "my_prefs" - you can have multiple preferences
SharedPreferences preferences = getSharedPreferences("my_prefs", MODE_PRIVATE);
// retrieve values from preference file
String s = preferences.getString("aString", "nothing");
Float f = preferences.getFloat("aFloat", 0);
Integer i = preferences.getInt("anInt", 0);
Boolean b = preferences.getBoolean("aBool", true);
```

Note: use `PreferenceScreen` and `PreferenceActivity` to easily manage preference settings.

### Loading & Saving Instance State using Lifecycle Handlers

- Android can & will terminate Activities to free resources
- If a session is terminated by Android, can save/restore UI state
  - Save state in the `onSaveInstanceState` handler (callback method)
  - Restore state in either the `onRestoreInstanceState` or `onCreate` handlers
- An Activity can be closed:
  - By the user – pressing the back/home button OR
  - By code – calling `finish()` (like when calling an activity for a result)
  - Then `onSaveInstanceState` & `onRestoreInstanceState` are not called
  - So rather use Preferences in `onPause` & `onResume`

### Including static files as resources

- Must be placed in the `res/raw` folder
- Use the `openRawResource` method to obtain an input stream
- These files are read-only
- Can set resources based on different languages, locations & hardware configurations
  - E.g., `res/raw-fr` for the same resource, but in French – Android always gives the correct file based on context

```java
Resources resources = getResources();
InputStream fis = resources.openRawResource(R.raw.myfilename);
```

### Working with the Android file system

- Most of the classes/methods found in `java.io` are still applicable
- Convenience methods are provided:
  - `deleteFile` – removes a specific file created by the current application
  - `fileList` – returns a string array of files created by the current application (or specific location)
  - `getFilesDir` – returns the absolute path to files created by the current application

### Creating application files

```java
// open file for saving to
FileOutputStream fos = openFileOutput("myFile.dat", Context.MODE_PRIVATE);
// open file to read from
FileInputStream fis = openFileInput("myFile.dat");
```

### Creating public/external files

```java
// obtain absolute path to specific folder, parameter can be one of:
// DIRECTORY_ALARMS, DIRECTORY_DCIM, DIRECTORY_DOWNLOADS, DIRECTORY_MOVIES,
// DIRECTORY_MUSIC, DIRECTORY_NOTIFICATIONS, DIRECTORY_PICTURES,
// DIRECTORY_PODCASTS, DIRECTORY_RINGTONES
File path = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_MUSIC);
File file = new File(path, FILENAME);
```

Note: if you want to access the SD card/external files, remember to set the correct permission in the manifest, e.g.:

```xml
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

## Exception handling

### Why do we need error handling?

- To create programs that are:
  - Clear
  - Robust
  - Fault-tolerant

### Introduction

- Error handling code should be separated from program code
- Error conditions must be dealt with

### When to use error handling?

- To handle exceptional cases
- To process exceptions from other classes
- To handle errors in a uniform way
- Some not-so-great practices: ignoring them, or aborting on an error

### Review of error handling

- Methods throw exceptions
- Exception handlers catch them
- For every `try` block:
  - 0..many `catch` blocks - done depending on if the try block threw an error
  - 0..1 `finally` block - always done

```java
// code before try-catch block
try
{
    // code to try and run
    // might throw exception(s)
}
catch (Exception ex)
{
    // if something goes wrong (exception ex)
    // handle error here
}
finally
{
    // regardless of what happens
    // always run this code
}
// code after try-catch block
```

### Example

```java
Scanner sin = new Scanner(System.in);
System.out.println("Enter two doubles:");
try
{
    // code to try and run, might throw exception(s)
    Double x = sin.nextDouble(); // user could enter a non-number
    Double y = sin.nextDouble(); // user could enter a non-number
    Double z = x / y;            // could attempt to divide by zero
}
catch (Exception e)
{
    System.out.println("Unable to complete operation. " + e.getMessage());
}
finally
{
    System.out.println("Finally");
}
System.out.println("Completed operation.");
```

Exceptions are subclasses of `Throwable`:

- `Throwable`
  - `Error`
  - `Exception` (Checked)
    - `RuntimeException` (Unchecked)

### Throwing exceptions

- To allow a method to throw exceptions, it must declare what exceptions it may throw
- A method must indicate that it throws an exception if its try-catch block can throw an exception that the catches do not handle

```java
public void myMethod() throws SomeException
{
    throw (new SomeException());
}
```

### Defining new exceptions

- Sometimes you want to define your own exceptions:
  - Want to pass specific parameters that could be used to solve the problem
  - Want to handle specific types of errors differently from existing errors

```java
class CustomException extends Exception
{
    CustomException(String msg)
    {
        super(msg);
    }
}
```

- Should select an appropriate subclass

```java
class DivideByZeroException extends ArithmeticException
{
    DivideByZeroException()
    {
    }
}
```

### Throwing the new exception

```java
int divide(int num1, int num2) throws DivideByZeroException
{
    if (num2 == 0)
        throw (new DivideByZeroException());
    return (num1 / num2);
}
```

### Rethrowing exceptions

- Sometimes necessary to defer exception handling to the next enclosing try-catch clause
  - i.e., the method calling the current method should do the exception handling
- An exception can be re-thrown inside a `catch` clause by calling: `throw exception;`
- If an exception is thrown from within a `catch() {…}` block:
  - the other catch blocks do not attempt to catch it (it is thrown out of the try-catch block & is considered unhandled)

## Styles

### Styling in Android

- Allows a consistent look & feel to be maintained across multiple Views/Activities/Application
- Presentation is separated from Logic in Android (like CSS style sheets)
- Style
  - Specifying a set of attribute/value pairs applied to a View
- Theme
  - Style applied to an entire application or Activity

### How to style?

Separate the Style from the View:

```xml
<style name="ButtonStyle" parent="@android:style/Widget.Button">
    <item name="android:gravity">center_vertical|center_horizontal</item>
</style>
```

Apply the Style to the View:

```xml
<Button
    style="@style/ButtonStyle"
    android:text="This is Style String"
/>
```

### Creating Styles

- Styles are a resource, i.e., found in `/res/values/styles.xml`
  - Have a number of styling items that specify colours, thicknesses, etc.
- Style of a View is set by specifying a value for the style property
- Android Studio lets you extract style information using Refactor → Extract Style

```xml
<resources>
    <style name="AppTheme" parent="AppBaseTheme">
        <!-- All customizations that are NOT specific to a particular API-level can go here. -->
    </style>
    <style name="LightTheme" parent="AppTheme">
        <item name="android:textColor">#101010</item>
        <item name="android:textSize">16sp</item>
        <item name="android:button">@style/new_button</item>
    </style>
    <style name="new_button" parent="@android:style/Widget.Button">
        <item name="android:layout_width">fill_parent</item>
        <item name="android:layout_height">wrap_content</item>
        <item name="android:textColor">#FF0000</item>
        <item name="android:gravity">center_vertical|center_horizontal</item>
        <item name="android:focusable">true</item>
        <item name="android:clickable">true</item>
    </style>
</resources>
```

### Applying themes

To an individual View:

```xml
<Button
    style="@style/ButtonStyle"
    android:text="This is Style String"
/>
```

To an individual Activity (in `AndroidManifest.xml`):

```xml
<activity android:name=".StyleTheme"
    android:label="@string/app_name"
    android:theme="@style/ButtonChild">
```

Or in code:

```java
this.setTheme(R.style.ButtonChild);
```

To the entire Application (in `AndroidManifest.xml`):

```xml
android:theme="@style/ButtonChild"
```

### Changing styles dynamically in code

- Currently no easy way to change styles by default in Android
- BUT, AirBnb has a plugin at https://github.com/Airbnb/paris that does a fairly good job
  - To use, add the following to `build.gradle` (for the module) at the end:

```groovy
dependencies {
    implementation 'com.airbnb.android:paris:1.7.1'
}
```

  - Then:

```java
Button btnRegular = findViewById(R.id.btnRegular);
Paris.style(btnRegular).apply(R.style.MyButtonStyle);
```
