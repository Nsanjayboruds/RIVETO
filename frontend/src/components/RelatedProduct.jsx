import React, { useContext, useEffect, useState } from 'react';
import { shopDataContext } from '../context/ShopContext';
import Title from './Title';
import Card from './Card';

function RelatedProduct({ category, subCategory, currentProductId, tags = [], price = 0 }) {
  const { product } = useContext(shopDataContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (product.length > 0 && category) {
      // Calculate similarity score for each product
      const scoredProducts = product
        .filter((item) => {
          // Exclude current product
          if (item._id?.toString() === currentProductId?.toString()) return false;
          
          // CRITICAL: Only include products that match the category
          // This ensures we NEVER show random unrelated products
          return item.category?.toLowerCase().trim() === category?.toLowerCase().trim();
        })
        .map((item) => {
          let score = 0;

          // 1. Category match (base requirement - already filtered above)
          score += 40;
          
          // 2. SubCategory match (highest priority for similarity) - 35 points
          if (item.subCategory?.toLowerCase().trim() === subCategory?.toLowerCase().trim()) {
            score += 35;
          }

          // 3. Tag similarity - up to 25 points
          if (tags && tags.length > 0 && item.tags && item.tags.length > 0) {
            const currentProductTags = tags.map(t => t?.toLowerCase().trim()).filter(Boolean);
            const itemTags = item.tags.map(t => t?.toLowerCase().trim()).filter(Boolean);
            
            const commonTags = itemTags.filter(tag => currentProductTags.includes(tag));
            
            if (commonTags.length > 0) {
              // More common tags = higher score
              const tagScore = (commonTags.length / Math.max(currentProductTags.length, itemTags.length)) * 25;
              score += tagScore;
            }
          }

          // 4. Price range similarity - up to 20 points
          if (price > 0 && item.price) {
            const priceDiff = Math.abs(item.price - price);
            const maxDiff = price * 0.5; // Consider products within 50% price range
            
            if (priceDiff <= maxDiff) {
              // Closer price = higher score
              const priceScore = 20 * (1 - (priceDiff / maxDiff));
              score += priceScore;
            }
          }

          // 5. Bestseller boost - 10 points
          if (item.bestseller) {
            score += 10;
          }

          // 6. Rating boost - up to 10 points
          if (item.rating && item.rating > 0) {
            score += (item.rating / 5) * 10;
          }

          return { ...item, score };
        })
        // Sort by score (highest similarity first)
        .sort((a, b) => b.score - a.score);

      // Prioritize products with same subcategory, then by score
      const sameSubCategory = scoredProducts.filter(
        item => item.subCategory?.toLowerCase().trim() === subCategory?.toLowerCase().trim()
      );
      
      const differentSubCategory = scoredProducts.filter(
        item => item.subCategory?.toLowerCase().trim() !== subCategory?.toLowerCase().trim()
      );

      // Take top 4: prioritize same subcategory, fill with same category if needed
      const finalProducts = [
        ...sameSubCategory.slice(0, 4),
        ...differentSubCategory
      ].slice(0, 4);

      setRelated(finalProducts);
    } else {
      setRelated([]);
    }
  }, [product, category, subCategory, currentProductId, tags, price]);

  return (
    <section className="w-full bg-gradient-to-l from-[#0e0e0e] to-[#1a1f22] py-12 px-4 md:px-16 lg:px-24">
      {/* Section Title */}
      <div className="mb-8">
        <Title text1="SIMILAR" text2="ITEMS" />
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
        {related.length > 0 ? (
          related.map((item) => (
            <Card
              key={item._id}
              id={item._id}
              name={item.name}
              price={item.price}
              image={item.image1}
            />
          ))
        ) : (
          <p className="text-gray-400 col-span-full text-center text-sm">
            No similar products found.
          </p>
        )}
      </div>
    </section>
  );
}

export default RelatedProduct;
