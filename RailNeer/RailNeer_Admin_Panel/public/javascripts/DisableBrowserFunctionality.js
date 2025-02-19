try {
    //Disable the Context Menu event.
    $(document).contextmenu(function () {
        return false;
    });

    $(document).keydown(function (event) {
        if (event.keyCode == 123) {
            return false;
        }
        else if (event.ctrlKey && event.shiftKey && event.keyCode == 73) {
            return false;  //Prevent from ctrl+shift+i
        }
        else if (event.ctrlKey && event.shiftKey && event.keyCode == 67) {
            return false;  //Prevent from ctrl+shift+c
        }
        else if (event.ctrlKey && event.shiftKey && event.keyCode == 77) {
            return false;  //Prevent from ctrl+shift+m
        }
    });

    if (document.layers) {
        //Capture the MouseDown event.
        document.captureEvents(Event.MOUSEDOWN);
        //Disable the OnMouseDown event handler.
        $(document).mousedown(function () {
            return false;
        });
    }
    else {
        //Disable the OnMouseUp event handler.
        $(document).mouseup(function (e) {
            if (e != null && e.type == "mouseup") {
                //Check the Mouse Button which is clicked.
                if (e.which == 2 || e.which == 3) {
                    //If the Button is middle or right then disable.
                    return false;
                }
            }
        });
    }

    document.onkeydown = function (e) {
        e = e || window.event;//Get event
        if (e.ctrlKey) {
            var c = e.which || e.keyCode;//Get key code
            switch (c) {
                case 83://Block Ctrl+S
                case 87://Block Ctrl+W --Not work in Chrome
                    e.preventDefault();
                    e.stopPropagation();
                    break;
            }
        }
    };

    //$(window).focus(function () {
    //    $("body").show();
    //}).blur(function () {
    //    $("body").hide();
    //});

    $(window).keyup(function (e) {
        if (e.keyCode == 44) {
            copyToClipboard();
        }
    });

    window.onbeforeunload = function () {//Prevent Ctrl+W
        // return "Really want to quit the game?";
    };

    function copyToClipboard() {
        // Create a "hidden" input
        var aux = document.createElement("input");
        // Assign it the value of the specified element
        aux.setAttribute("value", "Sorry you dont have permission..");
        // Append it to the body
        document.body.appendChild(aux);
        // Highlight its content
        aux.select();
        // Copy the highlighted text
        document.execCommand("copy");
        // Remove it from the body
        document.body.removeChild(aux);
        alert("Sorry you dont have permission..");
    }
} catch (e) {
    console.log("FileName: DisableBrowserFunctionality.js \n\nError Name: " + e.name + "\n\nError Message: " + e.message + "\n\nError Number: " + e.number + "\n\nError Description: " + e.description + "\n\nError Stack: " + e.stack);
}