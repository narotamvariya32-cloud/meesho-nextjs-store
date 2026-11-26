'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {useCart} from './CartProvider';

export default function StoreShell({children}:{children:React.ReactNode}) {
  const {items}=useCart();
  const [search,setSearch]=useState('');
  const [ready,setReady]=useState(false);
  useEffect(()=>setReady(true),[]);
  const count=ready?items.reduce((n,x)=>n+x.qty,0):0;
  return <>
    <div id="container" style={{overflow:'hidden'}}>
      <div className="_2dxSCm">
        <div className="_3CzzrP"><div className="_38U37R"><div>
          <div className="_1FWdmb">
            <div className="d-flex align-items-center">
              <button className="_3NH1qf original-menu-button" id="showmenu" aria-label="Menu" type="button"><span>☰</span></button>
              <Link className="Z4_K_h original-meesho-logo" href="/">meesho</Link>
            </div>
            <div className="header-menu">
              <Link className="_3NH1qf" href="/category" aria-label="Wishlist"><svg width="24" height="25" viewBox="0 0 24 25"><path d="M22 9.2c0 3.7-1.9 7.2-9.7 12.4a.6.6 0 0 1-.6 0C3.9 16.4 2 12.9 2 9.2S4.6 3.7 7.3 3.7c3.2-.1 4.6 3.6 4.7 3.8.1-.2 1.5-3.9 4.7-3.8C19.4 3.7 22 5.5 22 9.2Z" fill="#ed3843"/></svg></Link>
              <Link className="_3NH1qf original-cart-icon" href="/cart" aria-label="Cart"><svg width="25" height="25" viewBox="0 0 25 25" fill="none"><path d="M2 3h2.5l2.7 13.2a2 2 0 0 0 2 1.6h10.5M7 7h15l-1.2 8H8.5M11 21a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Zm7 0a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z" stroke="#9f2089" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>{count>0&&<span className="header__cart-count header__cart-count--floating">{count}</span>}</Link>
            </div>
          </div>
          <div className="search-bar"><div className="_3QNhdh"><div className="ORogdv"><div className="_1k9EoO"><div className="_2d36Hu"><div className="search-div"><span className="original-search-icon">⌕</span><input className="search-input-elm" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search for Sarees, Kurtis, Cosmetics, etc." /></div></div></div></div></div></div>
        </div></div></div>
      </div>
      {children}
    </div>
    <div className="sc-bcXHqe fctQgp BottomNavBarstyled__StyledNavBar-sc-be71xz-0 iyYCAl">
      <Link href="/" className="sc-bcXHqe fctQgp BottomNavBarstyled__StyledNavItem-sc-be71xz-1 gREIBe"><span className="original-bottom-icon">⌂</span><span>Home</span></Link>
      <Link href="/" className="sc-bcXHqe fctQgp BottomNavBarstyled__StyledNavItem-sc-be71xz-1 gREIBe"><span className="original-bottom-icon">▤</span><span>Categories</span></Link>
      <Link href="/" className="sc-bcXHqe fctQgp BottomNavBarstyled__StyledNavItem-sc-be71xz-1 gREIBe"><span className="original-bottom-icon">▱</span><span>My Orders</span></Link>
      <Link href="/" className="sc-bcXHqe fctQgp BottomNavBarstyled__StyledNavItem-sc-be71xz-1 gREIBe"><span className="original-bottom-icon">ⓘ</span><span>Help</span></Link>
      <Link href="/" className="sc-bcXHqe fctQgp BottomNavBarstyled__StyledNavItem-sc-be71xz-1 gREIBe"><span className="original-bottom-icon">☻</span><span>Account</span></Link>
    </div>
    <style jsx global>{`
      html,body{max-width:500px!important;margin:0 auto!important;background:#fff!important;font-family:'Mier demi',Arial,sans-serif!important;font-size:12px!important}
      #container{min-height:85vh;background:#fff}
      .original-meesho-logo{font-size:23px;font-weight:800;letter-spacing:-1.1px;color:#570d48!important;line-height:28px;padding:0!important;margin:0 0 0 10px!important;max-width:none!important}
      .original-menu-button{background:transparent;border:0;color:#333!important;font-size:22px;display:block!important;width:26px!important}
      .original-cart-icon{position:relative}
      .original-cart-icon svg{vertical-align:middle}
      .header__cart-count--floating{position:absolute;top:-2px;right:-4px;background:#e11900;color:white;border-radius:50%;font-size:9px;min-width:15px;height:15px;text-align:center;line-height:15px}
      .search-bar{display:block!important;padding:0 0 9px;background:#fff}
      .search-div{display:flex!important;align-items:center;height:40px!important;border:1px solid #d6d6df!important;background:#fff!important;border-radius:7px!important;padding:0 10px!important;line-height:normal!important}
      .search-input-elm{border:0!important;outline:0!important;width:100%!important;height:36px!important;font-size:13px!important;background:transparent!important;color:#353543!important}
      .original-search-icon{font-size:24px;color:#777;margin-right:8px;line-height:1}
      .iyYCAl{position:fixed!important;bottom:0!important;left:50%!important;transform:translateX(-50%);width:100%!important;max-width:500px!important;z-index:1000}
      .gREIBe{flex:1;min-width:0}
      .original-bottom-icon{font-size:23px;line-height:24px;color:#9f2089}
      @media(min-width:501px){html,body{border-left:1px solid #eee;border-right:1px solid #eee}}
    `}</style>
  </>;
}
