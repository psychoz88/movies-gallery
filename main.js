window.addEventListener("DOMContentLoaded", () => {

  function cards() {
    class MenuCard {
      constructor(id, name, img, description, year, genres, director, starring, parentSelector, ...classes) {
        this.id = id;
        this.name = name;
        this.img = img;
        this.description = description;
        this.year = year;
        this.genres = genres;
        this.director = director;
        this.starring = starring;
        this.classes = classes;
        this.parent = document.querySelector(parentSelector);
      }

      render() {
        const element = document.createElement("div");
        if (this.classes.length === 0) {
          this.element = "container";
          element.classList.add(this.element);
        } else {
          this.classes.forEach((className) => element.classList.add(className));
        }

        element.innerHTML = `
              <div data-modal id="${this.id}">
                <button data-id-star="${this.id}" class="favStar"></button>
                <img class="imgMovie" src="${this.img}">
                <p class="nameMovie">${this.name}</p>
                <p class="yearMovie">${this.year}</p>
              <div>
              `;
        this.parent.after(element);
      }
    }

    async function getResource(url) {
      let res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Could not fetch ${url}, status: ${res.status}`);
      }

      return await res.json();
    }
    getResource("https://my-json-server.typicode.com/moviedb-tech/movies/list").then((data) => {
      data.forEach(({ id, name, img, description, year, genres, director, starring }) => {
        new MenuCard(id, name, img, description, year, genres, director, starring, ".noDiv").render();
        let idz = id;
        modal('[data-modal]','.modal', idz);
        makeFavorite(idz);
        makeFavList(idz);
      });
    });


  } // cards


  cards();

  function openModal(modalSelector, identificator) {
    const modal = document.querySelector(modalSelector);
    modal.classList.add("show");
    modal.classList.remove("hide");
    // document.body.style.overflow = "hidden";
  }
  
  function closeModal(modalSelector) {
    const modal = document.querySelector(modalSelector),
    removeElement = document.querySelectorAll('.modal-content');
    modal.classList.add("hide");
    modal.classList.remove("show");

    removeElement.forEach((item) => {
        item.remove();
    })
    // document.body.style.overflow = "";
  }
  
  function modal(triggerSelector, modalSelector, identificator) {
    const modalTrigger = document.querySelectorAll(triggerSelector),
    modal = document.querySelector(modalSelector);

    modalTrigger.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            idx = e.target.closest('div').id;
            if (idx == identificator) {
                modalItem(identificator);
            }
        });
    });

    function modalItem(identificator) {
        class ModalItem {
            constructor(id, name, img, description, year, genres, director, starring, parentSelector, ...classes) {
            this.id = id;
            this.name = name;
            this.img = img;
            this.description = description;
            this.year = year;
            this.genres = genres;
            this.director = director;
            this.starring = starring;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            }
        
            render() {
                const element = document.createElement("div");
                if (this.classes.length === 0) {
                    this.element = "modal-content";
                    element.classList.add(this.element);
                } else {
                    this.classes.forEach((className) => element.classList.add(className));
                }
                element.innerHTML = `
                        <div class="block-one">
                        <img class="imgMovieModal" src="${this.img}">
                        <div class="fav-year">
                            <button data-id-star-modal="${this.id}" class="favStarModal"></button>
                            <p class="yearMovie">${this.year}</p>
                        </div>
                        <div class="genreList">
                            <p class="genre">${this.genres[0]}</p>
                            <p class="genre">${this.genres[1]}</p>
                        </div>
                        </div>
                        <div class="block-two">
                            <p class="nameMovie">${this.name}</p>
                            <p class="description">Description: ${this.description}</p>
                            <p class="director">Director: ${this.director}</p>
                            <p class="starring">Starring: ${this.starring}</p>
                            <button data-close class='btn-close-modal'>X</button>
                        </div>
                        `;
                this.parent.after(element);

            } // render

        }
        
        async function getResource(url) {
            let res = await fetch(url);
        
            if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
            }

            return await res.json();
        }
        getResource("https://my-json-server.typicode.com/moviedb-tech/movies/list")
            .then((data) => {
            data.forEach(({ id, name, img, description, year, genres: [first, second, ...allGenres], director, starring }) => {
                if (id == identificator) {
                    new ModalItem(id, name, img, description, year, [first, second, ...allGenres], director, starring, ".noDivModal").render();
                    makeFavoriteInModal(identificator)
                }; // if
                openModal(modalSelector, identificator);
            });
        }); // getResourse .then

    } // modalItem


  modal.addEventListener("click", (e) => {
    if (e.target.getAttribute("data-close") == "") {
      closeModal(modalSelector);
    }
  });
  
  document.addEventListener("keydown", (e) => {
    if (e.code === "Escape" && modal.classList.contains("show")) {
      closeModal(modalSelector);
    }
  });
  
  } // modal


  function makeFavoriteInModal(idz) {
    const btn = document.querySelectorAll('.favStarModal');

    btn.forEach((item) => {
        let dataIdStar = item.dataset.idStarModal; 
        if ( localStorage.getItem(`${idz}`) == dataIdStar) {
            item.classList.add('star');
        } 
    });

    btn.forEach((item) => {
        item.addEventListener('click', (e) => {
            e.stopPropagation()
            let dataIdStar = item.dataset.idStarModal; 
            if (dataIdStar == idz) {
                if (localStorage.getItem(`${idz}`) == dataIdStar && item.getAttribute('class') == 'favStarModal star') {
                    const removeItem = document.querySelector(`[data-id="${idz}"]`),
                    removeStar = document.querySelector(`[data-id-star="${idz}"]`);
                    removeStar.classList.remove('star');
                    item.classList.remove('star');
                    localStorage.removeItem(`${idz}`);
                    removeItem.remove();
                } else {
                    localStorage.setItem(`${idz}`, dataIdStar);
                    item.classList.add('star');
                    const addStar = document.querySelector(`[data-id-star="${idz}"]`);
                    addStar.classList.add('star');
                }
                makeFavList(idz);
            }
        })
    });
  } // makeFavoriteInModal


  function makeFavorite(idz) {
    const btn = document.querySelectorAll('.favStar');

    btn.forEach((item) => {
        let idx = item.closest('div').id;
        if ( localStorage.getItem(`${idz}`) == idx) {
            item.classList.add('star');
        }
    });
    
    btn.forEach((item) => {
        item.addEventListener('click', (e) => {
            e.stopPropagation()
            let idx = e.target.closest('div').id;
            if (idx == idz) {
                if (localStorage.getItem(`${idz}`) == idx && item.getAttribute('class') == 'favStar star'){
                    const removeItem = document.querySelector(`[data-id="${idz}"]`);
                    item.classList.remove('star');
                    localStorage.removeItem(`${idz}`);
                    removeItem.remove();
                } else {
                    localStorage.setItem(`${idz}`, idx);
                    item.classList.add('star');
                }
                makeFavList(idz);
            };
        })
    });
  } // makeFavorite


  function makeFavList(identificator) {
    const elements = document.querySelectorAll('.favStar');

    elements.forEach((item) => {
        if (item.getAttribute('class') == 'favStar star') {
            let idx = item.closest('div').id;
            if (idx == identificator) {
                favList(identificator);
            }
        }
    });

    function favList(identificator) {
        class FavItem {
            constructor(id, name, parentSelector, ...classes) {
            this.id = id;
            this.name = name;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            }
        
            render() {
            const element = document.createElement("div");
            if (this.classes.length === 0) {
                this.element = "favoriteList";
                element.classList.add(this.element);
            } else {
                this.classes.forEach((className) => element.classList.add(className));
            }
            element.innerHTML = `
                <div data-id="${this.id}" class="listItem">
                    <a href="#">${this.name}</a>
                    <button class="delete">X</button>
                </div>
                `;
            this.parent.after(element);
            }
        }
        
        async function getResource(url) {
            let res = await fetch(url);
        
            if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
            }
        
            return await res.json();
        }
        getResource("https://my-json-server.typicode.com/moviedb-tech/movies/list")
            .then((data) => {
            data.forEach(({ id, name }) => {
                if (id == identificator) {
                    new FavItem(id, name, ".noDivFavList").render();
                    deleteFavItem(identificator);
                } // if
            });
        }); // getResourse .then
    } // favList

    // favList();
  } // makeFavList


  function deleteFavItem(identificator) {
    const deleteBtn = document.querySelectorAll('.delete');

    deleteBtn.forEach((item) => {
        item.addEventListener('click', (e) => {
            dataId = e.target.closest('div').dataset.id;
            if (dataId == identificator) {
                const removeItem = document.querySelector(`[data-id="${dataId}"]`), 
                itemNoStar = document.querySelector(`[data-id-star="${dataId}"]`);
                itemNoStar.classList.remove('star');
                localStorage.removeItem(`${identificator}`);
                removeItem.remove();
            };
        })
    });
  }


}); //DOMContentLoaded