import { specialOffersData } from "../../../lib/mock/products";
import { SpecialOffersCarousel } from "./SpecialOffersCarousel";
import { SpecialOfferCard } from "./SpecialOfferCard";

export function SpecialOffers() {
  const offers = specialOffersData.slice(0, 20);

  return (
    <SpecialOffersCarousel>
      {offers.map((product, index) => (
        <SpecialOfferCard key={product.id} product={product} index={index} />
      ))}
    </SpecialOffersCarousel>
  );
}
