document.addEventListener('DOMContentLoaded', () => {
  const searchResultList = document.getElementById('searchResultList');
  const searchTitle = document.getElementById('search-title');
  const noResultsMessage = document.getElementById('no-results');
  
  const API_DOMAIN_CDN_IMAGE = 'https://phimimg.com/';

  async function performSearch() {
    const urlParams = new URLSearchParams(window.location.search);
    const keyword = urlParams.get('keyword');

    if (!keyword) {
      searchTitle.textContent = 'Vui lòng nhập từ khóa tìm kiếm.';
      noResultsMessage.classList.add('d-none');
      return;
    }

    searchTitle.textContent = `Kết quả tìm kiếm cho: "${keyword}"`;

    try {
      const response = await fetch(`https://phimapi.com/v1/api/tim-kiem?keyword=${encodeURIComponent(keyword)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.status === 'success' && data.data.items && data.data.items.length > 0) {
        displaySearchResults(data.data.items);
        noResultsMessage.classList.add('d-none');
      } else {
        searchResultList.innerHTML = '';
        noResultsMessage.classList.remove('d-none');
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      searchResultList.innerHTML = '';
      noResultsMessage.textContent = 'Lỗi khi tìm kiếm. Vui lòng thử lại sau.';
      noResultsMessage.classList.remove('d-none');
    }
  }

  function displaySearchResults(results) {
    searchResultList.innerHTML = '';
    results.forEach(movie => {
      const movieCard = document.createElement('div');
      movieCard.className = 'col';

      let movieTypeLabel = '';
      switch (movie.type) {
        case 'single':
          movieTypeLabel = 'Phim lẻ';
          break;
        case 'series':
          movieTypeLabel = 'Phim bộ';
          break;
        case 'hoathinh':
          movieTypeLabel = 'Hoạt hình';
          break;
        case 'tvshows':
          movieTypeLabel = 'TV Shows';
          break;
        default:
          movieTypeLabel = 'Không xác định';
          break;
      }
      
      movieCard.innerHTML = `
        <div class="card h-100 bg-dark text-white border-secondary">
          <a href="movie.html?slug=${movie.slug}" class="text-decoration-none text-white movie-poster-container">
            <img src="${API_DOMAIN_CDN_IMAGE}${movie.poster_url}" class="card-img-top" alt="${movie.name}">
            <a href="watch.html?server=0&tap=full&slug=${movie.slug}" class="watch-banner">
              <i class="bi bi-play-fill"></i> Xem ngay
            </a>
          </a>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title text-truncate">${movie.name}</h5>
            <p class="card-text text-truncate text-muted">${movie.origin_name}</p>
            <div class="mt-auto d-flex justify-content-between align-items-center">
              <small class="text-success">${movie.year}</small>
              <small class="badge bg-danger">${movieTypeLabel}</small>
            </div>
          </div>
        </div>
      `;
      searchResultList.appendChild(movieCard);
    });
  }

  performSearch();
});
