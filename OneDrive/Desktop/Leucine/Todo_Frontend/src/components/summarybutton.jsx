import React, { useState } from 'react';
import { generateAndSendSummary } from '../api/summaryapi';
import { toast } from 'react-toastify';


const Summarybutton = () => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  const handleGenerateSummary = async () => {
    try {
      setLoading(true);
      const result = await generateAndSendSummary();

      if (result.success) {
        setSummary(result.summary);
        setShowSummary(true);
        toast.success('Summary sent to Slack!');
      } else {
        toast.error('Failed to generate summary');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Todo Summary</h2>
        <button
          onClick={handleGenerateSummary}
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:bg-gray-400"
        >
          {loading ? 'Generating...' : 'Generate & Send to Slack'}
        </button>
      </div>

      {showSummary && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">Generated Summary:</h3>
          <div className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
            {summary}
          </div>
        </div>
      )}
    </div>
  );
};

export default Summarybutton;
