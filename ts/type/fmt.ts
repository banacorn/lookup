//
//  Formatter
//

type Style = {
    i: boolean,     // italic
    b: boolean,     // bold
    a: boolean      // link
};

type Seg = {
    text: string,
    style: Style
};

type Fmt = Seg[];

export {
    Style, Seg, Fmt
};
