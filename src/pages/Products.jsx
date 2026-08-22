import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import Container from "../components/Container";
import ProductCard from "../components/ProductCard";
import { useScrollReveal } from "../hooks/useScrollReveal";
import axios from "axios";

export default function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [sort, setSort] = useState("newest");
  const gridRef = useScrollReveal({ stagger: 0.04 });

  // product
  useEffect(() => {
    async function getProduct() {
      try {
        setLoading(true);
        let data = await axios.get(`http://localhost:3000/api/v1/product/allProduct`);
        setProducts(data.data.allProduct || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    getProduct();
  }, []);

  // Keep the filter in sync if the URL's ?category= changes (e.g. clicking a
  // different category link from Home while already on this page).
  useEffect(() => {
    setCategory(searchParams.get("category") || "All");
  }, [searchParams]);

  // Real categories, built from the actual products — no dummy data.
  const categories = ["All", ...new Set(products.map((p) => p.category).filter(Boolean))];

  const filtered = products
    .filter((p) => category === "All" || p.category === category)
    .sort((a, b) => {
      if (sort === "price-asc") return (a.discountPrice || a.price) - (b.discountPrice || b.price);
      if (sort === "price-desc") return (b.discountPrice || b.price) - (a.discountPrice || a.price);
      return 0;
    });

  return (
    <Container className="py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-600">Shop</p>
          <h1 className="mt-2 font-display text-2xl font-bold capitalize sm:text-3xl">
            {category === "All" ? "All products" : category}
          </h1>
        </div>

        <div className="flex items-center gap-2 text-sm text-ink/50">
          <SlidersHorizontal size={14} />
          {filtered.length} results
        </div>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full border px-4 py-2 text-sm font-medium capitalize transition ${
                category === c
                  ? "border-ink bg-ink text-white"
                  : "border-ink/10 text-ink/60 hover:border-ink/30"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="ml-auto h-10 rounded-full border border-ink/10 bg-white px-4 text-sm outline-none"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {loading ? (
        <p className="py-20 text-center text-sm text-ink/40">Loading products...</p>
      ) : filtered.length === 0 ? (
        <p className="py-20 text-center text-sm text-ink/40">No products match these filters.</p>
      ) : (
        <div ref={gridRef} className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </Container>
  );
}

