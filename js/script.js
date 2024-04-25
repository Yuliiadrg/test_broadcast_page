"use strict";

   // Загрузка и запуск видео - start
    var player;

    function loadAndPlayVideo() {
        player = new YT.Player('player', {
            videoId: 'wVkD89V1-BQ',
            events: {
                'onReady': function(event) {
                    event.target.playVideo();
                    document.querySelector('.video-container__wrapper').classList.add('hide-image'); // Скрываем картинку
                    document.getElementById('playButton').classList.add('hidden'); // Скрываем кнопку
                    document.getElementById('player').classList.remove('hidden'); // Показываем видео
                    // Добавим сюда также обновление размеров iframe после загрузки видео
                    resizeIframe();
                }
            }
        });
    }

    function resizeIframe() {
        // Получаем элемент iframe
        var iframe = document.querySelector('.video-container iframe');
        // Устанавливаем высоту равной высоте родительского блока
        iframe.style.height = iframe.parentElement.clientHeight + 'px';
        // Устанавливаем ширину равной ширине родительского блока
        iframe.style.width = iframe.parentElement.clientWidth + 'px';
    }

    window.addEventListener('resize', resizeIframe);

    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('playButton').addEventListener('click', loadAndPlayVideo);
    });

   // Загрузка и запуск видео - end
    


   document.addEventListener('DOMContentLoaded', function() {
    const currentHour = new Date().getHours();
    const videoContainer = document.querySelector('.video-container');
    const banner = document.getElementById('banner');
    const bannerSpecialOffer = document.getElementById('banner-special-offer');
    const advantages = document.getElementById('advantages');

    // Функция для проверки и отображения контента в зависимости от текущего времени
    function displayContentBasedOnTime() {
        if (currentHour >= 21 || currentHour < 18) {
            // Время с 21:00 до 18:00 следующего дня

            // Показываем только картинку и комментарии
            showImageAndComments();
        } else if (currentHour >= 18 && currentHour < 18.333) {
            // Время с 18:00 до 18:20

            // Показываем видео и комментарии
            showVideoAndComments();
        } else {
            // Время с 18:20 до 21:00

            // Показываем видео, баннеры, текст и комментарии
            showVideoAndBannersAndTextAndComments();
        }
    }

    // Вызываем функцию для отображения контента на основе текущего времени
    displayContentBasedOnTime();

    // Загружаем комментарии из локального хранилища при загрузке страницы
    loadCommentsFromLocalStorage();

    // Обработчик отправки формы комментария
    const commentForm = document.querySelector('.comment-form');
    const commentContainer = document.getElementById('commentContainer');
    commentForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('author').value.trim();
        const commentText = document.getElementById('comment').value.trim();

        if (username === '' || commentText === '') {
            alert('Please fill in all fields of the form.');
            return;
        }

        // Проверяем, разрешено ли добавление комментариев в данный момент
        if ((currentHour >= 18 && currentHour < 18.333) || (currentHour >= 18.333 && currentHour < 21)) {
            // Разрешено добавлять комментарии

            const commentTemplate = document.querySelector('.comment-people__block');
            const newComment = commentTemplate.cloneNode(true);

            newComment.querySelector('.comment-people__username').textContent = username;
            newComment.querySelector('.comment-people__message').textContent = commentText;

            // Находим существующий блок времени публикации и обновляем его текст
            const timeElement = newComment.querySelector('.comment-people__time-message');
            updateCommentTime(timeElement, new Date());

            commentContainer.appendChild(newComment);

            // Сохраняем комментарий в локальное хранилище
            saveCommentToLocalStorage(username, commentText, new Date());
        } else {
            // Блокируем добавление комментариев в другое время
            alert('Комментарии в данный момент недоступны.');
        }

        document.getElementById('author').value = '';
        document.getElementById('comment').value = '';
    });

    // Обновление времени публикации комментариев
    setInterval(updateCommentTimes, 60000);

    function updateCommentTimes() {
        const timeElements = document.querySelectorAll('.comment-people__time-message');
        timeElements.forEach(function(timeElement) {
            const commentTime = new Date(timeElement.closest('.comment-people__block').dataset.time);
            updateCommentTime(timeElement, commentTime);
        });
    }

    function updateCommentTime(timeElement, time) {
        timeElement.textContent = getTimeAgo(time);
    }

    function getTimeAgo(date) {
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds >= 86400) {
            return Math.floor(seconds / 86400) + " дней назад";
        } else if (seconds >= 3600) {
            return Math.floor(seconds / 3600) + " часов назад";
        } else if (seconds >= 60) {
            return Math.floor(seconds / 60) + " минут назад";
        } else {
            return seconds + " секунд назад";
        }
    }

    // Функции для отображения контента в зависимости от текущего времени
    function showImageAndComments() {
        if (banner) {
            banner.style.display = 'block';
        }
        if (bannerSpecialOffer) {
            bannerSpecialOffer.style.display = 'none';
        }
        if (videoContainer) {
            videoContainer.style.display = 'none';
        }
        if (advantages) {
            advantages.style.display = 'none';
        }
        // Разблокируем форму комментариев
        enableCommentForm();
    }

    function showVideoAndComments() {
        if (banner) {
            banner.style.display = 'none';
        }
        if (bannerSpecialOffer) {
            bannerSpecialOffer.style.display = 'none';
        }
        if (videoContainer) {
            videoContainer.style.display = 'block';
        }
        if (advantages) {
            advantages.style.display = 'none';
        }
        // Разблокируем форму комментариев
        enableCommentForm();
    }

    function showVideoAndBannersAndTextAndComments() {
        if (banner) {
            banner.style.display = 'block';
        }
        if (bannerSpecialOffer) {
            bannerSpecialOffer.style.display = 'block';
        }
        if (videoContainer) {
            videoContainer.style.display = 'block';
        }
        if (advantages) {
            advantages.style.display = 'block';
        }
        // Разблокируем форму комментариев
        enableCommentForm();
    }

    // Блокировка формы комментариев
    function disableCommentForm() {
        const commentForm = document.querySelector('.comment-form');
        const formInputs = commentForm.querySelectorAll('input, textarea, button');
        formInputs.forEach(function(input) {
            input.setAttribute('disabled', true);
        });
    }

    // Разблокировка формы комментариев
    function enableCommentForm() {
        const commentForm = document.querySelector('.comment-form');
        const formInputs = commentForm.querySelectorAll('input, textarea, button');
        formInputs.forEach(function(input) {
            input.removeAttribute('disabled');
        });
    }

    // Сохранение комментария в локальное хранилище
    function saveCommentToLocalStorage(username, commentText, time) {
        let comments = JSON.parse(localStorage.getItem('comments')) || [];
        comments.push({ username: username, commentText: commentText, time: time });
        localStorage.setItem('comments', JSON.stringify(comments));
    }

    // Загрузка комментариев из локального хранилища
    function loadCommentsFromLocalStorage() {
        const comments = JSON.parse(localStorage.getItem('comments')) || [];
        const commentContainer = document.getElementById('commentContainer');
        comments.forEach(function(comment) {
            const commentTemplate = document.querySelector('.comment-people__block');
            const newComment = commentTemplate.cloneNode(true);
            newComment.querySelector('.comment-people__username').textContent = comment.username;
            newComment.querySelector('.comment-people__message').textContent = comment.commentText;
            const timeElement = newComment.querySelector('.comment-people__time-message');
            updateCommentTime(timeElement, new Date(comment.time));
            commentContainer.appendChild(newComment);
        });
    }
});
