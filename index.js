document.addEventListener('DOMContentLoaded', () => {
  const movieList = document.getElementById('movieList');
  const paginationContainer = document.getElementById('pagination');

  // Get current page from URL or default to 1
  const urlParams = new URLSearchParams(window.location.search);
  let currentPage = parseInt(urlParams.get('page')) || 1;

  async function fetchMovies(page) {
    try {
      const response = await fetch(`https://phimapi.com/danh-sach/phim-moi-cap-nhat?page=${page}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      displayMovies(data.items);
      displayPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching movies:', error);
      movieList.innerHTML = '<p class="text-white">Không thể tải danh sách phim. Vui lòng thử lại sau.</p>';
    }
  }

  function displayMovies(movies) {
    movieList.innerHTML = '';
    movies.forEach(movie => {
      const movieCard = document.createElement('div');
      movieCard.className = 'col';

      // Xác định loại phim chính xác dựa trên thuộc tính 'type' của API này
      let movieTypeLabel = '';
      switch (movie.tmdb.type) {
        case 'movie':
          movieTypeLabel = 'Phim lẻ';
          break;
        case 'tv':
          movieTypeLabel = 'Phim bộ';
          break;
        default:
          movieTypeLabel = 'Không xác định';
          break;
      }

      movieCard.innerHTML = `
        <a href="movie.html?slug=${movie.slug}" class="text-decoration-none text-white">
          <div class="card h-100 bg-dark text-white border-secondary">
            <img src="${movie.poster_url}" class="card-img-top" alt="${movie.name}">
            <div class="watch-banner">
              <i class="bi bi-play-fill"></i> Xem ngay
            </div>
            <div class="card-body d-flex flex-column">
              <h5 class="card-title text-truncate">${movie.name}</h5>
              <p class="card-text text-truncate text-muted">${movie.origin_name}</p>
              <div class="mt-auto d-flex justify-content-between align-items-center">
                <small class="text-success">${movie.year}</small>
                <small class="badge bg-danger">${movieTypeLabel}</small>
              </div>
            </div>
          </div>
        </a>
      `;
      movieList.appendChild(movieCard);
    });
  }

  function displayPagination(pagination) {
    paginationContainer.innerHTML = '';
    const { currentPage, totalPages } = pagination;
    const maxPagesToShow = 5;

    // Previous button
    const prevItem = document.createElement('li');
    prevItem.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevItem.innerHTML = `<a class="page-link" href="?page=${currentPage - 1}">Trước</a>`;
    paginationContainer.appendChild(prevItem);

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      const pageItem = document.createElement('li');
      pageItem.className = `page-item ${i === currentPage ? 'active' : ''}`;
      pageItem.innerHTML = `<a class="page-link" href="?page=${i}">${i}</a>`;
      paginationContainer.appendChild(pageItem);
    }

    // Next button
    const nextItem = document.createElement('li');
    nextItem.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextItem.innerHTML = `<a class="page-link" href="?page=${currentPage + 1}">Sau</a>`;
    paginationContainer.appendChild(nextItem);
  }

  fetchMovies(currentPage);
});
