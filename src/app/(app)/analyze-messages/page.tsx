"use client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Page() {
  const [clusters, setClusters] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await axios.get("/api/analyze-messages");
        console.log(res);

        if (res.data.success) {
          setClusters(res.data.aiResult);
        }
      } catch (err) {
        console.error("Error fetching analysis:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  if (loading) return <p>Analyzing your feedback...</p>;

  if (!clusters) return <p>No analysis available yet.</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Feedback Analysis</h2>

      <h3 className="text-lg font-semibold">Main Clusters</h3>
      <ul className="list-disc ml-6 mb-4">
        {clusters.clusters?.map((cluster: any, i: number) => (
          <li key={i}>{cluster.title}</li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold">Top 3 Requests</h3>
      <ol className="list-decimal ml-6">
        {clusters.topRequests?.map((topic: string, i: number) => (
          <li key={i}>{topic}</li>
        ))}
      </ol>
    </div>
  );
}
