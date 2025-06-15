# コード分割セクション

## HTML構造（head部分）
```html
<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Local Guide - 特別な旅の体験を</title>
    <!-- Bootstrap, Icons, Swiper CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
```

## 主要CSS（一部抜粋）
```css
.guide-card {
  transition: transform 0.3s;
  margin-bottom: 1.5rem;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}
.guide-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}
```

## JavaScript検索機能（抜粋）
```javascript
function performSearch() {
  const searchTerm = document.getElementById('guide-search').value.toLowerCase();
  const guides = document.querySelectorAll('.guide-card');
  let visibleCount = 0;
  
  guides.forEach(guide => {
    const name = guide.querySelector('.card-title').textContent.toLowerCase();
    const location = guide.querySelector('.text-muted').textContent.toLowerCase();
    
    if (name.includes(searchTerm) || location.includes(searchTerm)) {
      guide.style.display = 'block';
      visibleCount++;
    } else {
      guide.style.display = 'none';
    }
  });
}
```

必要な部分だけ送れます。