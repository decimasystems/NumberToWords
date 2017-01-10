var Numeral = (function () {
    function Numeral(numar) {
        this.numar = numar;
        //rezultat va fi un string de tip vector
        this.rezultat = [""];
        this.ordin = 0;
        this._ordinP = ['', ' mii', ' milioane', ' miliarde'];
        this._ordinS = ['', 'mie', 'milion', 'miliard'];
        this._sute = ['', 'o suta ', 'doua sute ', 'trei sute ', 'patru sute ', 'cinci sute ', 'sase sute ', 'sapte sute ', 'opt sute ', 'noua sute '];
        this._zeci = ['', 'zece', 'douazeci', 'treizeci', 'patruzeci', 'cinzeci', 'saizeci', 'saptezeci', 'optzeci', 'nouazeci'];
        this._unitati = ['', 'unu', 'doi', 'trei', 'patru', 'cinci', 'sase', 'sapte', 'opt', 'noua'];
        this._sprezece = ['', 'unsprezece', 'doisprezece', 'treisprezece', 'paisprezece', 'cinsprezece', 'saisprezece', 'saptesprezece', 'optsprezece', 'nouasprezece'];
    }
    Numeral.prototype.convertDecimal = function () {
        var ret = null;
        var value;
        var integer, decimal;
        value = this.numar.split(',');
        integer = new Numeral(value[0]);
        if (!value[1]) {
            ret = integer.ToWord();
        }
        else {
            decimal = new Numeral(value[1]);
            ret = integer.ToWord() + 'virgula ' + decimal.ToWord();
        }
        return ret;
    };
    ;
    Numeral.prototype.convertMoney = function (valutaS, valutaP, baniS, baniP) {
        var ret, rezd, rezi = null;
        var value;
        var integer, decimal;
        var dec;
        value = this.numar.split(',');
        integer = new Numeral(value[0]);
        if (+value[0] == 0) {
            rezi = 'zero ' + valutaP;
        }
        else if (+value[0] > 1) {
            rezi = integer.ToWord() + valutaP;
        }
        else
            rezi = integer.ToWord() + valutaS;
        if (value[1]) {
            if (value[1].length == 1) {
                dec = +value[1] * 10 + '';
                decimal = new Numeral(dec);
                rezd = decimal.ToWord() + baniP;
            }
            else {
                if (value[1] == '01') {
                    decimal = new Numeral(value[1]);
                    rezd = 'un ' + baniS;
                }
                else {
                    decimal = new Numeral(value[1]);
                    rezd = decimal.ToWord() + baniP;
                }
            }
            ret = rezi + ' si ' + rezd;
        }
        else
            ret = rezi;
        return ret;
    };
    ;
    Numeral.prototype.ToWord = function () {
        var ret = '';
        var cat;
        var rest;
        if (this.numar == '0') {
            ret = 'zero';
        }
        else {
            //size va fi egal cu lungimea sirului
            var size = this.numar.length;
            if (size > "999999999999".length) {
                ret = "numar prea mare";
            }
            else {
                cat = Math.floor(size / 3);
                rest = size % 3;
                //grupurile de 3 cifre
                if (rest == 0) {
                    this.convert3Digits(0, size);
                } //grupurile de 1 sau 2 cifre
                else {
                    this.convert3Digits(rest, size);
                    this.convert1or2Digits(rest);
                }
                //rastorn rezultatul pentru a avea ordinea corecta a grupurilor
                this.rezultat.reverse();
                //se face concatenarea grupurilor
                ret = this.rezultat.join(" ");
                if (this.numar == '1') {
                    ret = 'un ';
                }
            }
        }
        return ret;
    };
    ;
    //converteste toate grupurile de 3 cifre
    Numeral.prototype.convert3Digits = function (length, size) {
        var s;
        //extrag grupul de 3 cifre de la dreapta spre stanga  parcurgand sirul 
        for (var i = size; i > length; i = i - 3) {
            //determin numarul curent format din 3 cifre 
            var curent = this.numar.substr(i - 3, 3);
            if (this.ordin > 0) {
                s = this.convertOrdin(curent, 'o', 'doua');
                this.rezultat.push(s);
            }
            this.ordin++;
            //fac conversia pentru un grup
            s = this.convert(+curent);
            //rezultatul fiind un sir il voi baga intr-un vector pentru a putea face concatenarea
            this.rezultat.push(s);
        }
    };
    ;
    //converteste toate grupurile de 1 sau 2 cifre
    Numeral.prototype.convert1or2Digits = function (rest) {
        //rest=1 sau rest=2
        var curent = this.numar.substr(0, rest);
        var x = "";
        //fac conversia pentru un grup
        //rezultatul fiind un sir il voi baga intr-un vector pentru a putea face concatenarea
        if (this.ordin == 1) {
            x = this.convertOrdin(curent, 'o ', 'doua ');
        }
        else if (this.ordin > 1) {
            x = this.convertOrdin(curent, 'un ', 'doua ');
        }
        if (!(this.ordin > 0 && (+curent == 1 || +curent == 2))) {
            x = this.convert(+curent) + this._ordinP[this.ordin];
        }
        this.rezultat.push(x);
    };
    ;
    // ordin mii, milioane, miliarde
    Numeral.prototype.convertOrdin = function (curent, one, two) {
        var ret;
        curent = +curent;
        if (curent == 1) {
            ret = one + this._ordinS[this.ordin];
        }
        else if (curent == 2) {
            ret = two + this._ordinP[this.ordin];
        }
        else if (curent >= 3 && curent < 20) {
            ret = this._ordinP[this.ordin];
        }
        else if (curent >= 20) {
            ret = 'de ' + this._ordinP[this.ordin];
        }
        return ret;
    };
    ;
    Numeral.prototype.convert = function (valoare) {
        var sute, zeci, unitati;
        if (valoare == 0) {
            return "";
        }
        //determin pentru grupul de 3 cifre cel al sutelor -- cifra sutelor, zecilor si unitatilor   
        sute = Math.floor(valoare / 100);
        zeci = Math.floor((valoare % 100) / 10);
        unitati = valoare % 10;
        var rezultat;
        //caz.1: cifra sutelor
        //1.1: sute=1; zeci=0; unitati=0; 100
        if ((sute >= 1) && (zeci == 0) && (unitati == 0)) {
            rezultat = this._sute[sute];
        }
        //1.2. sute>=1; zeci>=1; unitati=0; 210
        if ((sute >= 1) && (zeci >= 1) && (unitati == 0)) {
            rezultat = this._sute[sute] + this._zeci[zeci];
        }
        //1.3. sute>=1; zeci>=1; unitati>=1; 311
        if ((sute >= 1) && (zeci == 1) && (unitati >= 1)) {
            rezultat = this._sute[sute] + this._sprezece[unitati];
        }
        //1.3. sute>=1; zeci>1; unitati>=1; 459
        if ((sute >= 1) && (zeci > 1) && (unitati >= 1)) {
            rezultat = this._sute[sute] + this._zeci[zeci] + ' si ' + this._unitati[unitati];
        }
        //1.4. sute>=1; zeci=0; unitati>=1
        if ((sute >= 1) && (zeci == 0) && (unitati > 0)) {
            rezultat = this._sute[sute] + this._unitati[unitati];
        }
        //caz.2: cifra zecilor
        //2.1. sute=0; zeci=1; unitati=0; 10
        if ((zeci >= 1) && (sute == 0) && (unitati == 0)) {
            rezultat = this._zeci[zeci];
        }
        else if ((zeci == 1) && (sute == 0) && (unitati >= 1)) {
            rezultat = this._sprezece[unitati];
        }
        else if ((zeci > 1) && (sute == 0) && (unitati >= 1)) {
            rezultat = this._zeci[zeci] + ' si ' + this._unitati[unitati];
        }
        else if ((unitati >= 1) && (zeci == 0) && (sute == 0)) {
            rezultat = this._unitati[unitati];
        }
        return rezultat;
    };
    ;
    return Numeral;
})();
exports.Numeral = Numeral;
;
