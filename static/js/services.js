function ArtApi () {
  this.getAllArt = async () => {
    const ART_AND_EXHIBITIONS_API = `data/art.json`;
    try {
      const response = await fetch(ART_AND_EXHIBITIONS_API);
      const jsonData = await response.json();
      /* console.log(jsonData); */
      return jsonData;      
    } catch (error) {
    console.log(error);
    }
  }
}

function AtelierApi() {
  this.getAllAtelier = async () => {
    const ATELIER_AND_STUDIO_API = `data/atelier.json`;
    try {
      const response = await fetch(ATELIER_AND_STUDIO_API);
      const jsonData = await response.json();
      return jsonData;      
    } catch (error) {
    console.log(error);
    }
  }
}

function PressApi() {
  this.getAllPress = async () => {
    const PRESS_API = `data/press.json`;
    try {
      const response = await fetch(PRESS_API);
      const jsonData = await response.json();
      return jsonData;      
    } catch (error) {
    console.log(error);
    }
  }
}

function ArtFiltersApi() {
  this.getAllArtFilters = async () => {
    const ART_FILTER_API = `data/art-filters.json`;
    try {
      const response = await fetch(ART_FILTER_API);
      const jsonData = await response.json();
      return jsonData;      
    } catch (error) {
    console.log(error);
    }
  }
}