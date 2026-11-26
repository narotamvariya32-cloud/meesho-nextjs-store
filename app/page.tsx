import Link from 'next/link';
import {query} from '@/lib/db';
import LoadMoreProducts from '@/components/LoadMoreProducts';
import DailyDealsTimer from '@/components/DailyDealsTimer';
import {safeImage} from '@/lib/store';
export const dynamic='force-dynamic';
type P={id:number;unique_name:string;md5_slug?:string;name:string|null;selling_price:number|null;mrp:number|null;img1:string|null};
export default async function Home(){let products:P[]=[],cats:any[]=[],banners:any[]=[],total=0;try{products=await query<P>('SELECT id,unique_name,MD5(CAST(id AS CHAR)) AS md5_slug,name,selling_price,mrp,img1 FROM tbl_product WHERE is_show=1 ORDER BY MOD(id,17),id LIMIT 30');total=Number((await query<any>('SELECT COUNT(*) AS total FROM tbl_product WHERE is_show=1'))[0]?.total||0);cats=await query('SELECT id,cat_name,cat_img,unique_id FROM category ORDER BY `index` ASC');banners=await query('SELECT id,image,link FROM tbl_banner WHERE status=1 ORDER BY id ASC');}catch{}return <main className="original-home">
  <div className="categories"><div className="cat-list">{cats.map((c:any)=><Link className="category" href={`/category/${c.unique_id}`} key={c.id}><img src={safeImage(c.cat_img)} alt={c.cat_name}/><p>{c.cat_name}</p></Link>)}</div></div>
  <nav className="menu"><div className="menu__item"><div className="marquee"><div className="marquee__inner"><span>LAST DAY SALE AT 3 PIC COMBO PRICE 199/-ONLY</span><span>&nbsp;</span><span>LAST DAY SALE AT 3 PIC COMBO PRICE 199/-ONLY</span><span>&nbsp;</span></div></div></div></nav>
  <div className="_3lqN6b">
    <div className="WhKF32">
      <div className="IF3BzC">
        <div className="_1fhgRH">
          <div className="container-fluid"><div className="row"><div className="col-sm-12 p-0">
            {banners.length>0&&<div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
              <ol className="carousel-indicators">{banners.map((b:any,i:number)=><li key={b.id} data-target="#carouselExampleIndicators" data-slide-to={i} className={i===0?'active':''}/>)}</ol>
              <div className="carousel-inner">{banners.map((b:any,i:number)=><div className={`carousel-item ${i===0?'active':''}`} key={b.id}><a href={b.link||'#'}><img className="d-block w-100" src={safeImage(b.image)} alt={`Banner ${i+1}`}/></a></div>)}</div>
            </div>}
          </div></div></div>
        </div>
      </div>
    </div>
  </div>
  <img src="https://images.meesho.com/images/widgets/OY6J5/xwgyl_800.webp" alt="Meesho shopping benefits" className="w-100 mb-2"/>
  <div className="sc-bcXHqe eCQLMa"><div className="sc-bcXHqe fctQgp OfferTimerSubtitle__StyledSubtitleContainer-sc-9svgo6-0 JgdIi"><p className="sc-dkrFOg kZrHuA">Meesho Daily Deals <span>⚡</span></p><div className="OfferTimerstyled__StyledMediumOfferWrapper-sc-1otdyo0-0 eVLdcs"><span>◷</span><DailyDealsTimer/></div></div></div>
  <div className="products" id="products"><h4 className="sc-gswNZR wDrko">Products For You</h4>{products.length?<LoadMoreProducts initial={products} total={total}/>:<div className="empty-state">Products will appear here after the original MySQL database is connected.</div>}</div>
  <style>{`.original-home{padding-bottom:65px}.categories{padding:5px;border-bottom:10px solid #eaeaf2}.cat-list{display:flex;align-items:center;justify-content:space-between;overflow-x:auto;gap:5px}.category{display:flex;flex-flow:column;text-align:center;align-items:center;min-width:80px}.category img{width:60px;height:60px;object-fit:cover;padding:2px;border-radius:50%}.category p{font-size:13px;margin:0;width:85px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.menu{padding:10px 0;background:#970e71;overflow:hidden}.marquee__inner{display:flex;width:max-content;animation:original-marquee 8s linear infinite}.marquee span{font-size:18px;font-weight:900;color:#fff;white-space:nowrap;padding:0 12px}@keyframes original-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}.products{padding-bottom:12px}.products>h4{font-size:21px;padding:8px 5px;font-weight:400}.products .load-more{text-align:center;padding:16px}.products .load-more button{background:#9f2089;color:white;border:0;border-radius:6px;padding:10px 20px}.product-price{display:flex;align-items:center;gap:6px}.sell-price{font-size:17px;color:#333}.mrp-price{font-size:12px;color:#999;text-decoration:line-through}.off-percentage{font-size:11px;color:#038d63}.product-details{padding:5px 5px 0}.product-name{font-size:13px;line-height:1.3;min-height:34px;overflow:hidden}.iMEkWH{font-size:10px;color:#219653;display:inline-block;margin-top:5px}.product-list .product-card{width:50%;display:flex;flex-direction:column;color:#353543;border:1px solid #ccc6;border-bottom:2px solid #ccc6;background:#fff}.product-list .product-img{width:100%;aspect-ratio:1/1;overflow:hidden}.product-list .product-img img{width:100%;height:100%;object-fit:contain}.product-list{display:flex;flex-wrap:wrap}.products .product-details{width:100%}.products .free-delivery{display:inline-block;font-size:10px;color:#616173;background:#f8f8ff;padding:4px 8px;border-radius:48px;margin:8px 0}`}</style>
</main>}
