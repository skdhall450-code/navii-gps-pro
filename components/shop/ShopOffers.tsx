import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MessageCircle, Package } from "lucide-react";
import { formatInrPaise } from "@/lib/product-pricing";
import { getShopEnquiryUrl, getCompleteShopPrice, shopOffers, SHOP_GST_PERCENT } from "@/lib/shop-offers";
import styles from "./shop-offers.module.css";

export default function ShopOffers() {
  return (
    <section id="device-offers" className={styles.section} aria-labelledby="device-offers-title">
      <div className={styles.inner}>
        <div className={styles.heading}>
          <div>
            <p className={styles.eyebrow}>THE NAVII COLLECTION</p>
            <h2 id="device-offers-title">Your device. Clear pricing.</h2>
          </div>
          <p>Choose your model below. See device prices, 18% GST and shipping/handling clearly. GPS, OBD and AIS offers also include the listed SIM and platform charges; dash cam offers add shipping/handling only.</p>
        </div>
        <div className={styles.grid}>
          {shopOffers.map((offer) => (
            <article key={offer.id} id={offer.id} data-offer={offer.id} className={styles.card}>
              <div className={styles.stage}>
                {offer.image ? (
                  <Image src={offer.image} alt={`${offer.name} device`} width={440} height={330} sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw" className={styles.image} />
                ) : (
                  <div className={styles.placeholder}>
                    <Package aria-hidden="true" size={36} strokeWidth={1.25} />
                    <strong>{offer.name}</strong>
                    <span>Product photo coming soon</span>
                  </div>
                )}
                <span className={styles.tag}>{offer.category}</span>
              </div>
              <div className={styles.body}>
                <div className={styles.titleRow}>
                  <h3>{offer.name}</h3>
                  {offer.productHref && <Link href={offer.productHref} aria-label={`View ${offer.name} specifications`} className={styles.details}><ArrowUpRight size={20} /></Link>}
                </div>
                {offer.mrpInr !== undefined && <p className={styles.mrp}>MRP <strong>{formatInrPaise(offer.mrpInr * 100)}</strong></p>}
                <div className={styles.variants}>
                  {offer.variants.map((variant) => {
                    const price = getCompleteShopPrice(variant.baseInr, offer.chargePolicy);
                    return (
                      <div key={variant.id} data-variant={variant.id} className={styles.variant}>
                        <p className={styles.variantLabel}>{variant.label}</p>
                        <p className={styles.price}>{formatInrPaise(price.device.basePaise)}<span>+ {SHOP_GST_PERCENT}% GST</span></p>
                        <dl className={styles.breakdown}>
                          <div><dt>Device GST ({SHOP_GST_PERCENT}%)</dt><dd>{formatInrPaise(price.device.gstPaise)}</dd></div>
                          {price.charges.map(charge => <div key={charge.id}><dt>{charge.label}<small className={styles.feeTax}>{formatInrPaise(charge.basePaise)} + GST {formatInrPaise(charge.gstPaise)}</small></dt><dd>{formatInrPaise(charge.totalPaise)}</dd></div>)}
                          <div><dt>Total incl. GST & charges</dt><dd>{formatInrPaise(price.totalPaise)}</dd></div>
                          <div><dt>Round-off</dt><dd>{price.roundOffPaise < 0 ? "−" : "+"}{formatInrPaise(Math.abs(price.roundOffPaise))}</dd></div>
                          <div className={styles.total}><dt>Final payable</dt><dd>{formatInrPaise(price.payablePaise)}</dd></div>
                        </dl>
                        <a href={getShopEnquiryUrl(offer, variant)} target="_blank" rel="noopener noreferrer" className={styles.enquire} aria-label={`Enquire about ${offer.name}, ${variant.label}`}><MessageCircle size={17} aria-hidden="true" /> Enquire on WhatsApp <ArrowUpRight size={16} aria-hidden="true" /></a>
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className={styles.note}>
          <Package size={22} aria-hidden="true" />
          <p>Final payable is rounded to the nearest rupee, with the adjustment shown separately. All offers include 18% GST and ₹250 shipping/handling before GST. GPS, OBD and AIS offers also include Airtel SIM at ₹45 × 12 months and a ₹150 software platform fee before GST. Dash cam prices do not include any SIM or platform charge. Installation is not included; confirm charges before ordering. AIS 140 validity is the selected device/service offer, while the SIM shown covers 12 months only. Confirm platform coverage, activation requirements and renewal terms before ordering.</p>
        </div>
      </div>
    </section>
  );
}
