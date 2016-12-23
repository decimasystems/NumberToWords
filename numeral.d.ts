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
    ToWord(): string;
    private convert3Digits(length, size);
    private convert1or2Digits(rest);
    private convertOrdin(curent, one, two);
    private convert(valoare);
}
