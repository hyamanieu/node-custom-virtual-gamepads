# node-custom-virtual-gamepads

This nodejs application provides the possibility to use your smartphone 
as a gamepad controller on Linux OS simply by reaching a local address.
You can virtually plug **up to 4** gamepad controllers.

It is forked from [node-virtual-gamepads][original] and modified to allow for changing
the type of gamepad, accepting up to 8 buttons and 2 joysticks. 

**note the readme is different than the original one!**

[original]: https://github.com/jehervy/node-virtual-gamepads

Demo of the original (the same can be done with this version)
----
Demo video 1 player in game [here](https://www.youtube.com/watch?v=OWgWugNsF7w)

Demo video 3 players on EmulStation [here](https://www.youtube.com/watch?v=HQROnYLRyOw)

Prerequisite
------------
This application is only compatible with Linux OS with the **uinput** kernel module installed.
You also need python3.

Installation
------------
    git clone https://github.com/hyamanieu/node-custom-virtual-gamepads
    cd node-virtual-gamepads
    npm install

If you encounter problems while installing or running node-virtual-gamepads have
a look at the [troubleshooting](TROUBLESHOOTING.md) page.

You can now configure the server to your needs. Just open `config.json`
with the editor of you choice and adjust the values.

  * `port`: sets the port the web-server is listening on.
  * `useGamepadByDefault`: if set to `false`, the `/` will redirect to a
    page where one of gamepad, keyboard, or touchpad can be chosen.
    If set to `true`, `/` redirects to the gamepad. The input-selection
    page can still be accessed via `/index.html`.
  * `analog`: if set to `true` the the above mentioned redirection will
    append `?analog` to the address. This flag will cause the gamepad's
    d-pad to act like an analog stick instead of d-pad.
  * `logLevel`: set it to `"debug"` to get a lot more logging output,
    to `"warning"` to only get critical output, or even to `"error"` if
    you want to only get errors logged (not recommended).

To start the server run
    
    python3 start_custom_virtual_gamepad.py
    
This will start the server as shown in the original demo.

If you want to use your own gamepad, simply run

    python3 start_custom_virtual_gamepad.py path_to_gamepad.svg
    
Changing the gamepad
--------------------

To make your own custom gamepad, the easiest is to modify the original
svg under ./public/images/controler_extracted.svg

You then need to modify or delete the objects in the layer named *Cursors* 
(decrease the layer transparency to see them).

For the buttons: the binding is done under the attribute
*data-code* of the button object. Under Inkscape, you can access the object 
attributes with the XML editor (ctrl+shift+X).
In case you create the SVG from scratch, here is the list of code for each of the 
8 buttons for conveniance. You do not need to add them all.

```
uinput.BTN_A         = 0x130;
uinput.BTN_B         = 0x131;
uinput.BTN_X         = 0x133;
uinput.BTN_Y         = 0x134;
uinput.BTN_TL        = 0x136;
uinput.BTN_TR        = 0x137;
uinput.BTN_SELECT    = 0x13a;
uinput.BTN_START     = 0x13b;
```

you can remove the joystick. Simply delete the circle with object id 
`dirCenter` in the *Cursors* layer.

You can add a second joystick. For now, it must be added exactly on the 
oposite side of the first one. You need to add another small object
with id `dirCenter2` (copy & paste the first). You cannot have only
the second joystick.

There are two ugly custom examples:
 * /public/images/0js_4buttons.svg
 * /public/images/2js_4btn.svg

Improving custom virtual gamepads
---------------------------------
The implementation is quite dirty. If you can rewrite what the python3
code does directly in main.js, it may be easier to use.

Usage
-----
Once the nodejs application is launched, you just have to plug your gamepad controller
by connecting your device on the same local network and by reaching the address *http://node_server_address*

Features
--------
### Plug up to 4 virtual gamepads
The application will plug automatically a new controller when the web application is launched and unplug it at disconnection.
4 slots are available so 4 virtual gamepads can be created. You can see your current slot on the indicator directly on the vitual gamepad.

![Virtual gamepad](https://github.com/miroof/node-virtual-gamepads/blob/resources/screenshots/standalone.png?raw=true)

### Use it as standalone application (chrome mobile)
With the [add to homescreen](https://developer.chrome.com/multidevice/android/installtohomescreen) chrome feature,
you can easily use virtual gamepads application without launching the browser each time you want to play.

With only 3 clicks, virtual gamepads web application becomes a standalone application.

![Standalone installation step 1](https://github.com/miroof/node-virtual-gamepads/blob/resources/screenshots/standalone_step1.png?raw=true)
![Standalone installation step 2](https://github.com/miroof/node-virtual-gamepads/blob/resources/screenshots/standalone_step2.png?raw=true)

Then a shortcut is added on your homescreen and the application will be launched outside the browser.

![Virtual gamepad directly from the homescreen](https://github.com/miroof/node-virtual-gamepads/blob/resources/screenshots/standalone_step3.png?raw=true)
![Launched outside the browser](https://github.com/miroof/node-virtual-gamepads/blob/resources/screenshots/standalone_step4.png?raw=true)

### Enjoy haptic feedbacks
Because it's difficult to spot the right place in a touch screen without looking at it,
the touch zone of each button was increased. LT button was moved at the center of the screen
to let as much space as possible for the joystick and avoid touch mistakes.

![Step 1](https://github.com/miroof/node-virtual-gamepads/blob/resources/schemas/touch_zones.png?raw=true)

To know if we pressed a button with success, the web application provides an haptic feedback
which can be easily deactivated by turning off the vibrations of the phone.

### Use the keyboard to enter text
![Virtual Keyboard](https://github.com/miroof/node-virtual-gamepads/blob/resources/screenshots/keyboard.png?raw=true)

### Use the touchpad for mouse inputs
![Virtual Touchpad](https://github.com/miroof/node-virtual-gamepads/blob/resources/screenshots/touchpad.png?raw=true)

### An index page lets you choose
![Index page](https://github.com/miroof/node-virtual-gamepads/blob/resources/screenshots/index.png?raw=true)

Developing
----------
For developing you will also have to install coffeescript

    sudo apt-get install coffeescript

When you changed something in a coffeescript (e.g. main.coffee) run

    coffee -c main.coffee

This will compile main.coffee to main.js which than can be run with node
(see [Installation](README.md#installation))
To compile all coffee files when ever they change run

    coffee -cw .

If you want do add a new keyboard layout please refer to [this file](CREATE_KEYBOARD_LAYOUT.md).
