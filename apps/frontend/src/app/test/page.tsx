export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Tailwind CSS Test Page</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800">Colors Test</h2>
          <div className="flex space-x-2 mt-2">
            <div className="w-8 h-8 bg-red-500 rounded"></div>
            <div className="w-8 h-8 bg-green-500 rounded"></div>
            <div className="w-8 h-8 bg-blue-500 rounded"></div>
            <div className="w-8 h-8 bg-yellow-500 rounded"></div>
            <div className="w-8 h-8 bg-purple-500 rounded"></div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800">Typography Test</h2>
          <p className="text-sm text-gray-600">Small text</p>
          <p className="text-base text-gray-700">Base text</p>
          <p className="text-lg text-gray-800">Large text</p>
          <p className="font-bold">Bold text</p>
          <p className="italic">Italic text</p>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800">Spacing Test</h2>
          <div className="space-y-4">
            <div className="p-2 bg-blue-100">Padding 2</div>
            <div className="p-4 bg-green-100">Padding 4</div>
            <div className="p-6 bg-yellow-100">Padding 6</div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800">Grid Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div className="p-4 bg-gray-200 rounded">Column 1</div>
            <div className="p-4 bg-gray-300 rounded">Column 2</div>
            <div className="p-4 bg-gray-400 rounded">Column 3</div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800">Button Test</h2>
          <div className="flex space-x-4 mt-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Primary
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
              Secondary
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
              Outline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
