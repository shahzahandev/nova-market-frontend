import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShoppingBag, Heart, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import Container from "../components/Container";
import { useCart } from "../context/CartContext";
import axios from "axios";

export default function SingleProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
 try {
     async function getProduct(){
      let data = await axios.post(`http://localhost:3000/api/v1/product/singleProduct/${id}`)
      setProduct(data.data.data);
   
    }
    getProduct();
 } catch (error) {
  console.log(error);
 }
  }, [id]);

  console.log(product);
  

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const images = product.images?.length ? product.images : [{ url: null }];

  return (
    <Container className="py-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-3xl bg-mist">
            {images[activeImage]?.url ? (
              <img src={images[activeImage].url} alt={product.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-ink/20">Product image</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 overflow-hidden rounded-xl border-2 ${
                    activeImage === i ? "border-brand-400" : "border-transparent"
                  }`}
                >
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-brand-600">{product.category}</p>
          <h1 className="mt-2 font-display text-3xl font-bold">{product.title}</h1>
          <p className="mt-3 text-sm text-ink/60">{product.shortDescription}</p>

          <div className="mt-5 flex items-center gap-3 font-mono">
            {hasDiscount ? (
              <>
                <span className="text-2xl font-bold">${product.discountPrice}</span>
                <span className="text-base text-ink/40 line-through">${product.price}</span>
                <span className="rounded-full bg-amber-400/20 px-2.5 py-1 text-xs font-bold text-amber-600">
                  -{Math.round(100 - (product.discountPrice / product.price) * 100)}%
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold">${product.price}</span>
            )}
          </div>

          <p className="mt-3 text-xs font-medium text-emerald-600">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-white transition hover:bg-ink/90 disabled:opacity-50"
            >
              <ShoppingBag size={17} /> Add to cart
            </button>
            <button
              onClick={() => setWishlisted((v) => !v)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/10 hover:bg-mist"
            >
              <Heart size={18} className={wishlisted ? "fill-red-500 text-red-500" : "text-ink/60"} />
            </button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 border-y border-ink/10 py-6 text-center text-xs text-ink/60">
            <Feature icon={Truck} label="Fast delivery" />
            <Feature icon={ShieldCheck} label="Secure payment" />
            <Feature icon={RotateCcw} label="7-day returns" />
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-semibold">Description</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/60">{product.description}</p>
          </div>

          {product.brand && (
            <p className="mt-4 text-sm text-ink/60">
              <span className="font-semibold text-ink">Brand:</span> {product.brand}
            </p>
          )}
        </div>
      </div>
    </Container>
  );
}

function Feature({ icon: Icon, label }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <Icon size={18} />
      {label}
    </div>
  );
}
