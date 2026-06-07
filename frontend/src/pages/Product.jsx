
import LastestCollection from '../components/LastestCollection';
import BestSeller from '../components/BestSeller';
function Product() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-sky-50 dark:from-gray-900 dark:via-[#0f172a] dark:to-[#0c4a6e] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-16">
          <LastestCollection />
          <BestSeller />
        </div>
      </div>
    </div>
  );
}

export default Product;
