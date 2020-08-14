const MYBINDER_LOGO = `
[38;5;0m                                                                                                                        [0;0m
[38;5;0m                                                                                                                        [0;0m
[38;5;0m                                                                                                                        [0;0m
[38;5;0m           [38;5;232m [38;5;237m.[38;5;94m:[38;5;131ml[38;5;137moo[38;5;95mc[38;5;58m,[38;5;234m.[38;5;0m        [38;5;237m.[38;5;246mxxx[38;5;8mo[38;5;0m                                            [38;5;235m.[38;5;246mxxxx[38;5;0m                                      [0;0m
[38;5;0m          [38;5;94m;[38;5;179mO[38;5;215m0[38;5;173mO[38;5;131mo[38;5;95mc[38;5;131ml[38;5;173md[38;5;215m00[38;5;137md[38;5;235m.[38;5;0m      [38;5;240m;[38;5;15mMMM[38;5;253mW[38;5;0m            [38;5;234m [38;5;245md[38;5;145m0[38;5;247mk[38;5;240m;[38;5;0m                           [38;5;237m.[38;5;15mMMMM[38;5;0m                                      [0;0m
[38;5;0m        [38;5;232m [38;5;95ml[38;5;215m00[38;5;94m;[38;5;232m [38;5;0m    [38;5;234m [38;5;137md[38;5;215m0[38;5;179mO[38;5;235m.[38;5;0m     [38;5;240m;[38;5;15mMMM[38;5;253mW[38;5;0m            [38;5;249m0[38;5;15mMMMM[38;5;235m.[38;5;0m                          [38;5;237m.[38;5;15mMMMM[38;5;0m                                      [0;0m
[38;5;0m     [38;5;233m [38;5;95m,[38;5;131ml[38;5;168md[38;5;215m00[38;5;209mO[38;5;168md[38;5;131ml[38;5;95m,[38;5;233m [38;5;0m   [38;5;236m.[38;5;215m00[38;5;94m;[38;5;0m     [38;5;240m;[38;5;15mMMM[38;5;253mW[38;5;0m            [38;5;234m [38;5;245md[38;5;145mO[38;5;247mk[38;5;239m,[38;5;0m                           [38;5;237m.[38;5;15mMMMM[38;5;0m                                      [0;0m
[38;5;0m    [38;5;238m.[38;5;168mdd[38;5;131ml[38;5;238m.[38;5;131mo[38;5;215m00[38;5;131mol[38;5;168mdd[38;5;238m.[38;5;0m [38;5;233m [38;5;137mo[38;5;215m00[38;5;235m.[38;5;0m     [38;5;240m;[38;5;15mMMM[38;5;253mW[38;5;236m.[38;5;243ml[38;5;247mk[38;5;248mOO[38;5;246mx[38;5;241m:[38;5;234m [38;5;0m    [38;5;237m.[38;5;245mddd[38;5;242mc[38;5;0m   [38;5;8mo[38;5;245mddd[38;5;238m'[38;5;59m:[38;5;246mx[38;5;248mOO[38;5;246mx[38;5;59m:[38;5;232m [38;5;0m     [38;5;237m.[38;5;243ml[38;5;247mk[38;5;248mOO[38;5;246mx[38;5;241m:[38;5;239m,[38;5;15mMMMM[38;5;0m     [38;5;236m.[38;5;242mc[38;5;246mx[38;5;248mOOO[38;5;246mx[38;5;242mc[38;5;236m.[38;5;0m    [38;5;235m.[38;5;245mdddd[38;5;237m.[38;5;8mo[38;5;248mOO[38;5;237m.[38;5;0m          [0;0m
[38;5;0m   [38;5;234m [38;5;168mdd[38;5;131m:[38;5;0m  [38;5;232m [38;5;95mc[38;5;179m0O[38;5;245md[38;5;103mddd[38;5;60mc[38;5;138mk[38;5;179mO[38;5;173mk[38;5;236m.[38;5;0m      [38;5;240m;[38;5;15mMMMMMMMMMMMM[38;5;247mk[38;5;232m [38;5;0m  [38;5;241m:[38;5;15mMMM[38;5;252mN[38;5;0m   [38;5;255mM[38;5;15mMMMMMMMMMM[38;5;254mM[38;5;234m [38;5;0m  [38;5;236m.[38;5;252mN[38;5;15mMMMMMMMMMMMM[38;5;0m   [38;5;239m,[38;5;253mW[38;5;15mMMM[38;5;7mX[38;5;248mO[38;5;250mK[38;5;255mM[38;5;15mMM[38;5;253mW[38;5;238m'[38;5;0m  [38;5;238m'[38;5;15mMMMMMMMM[38;5;242mc[38;5;0m          [0;0m
[38;5;0m   [38;5;235m [38;5;168mdd[38;5;95m;[38;5;0m   [38;5;238m.[38;5;67mo[38;5;68mdd[38;5;103mddd[38;5;67mo[38;5;68mdd[38;5;66mc[38;5;234m [38;5;0m      [38;5;240m;[38;5;15mMMMM[38;5;246mx[38;5;235m.[38;5;0m [38;5;233m [38;5;59m;[38;5;255mM[38;5;15mMMM[38;5;249m0[38;5;0m  [38;5;241m:[38;5;15mMMM[38;5;252mN[38;5;0m   [38;5;255mM[38;5;15mMMM[38;5;252mN[38;5;237m.[38;5;0m [38;5;234m [38;5;252mN[38;5;15mMMM[38;5;102md[38;5;0m [38;5;234m [38;5;255mM[38;5;15mMMM[38;5;7mK[38;5;237m.[38;5;232m  [38;5;238m'[38;5;252mN[38;5;15mMMMM[38;5;0m  [38;5;238m'[38;5;15mMMMM[38;5;8mo[38;5;239m,,,[38;5;241m:[38;5;255mM[38;5;15mMMM[38;5;235m.[38;5;0m [38;5;238m'[38;5;15mMMMM[38;5;145m0[38;5;235m.[38;5;0m [38;5;233m [38;5;234m [38;5;0m          [0;0m
[38;5;0m    [38;5;95m;[38;5;168mdd[38;5;95m;[38;5;235m.[38;5;60m;[38;5;68mdd[38;5;60mc[38;5;95m:[38;5;168mdd[38;5;95m;[38;5;0m [38;5;234m [38;5;67ml[38;5;68md[38;5;67md[38;5;234m [38;5;0m     [38;5;240m;[38;5;15mMMM[38;5;255mM[38;5;232m [38;5;0m    [38;5;246mx[38;5;15mMMM[38;5;255mM[38;5;232m [38;5;0m [38;5;241m:[38;5;15mMMM[38;5;252mN[38;5;0m   [38;5;255mM[38;5;15mMMM[38;5;242mc[38;5;0m   [38;5;248mO[38;5;15mMMM[38;5;246mx[38;5;0m [38;5;240m;[38;5;15mMMMM[38;5;237m.[38;5;0m    [38;5;239m,[38;5;15mMMMM[38;5;0m  [38;5;245md[38;5;15mMMMM[38;5;145mO[38;5;248mOOOOOOOO[38;5;236m.[38;5;0m [38;5;238m'[38;5;15mMMMM[38;5;233m [38;5;0m              [0;0m
[38;5;0m     [38;5;236m.[38;5;131mc[38;5;168mddddddd[38;5;131mc[38;5;236m.[38;5;0m   [38;5;235m.[38;5;68mdd[38;5;239m'[38;5;0m     [38;5;240m;[38;5;15mMMMM[38;5;7mK[38;5;240m;[38;5;236m.[38;5;238m'[38;5;245md[38;5;15mMMMM[38;5;246mx[38;5;0m  [38;5;241m:[38;5;15mMMM[38;5;252mN[38;5;0m   [38;5;255mM[38;5;15mMMM[38;5;242mc[38;5;0m   [38;5;248mO[38;5;15mMMM[38;5;246mx[38;5;0m [38;5;233m [38;5;188mM[38;5;15mMMM[38;5;188mW[38;5;242mc[38;5;236m.[38;5;237m.[38;5;242mc[38;5;254mM[38;5;15mMMMM[38;5;0m  [38;5;236m.[38;5;255mM[38;5;15mMMM[38;5;246mx[38;5;234m [38;5;232m [38;5;234m [38;5;102md[38;5;188mWWW[38;5;250mK[38;5;232m [38;5;0m [38;5;238m'[38;5;15mMMMM[38;5;233m [38;5;0m              [0;0m
[38;5;0m       [38;5;232m [38;5;235m [38;5;60mc[38;5;103mdd[38;5;239m,[38;5;232m [38;5;0m    [38;5;232m [38;5;60m:[38;5;68mdd[38;5;235m.[38;5;0m     [38;5;240m;[38;5;15mMMM[38;5;255mMM[38;5;15mMMMMMM[38;5;254mM[38;5;242mc[38;5;0m   [38;5;241m:[38;5;15mMMM[38;5;252mN[38;5;0m   [38;5;255mM[38;5;15mMMM[38;5;242mc[38;5;0m   [38;5;248mO[38;5;15mMMM[38;5;246mx[38;5;0m  [38;5;234m [38;5;247mk[38;5;15mMMMMMMM[38;5;255mM[38;5;15mMMMM[38;5;0m   [38;5;236m.[38;5;248mO[38;5;15mMMMMMMMM[38;5;255mM[38;5;247mk[38;5;233m [38;5;0m  [38;5;238m'[38;5;15mMMMM[38;5;233m [38;5;0m              [0;0m
[38;5;0m         [38;5;232m [38;5;60m:[38;5;68mdd[38;5;67mc[38;5;239m,[38;5;238m''[38;5;60m;[38;5;67mo[38;5;68md[38;5;67mo[38;5;237m.[38;5;0m      [38;5;234m [38;5;240m;;;[38;5;239m,[38;5;232m [38;5;238m'[38;5;242mc[38;5;8mo[38;5;243ml[38;5;241m:[38;5;236m.[38;5;0m     [38;5;235m.[38;5;240m;;;[38;5;239m,[38;5;0m   [38;5;240m;;;;[38;5;235m.[38;5;0m   [38;5;237m.[38;5;240m;;;[38;5;236m.[38;5;0m    [38;5;232m [38;5;238m'[38;5;242mc[38;5;8mo[38;5;243ml[38;5;59m:[38;5;236m.[38;5;233m [38;5;240m;;;;[38;5;0m     [38;5;232m [38;5;237m.[38;5;59m:[38;5;243ml[38;5;8mo[38;5;243ml[38;5;241m:[38;5;237m.[38;5;232m [38;5;0m    [38;5;234m [38;5;240m;;;;[38;5;232m [38;5;0m              [0;0m
[38;5;0m           [38;5;234m [38;5;238m'[38;5;60m:[38;5;67mlolc[38;5;60m;[38;5;236m.[38;5;232m [38;5;0m                                                                                                   [0;0m
[38;5;0m                                                                                                                        [0;0m
[38;5;0m                                                                                                                        [0;0m
[38;5;0m                                                                                                                        [0;0m
`

const WELCOME = `
Welcome to the MyBinder.org Terminal version!
`
export function printMotd (term) {
  const MOTD = MYBINDER_LOGO + WELCOME
  for (const l of MOTD.trim().split('\n')) {
    term.write(l + '\r\n')
  }
}
