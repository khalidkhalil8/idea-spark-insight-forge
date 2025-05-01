import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const EnterIdea: React.FC = () => {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea) {
      alert("Please enter an idea");
      return;
    }

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "ideas"), {
        text: idea,
        createdAt: new Date(),
        votes: 0,
      });
      console.log("Document written with ID: ", docRef.id);
      navigate("/validate");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error adding idea. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="text-left">
          <h1 className="text-3xl font-bold mb-4">Enter Your Idea</h1>
          <p className="mb-6">
            Describe your idea below.
          </p>
          
          <form onSubmit={handleSubmit} className="max-w-lg">
            <div className="mb-6">
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md h-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="A social media platform for pet owners"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                required
              />
            </div>
            
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Idea"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnterIdea;
