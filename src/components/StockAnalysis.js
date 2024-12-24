import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { SearchIcon } from 'lucide-react';

const StockAnalysis = () => {
  const [ticker, setTicker] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);

  const handleAnalysis = async () => {
    if (!ticker) {
      setError('Please enter a stock ticker');
      return;
    }

    setError('');
    setIsAnalyzing(true);
    setResults(null);

    try {
      const response = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticker }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setResults(data.data);
      
    } catch (error) {
      setError('Analysis failed. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Stock Analysis Platform</CardTitle>
          <CardDescription>Enter a stock ticker to start the analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Enter stock ticker (e.g., AAPL or 939.HK)"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md"
            />
            <Button 
              onClick={handleAnalysis}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze'}
              <SearchIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
          {error && (
            <p className="text-red-500 mt-2">{error}</p>
          )}
        </CardContent>
      </Card>

      {results && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Jesse Livermore's Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Initial Analysis:</h4>
                  <p className="whitespace-pre-wrap">{results.jesse_initial}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Technical Analysis:</h4>
                  <p className="whitespace-pre-wrap">{results.jesse_technical}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Peter Lynch's Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Initial Analysis:</h4>
                  <p className="whitespace-pre-wrap">{results.peter_initial}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Technical Analysis:</h4>
                  <p className="whitespace-pre-wrap">{results.peter_technical}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Final Recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap font-mono">{results.final_discussion}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StockAnalysis;