window.onload = () => {
  document.querySelector(".btn-enviar").addEventListener("click", () => {
    new Auth().signUp();
  });
};

class Auth {
  constructor() {
    this.username = null;
    this.picture = null;
  }

  signUp() {
    this.username = document.querySelector("#username").value;
    this.picture = document.querySelector("#picture").value;

    axios
      .post("http://localhost:5001/sign-up", {
        username: this.username,
        avatar: this.picture,
      })
      .then(() => {
        const tweet = new Tweet();
        tweet.loadTweets();

        document
          .querySelector(".btn-enviar-tweet")
          .addEventListener("click", () => {
            tweet.postTweet(this.username);
          });
      })
      .catch((err) => {
        console.error(err);
        if (err.response) {
          alert(err.response.data);
        }
      });
  }
}

class Tweet {
  constructor() {
    this.tweet = null;
  }

  postTweet(username) {
    this.tweet = document.querySelector("#tweet").value;

    axios
      .post("http://localhost:5001/tweets", {
        username,
        tweet: this.tweet,
      })
      .then((response) => {
        if (response.status === 201) {
          document.querySelector("#tweet").value = "";
          new Tweet().loadTweets();
          return;
        }

        console.error(response);
        alert("Erro ao fazer tweet! Consulte os logs.");
      })
      .catch((err) => {
        console.error(err);
        if (err.response) {
          alert(err.response.data);
        }
      });
  }

  loadTweets() {
    axios.get("http://localhost:5001/tweets").then((res) => {
      const tweets = res.data;
      let tweetsHtml = "";

      for (const tweet of tweets) {
        tweetsHtml += `
          <div class="tweet">
            <div class="avatar">
              <img src="${tweet.avatar}" />
            </div>
            <div class="content">
              <div class="user">
                @${tweet.username}
              </div>
              <div class="body">
                ${this.escapeHtml(tweet.tweet)}
              </div>
            </div>
          </div>
        `;
      }

      document.querySelector(".tweets").innerHTML = tweetsHtml;
      document.querySelector(".pagina-inicial").classList.add("hidden");
      document.querySelector(".tweets-page").classList.remove("hidden");
    });
  }

  escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}
