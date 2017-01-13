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
        this._sute = ['', 'o', '', 'doua', 'trei', 'patru', 'cinci', 'sase', 'sapte', 'opt', 'noua'];
        this._zeci = ['', 'zece', 'douazeci', 'treizeci', 'patruzeci', 'cinzeci', 'saizeci', 'saptezeci', 'optzeci', 'nouazeci'];
        this._unitati = ['', 'unu', 'doi', 'trei', 'patru', 'cinci', 'sase', 'sapte', 'opt', 'noua'];
        this._sprezece = ['', 'unsprezece', 'doisprezece', 'treisprezece', 'paisprezece', 'cinsprezece', 'saisprezece', 'saptesprezece', 'optsprezece', 'nouasprezece'];
    }
    //metoda pentru conversia de numere cu zecimale   
    public convertDecimal() {
        var ret: string = null;
        var value: string[];
        var integer, decimal: any;

        value = this.numar.split(',');
        integer = new Numeral(value[0]);
        if (!value[1]) {
            ret = integer.ToWord();
        } else {
            decimal = new Numeral(value[1]);
            ret = integer.ToWord() + 'virgula ' + decimal.ToWord();
        }
        return ret;
    };
    //metoda pentru convertirea monetara cu zecimale
    public convertMoney(valutaS, valutaP, baniS, baniP, virgula, punct, separator) {
        var ret, rezd, rezi: string = null;
        var value: string[];
        var ordinsep: string[];
        var r: any;
        var integer, decimal: any;
        var dec: any;

        if (+this.numar == 0) {
            ret = '';
        } else {
            value = this.numar.split(virgula);
            if (value && value.length && value.length > 0 && value[0]) {
                if (punct == '.') {
                    value[0] = value[0].replace(/\./g, '');
                } else if (punct == ',') {
                    value[0] = value[0].replace(/\,/g, '');
                }
                integer = new Numeral(value[0]);
                var l = value[0].length;
                var u = +value[0].substr(l - 1, 1);
                var z = l - 2 >= 0 ? +value[0].substr(l - 2, 1) : 0;
                var s = l - 3 >= 0 ? +value[0].substr(l - 3, 1) : 0;
                if ((z >= 2 && u >= 0) || (s >= 0 && z == 0 && u == 0)) {
                    rezi = integer.ToWord(separator) + 'de' + separator + valutaP;
                } else if (+value[0] == 1) {
                    rezi = integer.ToWord(separator) + valutaS;
                } else {
                    rezi = integer.ToWord(separator) + valutaP;
                }
            }

            if (value[1]) {
                if (value[1].length == 1) {
                    value[1] = value[1] + '0';
                    decimal = new Numeral(value[1]);
                    if (value[1] == '10') {
                        rezd = decimal.ToWord(separator) + baniP;
                    } else
                        rezd = decimal.ToWord(separator) + 'de' + separator + baniP;
                } else {
                    if (value[1] == '01') {
                        rezd = 'un' + separator + baniS;
                    } else {
                        decimal = new Numeral(value[1]);
                        rezd = decimal.ToWord(separator) + baniP;
                        if (value[1] >= '20' || value[1] >= '2') {
                            decimal = new Numeral(value[1]);
                            rezd = decimal.ToWord(separator) + 'de' + separator + baniP;
                        }
                    }
                }
                if (+value[0] == 0) {
                    ret = rezd;
                } else {
                    ret = rezi + separator + 'si' + separator + rezd;
                }
            } else {
                ret = rezi;
            }
        }
        
        return ret;
    };

    //metoda de conversie a numerelor in cuvinte
    public ToWord(separator) {
        var ret: string = '';
        var cat;
        var rest;

        //size va fi egal cu lungimea sirului
        var size = this.numar.length;
        if (size > "999999999999,99".length) {
            ret = "numar prea mare";
        } else {

            cat = Math.floor(size / 3);
            rest = size % 3;

            //grupurile de 3 cifre
            if (rest == 0) {
                this.convert3Digits(0, size, separator);
            } //grupurile de 1 sau 2 cifre
            else {
                this.convert3Digits(rest, size, separator);
                this.convert1or2Digits(rest, separator);
            }
            //rastorn rezultatul pentru a avea ordinea corecta a grupurilor
            this.rezultat.reverse();
            //se face concatenarea grupurilor
            ret = this.rezultat.join(separator);

            if (this.numar == '1') {
                ret = 'un';
            }
        }

        return ret;
    };

    //converteste toate grupurile de 3 cifre
    private convert3Digits(length, size, separator) {

        var s: string;
        //extrag grupul de 3 cifre de la dreapta spre stanga  parcurgand sirul 
        for (var i = size; i > length; i = i - 3) {
            //determin numarul curent format din 3 cifre 
            var curent = this.numar.substr(i - 3, 3);
            if (this.ordin > 0) {
                s = this.convertOrdin(curent, 'o', 'doua', separator);
                this.rezultat.push(s);
            }
            this.ordin++;
            //fac conversia pentru un grup
            s = this.convert(+curent, separator);
            //rezultatul fiind un sir il voi baga intr-un vector pentru a putea face concatenarea
            this.rezultat.push(s);
        }
    };

    //converteste toate grupurile de 1 sau 2 cifre
    private convert1or2Digits(rest, separator) {
        //rest=1 sau rest=2
        var curent = this.numar.substr(0, rest);
        var x: string = "";
        //fac conversia pentru un grup
        //rezultatul fiind un sir il voi baga intr-un vector pentru a putea face concatenarea
        if (this.ordin == 1) {
            x = this.convertOrdin(curent, 'o', 'doua', separator);
        } else if (this.ordin > 1) {
            x = this.convertOrdin(curent, 'un', 'doua', separator);
        }

        if (!(this.ordin > 0 && (+curent == 1 || +curent == 2))) {
            x = this.convert(+curent, separator) + separator + this._ordinP[this.ordin];
        }
        this.rezultat.push(x);
    };

    // ordin mii, milioane, miliarde
    private convertOrdin(curent, one, two, separator) {
        var ret;
        curent = +curent;
        if (curent == 1) {
            ret = one + separator + this._ordinS[this.ordin];
        } else if (curent == 2) {
            ret = two + separator + this._ordinP[this.ordin];
        } else if ((curent >= 3 && curent <= 19) || (curent >= 101 && curent <= 119) || (curent >= 201 && curent <= 219) ||
            (curent >= 301 && curent <= 319) || (curent >= 401 && curent <= 419) || (curent >= 501 && curent <= 619)
            || (curent >= 701 && curent <= 719) || (curent >= 801 && curent <= 819) || (curent >= 901 && curent <= 919)) {
            ret = this._ordinP[this.ordin];
        } else ret = 'de' + separator + this._ordinP[this.ordin];

        return ret;
    };

    private convert(valoare: number, separator) {
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
        if (sute == 1) {
            if ((zeci == 0) && (unitati == 0)) {
                rezultat = this._sute[sute] + separator + 'suta';
            }

            //1.2. sute>=1; zeci>=1; unitati=0; 210
            if ((zeci >= 1) && (unitati == 0)) {
                rezultat = this._sute[sute] + separator + 'suta' + separator + this._zeci[zeci];
            }

            //1.3. sute>=1; zeci>=1; unitati>=1; 311
            if ((zeci == 1) && (unitati >= 1)) {
                rezultat = this._sute[sute] + separator + 'suta' + separator + this._sprezece[unitati];
            }

            //1.3. sute>=1; zeci>1; unitati>=1; 459
            if ((zeci > 1) && (unitati >= 1)) {
                rezultat = this._sute[sute] + separator + 'suta' + separator + this._zeci[zeci] + separator + 'si' + separator + this._unitati[unitati];
            }
            //1.4. sute>=1; zeci=0; unitati>=1
            if ((zeci == 0) && (unitati > 0)) {
                rezultat = this._sute[sute] + separator + 'suta' + separator + this._unitati[unitati];
            }
        } else if (sute > 1) {
            if ((zeci == 0) && (unitati == 0)) {
                rezultat = this._sute[sute + 1] + separator + 'sute';
            }

            //1.2. sute>=1; zeci>=1; unitati=0; 210
            if ((zeci >= 1) && (unitati == 0)) {
                rezultat = this._sute[sute + 1] + separator + 'sute' + separator + this._zeci[zeci];
            }

            //1.3. sute>=1; zeci>=1; unitati>=1; 311
            if ((zeci == 1) && (unitati >= 1)) {
                rezultat = this._sute[sute + 1] + separator + 'sute' + separator + this._sprezece[unitati];
            }

            //1.3. sute>=1; zeci>1; unitati>=1; 459
            if ((zeci > 1) && (unitati >= 1)) {
                rezultat = this._sute[sute + 1] + separator + 'sute' + separator + this._zeci[zeci] + separator + 'si' + separator + this._unitati[unitati];
            }
            //1.4. sute>=1; zeci=0; unitati>=1
            if ((zeci == 0) && (unitati > 0)) {
                rezultat = this._sute[sute + 1] + separator + 'sute' + separator + this._unitati[unitati];
            }

        }

        //caz.2: cifra zecilor
        //2.1. sute=0; zeci=1; unitati=0; 10
        if ((zeci >= 1) && (sute == 0) && (unitati == 0)) {
            rezultat = this._zeci[zeci];
        } else if ((this.ordin >= 1) && (sute == 0) && (zeci > 1) && (unitati == 2)) {
            rezultat = this._zeci[zeci] + separator + 'si doua' + separator + 'de';
        } else if ((this.ordin >= 1) && (sute == 0) && (zeci > 1) && (unitati == 1 || unitati > 2)) {
            rezultat = this._zeci[zeci] + separator + 'si' + separator + this._unitati[unitati];
        }

        //2.2. sute=0; zeci=1; unitati>=1; 14
        else if ((zeci == 1) && (sute == 0) && (unitati >= 1)) {
            rezultat = this._sprezece[unitati];
        }

        //2.3. sute=0; zeci>1; unitati>=1; 61
        else if ((zeci > 1) && (sute == 0) && (unitati >= 1)) {
            rezultat = this._zeci[zeci] + separator + 'si' + separator + this._unitati[unitati];
        } else if ((zeci > 1) && (sute == 0) && (unitati >= 1)) {
            rezultat = this._zeci[zeci] + separator + 'si' + separator + this._unitati[unitati];
        }

        //caz.3. cifra unitatilor
        //3.1. sute>=1;zeci=0;unitati>=1; --> si unu lei
        if ((unitati >= 1) && (zeci == 0) && (sute == 0)) {
            rezultat = this._unitati[unitati];
        }
        if ((this.ordin > 1) && (sute > 1) && (zeci == 0 || zeci > 1) && (unitati == 2)) {
            rezultat = this._sute[sute] + separator + 'sute' + separator + this._zeci[zeci] + separator + 'si doua';
        } else if ((this.ordin > 1) && (sute == 1) && (zeci == 0 || zeci > 1) && (unitati == 2)) {
            rezultat = this._sute[sute] + separator + 'suta' + separator + this._zeci[zeci] + separator + 'si doua';
        }

        return rezultat;

    };

};

