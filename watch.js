document.addEventListener('DOMContentLoaded', () => {
  const videoPlayer = document.getElementById('video-player');
  const movieTitle = document.getElementById('movie-title');
  const episodeListContainer = document.getElementById('episode-list');

  async function loadVideo() {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    const serverIndex = parseInt(urlParams.get('server'));
    const episodeSlug = urlParams.get('tap');

    if (!slug || isNaN(serverIndex) || !episodeSlug) {
      movieTitle.textContent = 'Thiếu thông tin phim để phát.';
      return;
    }

    try {
      const response = await fetch(`https://phimapi.com/phim/${slug}`);
      const data = await response.json();

      if (!data.status || !data.movie || !Array.isArray(data.episodes) || !data.episodes.length) {
        movieTitle.textContent = 'Không tìm thấy phim hoặc danh sách tập.';
        return;
      }

      const movie = data.movie;
      const episodes = data.episodes;

      const server = episodes[serverIndex];
      const episode = server?.server_data?.find(ep => ep.slug.toLowerCase() === episodeSlug.toLowerCase());

      if (!server || !episode) {
        movieTitle.textContent = 'Không tìm thấy tập phim hoặc server.';
        return;
      }

      movieTitle.textContent = `${movie.name} - ${episode.name || 'Full'}`;
      playVideo(episode.link_m3u8);
      displayEpisodeList(episodes, slug, serverIndex, episodeSlug);
    } catch (error) {
      console.error('Lỗi khi tải phim:', error);
      movieTitle.textContent = 'Lỗi khi tải phim. Vui lòng thử lại.';
    }
  }

  function playVideo(url) {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(videoPlayer);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        videoPlayer.play();
      });
    } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
      videoPlayer.src = url;
      videoPlayer.addEventListener('loadedmetadata', function () {
        videoPlayer.play();
      });
    } else {
      alert('Trình duyệt của bạn không hỗ trợ HLS.');
    }
  }

  function displayEpisodeList(episodes, slug, currentServerIndex, currentEpisodeSlug) {
    episodeListContainer.innerHTML = '';

    // Server selector
    const serverDropdown = document.createElement('div');
    serverDropdown.className = 'btn-group mb-3';
    serverDropdown.innerHTML = `
      <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        Server: ${episodes[currentServerIndex].server_name}
      </button>
      <ul class="dropdown-menu">
        ${episodes.map((server, index) => `
          <li><a class="dropdown-item ${index === currentServerIndex ? 'active' : ''}" href="#" data-server-index="${index}">${server.server_name}</a></li>
        `).join('')}
      </ul>
    `;
    episodeListContainer.appendChild(serverDropdown);

    // Server switching
    const dropdownItems = serverDropdown.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const newServerIndex = parseInt(e.target.dataset.serverIndex);
        const newEpisodeSlug = episodes[newServerIndex].server_data[0].slug;
        window.location.href = `watch.html?server=${newServerIndex}&tap=${newEpisodeSlug}&slug=${slug}`;
      });
    });

    // Episode list
    const episodeButtons = document.createElement('div');
    episodeButtons.className = 'd-flex flex-wrap gap-2';
    const currentServerData = episodes[currentServerIndex].server_data;

    currentServerData.forEach(episode => {
      const isActive = episode.slug.toLowerCase() === currentEpisodeSlug.toLowerCase() ? 'active' : '';
      const button = document.createElement('a');
      button.href = `watch.html?server=${currentServerIndex}&tap=${episode.slug}&slug=${slug}`;
      button.className = `btn btn-outline-light ${isActive}`;
      button.textContent = episode.name || 'Full';
      episodeButtons.appendChild(button);
    });

    episodeListContainer.appendChild(episodeButtons);
  }

  loadVideo();
});
