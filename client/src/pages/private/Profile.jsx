import '../../App.css';
import axios from "axios";
import {useEffect} from "react";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { formatDistanceToNow } from 'date-fns';

export default function Profile() {
  const { username } = useParams();

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
        const res = await axios.post("https://remarks-server.vercel.app/post/getusers", {author: username}, {withCredentials: true});
        document.getElementById("Feed").innerHTML = "";
        res.data.posts.forEach((post) => {
          let postDiv = document.createElement("div");
          postDiv.className = "Post";
          postDiv.innerHTML = `
          <div>
          <h3>${post.author}</h3>
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
  }, [username]);


  return (
    <div className="Home">
      <h1 className="HomeHeading">{username}'s posts</h1>
      <p></p>
      <Feed/>
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