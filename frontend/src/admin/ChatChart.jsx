import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import API from "../api/axios";

export default function ChatChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(`/analytics/messages`);

        const formatted = (res.data || []).map((item, index) => ({
          date: item._id || `Day ${index + 1}`,   // 🔥 FIX HERE
          messages: item.count || 0,
        }));

        setData(formatted);
      } catch (err) {
        
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full h-[300px] bg-white p-4 rounded-xl shadow">
      
      <h2 className="text-lg font-semibold mb-3">
        📊 Messages Activity
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          
          <XAxis 
            dataKey="date"
            tick={{ fontSize: 12 }}
          />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="messages"
            stroke="#f59e0b"
            strokeWidth={3}
            dot={{ r: 4 }}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}