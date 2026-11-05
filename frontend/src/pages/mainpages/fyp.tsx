import { ArrowDown, ArrowUpRight, CarFront } from "lucide-react";
import { Link } from "react-router-dom";
import { FeedProducts } from "@/widgets/product/FeedProducts";
import { ROUTE_PATHS } from "@/app/routes";

export default function FypPage() {
  return (
    <div className="marketplace-page">
      <div className="storefront-intro">
        <section className="storefront-hero" aria-labelledby="storefront-title">
          <div className="storefront-hero-art" aria-hidden="true">
            <img src="/marketplace/brake-assembly.jpg" alt="" fetchPriority="high" />
          </div>
          <div className="storefront-hero-copy">
            <h1 id="storefront-title">Всё дело<br />в деталях.</h1>
            <p>Новые и б/у запчасти для вашего автомобиля. Ищите по названию или артикулу.</p>
            <a className="storefront-hero-action" href="#catalog">
              Смотреть каталог <ArrowDown size={17} aria-hidden="true" />
            </a>
          </div>
        </section>

        <Link to={ROUTE_PATHS.buyer.garage} className="storefront-garage">
          <CarFront className="garage-mark" size={28} strokeWidth={1.5} aria-hidden="true" />
          <div>
            <h2>Мой гараж</h2>
            <p>Марка, модель и VIN ваших автомобилей в одном месте.</p>
          </div>
          <span className="garage-link">
            <span>Открыть гараж</span><ArrowUpRight size={19} aria-hidden="true" />
          </span>
        </Link>
      </div>

      <FeedProducts />
    </div>
  );
}
