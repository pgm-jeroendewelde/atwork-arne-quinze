(() => {
  const app = {
    initialize () {
      this.cacheElements();
      this.buildUI();
      /* this.checkQueryParameters(); */
    },
    cacheElements () {
      //Art & exhibitions Overview
      this.$artAndExhibitions = document.querySelector('.art-and-exhibitions');
      this.$artFilterbyCategory = document.querySelector('.art-filters__categories');
      this.$artFilterbyYear = document.querySelector('.art-filters__years');

      this.years = [];

      //Art & Exhibition teasers
      this.$artAndExhibitionsTeasers = document.querySelector('.teaser-box--artAndExhibitions .teaser-items');

      //Atelier & Studio
      this.$atelierStudioTeasers = document.querySelector('.teaser-box--atelierStudio .teaser-items');
      this.$atelierStudioTeasersAll = document.querySelector('.teaser-box--atelierStudio--all .teaser-items');

      //Press
      this.$pressReleasesTeasers = document.querySelector('.teaser-box--press-releases .teaser-items');
      this.$pressInThePressTeasers = document.querySelector('.teaser-box--in-the-press .teaser-items');

      this.$buttonToTop = document.querySelector('.to-top');


      this.$clock = document.querySelectorAll('.time_in_Belgium');
    },


    getCurrentTime() {

    },



    ticking () {
      for(clockElement of this.$clock) {
        clockElement.innerHTML = this.DigitalClock();
      }
    },  
    DigitalClock (utc = 1, city = 'Ghent') {
      const date = new Date();
      date.setHours(date.getHours() + utc + date.getTimezoneOffset() / 60);

      return `${date.getHours()}:${date.getMinutes()}`;
    },





    buildUI() {
      this.$atelierStudioTeasers ? this.fetchAtelierAndStudio('3') : '';
      this.$atelierStudioTeasersAll ? this.fetchAtelierAndStudio() : '';
      (this.$pressReleasesTeasers && this.$pressInThePressTeasers) ? this.fetchPress() : console.log('geen press hier');
      this.$artAndExhibitionsTeasers ? this.fetchArt() : console.log('geen art & exh teasers hier');
      this.fetchArtFilters();
      this.toggleToTopButton();
      this.setEventListeners();
      if (this.$clock) {
        this.ticking();
        setInterval(() => {this.ticking()},60000);
      }
    },
    setEventListeners() {
      window.addEventListener('scroll', () => this.toggleToTopButton());
      //event.preventDefault();
      this.$buttonToTop.addEventListener('click', () => this.scrollToTop());
    },
    toggleToTopButton() {
      console.log(window.scrollY)
      if (window.scrollY > 900){
        console.log('show button');
        this.$buttonToTop.classList.remove('hidden'); 
      } else {
        this.$buttonToTop.classList.add('hidden'); 
        console.log(window.scrollY);
      }
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    async fetchAtelierAndStudio(amount = 'all') {
      const atelier = new AtelierApi();
      let atelierList = await atelier.getAllAtelier();
      atelierList = amount !== '3' ? atelierList : atelierList.slice(0,3);
      console.warn(atelierList);
      this.$atelierStudioTeasers ? this.$atelierStudioTeasers.innerHTML = this.updateTeasers(atelierList, 'atelier') : console.log('geen atelier teasers hier');
      this.$atelierStudioTeasersAll ? this.$atelierStudioTeasersAll.innerHTML = this.updateTeasers(atelierList, 'atelier') : console.log('geen atelier overzicht hier');
    },
    async fetchPress() {
      const atelier = new PressApi();
      let pressList = await atelier.getAllPress();
      /* console.warn(pressList); */
      this.$pressReleasesTeasers.innerHTML = this.updateTeasers( pressList.filter((press) => press.release === true), 'press');
      this.$pressInThePressTeasers.innerHTML = this.updateTeasers( pressList.filter((press) => press.release === false), 'press');
    },
    async fetchArt(years = null, cats = null) {
      const art = new ArtApi();
      let artList = await art.getAllArt();
      artList = this.$artAndExhibitionsTeasers ? artList.filter(art => art.highlight === true) : artList;
      this.$artAndExhibitionsTeasers ? this.$artAndExhibitionsTeasers.innerHTML =  this.updateTeasers(artList,'art') : console.log('geen art & exh teasers hier');
      (this.$artAndExhibitions && ( (years !== null) && cats !== null )) ? this.$artAndExhibitions.innerHTML =  this.updateArtAndExhibitionList(artList, years.data, cats.data) : console.log('geen art & exh overview hier');
    },
    updateTeasers(teaserList,category){
      console.warn(teaserList);
      let folder = null;
      let returnString = '';
      switch(category) {
        case 'art' : 
          folder = 'art-and-exhibitions';
          break
        case 'atelier' : 
          folder = 'atelier-studio';
          break
        case 'press' : 
          folder = 'press';
          break
      }
      if(folder !== null) {
        returnString = teaserList.map(teaser => `
        <li class="teaser-item">
          <div class="teaser-item__image">
              <figure>
                  <img src="static/img/${folder}/${teaser.cover}" alt="image about ${teaser.title}">
              </figure>
          </div>
          <div class="teaser-item__content">
              <span class="subTitle">${teaser.subtitle}</span>
              <h3>${teaser.title}</h3>
              <p>${this.limitDescriptionSize(teaser.description)}</p>
              ${this.checkteaserURL(teaser,folder)}
          </div>
        </li>
        `).join('');
      } else {
        console.error('Something went wrong with the data');
      }
      return returnString;
    },
    checkteaserURL(teaserItem, folder) {

      let returnURL = '';
      if(folder === 'art-and-exhibitions') {
        returnURL += `<a href="${folder}/in-dialogue-with-calatrava/index.html" class="link link--underline">Learn more</a>`;
      }
      else if(folder === 'atelier-studio') {
        returnURL += `<a href="${folder}/visiting-mons-again/index.html" class="link link--underline">Learn more</a>`;
      }
      else if(folder === 'press') {

        if(teaserItem.link !== null) {
          returnURL += `<a href="${teaserItem.link}" target="_blank" class="link link--underline">`;
        }
        else {
          returnURL += `<a href="${folder}/my-secret-garden-valencia/index.html" class="link link--underline">`;
        }
        switch(teaserItem.linkType) {
          case 'press release' :
            returnURL += 'Open press release</a>';
            break
          case 'article' :
            returnURL += 'download article</a>';
            break
          case 'website' :
            returnURL += 'visit website</a>';
            break
        }
      }
      console.log(returnURL);
      return returnURL;
    },

    limitDescriptionSize(description) {
      let descriptionWords = description.split(' ');
      let tempStr = '';
      let returnDescription =  descriptionWords.map(word => {

        if((tempStr += " " + word).split('').length < 100) {
          return ' ' + word;
        }
      }).join('');

      returnDescription += "...";
      return returnDescription;
    },
    async fetchArtFilters() {
      if(this.$artAndExhibitions) {
        const artFilters = new ArtFiltersApi();
        let artFiltersList = await artFilters.getAllArtFilters();

        let artFiltersYear = artFiltersList.find(artFilter => artFilter.type === "year");
        let ArtFiltersCategory = artFiltersList.find(artFilter => artFilter.type === "category");

        this.$artFilterbyCategory ? this.$artFilterbyCategory.innerHTML = this.updateArtAndExhibitionFilter(ArtFiltersCategory) : '';
        this.$artFilterbyYear ? this.$artFilterbyYear.innerHTML = this.updateArtAndExhibitionFilter(artFiltersYear) : '';
      
        this.fetchArt(artFiltersYear, ArtFiltersCategory);
      }

    },
    updateArtAndExhibitionFilter(filteredObject) {
      return filteredObject.data.map((listItem) => `
        <li>
          <a href="art-and-exhibitions/index.html?${this.checkQueryParameters(filteredObject.type, listItem)} data-${filteredObject.type}="${listItem}">
            ${ listItem === 'all' ? 'Show all' : listItem === 'Installation' ? 'Public Art' : listItem }
          </a>
        </li>
      `).join('');
    },
    checkQueryParameters(category, currentFilter) {

      const params = new URLSearchParams(window.location.search);

      let tempStr = '';
      let active = true;

      if(category !== 'year') {
        if(params.has('year') && ((params.get('year') !== null))) {
          tempStr += `year=${params.get('year')}`;
          active = currentFilter === params.get('category') ? true : false;
        }
        else {
          tempStr += `year=all`;
        }
      } else {
        tempStr += `year=${currentFilter}`;
      }


      if(category !== 'category') {
        if(params.has('category') && ((params.get('category') !== null))) {
          // hij heeft al een category parameter, gebruik deze
          tempStr += `&category=${params.get('category')}"`;
          active = currentFilter === params.get('year') ? true : false;
        } else {
          tempStr += `&category=all"`;
        }
      } else {
        
        tempStr += `&category=${currentFilter}"`;
      }

      if(active === true && params.has(category)) {
        tempStr += ` class="active"`;
      } else if(currentFilter == 'all' && !params.has(category)){
        tempStr += ` class="active"`;
      }
  
      return tempStr;

    },
    updateArtAndExhibitionList(artList, years, cats) {
      const params = new URLSearchParams(window.location.search);
      const paramYear = params.get('year');
      const paramCat = params.get('category')
      
      cats = cats.filter((cat) => cat !== 'all');
      years = years.filter((year) => year !== 'all');
      if(paramYear !== null && years.indexOf(paramYear) > -1){
        years = years.filter((year) => year === paramYear)
      }

      let tempStr = '<li class="art-and-exhibitions__byYear">';
      

      tempStr = years.map((year) => {
        let filteredListItems = this.generateArtAndExhItems(artList.filter((art) => art.year === year), paramCat, cats);
        if(filteredListItems.length > 0)
        {
          return `
          <h2>${year}</h2>
          <ul>
            ${ this.generateArtAndExhItems(artList.filter((art) => art.year === year), paramCat, cats)}
          </ul>  
          `
        }
      }).join('');
        

      return tempStr += '</li>';

    },
    generateArtAndExhItems (items, category, categoryList) {
      if(category !== null && categoryList.indexOf(category) > -1){
        items = items.filter((item) => item.tags.indexOf(category) > -1);
      }
      return items.map((item) =>`
      <li class="art-and-exhibitions__project">
        <div class="art-and-exhibitions__project__content">
            <h3>
              <a href="art-and-exhibitions/in-dialogue-with-calatrava/index.html" class="link">
              ${item.title}
              </a>
            </h3>
            <p class="subTitle">${item.subtitle}</p>
            <p class="art-and-exhibitions__project__categoryAndLocations">
              ${item.tags.map((i)=> i).join(' / ')} 
              ${item.location !== null ? '- ' + item.location : ''}</p>
        </div>
        <div class="art-and-exhibitions__project__images">
          <ul>
              ${this.generateImages(item.images)}
          </ul>
        </div>
      </li>`).join('');
    },
    generateImages(imagesList) {
      return imagesList.map(image => {
        /* console.log(image); */
        return `
        <li>
          <a href="">
              <img src="static/img/art-and-exhibitions/${image}" alt="">
          </a>
        </li>`;
      }).join('');
    },
  }
  app.initialize();
})();