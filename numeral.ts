export class Numeral {
    private _ordinP;
    private _ordinS;
    private ordin;
    private _sute;
    private _zeci;
    private _unitati;
    private _sprezece;
    //rezultat va fi un string de tip vector
    rezultat: string[] = [""];
    constructor(private numar: string) {
        this.ordin = 0;
        this._ordinP = ['', 'mii', 'milioane', 'miliarde'];
        this._ordinS = ['', 'mie', 'milion', 'miliard'];
        this._sute = ['', 'o suta ', ' doua sute ', 'trei sute ', 'patru sute ', 'cinci sute ', 'sase sute ', 'sapte sute ', 'opt sute ', 'noua sute '];
        this._zeci = ['', 'zece', 'douazeci', 'treizeci', 'patruzeci', 'cinzeci', 'saizeci', 'saptezeci', 'optzeci', 'nouazeci'];
        this._unitati = ['', 'un', 'unu', 'doi', 'trei', 'patru', 'cinci', 'sase', 'sapte', 'opt', 'noua'];
        this._sprezece = ['', 'unsprezece', 'doisprezece', 'treisprezece', 'paisprezece', 'cinsprezece', 'saisprezece', 'saptesprezece', 'optsprezece', 'nouasprezece'];
    }
    public ToWord() {
        var ret: string = '';
        var cat;
        var rest;

        if (this.numar == '0') {
            ret = 'zero';
        } else {
            //size va fi egal cu lungimea sirului
            var size = this.numar.length;
            if (size > "999999999999".length) {
                ret = "numar prea mare";
            } else {

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
                    ret = ret + 'leu';
                } else {
                    ret = ret + 'lei';
                }
            }
        }
        return ret;
    };

    //converteste toate grupurile de 3 cifre
    private convert3Digits(length, size) {

        var s: string;
        //extrag grupul de 3 cifre de la dreapta spre stanga  parcurgand sirul 
        for (var i = size; i > length; i = i - 3) {
            //determin numarul curent format din 3 cifre 
            var curent = this.numar.substr(i - 3, 3);
            if (this.ordin > 0) {
                s=this.convertOrdin(curent, 'o', 'doua');
                this.rezultat.push(s);
            }
            this.ordin++;
            //fac conversia pentru un grup
            s = this.convert(+curent);
            //rezultatul fiind un sir il voi baga intr-un vector pentru a putea face concatenarea
            this.rezultat.push(s);
        }
    };

    //converteste toate grupurile de 1 sau 2 cifre
    private convert1or2Digits(rest) {
        //rest=1 sau rest=2
        var curent = this.numar.substr(0, rest);
        var x: string = "";
        //fac conversia pentru un grup
        //rezultatul fiind un sir il voi baga intr-un vector pentru a putea face concatenarea
        if (this.ordin == 1) {
            x = this.convertOrdin(curent, 'o ', 'doua ');
        } else if (this.ordin > 1) {
            x = this.convertOrdin(curent, 'un ', 'doua ');
        }

        if (!(this.ordin > 0 && (+curent == 1 || +curent == 2))) {
            x = this.convert(+curent);
        }
        this.rezultat.push(x);
    };

    // ordin mii, milioane, miliarde
    private convertOrdin(curent, one, two) {
        var ret;
        curent = +curent;
        if (curent == 1) {
            ret = one + this._ordinS[this.ordin];
        } else if (curent == 2) {
            ret = two + this._ordinP[this.ordin];
        } else if (curent >= 3 && curent < 20) {
            ret = this._ordinP[this.ordin];
        } else if (curent >= 20) {
            ret = 'de ' + this._ordinP[this.ordin];
        }
        return ret;
    };

    private convert(valoare: number) {

        var sute, zeci, unitati: any;

        if (valoare == 0) {
            return "";
        }

        //determin pentru grupul de 3 cifre cel al sutelor -- cifra sutelor, zecilor si unitatilor   
        sute = Math.floor(valoare / 100);
        zeci = Math.floor((valoare % 100) / 10);
        unitati = valoare % 10;
        var rezultat: string;

        //caz.1: cifra sutelor
        //1.1: sute=1; zeci=0; unitati=0; 100
        if ((sute >= 1) && (zeci == 0) && (unitati == 0)) {    //toate cond. sunt indeplinite simultan
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
            rezultat = this._sute[sute] + this._zeci[zeci] + ' si ' + this._unitati[unitati + 1];
        }

        //1.4. sute>=1; zeci=0; unitati>=1
        if ((sute >= 1) && (zeci == 0) && (unitati > 0)) {
            rezultat = this._sute[sute] + this._unitati[unitati + 1];
        }

        //caz.2: cifra zecilor
        //2.1. sute=0; zeci=1; unitati=0; 10
        if ((zeci >= 1) && (sute == 0) && (unitati == 0)) {
            rezultat = this._zeci[zeci];
        }

        //2.2. sute=0; zeci=1; unitati>=1; 14
        else if ((zeci == 1) && (sute == 0) && (unitati >= 1)) {
            rezultat = this._sprezece[unitati];
        }

        //2.3. sute=0; zeci>1; unitati>=1; 61
        else if ((zeci > 1) && (sute == 0) && (unitati >= 1)) {
            rezultat = this._zeci[zeci] + ' si ' + this._unitati[unitati + 1];
        }

        //caz. 3: cifra unitatilor
        //3.1. sute=0; zeci=0; unitati=1; singular --> un leu
        else if ((unitati == 1) && (zeci == 0) && (sute == 0)) {
            rezultat = this._unitati[unitati];
        }
        //3.2. sute>=1;zeci=0;unitati=1; --> si unu lei
        else if ((unitati > 1) && (zeci == 0) && (sute == 0)) {
            rezultat = this._unitati[unitati + 1];
        }

        return rezultat;

    };
};
