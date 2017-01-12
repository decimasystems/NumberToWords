export declare class Numeral {
    private numar;
    private _ordinP;
    private _ordinS;
    private ordin;
    private _sute;
    private _zeci;
    private _unitati;
    private _sprezece;
    rezultat: string[];
    constructor(numar: string);
    convertDecimal(): string;
    convertMoney(valutaS: any, valutaP: any, baniS: any, baniP: any, virgula: any, punct: any, separator: any): any;
    ToWord(separator: any): string;
    private convert3Digits(length, size, separator);
    private convert1or2Digits(rest, separator);
    private convertOrdin(curent, one, two, separator);
    private convert(valoare, separator);
}
