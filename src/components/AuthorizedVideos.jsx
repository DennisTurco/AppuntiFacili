import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { videos } from "@/data/videos.ts";

export default function AuthorizedVideos() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (!user) {
    return (
      <p className="col-span-full text-center text-red-500">
        Devi essere loggato per vedere i video. <a href="/ImparareFacile/login" class="text-blue-600 font-semibold underline hover:text-blue-800">Login</a>
      </p>
    );
  }

  const authorizedVideos = videos.filter(video => video.allowed.includes(user.email));

  if (authorizedVideos.length === 0) {
    return (
      <p className="col-span-full text-center text-gray-700">
        Non sei autorizzato a vedere i video. Contattami per richiedere l'accesso.
      </p>
    );
  }

  return authorizedVideos.map((video, index) => (
    <div key={index} className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">{video.title}</h2>
      <iframe
        className="w-full h-64 md:h-80 rounded"
        src={video.url}
        title={video.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  ));
}
