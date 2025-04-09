export const idlFactory = ({ IDL }: any) => {
    return IDL.Service({ 'greet': IDL.Func([], [IDL.Text], ['query']) });
};
export const init = ({ IDL }: any) => { return []; };