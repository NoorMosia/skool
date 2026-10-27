# Lecture 01: Introduction to Android

## Mobile devices

- Smaller, more powerful
- Features: GPS, Camera, Multimedia, Touch input, etc.
- Require a robust, flexible OS

## Android

- Ecosystem of:
  - Free, Open Source OS for embedded systems
  - Open Source development platform for creating applications
  - Devices that run Android OS & applications

### Android platform architecture

- Linux kernel that interfaces with hardware
  - Provides security, threading & low-level memory management
- Hardware Abstraction Layer (HAL) for hardware independence
- Android Runtime (ART) for running apps
- Open Source libraries, e.g. SQLite, WebKit, OpenGL, media manager
- Run-time to execute & host Android apps
- Application framework that exposes window manager, location manager, databases, telephony, sensors
- UI framework
- Pre-installed apps
- SDK for creating apps

### Dalvik VM & ART

- Prior to Android 5.0, had a Virtual Machine (called Dalvik) on which apps ran
  - Similar concept to the Java VM
  - Created to allow multiple instances of the VM to run on the device
  - Uses the Linux kernel to handle security, threading, process & memory management
  - When compiled, Java code was converted to Dalvik code
- Android 5.0 introduced ART officially
  - At installation time, an app is compiled directly to the device's machine code
  - Slower installation time, more secondary storage required, but runs faster

## Lifecycle

- An application has an Activity that changes state as it is being used
- Incoming calls, user pressing buttons, etc. affect the state of the Activity
- Slow responding applications are terminated after a short period of time (5s)
- The application is responsible for remembering the state of variables/GUI, etc.

## Manifest

- Each application contains an `AndroidManifest.xml`
- Describes:
  - Where the entry point of the application is
  - What is required by the application to function
    - Permissions, hardware, versions of Android
  - What intents it can respond to

## Activities

- Activity = a single "task" of an application, e.g.
  - Select contact, Type SMS, Perform search
- Similar to a JavaFX Scene, have Views
- Lifecycle is controlled by Android & the Application class
- Need to specify the starting Activity in `AndroidManifest.xml`
- Activities may be exposed to other applications, allowing other applications to call specific activities of another application (this is NB)

### Hints for using Activities

- Should be self-contained
- Use layout managers
- Split into Fragments if you want to reuse in another Activity's UI
- Use resources

## Resources

- Resources are stored in external files
- Found under the `/res` folder
- Store images, strings, GUI layouts
- Easy to change

### `/res/values/strings.xml`

- Strings used in GUI

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="hello">Hello World, ExampleActivity!</string>
    <string name="app_name">Example</string>
</resources>
```

- Easy to localise to another language
- Located in a single file
- Accessed elsewhere as `@string/app_name`
- Can retrieve in code using: `String s = getString(R.string.app_name);`

### `/res/layout/main.xml`

- Defines GUI separately from code (like FXML)
- Can easily change GUI without touching a line of code
- Use layout managers to allow the GUI to resize nicely
- Can have multiple versions of a GUI for different devices

## Views

- Similar to JavaFX components/controls
- Views for Buttons, List boxes, etc.
- Typically do NOT create in code, rather described in an XML layout (like in FXML)
- Typical usage:
  - Drag-and-drop a View onto the layout
  - Configure attributes in the editor
  - Attach event handler(s) by:
    - Specifying in the editor (linked via reflection, i.e., same way as in JavaFX) OR
    - Specifying the handler in code (also as done in JavaFX)

## Intents

- Tells Android what your activity INTENDS to have done
- Android decides WHO will fulfill that intention (if anyone)
- What can they do?
  - Change to other Activities (screens) in the same application
  - Call Activities from other applications, e.g., initiate a phone call, send SMSs
  - Obtain results from other applications, e.g., get a photo from the camera, request voice recognition
  - Override default Intents, e.g., replace the standard way of receiving SMSs
  - Expose your Activities to be used by other applications
- Starting an Activity with an Intent:
  - Explicit: Specify the Activity you want to handle the Intent
  - Implicit: Indicate the type of Intent to handle & let Android decide who will handle it

### Explicit Intents

- The Activity class to handle the Intent is explicitly given
- The Activity class MUST be registered in the `AndroidManifest.xml` file
- Typically WITHIN an application

### Implicit Intents

- An action is specified & Android decides on the best app & Activity to handle it
- Typically between applications

## Deploying & running an Android app

- Android apps cannot run directly on Windows (or iOS, etc.) because Android is a different OS
- Need a real Android device or an emulator
  - Connect an Android device via USB to the PC, ensure that Developer Options (USB Debugging, etc.) are enabled OR
  - Create an emulator using the Device Manager
- Using a real device gives direct access to sensors, etc.

## Debugging

- While connected to a real device or emulator, you can:
  - Use break points & step through code (like regular Java)
    - Must start running with the debug button (the bug)
  - No `System.out`, but can use logging, which appears in Android Studio
    - Using `Log.i`, `Log.e`, `Log.d`, etc.

## Publishing

- Once exported from the IDE, the APK is on the device
- For others to use, Google's Play Store
  - Free, Pay-to-download, Pay-for-in-app items
