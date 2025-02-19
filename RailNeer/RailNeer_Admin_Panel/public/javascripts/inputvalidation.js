//#region Common Functions
jQuery("body").on("keypress", ".AllowAlphabetSpaceKey", function (e) {

    AllowAlphabetSpaceKey(e);
});

jQuery("body").on("keypress", ".AllowNumberKey", function (e) {

    AllowNumberKey(e);
});

jQuery("body").on("keypress", ".AllowDecimalNumberKey", function (e) {

    AllowDecimalNumberKey(e);
});

jQuery("body").on("keypress", ".AllowAlphabetAndNumber", function (e) {

    AllowAlphabetAndNumber(e);
});

function AllowNumberKey(e) {
    var code = ("charCode" in e) ? e.charCode : e.keyCode;
    if (!(code > 47 && code < 58)) { //numeric (0-9)
        e.preventDefault();
    }
}

function AllowAlphabetSpaceKey(e) {
    var code = ("charCode" in e) ? e.charCode : e.keyCode;
    if (!(code == 32) && //space ( )
        !(code > 64 && code < 91) && //upper alpha (A-Z)
        !(code > 96 && code < 123)) { //lower alpha (a-z)
        e.preventDefault();
    }
}

function AllowDecimalNumberKey(e) {
    var code = ("charCode" in e) ? e.charCode : e.keyCode;
    if (!((code > 47 && code < 58) || code === 46)) { //numeric (0-9 & .)
        e.preventDefault();
    }
}

function AllowAlphabetAndNumber(e) {
    var code = ("charCode" in e) ? e.charCode : e.keyCode;
    if (!(code == 32) &&
        !(48 <= code && code <= 57) &&
        !(65 <= code && code <= 90) &&
        !(97 <= code && code <= 122))
        e.preventDefault();
}

//#endregion Common Functions