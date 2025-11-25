// Product Performance Widget
// Shows top-performing SpiceJax products based on mock data

interface ProductStat {
  name: string;
  sales: number;
  engagement: number;
  trend: "up" | "down" | "stable";
}

const topProducts: ProductStat[] = [
  { name: "Nashville Heat Wave", sales: 342, engagement: 94, trend: "up" },
  { name: "Birria Fiesta Blend", sales: 298, engagement: 88, trend: "up" },
  { name: "Honey Chipotle BBQ", sales: 256, engagement: 82, trend: "stable" },
  { name: "Heat Lover's Trio", sales: 184, engagement: 79, trend: "up" },
];

export default function ProductPerformance() {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          🏆 Top Products This Week
        </h3>
        <span className="text-xs text-gray-500">Last 7 days</span>
      </div>

      <div className="space-y-4">
        {topProducts.map((product, index) => (
          <div key={index} className="relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-spice-400 to-spice-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  #{index + 1}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{product.name}</p>
                  <p className="text-xs text-gray-500">
                    {product.sales} sales • {product.engagement}% engagement
                  </p>
                </div>
              </div>
              <div
                className={`text-xl ${
                  product.trend === "up"
                    ? "text-green-500"
                    : product.trend === "down"
                    ? "text-red-500"
                    : "text-gray-400"
                }`}
              >
                {product.trend === "up" ? "↗" : product.trend === "down" ? "↘" : "→"}
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-spice-500 to-spice-600 h-2 rounded-full transition-all"
                style={{ width: `${(product.sales / 350) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="w-full py-2 text-spice-600 hover:text-spice-700 font-medium text-sm hover:bg-spice-50 rounded-lg transition-colors">
          View Full Product Analytics →
        </button>
      </div>
    </div>
  );
}

