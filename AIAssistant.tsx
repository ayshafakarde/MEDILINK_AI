export default function AIAssistant() {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          AI Assistant
        </h2>
  
        <textarea
          placeholder="Describe your emergency..."
          className="w-full border rounded-xl p-4 mb-4"
        />
  
        <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition">
          Get AI Recommendation
        </button>
      </div>
    );
  }