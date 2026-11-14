// Simple SVG stickers. Swap any of these for <img src="/assets/stickers/x.png"/> later.
const S=({children,size=56,className='',style})=><svg className={'stk '+className} style={style} width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">{children}</svg>;
export const Heart=p=><S {...p}><path d="M32 54C8 36 10 14 24 14c5 0 8 3 8 6 0-3 3-6 8-6 14 0 16 22-8 40z" fill="#e8798f"/></S>;
export const Star=p=><S {...p}><path d="M32 6l7 17 18 2-14 12 4 18-15-10-15 10 4-18L7 25l18-2z" fill="#D4AF6A"/></S>;
export const Kiss=p=><S {...p}><circle cx="32" cy="32" r="28" fill="#f8c9d0"/><path d="M14 32q9-12 18-4 9-8 18 4-9 14-18 14T14 32z" fill="#d94a67"/><path d="M16 32q16 4 32 0" stroke="#8e1f38" strokeWidth="2" fill="none"/><path d="M50 10l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#fff"/></S>;
const face=<><circle cx="32" cy="36" r="19" fill="#F5D5B8"/><circle cx="25" cy="37" r="2" fill="#0A192F"/><circle cx="39" cy="37" r="2" fill="#0A192F"/><path d="M26 45q6 5 12 0" stroke="#0A192F" strokeWidth="2" fill="none" strokeLinecap="round"/><circle cx="20" cy="42" r="3" fill="#f2a1a8" opacity=".7"/><circle cx="44" cy="42" r="3" fill="#f2a1a8" opacity=".7"/></>;
export const Boy=p=><S {...p}>{face}<path d="M12 33q0-22 20-21t20 21q-9-9-20-7t-20 7z" fill="#2b2118"/></S>;
export const Girl=p=><S {...p}><circle cx="32" cy="34" r="26" fill="#5a3a2a"/>{face}<path d="M13 34q2-18 19-18t19 18q-10-10-19-9t-19 9z" fill="#5a3a2a"/><path d="M46 14l8-4-2 9zM46 14l-8-4 2 9z" fill="#e8798f"/></S>;
export const Camera=p=><S {...p}><rect x="8" y="18" width="48" height="34" rx="7" fill="#F5E6D3"/><rect x="22" y="12" width="14" height="8" rx="2" fill="#F5E6D3"/><circle cx="32" cy="35" r="11" fill="#0F172A"/><circle cx="32" cy="35" r="6" fill="#4a6fa5"/><circle cx="49" cy="25" r="2" fill="#D4AF6A"/></S>;
export const Cake=p=><S {...p}><rect x="10" y="34" width="44" height="20" rx="5" fill="#F5E6D3"/><rect x="16" y="22" width="32" height="14" rx="4" fill="#fff"/><rect x="30" y="12" width="4" height="10" fill="#0F172A"/><ellipse cx="32" cy="9" rx="3" ry="5" fill="#D4AF6A"/></S>;
export const Tape=({style})=><span className="tape" style={style} aria-hidden="true"/>;
