import '../../App.css';
import axios from "axios";
import {useEffect, useState} from "react";
import Send from "../../components/Send";
import Loading from "../../components/Loading";
import { formatDistanceToNow } from 'date-fns';


export default function Home() {
  const [user, setUser] = useState("");

  useEffect(() => {
    const generateRelativeDate = (timestamp) => {
      try {
        let relativeDate = formatDistanceToNow(timestamp, {addSuffix: true}).replace("about", "");
        if (relativeDate === "less than a minute ago") {
          relativeDate = "just now";
        }
        return relativeDate;
      } catch (error) {
        return "old";
      }
    }

    const updateFeed = async () => {
      console.log("Update Feed");
      try {
        const res = await axios.get("https://remarks-server.vercel.app/post/getall", {withCredentials: true});
        setUser(res.data.user);
        document.getElementById("Feed").innerHTML = "";
        res.data.posts.forEach((post) => {
          let postDiv = document.createElement("div");
          postDiv.className = "Post";
          postDiv.innerHTML = `
          <div>
          <h3><a class="WhiteLinkHidden" href="/user/${post.author}">${post.author}</a></h3>
          <h10>${generateRelativeDate(post.timestamp)}</h10>
          </div>
          <hr/>
          <p>${post.content}</p>
        `;
          document.getElementById("Feed").prepend(postDiv);
        })
      } catch (error) {
        console.log(error);
        window.location.replace("/");
      }
      document.getElementById("LoadingBackground").style.display = "none";
    }

    updateFeed();
  }, []);


  return (
    <div className="Home">
      <h1 className="HomeHeading">Welcome, {user.username}.</h1>
      <p className="HomeSubheading">Let's get you caught up.</p>
      <Feed/>
      <Send author={user.username}/>
      <Loading/>
    </div>
  );
}

function Feed() {
  return (
    <div id="Feed">
    </div>
  );
}
