document.addEventListener('DOMContentLoaded', () => {
  const movieDetailContainer = document.getElementById('movie-detail');

  async function fetchMovieDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');

    if (!slug) {
      movieDetailContainer.innerHTML = '<p class="text-white">Không tìm thấy thông tin phim.</p>';
      return;
    }

    try {
      const response = await fetch(`https://phimapi.com/phim/${slug}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      if (data.status && data.movie) {
        data.movie.episodes = data.episodes || [];
        displayMovieDetail(data.movie);
      } else {
        movieDetailContainer.innerHTML = '<p class="text-white">Không tìm thấy phim này.</p>';
      }
    } catch (error) {
      console.error('Error fetching movie detail:', error);
      movieDetailContainer.innerHTML = '<p class="text-white">Lỗi tải chi tiết phim.</p>';
    }
  }

  function displayMovieDetail(movie) {
    const html = `
      <div class="row">
        <div class="col-md-4">
          <img src="${movie.poster_url}" class="img-fluid rounded-3" alt="${movie.name}" />
        </div>
        <div class="col-md-8">
          <h2 class="text-white">${movie.name}</h2>
          <p class="text-white">${movie.content}</p>
          <a class="btn btn-success mb-3" id="watch-first-ep" href="#">
            <i class="bi bi-play-fill"></i> Xem phim
          </a>
          <h5 class="text-white">Tập phim</h5>
          <div id="episode-buttons" class="d-flex flex-wrap gap-2"></div>
        </div>
      </div>
    `;
    movieDetailContainer.innerHTML = html;

    const episodeContainer = document.getElementById('episode-buttons');
    if (movie.episodes.length > 0) {
      movie.episodes[0].server_data.forEach((episode) => {
        const epBtn = document.createElement('a');
        epBtn.className = 'btn btn-outline-light';
        epBtn.href = `watch.html?server=0&tap=${episode.slug}&slug=${movie.slug}`;
        epBtn.textContent = episode.name;
        episodeContainer.appendChild(epBtn);
      });

      const watchBtn = document.getElementById('watch-first-ep');
      const firstEp = movie.episodes[0].server_data[0];
      watchBtn.href = `watch.html?server=0&tap=${firstEp.slug}&slug=${movie.slug}`;
    } else {
      episodeContainer.innerHTML = '<p class="text-white">Không có dữ liệu tập phim.</p>';
    }
  }

  fetchMovieDetail();
});
