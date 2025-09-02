import React, { useState } from "react";
import Markdown from "react-markdown";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import { Trash2 } from "lucide-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const CreationItem = ({ item, onDelete }) => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  const handleDelete = async (e) => {
    e.stopPropagation(); // Prevent expand toggle when clicking delete
    if (!window.confirm("Are you sure you want to delete this creation?")) return;

    try {
      setLoading(true);
      const token = await getToken();
      const { data } = await axios.delete(`/api/user/delete-creation/${item.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success("Deleted successfully!");
        onDelete(item.id);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="p-4 max-w-5xl text-sm bg-white border border-gray-200 rounded-lg cursor-pointer"
    >
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2>{item.prompt}</h2>
          <p className="text-gray-500">
            {item.type} - {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 text-red-500 hover:text-red-700"
            title="Delete"
          >
            {loading ? "..." : <Trash2 className="w-5 h-5" />}
          </button>
          <button className="bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] px-4 py-1 rounded-full">
            {item.type}
          </button>
        </div>
      </div>

      {expanded && (
        <div>
          {item.type === "image" ? (
            <div>
              <img
                src={item.content}
                alt="image"
                className="mt-3 w-full max-w-md"
              />
            </div>
          ) : (
            <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-700">
              <div className="reset-tw">
                <Markdown>{item.content}</Markdown>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreationItem;
