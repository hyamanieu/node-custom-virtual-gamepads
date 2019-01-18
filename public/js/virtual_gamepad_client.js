/***********************
 INITIALIZE THE JOYSTICK
 **********************/
var setDirection = function() {};
var initJoystick = function () {
    var dirCursor = document.getElementById("dirCenter");
    var container = document.getElementById("dirContainer");
    // var joystickBoundLimit = document.getElementById("path3212");

    var joystick = new VirtualJoystick({
        mouseSupport: true,
        stationaryBase: true,
        baseX: $(dirCursor).position().left,
        baseY: $(dirCursor).position().top,
        limitStickTravel: true,
        stickRadius: 50,
        baseElement: $(dirCursor).clone()[0],
        container: container,
        strokeStyle: '#777f82'
    });
    
    $(window).resize(function () {
        joystick._baseX = $(dirCursor).position().left;
        joystick._baseY = $(dirCursor).position().top;
    });

    
       
    var lastDirection = "none";
    var analog = location.href.match(/\?analog/);
    setInterval(function(){
        if (analog) {
            /************
            JOYSTICK MODE
             ***********/
            if (joystick.left() || joystick.right() | joystick.up() || joystick.down()) {
                lastDirection = "dir";
                var xy = {
					direction: "dir",
                    x: Math.round(127*(joystick.deltaX()/50 + 1)),
                    y: Math.round(127*(joystick.deltaY()/50 + 1))
                };
                setDirection(xy);
            } else if (lastDirection != "none"){
                lastDirection = "none";
                setDirection({direction: "none", x: 127, y: 127});
            }
        } else {
            /************
             DIRECTIONAL PAD MODE
             ***********/
            if(joystick.left()) {
                if (lastDirection != "left") {
                    lastDirection = "left";
                    setDirection({direction: "left"});
                }
            } else if(joystick.right()) {
                if (lastDirection != "right") {
                    lastDirection = "right";
                    setDirection({direction: "right"});
                }
            } else if(joystick.up()) {
                if (lastDirection != "up") {
                    lastDirection = "up";
                    setDirection({direction: "up"});
                }
            } else if(joystick.down()) {
                if (lastDirection != "down") {
                    lastDirection = "down";
                    setDirection({direction: "down"});
                }
            } else if (lastDirection != "none") {
                lastDirection = "none";
                setDirection({direction: "none"});
            }
        }
    }, 1/30 * 1000);
    
    
    if (document.getElementById("dirCenter2")) {
		var dirCursor2 = document.getElementById("dirCenter2");
        var container2 = document.getElementById("dirContainer2");
		var joystick2 = new VirtualJoystick({
			mouseSupport: true,
			stationaryBase: true,
			baseX: $(dirCursor2).position().left,
			baseY: $(dirCursor2).position().top,
			limitStickTravel: true,
			stickRadius: 50,
			baseElement: $(dirCursor2).clone()[0],
			container: container2,
			strokeStyle: '#777f82'
        });
        
        $(window).resize(function () {
            joystick._baseX = $(dirCursor).position().left;
            joystick._baseY = $(dirCursor).position().top;
            joystick2._baseX = $(dirCursor2).position().left;
            joystick2._baseY = $(dirCursor2).position().top;
        });
        
        var lastDirection2 = "none2";
		setInterval(function(){
			if (analog) {
				/************
				JOYSTICK MODE
				 ***********/
				if (joystick2.left() || joystick2.right() | joystick2.up() || joystick2.down()) {
					lastDirection2 = "dir2";
					var xy2 = {
						direction: "dir2",
						x2: Math.round(127*(joystick2.deltaX()/50 + 1)),
						y2: Math.round(127*(joystick2.deltaY()/50 + 1))
					};
					setDirection(xy2);
				} else if (lastDirection2 != "none2"){
					lastDirection2 = "none2";
					setDirection({direction: "none2", x2: 127, y2: 127});
				}
			} else {
				/************
				 DIRECTIONAL PAD MODE
				 ***********/
				if(joystick2.left()) {
					if (lastDirection2 != "left2") {
						lastDirection2 = "left2";
						setDirection({direction: "left2"});
					}
				} else if(joystick2.right()) {
					if (lastDirection2 != "right2") {
						lastDirection2 = "right2";
						setDirection({direction: "right2"});
					}
				} else if(joystick2.up()) {
					if (lastDirection2 != "up2") {
						lastDirection2 = "up2";
						setDirection({direction: "up2"});
					}
				} else if(joystick2.down()) {
					if (lastDirection2 != "down2") {
						lastDirection2 = "down2";
						setDirection({direction: "down2"});
					}
				} else if (lastDirection2 != "none2") {
					lastDirection2 = "none2";
					setDirection({direction: "none2"});
				}
			}
		}, 1/30 * 1000);
	}
};

/*************************
 INITIALIZE SLOT INDICATOR
 ************************/
var indicatorOn;
var slotNumber;
var initSlotIndicator = function () {
    indicatorOn = false;
    var slotAnimationLoop = function () {
        if (slotNumber != undefined) {
            $(".indicator").removeClass("indicatorSelected");
            $("#indicator_"+(slotNumber+1)).addClass("indicatorSelected");
        } else {
            if(indicatorOn) {
                $(".indicator").removeClass("indicatorSelected");
            } else {
                $(".indicator").addClass("indicatorSelected");
            }
            indicatorOn = !indicatorOn;
            setTimeout(slotAnimationLoop, 500);
        }
    }
    slotAnimationLoop();
}

/**********************
 HAPTIC CALLBACK METHOD
 *********************/
navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
var hapticCallback = function () {
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
};

/****************
 MAIN ENTRY POINT
 ***************/
$( window ).load(function() {
	if (document.getElementById("dirCenter")){
        initJoystick();
    }
    initSlotIndicator();

    var socket = io();

    socket.on("gamepadConnected", function(data) {
        slotNumber = data.padId;

        $(".btn").off("touchstart touchend");
        setDirection = function(){};

        $(".btn").on("touchstart", function() {
            btnId = $(this).data("btn");
            $("#"+btnId).attr("class", "btnSelected");
            socket.emit("padEvent", {type: 0x01, code: $(this).data("code"), value: 1});
            hapticCallback();
        });

        $(".btn").on("touchend", function() {
            btnId = $(this).data("btn");
            $("#"+btnId).attr("class", "");
            socket.emit("padEvent", {type: 0x01, code: $(this).data("code"), value: 0});
            //hapticCallback();
        });

        setDirection = function(direction) {
            switch (direction.direction) {
                case "left" :
                    socket.emit("padEvent", {type: 0x03, code: 0x00, value: 0});
                    socket.emit("padEvent", {type: 0x03, code: 0x01, value: 127});
                    break;
                case "right" :
                    socket.emit("padEvent", {type: 0x03, code: 0x00, value: 255});
                    socket.emit("padEvent", {type: 0x03, code: 0x01, value: 127});
                    break;
                case "up" :
                    socket.emit("padEvent", {type: 0x03, code: 0x00, value: 127});
                    socket.emit("padEvent", {type: 0x03, code: 0x01, value: 0});
                    break;
                case "down" :
                    socket.emit("padEvent", {type: 0x03, code: 0x00, value: 127});
                    socket.emit("padEvent", {type: 0x03, code: 0x01, value: 255});
                    break;
                case "none" :
                    socket.emit("padEvent", {type: 0x03, code: 0x00, value: 127});
                    socket.emit("padEvent", {type: 0x03, code: 0x01, value: 127});
                    break;
                case "left2" :
                    socket.emit("padEvent", {type: 0x03, code: 0x03, value: 0});
                    socket.emit("padEvent", {type: 0x03, code: 0x04, value: 127});
                    break;
                case "right2" :
                    socket.emit("padEvent", {type: 0x03, code: 0x03, value: 255});
                    socket.emit("padEvent", {type: 0x03, code: 0x04, value: 127});
                    break;
                case "up2" :
                    socket.emit("padEvent", {type: 0x03, code: 0x03, value: 127});
                    socket.emit("padEvent", {type: 0x03, code: 0x04, value: 0});
                    break;
                case "down2" :
                    socket.emit("padEvent", {type: 0x03, code: 0x03, value: 127});
                    socket.emit("padEvent", {type: 0x03, code: 0x04, value: 255});
                    break;
                case "none2" :
                    socket.emit("padEvent", {type: 0x03, code: 0x03, value: 127});
                    socket.emit("padEvent", {type: 0x03, code: 0x04, value: 127});
                    break;
                case "dir" :
                    socket.emit("padEvent", {type: 0x03, code: 0x00, value: direction.x});
                    socket.emit("padEvent", {type: 0x03, code: 0x01, value: direction.y});
                    break;
                case "dir2" :
                    socket.emit("padEvent", {type: 0x03, code: 0x03, value: direction.x2});
                    socket.emit("padEvent", {type: 0x03, code: 0x04, value: direction.y2});
                    break;
                default :
                    socket.emit("padEvent", {type: 0x03, code: 0x00, value: direction.x});
                    socket.emit("padEvent", {type: 0x03, code: 0x01, value: direction.y});
                    break;
            }
        };
        if (document.getElementById("dirCenter")) {
            setDirection({direction: "dir", x: 127, y: 127});
	    }
        if (document.getElementById("dirCenter2")) {
            setDirection({direction: "dir2", x2: 127, y2: 127});
        }
    });

    socket.on("connect", function() {
        socket.emit("connectGamepad", null);
    });

    socket.on("disconnect", function() {
        location.reload();
    });
} );
