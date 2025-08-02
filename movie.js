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
        </div>
      </div>
    `;
    movieDetailContainer.innerHTML = html;

    const watchBtn = document.getElementById('watch-first-ep');
    if (movie.episodes.length > 0 && movie.episodes[0].server_data.length > 0) {
      const firstEp = movie.episodes[0].server_data[0];
      watchBtn.href = `watch.html?server=0&tap=${firstEp.slug}&slug=${movie.slug}`;
    } else {
      // Ẩn nút xem phim nếu không có tập nào
      watchBtn.style.display = 'none';
    }
  }

  fetchMovieDetail();
});
