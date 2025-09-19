import React, { useContext, useEffect, useState } from 'react';
import { shopDataContext } from '../context/ShopContext';
import Title from './Title';
import Card from './Card';

function RelatedProduct({ category, subCategory, currentProductId }) {
  const { product } = useContext(shopDataContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (product.length > 0) {
      const relatedProducts = product.filter((item) => {
        const isMatch =
          item.category?.toLowerCase().trim() === category?.toLowerCase().trim() &&
          item.subCategory?.toLowerCase().trim() === subCategory?.toLowerCase().trim() &&
          item._id?.toString() !== currentProductId?.toString();

        return isMatch;
      });

      setRelated(relatedProducts.slice(0, 4));
    }
  }, [product, category, subCategory, currentProductId]);

  return (
    <section className="w-full bg-gradient-to-l from-[#0e0e0e] to-[#1a1f22] py-12 px-4 md:px-16 lg:px-24">
      {/* Section Title */}
      <div className="mb-8">
        <Title text1="RELATED" text2="PRODUCT" />
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
            No related products found in this category.
          </p>
        )}
      </div>
    </section>
  );
}

export default RelatedProduct;
